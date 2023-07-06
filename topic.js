const {
  TopicCreateTransaction,
  Client,
  Wallet,
  TopicMessageSubmitTransaction,
  TopicInfoQuery,
  TopicMessageQuery,
  PrivateKey,
  AccountBalanceQuery,
} = require('@hashgraph/sdk');
require('dotenv').config();

const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(
  process.env.MY_PRIVATE_KEY
);

const myAccountId2 = process.env.ACCOUNT_ID_2;
const myPrivateKey2 = PrivateKey.fromString(
  process.env.PRIVATE_KEY_2
);

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

const walletUser = new Wallet(myAccountId, myPrivateKey);
const walletUser2 = new Wallet(myAccountId2, myPrivateKey2);

async function createTopic() {
  console.log('Before Calling Topic:');
  var prevgas = await verifyAccountBalance('0.0.15012018');

  let transaction = new TopicCreateTransaction()
    .setSubmitKey(walletUser.publicKey)
    .setAdminKey(walletUser.publicKey)
    .setTopicMemo('Chain group');

  console.log(
    `Created a new TopicCreateTransaction with admin and submit key both set to: ${walletUser.publicKey}`
  );

  let txResponse = await transaction.execute(client);
  let receipt = await txResponse.getReceipt(client);

  let topicId = receipt.topicId;
  console.log(`Your topic ID is: ${topicId}`);

  // await new Promise((resolve) => setTimeout(resolve, 5000));

  setTimeout(async () => {
    console.log('Delayed for 3 second.');
    var nextgas = await verifyAccountBalance('0.0.15012018');
    let exact = prevgas - nextgas;
    console.log(
      'Exact Gas Fees For Each Query: ',
      exact * 0.00000001,
      'HBAR'
    );
  }, '3000');
}
async function submitMessage(topicId) {
  console.log('Before Calling Topic:');
  var prevgas = await verifyAccountBalance('0.0.15012018');
  const messageData = JSON.stringify({
    '874fh4byf7774f3tdfyrb': {
      docId: '874fh4byf7774f3tdfyrb',
      docName: 'Jadu.jpg',
      extention: 'image / jpeg',
      currentVersion: 1_1688124808,
      passphrase: 'byg47f4987yfbhru784y',
      fileURL:
        'https://amethyst-actual-hamster-661.mypinata.cloud/ipfs/QmacBW3BLehScbXkkb3KMvx9248R6DeFRqz6oKYJHvXsz7',
    },
  });
  let sendResponse = await new TopicMessageSubmitTransaction({
    topicId: topicId,
    message: messageData,
  }).execute(client);

  const getReceipt = await sendResponse.getReceipt(client);
  const transactionStatus = getReceipt.status;
  console.log('The message transaction status: ' + transactionStatus);
  //process.exit();

  setTimeout(async () => {
    console.log('Delayed for 3 second.');
    var nextgas = await verifyAccountBalance('0.0.15012018');
    let exact = prevgas - nextgas;
    console.log(
      'Exact Gas Fees For Each Query: ',
      exact * 0.00000001,
      'HBAR'
    );
  }, '3000');
}
async function subscribeTopic(topicId) {
  console.log('Before Calling Topic:');
  var prevgas = await verifyAccountBalance('0.0.15012018');

  new TopicMessageQuery()
    .setTopicId(topicId)
    .setStartTime(0)
    .subscribe(client, (message) => {
      console.log(Buffer.from(message.contents, 'utf8').toString());
    });
  setTimeout(async () => {
    console.log('Delayed for 3 second.');
    var nextgas = await verifyAccountBalance('0.0.15012018');
    let exact = prevgas - nextgas;
    console.log(
      'Exact Gas Fees For Each Query: ',
      exact * 0.00000001,
      'HBAR'
    );
  }, '5000');
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

subscribeTopic('0.0.15039969');
// submitMessage('0.0.15039969');
// createTopic();
