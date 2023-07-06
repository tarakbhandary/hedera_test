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

//createNewAccount();
async function createNewAccount() {
  //Create new keys
  const newAccountPrivateKey = PrivateKey.generateED25519();
  const newAccountPublicKey = newAccountPrivateKey.publicKey;

  //Create another keys
  const anotherAccountPrivateKey = PrivateKey.generateED25519();
  const anotherAccountPublicKey = anotherAccountPrivateKey.publicKey;

  //Create a new account
  const newAccount = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .execute(client);

  // Get the new account ID
  const getReceipt = await newAccount.getReceipt(client);
  const newAccountId = getReceipt.accountId;

  //New account ID
  console.log('The new account ID is: ' + newAccountId);

  //Create another account with 1,000 tinybar starting balance
  const anotherAccount = await new AccountCreateTransaction()
    .setKey(anotherAccountPublicKey)
    .setInitialBalance(Hbar.fromTinybars(123))
    .execute(client);

  // Get the another account ID
  const getAnotherReceipt = await anotherAccount.getReceipt(client);
  const anotherAccountId = getAnotherReceipt.accountId;

  //New account ID
  console.log('The another account ID is: ' + anotherAccountId);

  verifyAccountBalance(anotherAccountId);
}

verifyAccountBalance('0.0.15012018');
async function verifyAccountBalance(newAccountId) {
  //Verify the account balance
  const accountBalance = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .execute(client);

  console.log(
    'The new account balance is: ' +
      accountBalance.hbars.toTinybars() +
      ' tinybar.'
  );
}
