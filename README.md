# 🎨 DevNFT Minting DApp

**[Live Demo](https://nft-minting-d-app-5j4y-lfm0dfxpl-chenkangs-projects-fc27279a.vercel.app)** | **[Verified Contract](https://sepolia.etherscan.io/address/0xa15c370A7f354847b25Bf0d566266577FbE4EC64)**

---

````markdown
![image](https://github.com/chenkang991019/NFT-Minting-DApp/blob/main/public/screenshot.png)

## ✨ Features

-   **👜 Wallet Connection**: Integrated with **RainbowKit** & **Wagmi v2**, supporting MetaMask and WalletConnect.
-   **⚡ Real-time Minting**: Automatic UI updates upon transaction confirmation (using `useWaitForTransactionReceipt`).
-   **🖼️ NFT Gallery**: Dynamic fetching of NFT metadata from **IPFS** with automatic fallback gateways (Cloudflare/Pinata).
-   **🛡️ Admin Panel**: Exclusive dashboard for the contract owner to withdraw funds (`Ownable` pattern).
-   **🔧 Robust Error Handling**: Handles IPFS path issues, network switching, and user rejection gracefully.

## 🛠️ Tech Stack

-   **Frontend**: Next.js, TypeScript, Tailwind CSS
-   **Web3 Integration**: Wagmi v2, Viem, TanStack Query
-   **Smart Contract**: Solidity (ERC-721), OpenZeppelin
-   **Storage**: IPFS (Pinata)
-   **Deployment**: Vercel (Frontend), Remix (Contract)

## 🔗 Smart Contract Details

The smart contract is deployed on the **Sepolia Testnet**.

| Item              | Value                                        |
| :---------------- | :------------------------------------------- |
| **Network**       | Sepolia                                      |
| **Contract Name** | `DevNFTv2`                                   |
| **Address**       | `0xa15c370A7f354847b25Bf0d566266577FbE4EC64` |
| **Status**        | ✅ Verified on Etherscan                     |

> Source code can be found in the [`contracts/`](./contracts/) directory.

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/chenkang991019/NFT-Minting-DApp.git
cd my-nft-dapp
```
````
