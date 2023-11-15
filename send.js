/* eslint-disable no-await-in-loop, no-use-before-define, no-lonely-if, import/no-dynamic-require, global-require */
/* eslint-disable no-console, no-inner-declarations, no-undef, import/no-unresolved, no-restricted-syntax */

const path = require('path');
const { ethers } = require('hardhat');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const networkIDzkEVM = 1;
const pathPingPongOutput = path.join(__dirname, '../deployment/pingPong_output.json');
const pingSenderContractAddress = require(pathPingPongOutput).pingSenderContract;

/**
 * Loads the deployer wallet based on the provided environment variables.
 * @returns {Promise<ethers.Wallet>} The deployed wallet.
 */
async function loadDeployer() {
    if (process.env.PVTKEY) {
        // Use the private key to create a wallet
        const deployer = new ethers.Wallet(process.env.PVTKEY, ethers.provider);
        console.log('Using private key deployer with address:', deployer.address);
        return deployer;
    } else if (process.env.RECOVERY_PHRASE) {
        // Use the recovery phrase to create a wallet
        const deployer = ethers.Wallet.fromMnemonic(process.env.RECOVERY_PHRASE).connect(ethers.provider);
        console.log('Using recovery phrase deployer with address:', deployer.address);
        return deployer;
    } else {
        // Use the default signer if no private key or recovery phrase is provided
        const [deployer] = await ethers.getSigners();
        console.log('Using default signer deployer with address:', deployer.address);
        return deployer;
    }
}

/**
 * Main function to interact with the PingSender contract.
 */
async function main() {
    const deployer = await loadDeployer();

    const nftBridgeFactory = await ethers.getContractFactory('PingSender', deployer);
    const nftBridgeContract = nftBridgeFactory.attach(pingSenderContractAddress);

    const forceUpdateGlobalExitRoot = true; // fast bridge
    const pingValue = 69420;
    
    // Send a bridge ping message
    const tx = await nftBridgeContract.bridgePingMessage(
        networkIDzkEVM,
        forceUpdateGlobalExitRoot,
        pingValue,
    );

    console.log(await tx.wait());

    console.log('Bridge done successfully');
}

// Execute the main function and handle errors
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
