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
require('dotenv').config({ path: `../.env` });

// Configure accounts and client
const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
const client = Client.forTestnet().setOperator(
  operatorId,
  operatorKey
);

async function main() {
  // Create other necessary accounts
  console.log(`\n- Creating accounts...`);
  const initBalance = 100;
  const treasuryKey = PrivateKey.generateED25519();
  const [treasuryAccSt, treasuryId] = await accountCreatorFcn(
    treasuryKey,
    initBalance
  );
  console.log(
    `- Created Treasury account ${treasuryId} that has a balance of ${initBalance} ℏ`
  );

  const aliceKey = PrivateKey.generateED25519();
  const [aliceAccSt, aliceId] = await accountCreatorFcn(
    aliceKey,
    initBalance
  );
  console.log(
    `- Created Alice's account ${aliceId} that has a balance of ${initBalance} ℏ`
  );

  // Import the compiled contract bytecode
  const contractBytecode = fs.readFileSync(
    'hbarToAndFromContract.bin'
  );

  // Deploy the smart contract on Hedera
  console.log(`\n- Deploying contract...`);
  let gasLimit = 100000;

  const [contractId, contractAddress] = await contractDeployFcn(
    contractBytecode,
    gasLimit
  );
  console.log(`- The smart contract ID is: ${contractId}`);
  console.log(
    `- The smart contract ID in Solidity format is: ${contractAddress}`
  );

  const tokenId = AccountId.fromString('0.0.47931765');
  console.log(
    `\n- Token ID (for association with contract later): ${tokenId}`
  );
}

main();
