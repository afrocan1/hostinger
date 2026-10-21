// Replace these 3 with YOUR receiving addresses.
// One EVM address works for ETH, BNB, Base, Avax and Arbitrum.
const EVM_WALLET = "0xYOUR_EVM_ADDRESS";
const TRON_WALLET = "YOUR_TRON_ADDRESS";
const SOL_WALLET = "YOUR_SOLANA_ADDRESS";

export const CHAINS = {
  tron:     { label: "Tron",      type: "tron",   address: TRON_WALLET, token: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" },
  bnb:      { label: "BNB Chain", type: "evm", chainId: 56,    address: EVM_WALLET, token: "0x55d398326f99059fF775485246999027B3197955" },
  eth:      { label: "Ethereum",  type: "evm", chainId: 1,     address: EVM_WALLET, token: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
  base:     { label: "Base",      type: "evm", chainId: 8453,  address: EVM_WALLET, token: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2" },
  avax:     { label: "Avalanche", type: "evm", chainId: 43114, address: EVM_WALLET, token: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7" },
  arbitrum: { label: "Arbitrum",  type: "evm", chainId: 42161, address: EVM_WALLET, token: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9" },
  solana:   { label: "Solana",    type: "solana", address: SOL_WALLET, token: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" },
};
