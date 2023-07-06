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
  HbarUnit,
} = require('@hashgraph/sdk');
require('dotenv').config();

//Grab your Hedera testnet account ID and private key from your .env file
myAccountId = process.env.MY_ACCOUNT_ID;
myPrivateKey = process.env.MY_PRIVATE_KEY;

//Create your Hedera Testnet client
const client = Client.forTestnet();

//Set your account as the client's operator
client.setOperator(myAccountId, myPrivateKey);

storeByteCode();

async function storeByteCode() {
  console.log('Before Calling:');
  var prevgas = await verifyAccountBalance('0.0.15012018');
  //Import the compiled contract from the HelloHedera.json file
  let helloHedera = require('./HelloHedera.json');
  const bytecode = helloHedera.object;

  //Create a file on Hedera and store the hex-encoded bytecode
  const fileCreateTx = new FileCreateTransaction()
    //Set the bytecode of the contract
    .setContents(bytecode);

  //Submit the file to the Hedera test network signing with the transaction fee payer key specified with the client
  const submitTx = await fileCreateTx.execute(client);

  //Get the receipt of the file create transaction
  const fileReceipt = await submitTx.getReceipt(client);

  //Get the file ID from the receipt
  const bytecodeFileId = fileReceipt.fileId;

  //Log the file ID
  console.log(
    'The smart contract byte code file ID is ' + bytecodeFileId
  );

  await deployByteCode(bytecodeFileId);
  console.log('After: ');
  var nextgas = await verifyAccountBalance('0.0.15012018');
  let exact = prevgas - nextgas;
  console.log('Exact Gas Fees: ', exact * 0.00000001, 'HBAR');
}

async function deployByteCode(bytecodeFileId) {
  // Instantiate the contract instance
  const contractTx = await new ContractCreateTransaction()
    //Set the file ID of the Hedera file storing the bytecode
    .setBytecodeFileId(bytecodeFileId)
    //Set the gas to instantiate the contract
    .setGas(1000000)
    //Provide the constructor parameters for the contract
    .setConstructorParameters(
      new ContractFunctionParameters().addString(
        'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.'
      )
    );

  //Submit the transaction to the Hedera test network
  const contractResponse = await contractTx.execute(client);

  //Get the receipt of the file create transaction
  const contractReceipt = await contractResponse.getReceipt(client);

  //Get the smart contract ID
  const newContractId = contractReceipt.contractId;

  //Log the smart contract ID
  console.log('The smart contract ID is ' + newContractId);
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
