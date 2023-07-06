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
  HbarUnit,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
} = require('@hashgraph/sdk');
require('dotenv').config();

//Grab your Hedera testnet account ID and private key from your .env file
const myAccountId = process.env.MY_ACCOUNT_ID;
const treasuryId = myAccountId;

const myPrivateKey = PrivateKey.fromString(
  process.env.MY_PRIVATE_KEY
);
const treasuryKey = myPrivateKey;
//const supplyKey = myPrivateKey;
const supplyKey = PrivateKey.fromString(process.env.PRIVATE_KEY_2);

//Create your Hedera Testnet client
const client = Client.forTestnet();

//Set your account as the client's operator
client.setOperator(myAccountId, myPrivateKey);

createFungibleToken();
async function createFungibleToken() {
  // CREATE FUNGIBLE TOKEN (STABLECOIN)
  let tokenCreateTx = await new TokenCreateTransaction()
    .setTokenName('INR Bar')
    .setTokenSymbol('TBTB')
    .setTokenType(TokenType.FungibleCommon)
    .setDecimals(2)
    .setInitialSupply(10000)
    .setTreasuryAccountId(treasuryId)
    .setSupplyType(TokenSupplyType.Infinite)
    .setSupplyKey(supplyKey)
    .freezeWith(client);

  //SIGN WITH TREASURY KEY
  let tokenCreateSign = await tokenCreateTx.sign(treasuryKey);

  //SUBMIT THE TRANSACTION
  let tokenCreateSubmit = await tokenCreateSign.execute(client);

  //GET THE TRANSACTION RECEIPT
  let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);

  //GET THE TOKEN ID
  let tokenId = tokenCreateRx.tokenId;

  //LOG THE TOKEN ID TO THE CONSOLE
  console.log(`- Created token with ID: ${tokenId} \n`);
}
