import os
import sys
import time
import uuid
from cdp import Wallet, hash_message
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent
from cdp_langchain.tools import CdpTool
from pydantic import BaseModel, Field
from cdp_langchain.agent_toolkits import CdpToolkit
from cdp_langchain.utils import CdpAgentkitWrapper
from cdp import Wallet, hash_message
from cdp_langchain.tools import CdpTool
from langchain import hub
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.tools import tool
import requests
from web3 import Web3
import google.generativeai as genai
import json
from cdp import *
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

# Configuration
GOOGLE_API_KEY='AIzaSyCd7v59fLmQZVpsPTER-qNWZagJc_VUa9g'
genai.configure(api_key=GOOGLE_API_KEY)
Cdp.configure_from_json("cdp_api_key.json")
print("CDP SDK has been successfully configured from JSON file.")
file_path = "seed.json"
wallet=Wallet.fetch("63a1f400-ed60-496a-8e08-f0d88e7943fe")
wallet.load_seed(file_path)
print(wallet.default_address)
print("Wallet imported successfully")

# Existing video info tool
@tool
def get_video_info(filepath: str) -> str:
    """Verify insurance claim """
    video_file_name = filepath
    video_file = genai.upload_file(path=video_file_name)
    while video_file.state.name == "PROCESSING":
        time.sleep(10)
        video_file = genai.get_file(video_file.name)
    if video_file.state.name == "FAILED":
        return("Video fail ")
    prompt = """the video contains a accident or some sort of similar image or video of car/bike/bus or any vehicle accident , very or not whether the insurance can is approved or not . 
         response ={
         "approved": true/false,
         }"""
    model = genai.GenerativeModel(model_name="models/gemini-1.5-flash", generation_config={"response_mime_type": "application/json"}, system_instruction="you are video parser agent which responds in true or false format")
    response = model.generate_content([prompt, video_file])
    return response

