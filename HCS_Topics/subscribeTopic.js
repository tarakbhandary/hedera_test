const {
  Client,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageQuery,
} = require('@hashgraph/sdk');
require('dotenv').config({ path: '../.env' });

//Grab your Hedera testnet account ID and private key from your .env file
const myAccountId = process.env.ACCOUNT_ID_2;
const myPrivateKey = process.env.PRIVATE_KEY_2;

//Create your Hedera Testnet client
const client = Client.forTestnet();

//Set your account as the client's operator
client.setOperator(myAccountId, myPrivateKey);

//subscribeTopic('0.0.15052360');
subscribeTopic('0.0.15052523');
async function subscribeTopic(topicId) {
  console.log(topicId);
  // Subscribe to the topic
  new TopicMessageQuery()
    .setTopicId(topicId)
    .setStartTime(0)
    .subscribe(client, null, (message) => {
      console.log(Buffer.from(message.contents, 'utf8').toString());

      let messageAsString = Buffer.from(
        message.contents,
        'utf8'
      ).toString();
      console.log(
        `${message.consensusTimestamp.toDate()} Received: ${messageAsString}`
      );
    });
}
