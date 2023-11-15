/* eslint-disable no-await-in-loop */
/* eslint-disable no-console, no-inner-declarations, no-undef, import/no-unresolved */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { ethers } = require('hardhat');
const axios = require('axios');

const mainnetBridgeAddress = '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe';
const testnetBridgeAddress = '0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7';

const mekrleProofString = '/merkle-proof';
const getClaimsFromAcc = '/bridges/';

const pathPingPongOutput = path.join(__dirname, '../deployment/pingPong_output.json');
const pingReceiverContractAddress = require(pathPingPongOutput).pingReceiverContract;

async function getDeployerWallet() {
    const currentProvider = ethers.provider;

    if (process.env.PVTKEY) {
        return new ethers.Wallet(process.env.PVTKEY, currentProvider);
    } else if (process.env.MNEMONIC) {
        return ethers.Wallet.fromMnemonic(process.env.MNEMONIC, 'm/44\'/60\'/0\'/0/0').connect(currentProvider);
    } else {
        const [deployer] = await ethers.getSigners();
        return deployer;
    }
}

async function getBridgeInfo(networkName) {
    if (networkName === 'polygonZKEVMMainnet' || networkName === 'mainnet') {
        return { address: mainnetBridgeAddress, baseURL: 'https://bridge-api.zkevm-rpc.com' };
    } else if (networkName === 'polygonZKEVMTestnet' || networkName === 'goerli') {
        return { address: testnetBridgeAddress, baseURL: 'https://bridge-api.public.zkevm-test.net' };
    }

    throw new Error('Unsupported network: ' + networkName);
}

async function main() {
    const deployer = await getDeployerWallet();
    const networkName = process.env.HARDHAT_NETWORK;
    const { address: zkEVMBridgeContractAddress, baseURL } = await getBridgeInfo(networkName);

    const axiosInstance = axios.create({ baseURL });

    const bridgeFactoryZkeEVm = await ethers.getContractFactory('PolygonZkEVMBridge', deployer);
    const bridgeContractZkeVM = bridgeFactoryZkeEVm.attach(zkEVMBridgeContractAddress);

    const depositAxions = await axiosInstance.get(getClaimsFromAcc + pingReceiverContractAddress, { params: { limit: 100, offset: 0 } });
    const depositsArray = depositAxions.data.deposits;

    if (depositsArray.length === 0) {
        console.log('Not ready yet!');
        return;
    }

    for (const currentDeposit of depositsArray) {
        if (currentDeposit.ready_for_claim) {
            const proofAxios = await axiosInstance.get(mekrleProofString, {
                params: { deposit_cnt: currentDeposit.deposit_cnt, net_id: currentDeposit.orig_net },
            });

            const { proof } = proofAxios.data;
            const claimTx = await bridgeContractZkeVM.claimMessage(
                proof.merkle_proof,
                currentDeposit.deposit_cnt,
                proof.main_exit_root,
                proof.rollup_exit_root,
                currentDeposit.orig_net,
                currentDeposit.orig_addr,
                currentDeposit.dest_net,
                currentDeposit.dest_addr,
                currentDeposit.amount,
                currentDeposit.metadata,
            );
            console.log('Claim message successfully sent:', claimTx.hash);
            await claimTx.wait();
            console.log('Claim message successfully mined');
        } else {
            console.log('Bridge not ready for claim');
        }
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
