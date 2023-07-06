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
  ContractExecuteTransaction,
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

setTransaction();
async function setTransaction() {
  console.log('Before Calling Set Message:');
  var prevgas = await verifyAccountBalance('0.0.15012018');

  //Create the transaction to update the contract message
  const contractExecTx = await new ContractExecuteTransaction()
    //Set the ID of the contract
    .setContractId('0.0.15012997')
    //Set the gas for the contract call
    .setGas(1000000)
    //Set the contract function to call
    .setFunction(
      'set_message',
      new ContractFunctionParameters().addString(
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.'
      )
    );

  //Submit the transaction to a Hedera network and store the response
  const submitExecTx = await contractExecTx.execute(client);

  //Get the receipt of the transaction
  const receipt2 = await submitExecTx.getReceipt(client);

  //Confirm the transaction was executed successfully
  console.log(
    'The transaction status is ' + receipt2.status.toString()
  );

  console.log('After Query: ');
  var nextgas = await verifyAccountBalance('0.0.15012018');
  let exact = prevgas - nextgas;
  console.log(
    'Exact Gas Fees For Each Query: ',
    exact * 0.00000001,
    'HBAR'
  );
}

async function verifyAccountBalance(newAccountId) {
  //Verify the account balance
  const accountBalance = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .execute(client);

  console.log(
    'The account balance is: ' +
      accountBalance.hbars.toTinybars() +
      ' tinybar.'
  );
  return accountBalance.hbars.toTinybars();
}
