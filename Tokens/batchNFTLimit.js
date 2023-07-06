const {
  Client,
  PrivateKey,
  TokenMintTransaction,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenInfoQuery,
} = require('@hashgraph/sdk');
require('dotenv').config({ path: '../.env' });

//Grab your Hedera testnet account ID and private key from your .env file
myAccountId = process.env.MY_ACCOUNT_ID;
myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

treasuryId = myAccountId;
treasuryKey = myPrivateKey;
supplyKey = myPrivateKey;

//Create your Hedera Testnet client
const client = Client.forTestnet();

//Set your account as the client's operator
client.setOperator(myAccountId, myPrivateKey);

batchNFTLimit();

async function executeTransaction(transaction, key) {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const txSign = await transaction.sign(key);
      const txSubmit = await txSign.execute(client);
      const txReceipt = await txSubmit.getReceipt(client);

      // If the transaction succeeded, return the receipt
      return txReceipt;
    } catch (err) {
      // If the error is BUSY, retry the transaction
      if (err.toString().includes('BUSY')) {
        retries++;
        console.log(`Retry attempt: ${retries}`);
      } else {
        // If the error is not BUSY, throw the error
        throw err;
      }
    }
  }
  throw new Error(`Transaction failed after ${MAX_RETRIES} attempts`);
}
