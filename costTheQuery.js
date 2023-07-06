const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar,
  TransferTransaction,
} = require('@hashgraph/sdk');
require('dotenv').config();

//Grab your Hedera testnet account ID and private key from your .env file
myAccountId = process.env.MY_ACCOUNT_ID;
myPrivateKey = process.env.MY_PRIVATE_KEY;

//Create your Hedera Testnet client
const client = Client.forTestnet();

//Set your account as the client's operator
client.setOperator(myAccountId, myPrivateKey);

createNewAccount();
async function createNewAccount() {
  //Create new keys
  const newAccountPrivateKey = PrivateKey.generateED25519();
  const newAccountPublicKey = newAccountPrivateKey.publicKey;

  //Create a new account
  const newAccount = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .execute(client);

  // Get the new account ID
  const getReceipt = await newAccount.getReceipt(client);
  const newAccountId = getReceipt.accountId;

  //New account ID
  console.log('The new account ID is: ' + newAccountId);

  costTheQuery(newAccountId);
}

async function costTheQuery(newAccountId) {
  //Request the cost of the query
  const queryCost = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .getCost(client);

  console.log('The cost of query is: ' + queryCost);

  transferFund(newAccountId);
}

async function transferFund(newAccountId) {
  //Create the transfer transaction
  const sendHbar = await new TransferTransaction()
    .addHbarTransfer(myAccountId, Hbar.fromTinybars(-1000)) //Sending account
    .addHbarTransfer(newAccountId, Hbar.fromTinybars(1000)) //Receiving account
    .execute(client);

  //Verify the transaction reached consensus
  const transactionReceipt = await sendHbar.getReceipt(client);
  console.log(
    'The transfer transaction from my account to the new account was: ' +
      transactionReceipt.status.toString()
  );
  costTheQuery(newAccountId);
}
