const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar,
  TransferTransaction,
} = require('@hashgraph/sdk');
require('dotenv').config();

let myAccountId, myPrivateKey;
async function environmentSetup() {
  //Grab your Hedera testnet account ID and private key from your .env file
  myAccountId = process.env.MY_ACCOUNT_ID;
  myPrivateKey = process.env.MY_PRIVATE_KEY;

  // If we weren't able to grab it, we should throw a new error
  if (!myAccountId || !myPrivateKey) {
    throw new Error(
      'Environment variables MY_ACCOUNT_ID and MY_PRIVATE_KEY must be present'
    );
  }
}

environmentSetup();

createClient();

async function createClient() {
  //Create your Hedera Testnet client
  const client = Client.forTestnet();

  //Set your account as the client's operator
  client.setOperator(myAccountId, myPrivateKey);
}
