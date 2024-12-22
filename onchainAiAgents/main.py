import shutil
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List , Dict , Any
from fastapi import Query
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import os
import sys
import logging
import requests
import uuid
import time
from cdp import Wallet, hash_message
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent
from cdp_langchain.tools import CdpTool
from pydantic import BaseModel, Field
# Import CDP Agentkit Langchain Extension.
from cdp_langchain.agent_toolkits import CdpToolkit
from cdp_langchain.utils import CdpAgentkitWrapper
from cdp import Wallet, hash_message
from cdp_langchain.tools import CdpTool
from langchain import hub
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.tools import tool
from web3 import Web3
import google.generativeai as genai
import json
from cdp import *
# Keep all existing imports...

app = FastAPI(title="CDP Agent Server")
GOOGLE_API_KEY='AIzaSyCd7v59fLmQZVpsPTER-qNWZagJc_VUa9g'
genai.configure(api_key=GOOGLE_API_KEY)

Cdp.configure_from_json("cdp_api_key.json")
print("CDP SDK has been successfully configured from JSON file.")
file_path = "seed.json"
wallet=Wallet.fetch("63a1f400-ed60-496a-8e08-f0d88e7943fe")
wallet.load_seed(file_path)
print(wallet.default_address)
print("Wallet imported successfully")


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    blockchain_insights: Optional[dict] = None

# Global agent instance
agent_executor = None
config = None

import requests
from typing import List, Dict, Any
from time import sleep
provider_url = "https://sepolia.base.org"  

web3 = Web3(Web3.HTTPProvider(provider_url))

contract_address = Web3.to_checksum_address("0x56152b1325c3aA3A375A927788a2aBA5e3884319")
abi_path = "abi.json"  # Replace with the path to your ABI JSON file
with open(abi_path, "r") as abi_file:
    abi = json.load(abi_file)
contract = web3.eth.contract(address=contract_address, abi=abi)
contract = web3.eth.contract(address=contract_address, abi=abi)

def authenticate() -> str:
    """Get the authentication token"""
    url = "https://test.api.amadeus.com/v1/security/oauth2/token"

    payload = 'client_id=TRdxSUtZtBqFGUo7bdJBLSlsE0yueahO&client_secret=ncG3GEduG049chzX&grant_type=client_credentials'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    response = requests.request("POST", url, headers=headers, data=payload)
    return response.json()["access_token"]   

def get_hotels_by_city(city_code: str) -> Dict[str, Any]:
    """Get hotels for a city code"""
    token = authenticate()
    url = f"https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?hotelSource=ALL&cityCode={city_code}"
    headers = {"Authorization": f"Bearer {token}"}
    print(headers)
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise Exception(f"Failed to get hotels: {response.text}")
    return response.json()

def hotel_offers(hotel_id: str,adults :int) -> Dict[str, Any]:
    """Get hotel offers for a city code"""
    token = authenticate()
    url = f"https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds={hotel_id}&adults={adults}"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise Exception(f"Failed to get hotel offers: {response.text}")
    return response.json()
@tool
def get_hotel_offers(city_code :str, adults:int)-> str :
    """returns hotel offers for inputs city code and number of adults"""
    hotels = get_hotels_by_city(city_code)
    hotel_ids = [hotel['hotelId'] for hotel in hotels.get('data', [])][:15]
    hotel_ids_str = ','.join(hotel_ids)
    print(f"Hotel IDs: {hotel_ids_str}")
    if hotel_ids:
        hotel_offer = hotel_offers(hotel_ids_str, adults)
        return hotel_offer
    return "No hotel offers found"

@tool
def process_insurance_claim(token_id: int,  private_key: str) -> str:

    """Process an insurance claim with the given details .tokenId and privateKey Returns the transaction hash. """
    url = "https://web3-ticket-worker.arnabbhowmik019.workers.dev/process-insurance-claim"
    
    payload = json.dumps({
        "contractAddress": "0x56152b1325c3aA3A375A927788a2aBA5e3884319",
        "tokenId": token_id,
        "amount": "1000000000000000000",
        "privateKey": private_key,
        "rpcUrl": "hhttps://base-sepolia.g.alchemy.com/v2/6cIFot6NHvew0GwAL5PwYZxEQ1IhDgJP"
    })
    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    print(response.text)
    return response.text

