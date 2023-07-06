const {
  Client,
  PrivateKey,
  TokenAssociateTransaction,
} = require('@hashgraph/sdk');
require('dotenv').config({ path: '../.env' });

//Grab your Hedera testnet account ID and private key from your .env file
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(
  process.env.MY_PRIVATE_KEY
);

const AccountId2 = process.env.ACCOUNT_ID_2;
const PrivateKey2 = PrivateKey.fromString(process.env.PRIVATE_KEY_2);

treasuryId = myAccountId;
treasuryKey = myPrivateKey;
supplyKey = myPrivateKey;

//Create your Hedera Testnet client
const client = Client.forTestnet();

//Set your account as the client's operator
client.setOperator(myAccountId, myPrivateKey);

associateNFT('0.0.15052933');

async function associateNFT(tokenId) {
  //Create the associate transaction and sign with Alice's key
  const associateAliceTx = await new TokenAssociateTransaction()
    .setAccountId(AccountId2)
    .setTokenIds([tokenId])
    .freezeWith(client)
    .sign(PrivateKey2);

  //Submit the transaction to a Hedera network
  const associateAliceTxSubmit = await associateAliceTx.execute(
    client
  );

  //Get the transaction receipt
  const associateAliceRx = await associateAliceTxSubmit.getReceipt(
    client
  );

  //Confirm the transaction was successful
  console.log(
    `- NFT association with Alice's account: ${associateAliceRx.status}\n`
  );
}
