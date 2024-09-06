# Defi Lend Borrow

DeFi Lend Borrow is a decentralized finance (DeFi) application that enables users to lend and borrow assets on the Shimmer EVM testnet. The project is built using Solidity, Hardhat, React and ethers.

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v14 or later)
- Hardhat
- MetaMask (for interacting with the IOTA EVM Testnet)
- Etherscan API Key for adding chain configs in hardhat config.

## Getting Started

### 1. Clone the Repository

```bash
https://github.com/iota-community/Defi-lend-borrow.git
cd Defi-lend-borrow
```

### 2. Install Dependencies

Install all necessary dependencies for both the backend (smart contracts) and the frontend.

```bash
npm install         # Install dependencies for the hardhat project
cd frontend
npm install  or npm install --legacy-peer-deps   # Install dependencies for the React frontend
```

### 3. Configure Environment Variables

Create a `.env` file at the root of your project and include the following:

```bash
# .env
PRIVATE_KEY=<Your_Private_Key>
ETHERSCAN_API_KEY=<Your_ETHERSCAN_API_KEY>
```

### 4. Deploy the Contracts

Using Hardhat, compile and deploy the contracts on the IOTA EVM testnet, ensuring that the deploy script properly includes the required constructor arguments.

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network shimmer_evm_testnet
```

### 5. Run the Frontend

Navigate to the `/lend-borrow-ui` directory and start the React development server.

```bash
cd lend-borrow-ui
npm start
```

Open your browser at http://localhost:3000 to interact with the app.

## Contributing

Contributions are welcome! Please follow the standard GitHub process for opening issues, creating pull requests, and contributing code.

- Fork the repository
- Create a new branch (git checkout -b feature/your-feature)
- Commit your changes (git commit -m 'Add some feature')
- Push to the branch (git push origin feature/your-feature)
- Open a pull request

### License

This project is licensed under the MIT License.
