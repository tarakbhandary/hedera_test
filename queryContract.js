const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar,
  TransferTransaction,
  FileCreateTransaction,
  ContractCreateTransaction,
  ContractFunctionParameters,
  ContractCallQuery,
} = require('@hashgraph/sdk');
require('dotenv').config();

//Grab your Hedera testnet account ID and private key from your .env file
myAccountId = process.env.MY_ACCOUNT_ID;
myPrivateKey = process.env.MY_PRIVATE_KEY;

//Create your Hedera Testnet client
const client = Client.forTestnet();

//Set your account as the client's operator
client.setOperator(myAccountId, myPrivateKey);

queryContract();

async function queryContract() {
  console.log('Before Calling Query:');
  var prevgas = await verifyAccountBalance('0.0.15012018');

  // Calls a function of the smart contract
  const contractQuery = await new ContractCallQuery()
    //Set the gas for the query
    .setGas(50000)
    //Set the contract ID to return the request for
    .setContractId('0.0.15012997')
    //Set the contract function to call
    .setFunction('get_message');
  //Set the query payment for the node returning the request
  //This value must cover the cost of the request otherwise will fail
  //.setQueryPayment(new Hbar(2));

  //Submit to a Hedera network
  const getMessage = await contractQuery.execute(client);

  // Get a string from the result at index 0
  const message = getMessage.getString(0);

  //Log the message
  console.log('The contract message: ' + message);

  setTimeout(async () => {
    console.log('Delayed for 3 second.');
    var nextgas = await verifyAccountBalance('0.0.15012018');
    let exact = prevgas - nextgas;
    console.log(
      'Exact Gas Fees For Each Query: ',
      exact * 0.00000001,
      'HBAR'
    );
  }, '3000');
}

async function verifyAccountBalance(newAccountId) {
  //Verify the account balance
  const accountBalance = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .execute(client);

  const bal = accountBalance.hbars.toTinybars();
  console.log('The account balance is: ' + bal + ' tinybar.');
  return bal;
}
