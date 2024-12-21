// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CommunityBoard {
    struct Thread {
        uint id;
        address creator;
        string title;
        string text;
        uint timestamp;
    }

    Thread[] public threads;
    uint public nextThreadId;

    event ThreadCreated(
        uint id,
        address creator,
        string title,
        string text,
        uint timestamp
    );

    function createThread(string memory _title, string memory _text) public {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_text).length > 0, "Text cannot be empty");

        threads.push(
            Thread({
                id: nextThreadId,
                creator: msg.sender,
                title: _title,
                text: _text,
                timestamp: block.timestamp
            })
        );

        emit ThreadCreated(
            nextThreadId,
            msg.sender,
            _title,
            _text,
            block.timestamp
        );

        nextThreadId++;
    }

    function getAllThreads() public view returns (Thread[] memory) {
        return threads;
    }

    function getThread(uint _id) public view returns (Thread memory) {
        require(_id < threads.length, "Thread does not exist");
        return threads[_id];
    }

    function getThreadCount() public view returns (uint) {
        return threads.length;
    }
}
