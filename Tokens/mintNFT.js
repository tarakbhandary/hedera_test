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

mintNFT('0.0.15052933');

async function mintNFT(tokenId) {
  // MINT NEW BATCH OF NFTs
  const mintTx = new TokenMintTransaction()
    .setTokenId(tokenId)
    .setMetadata(Buffer.from) //Batch minting - UP TO 10 NFTs in single tx
    //.setMaxTransactionFee(maxTransactionFee)
    .freezeWith(client);

  //Sign the transaction with the supply keys
  const mintTxSign = await mintTx.sign(supplyKey);

  //Submit the transaction to a Hedera network
  const mintTxSubmit = await mintTxSign.execute(client);

  //Get the transaction receipt
  const mintRx = await mintTxSubmit.getReceipt(client);

  //Log the serial number
  console.log(
    `- Created NFT ${tokenId} with serial: ${mintRx.serials[0].low} \n`
  );
  executeTransaction(mintTx, myPrivateKey);
}

async function executeTransaction(transaction, key) {
  let retries = 0;
  while (retries < 10) {
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

// getTokenInfo('0.0.15052856');
async function getTokenInfo(newTokenId) {
  //Create the query
  const query = new TokenInfoQuery().setTokenId(newTokenId);

  //Sign with the client operator private key, submit the query to the network and get the token supply
  const tokenSupply = await query.execute(client);

  console.log(tokenSupply);
}
