const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; //This variable is to prevent mining forever in the while loop at line 18 by changing some non-used value in the hash 
        //function so that the hash is different each time.
    }

    //This function generates a random hash using the SHA256 built-in function to generate a random hash using 
    //the variables associated with each block
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    //This function is what make sure that the hash corresponding to a block fulfills the difficulty set by the
    //admin
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++; //incrementing to change some value in the hash so that the loop doesn't go forever
            this.hash = this.calculateHash();
        }

        console.log("Block Mined: " + this.hash);
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4; //Manually set
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2018", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let me = new BlockChain();

console.log("Mining block 1...");
me.addBlock(new Block(1, "10/01/2018", { amount: 4 }));

console.log("Mining block 2...");
me.addBlock(new Block(2, "10/01/2018", { amount: 10 }));