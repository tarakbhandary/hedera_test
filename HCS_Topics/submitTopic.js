const {
  Client,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageQuery,
  TopicMessageSubmitTransaction,
} = require('@hashgraph/sdk');
require('dotenv').config({ path: '../.env' });

//Grab your Hedera testnet account ID and private key from your .env file
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = process.env.MY_PRIVATE_KEY;

//Create your Hedera Testnet client
const client = Client.forTestnet();

//Set your account as the client's operator
client.setOperator(myAccountId, myPrivateKey);

submitTopic('0.0.15052264');

async function submitTopic(topicId) {
  // Send message to the topic
  let sendResponse = await new TopicMessageSubmitTransaction({
    topicId: topicId,
    message: 'Message 1',
  }).execute(client);

  // Submit messages
  await new TopicMessageSubmitTransaction({
    topicId: topicId,
    message: 'Message 2',
  }).execute(client);

  await new TopicMessageSubmitTransaction({
    topicId: topicId,
    message: 'Message 3',
  }).execute(client);

  await new TopicMessageSubmitTransaction({
    topicId: topicId,
    message: 'Message 4',
  }).execute(client);

  // Get the receipt of the transaction
  const getReceipt = await sendResponse.getReceipt(client);

  // Get the status of the transaction
  const transactionStatus = getReceipt.status;
  console.log(
    'The message transaction status ' + transactionStatus.toString()
  );
}
