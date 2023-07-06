const {
  Client,
  PrivateKey,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
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

createNFT();

async function createNFT() {
  //Create the NFT
  const nftCreate = await new TokenCreateTransaction()
    .setTokenName('MYTBTOKEN')
    .setTokenSymbol('TBTK')
    .setTokenType(TokenType.NonFungibleUnique)
    .setDecimals(0)
    .setInitialSupply(0)
    .setTreasuryAccountId(treasuryId)
    .setSupplyType(TokenSupplyType.Finite)
    .setMaxSupply(5)
    .setSupplyKey(supplyKey)
    .freezeWith(client);

  //Sign the transaction with the treasury key
  const nftCreateTxSign = await nftCreate.sign(treasuryKey);

  //Submit the transaction to a Hedera network
  const nftCreateSubmit = await nftCreateTxSign.execute(client);

  //Get the transaction receipt
  const nftCreateRx = await nftCreateSubmit.getReceipt(client);

  //Get the token ID
  const tokenId = nftCreateRx.tokenId;

  //Log the token ID
  console.log(`- Created NFT with Token ID: ${tokenId} \n`);
}
