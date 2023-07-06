const {
  Client,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageQuery,
} = require('@hashgraph/sdk');
require('dotenv').config({ path: '../.env' });

//Grab your Hedera testnet account ID and private key from your .env file
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = process.env.MY_PRIVATE_KEY;

//Create your Hedera Testnet client
const client = Client.forTestnet();

//Set your account as the client's operator
client.setOperator(myAccountId, myPrivateKey);

createPrivateTopic();
async function createPrivateTopic() {
  // Create a new topic
  let txResponse = await new TopicCreateTransaction()
    .setSubmitKey(myPrivateKey.publicKey)
    .execute(client);

  // Grab the newly generated topic ID
  let receipt = await txResponse.getReceipt(client);
  console.log(`Your topic ID is: ${receipt.topicId}`);

  // Wait 5 seconds between consensus topic creation and subscription creation
  await new Promise((resolve) => setTimeout(resolve, 5000));
}