@tool
def initiate_insurance_claim(token_id: int, private_key: str) -> str:
    """Initiate an insurance claim with the given details."""
    url = "https://web3-ticket-worker.arnabbhowmik019.workers.dev/initiate-insurance-claim"
    
    payload = json.dumps({
        "contractAddress": "0x56152b1325c3aA3A375A927788a2aBA5e3884319",
        "tokenId": token_id,
        "privateKey": private_key,
        "rpcUrl": "https://base-sepolia.g.alchemy.com/v2/6cIFot6NHvew0GwAL5PwYZxEQ1IhDgJP"
    })
    headers = {
        'Content-Type': 'application/json',
        'Cookie': 'csrftoken=0IEttT24gGkexWxWrCtrlfCUpj183RU9QDnbQCRRxcFl85JVnr8cQBcW9rKYpb2o'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    print(response.text)
    return response.text


# Tools list
toolsLG = [get_video_info,initiate_insurance_claim]

# Wallet data configuration
wallet_data_file = "wallet_data.txt"

# Direct LLM and Agent Setup
llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", google_api_key="AIzaSyCd7v59fLmQZVpsPTER-qNWZagJc_VUa9g")


values = {}
agentkit = CdpAgentkitWrapper(**values)

# Persist wallet data
new_wallet_data = agentkit.export_wallet()
with open(wallet_data_file, "w") as f:
    f.write(new_wallet_data)

# Initialize CDP Agentkit Toolkit
cdp_toolkit = CdpToolkit.from_cdp_agentkit_wrapper(agentkit)
all_tools = cdp_toolkit.get_tools() + toolsLG

# Create memory and config
memory = MemorySaver()

# Create agent
agent = create_react_agent(
    llm,
    tools=cdp_toolkit.get_tools()+toolsLG,
    checkpointer=memory,
    state_modifier="You are a helpful agent that can interact onchain using the Coinbase Developer Platform Agentkit. You are empowered to interact onchain using your tools. If you ever need funds, you can request them from the faucet if you are on network ID `base-sepolia`. If not, you can provide your wallet details and request funds from the user. If someone asks you to do something you can't do with your currently available tools, you must say so, and encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to docs.cdp.coinbase.com for more informaton. Be concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.",
)

# Flask Application
app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_video():
    """Handle video file upload and verification."""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    description = request.form.get('description')
    
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        # Save the file
        filename = secure_filename(file.filename)
        filepath = os.path.join('uploads', filename)
        os.makedirs('uploads', exist_ok=True)
        file.save(filepath)
        
        # Generate config
        config = {
            "configurable": {
                "thread_id": str(uuid.uuid4()),
                "checkpoint_ns": "video_verification",
                "checkpoint_id": str(uuid.uuid4())
            }
        }
        
        try:
            # Verify video
            events = agent.stream(
                {"messages": [("user", f" use the tool get_video_info with filepath={filepath} and if the response has approved true then start with the initiate_insurance_claim tool with the token_id and private_key")],},
                config=config,
                stream_mode="values",
            )
            
            # Collect results
            results = []
            for event in events:
                results.append(str(event["messages"][-1]))
            
            # Clean up the file
            os.remove(filepath)
            
            return jsonify({
                "results": results,
                "filepath": filepath
            })
        
        except Exception as e:
            # Clean up the file in case of an error
            if os.path.exists(filepath):
                os.remove(filepath)
            
            return jsonify({
                "error": str(e)
            }), 500

@app.route('/test', methods=['GET'])
def test():
    wallet = Wallet.create()
    # Get the default_address in the wallet.
    address1 = wallet.default_address
    print(address1)
    #Create a faucet request that returns a Faucet transaction, which can be used to retrieve the transaction hash.
    faucet_transaction = wallet.faucet()

    # Wait for the faucet transaction to land on-chain.
    faucet_transaction.wait()

    print(f"Faucet transaction successfully completed: {faucet_transaction}")
    steps = 100000
    faucet_transaction.transaction_hash
    balance = wallet.balances()
    print(balance)
    contract_address = "0xf809812695F341479218DAa3a8B2beEa2eC88339"
    payable_value = 1000000000000000
    with open('StepStakeDynamicNFT.json', 'r') as file:
        contract_data = json.load(file)
        abi = contract_data['abi']
        invocation = wallet.invoke_contract(
        contract_address="0x52dE6508FECCA4d712b75b0bD018a621EaF2d734",  # Replace with actual contract address
        abi=[{
        "inputs": [
            {"internalType": "address", "name": "wallet", "type": "address"},
            {"internalType": "uint256", "name": "stepCount", "type": "uint256"}
        ],
        "name": "updateDailySteps",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }],
    method="updateDailySteps",
    args={
        "wallet": "0x38E4eFC439Ef728716511817F0a508F53252c2b9",  # Replace with the wallet address
        "stepCount": str(int(10000))  # Example step count, replace with actual steps
    }
)

        invocation.wait()
    print(invocation)
    return jsonify({"status": "success"})


@app.route('/claim', methods=['GET'])
def claim():
    #wallet = Wallet.create()
    address1 = wallet.default_address
    # Create a faucet request that returns a Faucet transaction, which can be used to retrieve the transaction hash.
    #faucet_transaction = wallet.faucet()

    # Wait for the faucet transaction to land on-chain.
    #faucet_transaction.wait()

    #print(f"Faucet transaction successfully completed: {faucet_transaction}")

    #faucet_transaction.transaction_hash
    #balance = wallet.balances()
    #print(balance)
    
    invocation = wallet.invoke_contract(
    contract_address="0x52dE6508FECCA4d712b75b0bD018a621EaF2d734",  # Replace with actual contract address
    abi=[{
        "inputs": [
            {"internalType": "address", "name": "wallet", "type": "address"},
            {"internalType": "string", "name": "imageUrl", "type": "string"}
        ],
        "name": "claimStakeAndMintNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }],
    method="claimStakeAndMintNFT",
    args={
        "wallet": "0x1346cc580Bffe1cB9948a056BDDCd893E6C5d5B6",  # Replace with the wallet address
        "imageUrl": "https://cdn.prod.website-files.com/6615636a03a6003b067c36dd/661ffd0dbe9673d914edca2d_6423fc9ca8b5e94da1681a70_Screenshot%25202023-03-29%2520at%252010.53.43.jpeg"  # Replace with actual image URL
    }
    )
    invocation.wait()
    print(invocation)
    return jsonify({"message": "Hello World"})

@app.route('/transfer', methods=['GET'])
def transfer():
    

    
    balance = wallet.balances()
    print(balance)
    
    transfer = wallet.transfer(0.009, "eth", "0x1346cc580Bffe1cB9948a056BDDCd893E6C5d5B6")
    transfer.wait()
    print(transfer)
    return jsonify({"message": "Hello World"})

def run_server(host='0.0.0.0', port=5000):
    """Run the Flask server."""
    app.run(host=host, port=port, debug=True)

if __name__ == "__main__":
    print("Starting Flask Server...")
    run_server()