# Polygon LxLy

![Polygon LxLy](images/Screen_Shot_2023-11-15_at_10.03.51_AM.png)

## Quickstart

This repository includes two example scripts demonstrating how to send and claim messages on the Polygon LxLy Bridge. These scripts focus on core functionality, emphasizing key sending and claiming operations.

To access the full contracts and code snippets, refer to the [PingPongExample](https://github.com/0xPolygonHermez/code-examples/tree/main/pingPongExample) repository.

Run the following commands in conjunction with the `PingPongExample`:

```bash
npx hardhat run send.js --network goerli
npx hardhat run claim.js --network goerli
```

# What is the Polygon LXLY and Why Is it So Useful?

Bridges are crucial components of the blockchain ecosystem, enabling developers to build app-specific chains tailored to their needs and giving users the flexibility to transition between different chains. This article explores bridges, their types, and delves into the LxLy bridge, highlighting its benefits and functionality through a live coding example.

## A Brief Introduction to Bridges

Originally, the concept of a universal database of assets underpinned blockchain technology. As different blockchains emerged, each with distinct value propositions, bridges became essential. They allow developers to create customized app-specific chains while ensuring users can interact with applications on different chains without being constrained to a specific one.

## Trusted vs. Trustless Bridges

Bridges, holding over $200 billion worth of assets at their peak in March 2022, come in two types: trusted and trustless. Trusted bridges rely on a central entity to custody assets, introducing trust assumptions. In contrast, trustless bridges operate using smart contracts and algorithms, maintaining security at the blockchain level.

![Trusted vs Trustless Bridges](images/Screen_Shot_2023-11-15_at_9.55.03_AM.png)

However, trusted bridges have faced security challenges, with major hacks occurring due to their centralized nature. The Polygon LxLy bridge aims to address these concerns.

## Polygon LxLy Bridge

![Polygon LxLy Bridge](images/Screen_Shot_2023-11-15_at_10.03.51_AM.png)

### Benefits

The [Polygon Lx-Ly bridge](https://youtu.be/BOk2y_AtaYw?si=9VFMMwdamjMkwgjj&t=133) aims to achieve six main objectives:

1. Accessibility: Permissionless creation of a zk-EVM connected to the system.
2. Unified Liquidity: All Zk-EVMs use the same bridge, with L2 to L2 bridges available.
3. Polygon SDK: Consistent stack across all bridges.
4. Roll-up Centric: Projects can create their own rollup.
5. Communication Between Rolups: All rollups can communicate using the LXLy bridge.
6. Upgradeable: Governance upgrades all deployed rollups.

In the future, Polygon plans to enable direct communication between App chains without relying on L1 as an intermediary.

### Interoperability

Another [unique feature](https://wiki.polygon.technology/docs/zkevm/protocol/lxly-bridge/#what-remains-unchanged) of the Polygon LXLY bridge is the separation of bridging logic from the Global Exit Root Logic, enhancing interoperability.

## How it Works

1. **Deposit Tokens on L1:**
   Users initiate a transaction on Ethereum L1, depositing tokens into `PolygonZkEVMBridge` using the `bridgeAsset` function.

2. **Append Exit Leaf & Update Global Exit Root:**
   The bridge asset calls a `_deposit` function, calculating the leave value based on user deposit details.

3. **Syncing on L2:**
   After a while, the global exit root is updated on L2. The sequencer fetches the Global Exit Root, ensuring its designated storage slots in `PolygonkEVMGlobalExitRootL2` guarantee its specific location.

4. **Claiming Assets on L2:**
   Users construct a Merkle proof of their deposit leaf on L2 and submit a transaction on L2 to call `claimAsset` on `PolygonZkEVMBridge`.

5. **Validate and Complete the Bridging Process:**
   Inside the `claimAsset` function of the `PolygonZkEVMBridge` contract, the provided Merkle proof is verified.

![How it Works](images/Screen_Shot_2023-11-15_at_10.10.59_AM.png)

![New Bridge Design](images/lxly-2-new-bridge-design-1a77563150b6f141f737df81bea55162.png)

## Conclusion

In conclusion, bridges play a pivotal role in the blockchain ecosystem, providing developers with the flexibility to construct application-specific blockchains and enabling users to seamlessly navigate between different chains.

For further reading, refer to the following resources:

- [Cross-Chain Hacks with LxLy Bridge | Polygon DevX Americas Workshop Series Ep04](https://www.youtube.com/watch?v=MKvGl28pknE)
- [Designing the Polygon zkEVM LxLy Bridge, by Jesus Ligero](https://www.youtube.com/watch?v=BOk2y_AtaYw)
- [LXLY Bridge: Polygon Wiki](https://wiki.polygon.technology/docs/zkevm/protocol/lxly-bridge)