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
const myPrivateKey = PrivateKey.fromString(
  process.env.MY_PRIVATE_KEY
);

const AccountId2 = process.env.ACCOUNT_ID_2;
const PrivateKey2 = PrivateKey.fromString(process.env.PRIVATE_KEY_2);

//Create your Hedera Testnet client
const client = Client.forTestnet();

//Set your account as the client's operator
client.setOperator(myAccountId, myPrivateKey);

submitPrivateTopic('0.0.15052523');
async function submitPrivateTopic(topicId) {
  // Send message to private topic
  let submitMsgTx = await new TopicMessageSubmitTransaction({
    topicId: topicId,
    message: 'It Seems AAAA',
  })
    .freezeWith(client)
    .sign(PrivateKey2);

  let submitMsgTxSubmit = await submitMsgTx.execute(client);

  // Get the receipt of the transaction
  let getReceipt = await submitMsgTxSubmit.getReceipt(client);

  // Get the status of the transaction
  const transactionStatus = getReceipt.status;
  console.log(
    'The message transaction status ' + transactionStatus.toString()
  );
}
