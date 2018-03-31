pragma solidity ^0.4.20;

contract LotteryGenerator {
    address[] public lotteries;

    function createLottery(string name) public {
        address newLottery = new Lottery(name, msg.sender);
        lotteries.push(newLottery);
    }

    function getLotteries() public view returns(address[]) {
        return lotteries;
    }
}

contract Lottery {
    // name of the lottery
    string public lotteryName;
    // Creator of the lottery contract
    address public manager;

    // variables for players
    struct Player {
        string name;
        uint entryCount;
        uint index;
    }
    address[] public addressIndexes;
    mapping(address => Player) players;
    address[] public lotteryBag;

    // Variables for lottery information
    Player public winner;
    bool public isLotteryLive;
    uint public maxEntriesForPlayer;
    uint public ethToParticipate;

    // constructor
    function Lottery(string name, address creator) public {
        manager = creator;
        lotteryName = name;
    }

    // Let users participate by sending eth directly to contract address
    function () public payable {
        // player name will be unknown
        participate("Unknown");
    }

    function participate(string playerName) public payable {
        require(isLotteryLive);
        require(msg.value == ethToParticipate * 1 ether);
        require(players[msg.sender].entryCount < maxEntriesForPlayer);

        if (isNewPlayer(msg.sender)) {
            players[msg.sender].entryCount = 1;
            players[msg.sender].name = playerName;
            players[msg.sender].index = addressIndexes.push(msg.sender) - 1;
        } else {
            players[msg.sender].entryCount += 1;
        }

        lotteryBag.push(msg.sender);
    }

    function activateLottery(uint maxEntries, uint ethRequired) public restricted {
        isLotteryLive = true;
        maxEntriesForPlayer = maxEntries == 0 ? 1: maxEntries;
        ethToParticipate = ethRequired == 0 ? 1: ethRequired;
    }

    function declareWinner() public restricted {
        uint index = generateRandomNumber() % lotteryBag.length;
        lotteryBag[index].transfer(this.balance);
         
        winner.name = players[lotteryBag[index]].name;
        winner.entryCount = players[lotteryBag[index]].entryCount;

        // empty the lottery bag and indexAddresses
        lotteryBag = new address[](0);
        addressIndexes = new address[](0);

        // Mark the lottery inactive
        isLotteryLive = false;
    }

    function getPlayers() public view returns(address[]) {
        return addressIndexes;
    }

    function getPlayer(address playerAddress) public view returns (string, uint) {
        return (players[playerAddress].name, players[playerAddress].entryCount);
    }

    // Private functions
    function isNewPlayer(address playerAddress) private view returns(bool) {
        if (addressIndexes.length == 0) {
            return true;
        }
        return (addressIndexes[players[playerAddress].index] != playerAddress);
    }

    // NOTE: This should not be used for generating random number in real world
    function generateRandomNumber() private view returns(uint) {
        return uint(keccak256(block.difficulty, now, lotteryBag));
    }

    // Modifiers
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

}