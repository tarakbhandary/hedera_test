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

//Get the contract bytecode
// const bytecode = htsContract.data.bytecode.object;
storeByteCode();
async function storeByteCode() {
  let helloHedera = require('./HTS.json');
  const bytecode = helloHedera.data.bytecode.object;

  //Create a file on Hedera and store the hex-encoded bytecode
  const fileCreateTx = new FileCreateTransaction().setContents(
    bytecode
  );

  //Submit the file to the Hedera test network signing with the transaction fee payer key specified with the client
  const submitTx = await fileCreateTx.execute(client);

  //Get the receipt of the file create transaction
  const fileReceipt = await submitTx.getReceipt(client);

  //Get the file ID from the receipt
  const bytecodeFileId = fileReceipt.fileId;

  //Log the file ID
  console.log(
    'The smart contract bytecode file ID is ' + bytecodeFileId
  );

  deployByteCode(bytecodeFileId);
}

async function deployByteCode(bytecodeFileId) {
  //Deploy the contract instance
  const contractTx = await new ContractCreateTransaction()
    //The bytecode file ID
    .setBytecodeFileId(bytecodeFileId)
    //The max gas to reserve
    .setGas(2000000);

  //Submit the transaction to the Hedera test network
  const contractResponse = await contractTx.execute(client);

  //Get the receipt of the file create transaction
  const contractReceipt = await contractResponse.getReceipt(client);

  //Get the smart contract ID
  const newContractId = contractReceipt.contractId;

  //Log the smart contract ID
  console.log('The smart contract ID is ' + newContractId);
}