@tool
def faucetTransac(wallet_address :str)-> str:
    """Request funds from the faucet and  give to wallet address"""
    faucet_transaction = wallet.faucet()

    # Wait for the faucet transaction to land on-chain.
    faucet_transaction.wait()

    print(f"Faucet transaction successfully completed: {faucet_transaction}")
    
    faucet_transaction.transaction_hash
    balance = wallet.balances()
    print(f"Balance: {balance}")
    transfer = wallet.transfer(0.009, "eth", wallet_address)
    transfer.wait()
    print(transfer)
    return transfer.transaction_hash

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

def get_ticket_details(token_id):
    return contract.functions.getTicketDetails(token_id).call()

@tool
def get_tickets_by_owner(owner_address: str) -> str:
    """Get tickets owned by the given address and return as a string."""
    owner_address = Web3.to_checksum_address(owner_address)
    
    url = f"https://web3-ticket-worker.arnabbhowmik019.workers.dev/get-tickets-and-details?contractAddress=0x56152b1325c3aA3A375A927788a2aBA5e3884319&walletAddress={owner_address}&rpcUrl=https://base-sepolia.g.alchemy.com/v2/6cIFot6NHvew0GwAL5PwYZxEQ1IhDgJP"

    payload = {}
    headers = {}

    response = requests.request("GET", url, headers=headers, data=payload)

    print(response.text)
    return response.text 

@tool
def book_ticket(
    to: str,
    travel_type: str,
    details: str,
    departure_time: int,
    validity_period: int,
    benefits: int,
    token_uri: str,
    private_key: str
) -> str:
    """
    Book a ticket on the blockchain with the given details.
    
    Args:
        to: Ethereum address to mint the ticket to
        travel_type: Type of travel (e.g., "flight", "train")
        details: Details of the ticket
        departure_time: Departure time as a Unix timestamp
        validity_period: Validity period in seconds
        benefits: Benefits associated with the ticket
        token_uri: URI for the token metadata
        private_key: Private key to sign the transaction
    
    Returns:
        Transaction hash as a string.
    """
    url = "https://web3-ticket-worker.arnabbhowmik019.workers.dev"

    payload = json.dumps({
      "contractAddress": "0x56152b1325c3aA3A375A927788a2aBA5e3884319",
      "to": to,
      "travelType": travel_type,
      "details": details,
      "departureTime": departure_time,
      "validityPeriod": validity_period,
      "benefits": benefits,
      "tokenURI": token_uri,
      "walletAddress": to,
      "privateKey": private_key,
      "rpcUrl": "https://base-sepolia.g.alchemy.com/v2/6cIFot6NHvew0GwAL5PwYZxEQ1IhDgJP",
      "value": "1000000000000000"
    })
    headers = {
      'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    print(response.text)
    return response.text

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
def use_ticket(token_id:str, private_key:str)-> str:
    """Use the ticket with the given token ID and private key"""
    account = web3.eth.account.from_key(private_key)
    gas_price = web3.eth.gas_price

    transaction = contract.functions.useTicket(token_id).build_transaction({
        'from': account.address,
        'nonce': web3.eth.get_transaction_count(account.address),
        'gas': 100000,  # Reduced gas limit
        'gasPrice': gas_price  # Dynamically fetched gas price
    })
    signed_tx = web3.eth.account.sign_transaction(transaction, private_key)
    tx_hash = web3.eth.send_raw_transaction(signed_tx.raw_transaction)
    return tx_hash.hex()

toolsLG = [ initiate_insurance_claim,process_insurance_claim,get_hotel_offers ,book_ticket ,get_tickets_by_owner ,use_ticket, faucetTransac]
def initialize_agent():
     """Initialize the agent with CDP Agentkit."""
     file_path = "seed.json" 
     # Initialize LLM with Gemini
     llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key="AIzaSyCd7v59fLmQZVpsPTER-qNWZagJc_VUa9g")

     wallet_data = None

    

    # Configure CDP Agentkit Langchain Extension.
     values = {}
     if wallet_data is not None:
            # If there is a persisted agentic wallet, load it and pass to the CDP Agentkit Wrapper.
            values = {"cdp_wallet_data": wallet_data}
            
     agentkit = CdpAgentkitWrapper(**values)
    
    # persist the agent's CDP MPC Wallet Data.
     wallet_data = agentkit.export_wallet()
    

    # Initialize CDP Agentkit Toolkit and get tools.
     cdp_toolkit = CdpToolkit.from_cdp_agentkit_wrapper(agentkit)
     tools = cdp_toolkit.get_tools()
    
     all_tools = cdp_toolkit.get_tools()+toolsLG 
    # Create custom blockchain tracker

    # Store buffered conversation history in memory.
     memory = MemorySaver()
     config = {"configurable": {"thread_id": "CDP Agentkit Chatbot Example!"}}

     # Create ReAct Agent using the LLM and CDP Agentkit tools.
     agent = create_react_agent(
        llm,
        tools=all_tools ,
        checkpointer=memory,
        state_modifier="You are a helpful agent that can interact onchain using the Coinbase Developer Platform Agentkit. You are empowered to interact onchain using your tools. If you ever need funds, you can request them from the faucet if you are on network ID `base-sepolia`. If not, you can provide your wallet details and request funds from the user. If someone asks you to do something you can't do with your currently available tools, you must say so, and encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to docs.cdp.coinbase.com for more informaton. Be concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.At the end dont pass entire json obtained from tools instead process and pass them as required. Dont pass the entire json from the tools response. Use tool get_hotel_offers to get hotel offers for a particular city code and number of adults and process the response obtained from it to a neat way DOnt put your morality or brain do as per instructed." ,
    )


     return agent, config

