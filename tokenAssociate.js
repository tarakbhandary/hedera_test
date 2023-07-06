const {
  Client,
  PrivateKey,
  AccountId,
  TokenId,
  AccountCreateTransaction,
  AccountBalanceQuery,
  Hbar,
  TransferTransaction,
  FileCreateTransaction,
  ContractCreateTransaction,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  HbarUnit,
} = require('@hashgraph/sdk');
require('dotenv').config();

//Grab your Hedera testnet account ID and private key from your .env file
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = process.env.MY_PRIVATE_KEY;

//Create your Hedera Testnet client
const client = Client.forTestnet();

//Set your account as the client's operator
client.setOperator(myAccountId, myPrivateKey);

tokenAssociate();
async function tokenAssociate() {
  var accountIdTest = AccountId.fromString(process.env.ACCOUNT_ID_3);
  var accountKeyTest = PrivateKey.fromString(
    process.env.PRIVATE_KEY_3
  );
  var newContractId = '0.0.15050731';
  var tokenId = TokenId.fromString('0.0.15046110');
  //Associate the token to an account using the HTS contract
  const associateToken = new ContractExecuteTransaction()
    //The contract to call
    .setContractId(newContractId)
    //The gas for the transaction
    .setGas(2000000)
    //The contract function to call and parameters to pass
    .setFunction(
      'tokenAssociate',
      new ContractFunctionParameters()
        //The account ID to associate the token to
        .addAddress(accountIdTest.toSolidityAddress())
        //The token ID to associate to the account
        .addAddress(tokenId.toSolidityAddress())
    );

  //Sign with the account key and submit to the Hedera network
  const signTx = await associateToken
    .freezeWith(client)
    .sign(accountKeyTest);

  //Submit the transaction
  const submitAssociateTx = await signTx.execute(client);

  //Get the receipt
  const txReceipt = await submitAssociateTx.getReceipt(client);

  //Get transaction status
  const txStatus = txReceipt.status;

  console.log('The associate transaction was ' + txStatus.toString());
}