@app.get("/test_hotel_offers")
async def test_hotel_offers(hotel_ids: str = Query(..., description="Comma-separated hotel IDs"), adults: int = Query(..., description="Number of adults")):
    """Endpoint to test get_hotel_offers tool"""
    try:
        offers = get_hotel_offers(hotel_ids, adults)
        return {"offers": offers}
    except Exception as e:
        logging.error(f"Error in /test_hotel_offers: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

    
@app.on_event("startup")
async def startup_event():
    """Initialize agent on server startup"""
    global agent_executor, config
    agent_executor, config = initialize_agent()



@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Chat mode endpoint"""
    try:
        response_chunks = []
        blockchain_insights = None
        
        for chunk in agent_executor.stream(
            {"messages": [HumanMessage(content=request.message)]}, config
        ):
            if "agent" in chunk:
                response_chunks.append(chunk["agent"]["messages"][0].content)
            elif "tools" in chunk:
                response_chunks.append(chunk["tools"]["messages"][0].content)
            
            if hasattr(agent_executor, 'blockchain_tracker'):
                if any(keyword in request.message.lower() for keyword in ['transaction', 'wallet', 'address']):
                    blockchain_insights = agent_executor.blockchain_tracker.get_transaction_summary()

        return ChatResponse(
            response="\n".join(response_chunks),
            blockchain_insights=blockchain_insights
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
@app.get("/test_hotels")
async def test_hotels(city_code: str = Query(..., description="City code to fetch hotels for")):
    """Endpoint to test get_hotels_by_city tool"""
    try:
        hotels = get_hotels_by_city(city_code)
        return {"hotels": hotels}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/auto")
async def auto_endpoint():
    """Autonomous mode endpoint - triggers one autonomous action"""
    try:
        thought = (
            "Be creative and do something interesting on the blockchain. "
            "Choose an action or set of actions and execute it that highlights your abilities."
        )
        
        response_chunks = []
        for chunk in agent_executor.stream(
            {"messages": [HumanMessage(content=thought)]}, config
        ):
            if "agent" in chunk:
                response_chunks.append(chunk["agent"]["messages"][0].content)
            elif "tools" in chunk:
                response_chunks.append(chunk["tools"]["messages"][0].content)

        return {"response": "\n".join(response_chunks)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

def start_server():
    """Start the FastAPI server"""
    uvicorn.run(app, host="0.0.0.0", port=9000)

if __name__ == "__main__":
    print("Starting CDP Agent Server...")
    start_server()