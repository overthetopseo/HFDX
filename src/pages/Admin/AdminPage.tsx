import { Trans, t } from "@lingui/macro";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useChainId, usePublicClient, useWalletClient } from "wagmi";
import { Address, keccak256, toBytes } from "viem";

import SEO from "components/Seo/SEO";
import Button from "components/Button/Button";
import ExternalLink from "components/ExternalLink/ExternalLink";
import AppPageLayout from "components/AppPageLayout/AppPageLayout";

import { getContract } from "config/contracts";
import { ARBITRUM, AVALANCHE } from "config/chains";
import { UI_FEE_RECEIVER_ACCOUNT } from "config/ui";

import "./AdminPage.css";

// HFDX Admin Wallet - ONLY this wallet can access admin functions
const HFDX_ADMIN_WALLET = "0x791A7E0F0ba98B09D3b8d7DE61b35DED076A7854";

// HFDX Fee Receiver Wallet - configured in .env as VITE_APP_UI_FEE_RECEIVER
const HFDX_FEE_RECEIVER = UI_FEE_RECEIVER_ACCOUNT || "0x64d2b485eBFe5ddFf112D92E4802D7851ceAD586";

// ExchangeRouter ABI for UI fee functions
const EXCHANGE_ROUTER_ABI = [
  {
    inputs: [{ name: "uiFeeFactor", type: "uint256" }],
    name: "setUiFeeFactor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "market", type: "address" },
      { name: "token", type: "address" },
      { name: "receiver", type: "address" },
    ],
    name: "claimUiFees",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// DataStore ABI for reading fee values
const DATA_STORE_ABI = [
  {
    inputs: [{ name: "key", type: "bytes32" }],
    name: "getUint",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "key", type: "bytes32" }],
    name: "getAddress",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Keys for DataStore - using keccak256 hash of the key name (GMX convention)
const MAX_UI_FEE_FACTOR_KEY = keccak256(toBytes("MAX_UI_FEE_FACTOR"));

// Supported chains for GMX V2
const SUPPORTED_CHAINS = [ARBITRUM, AVALANCHE];

// HFDX Admin Dashboard v1.1
function AdminPage() {
  const chainId = useChainId();
  const { address: account, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  // State
  const [uiFeeFactor, setUiFeeFactor] = useState<string>("0.1"); // 0.1% fee on Open/Close
  const [maxUiFeeFactor, setMaxUiFeeFactor] = useState<bigint>(0n);
  const [receiverWallet, setReceiverWallet] = useState<string>(HFDX_FEE_RECEIVER);
  const [claimMarket, setClaimMarket] = useState<string>("");
  const [claimToken, setClaimToken] = useState<string>("");
  const [isSettingFee, setIsSettingFee] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [txHash, setTxHash] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Check if connected wallet is the admin
  const isAdmin = account?.toLowerCase() === HFDX_ADMIN_WALLET.toLowerCase();
  
  // Check if on supported chain
  const isSupportedChain = SUPPORTED_CHAINS.includes(chainId);

  // Get contract addresses - wrapped in try-catch for unsupported chains
  let exchangeRouterAddress: string | undefined;
  let dataStoreAddress: string | undefined;
  
  try {
    if (chainId && isSupportedChain) {
      // Cast chainId to the supported type since we already check isSupportedChain
      const supportedChainId = chainId as typeof ARBITRUM | typeof AVALANCHE;
      exchangeRouterAddress = getContract(supportedChainId, "ExchangeRouter");
      dataStoreAddress = getContract(supportedChainId, "DataStore");
    }
  } catch (e) {
    // Chain not supported - will show unsupported chain message
  }

  // Load max UI fee factor from DataStore
  useEffect(() => {
    async function loadMaxFeeFactor() {
      if (!publicClient || !dataStoreAddress) return;

      try {
        const maxFee = await publicClient.readContract({
          address: dataStoreAddress as Address,
          abi: DATA_STORE_ABI,
          functionName: "getUint",
          args: [MAX_UI_FEE_FACTOR_KEY as `0x${string}`],
        });
        setMaxUiFeeFactor(maxFee);
      } catch (err) {
        console.error("Error loading max fee factor:", err);
      }
    }

    loadMaxFeeFactor();
  }, [publicClient, dataStoreAddress]);

  // Convert percentage to fee factor (multiply by 10^30 / 100)
  const percentageToFeeFactor = (percentage: string): bigint => {
    const percentValue = parseFloat(percentage);
    if (isNaN(percentValue) || percentValue < 0) return 0n;
    // fee = percentage / 100 * 10^30
    return BigInt(Math.floor(percentValue * 10 ** 28));
  };

  // Convert fee factor to percentage
  const feeFactorToPercentage = (feeFactor: bigint): string => {
    if (feeFactor === 0n) return "0";
    const percentage = Number(feeFactor) / 10 ** 28;
    return percentage.toFixed(4);
  };

  // Set UI Fee Factor
  const handleSetUiFeeFactor = useCallback(async () => {
    if (!isAdmin) {
      setError("Unauthorized: Only admin wallet can set fees");
      return;
    }

    if (!walletClient || !exchangeRouterAddress || !account) {
      setError("Please connect your wallet to Arbitrum or Avalanche");
      return;
    }

    setIsSettingFee(true);
    setError("");
    setSuccess("");
    setTxHash("");

    try {
      const feeFactor = percentageToFeeFactor(uiFeeFactor);

      if (maxUiFeeFactor > 0n && feeFactor > maxUiFeeFactor) {
        setError(`Fee factor exceeds maximum allowed (${feeFactorToPercentage(maxUiFeeFactor)}%)`);
        setIsSettingFee(false);
        return;
      }

      const hash = await walletClient.writeContract({
        address: exchangeRouterAddress as Address,
        abi: EXCHANGE_ROUTER_ABI,
        functionName: "setUiFeeFactor",
        args: [feeFactor],
      });

      setTxHash(hash);
      setSuccess(`UI Fee Factor set to ${uiFeeFactor}%`);
    } catch (err: any) {
      console.error("Error setting UI fee factor:", err);
      setError(err.message || "Failed to set UI fee factor");
    } finally {
      setIsSettingFee(false);
    }
  }, [walletClient, exchangeRouterAddress, account, uiFeeFactor, maxUiFeeFactor, isAdmin]);

  // Claim UI Fees
  const handleClaimFees = useCallback(async () => {
    if (!isAdmin) {
      setError("Unauthorized: Only admin wallet can claim fees");
      return;
    }

    if (!walletClient || !exchangeRouterAddress || !account) {
      setError("Please connect your wallet to Arbitrum or Avalanche");
      return;
    }

    if (!claimMarket || !claimToken || !receiverWallet) {
      setError("Please fill in all claim fields");
      return;
    }

    setIsClaiming(true);
    setError("");
    setSuccess("");
    setTxHash("");

    try {
      const hash = await walletClient.writeContract({
        address: exchangeRouterAddress as Address,
        abi: EXCHANGE_ROUTER_ABI,
        functionName: "claimUiFees",
        args: [claimMarket as Address, claimToken as Address, receiverWallet as Address],
      });

      setTxHash(hash);
      setSuccess("UI Fees claimed successfully!");
    } catch (err: any) {
      console.error("Error claiming UI fees:", err);
      setError(err.message || "Failed to claim UI fees");
    } finally {
      setIsClaiming(false);
    }
  }, [walletClient, exchangeRouterAddress, account, claimMarket, claimToken, receiverWallet, isAdmin]);

  const getExplorerUrl = (hash: string) => {
    if (chainId === ARBITRUM) {
      return `https://arbiscan.io/tx/${hash}`;
    } else if (chainId === AVALANCHE) {
      return `https://snowtrace.io/tx/${hash}`;
    }
    return `https://arbiscan.io/tx/${hash}`;
  };

  const getChainName = () => {
    if (chainId === ARBITRUM) return "Arbitrum";
    if (chainId === AVALANCHE) return "Avalanche";
    if (chainId === 1) return "Ethereum";
    if (chainId === 56) return "BNB Chain";
    if (chainId === 8453) return "Base";
    return `Chain ${chainId}`;
  };

  return (
    <AppPageLayout>
      <SEO title={t`Admin - UI Fee Management`}>
        <div className="admin-page">
          <div className="admin-container">
            <div className="admin-header">
              <h1 className="admin-title">
                <Trans>UI Fee Administration</Trans>
              </h1>
              <p className="admin-subtitle">
                <Trans>Configure UI fees and claim accumulated trading fees</Trans>
              </p>
            </div>

          {/* Not Connected */}
          {!isConnected && (
            <div className="admin-card admin-connect-prompt">
              <div className="admin-connect-icon">🔐</div>
              <h2>
                <Trans>Connect Wallet</Trans>
              </h2>
              <p>
                <Trans>Please connect your wallet to access admin functions</Trans>
              </p>
            </div>
          )}

          {/* Connected but not admin */}
          {isConnected && !isAdmin && (
            <div className="admin-card admin-connect-prompt">
              <div className="admin-connect-icon">🚫</div>
              <h2>
                <Trans>Access Denied</Trans>
              </h2>
              <p>
                <Trans>This admin panel is restricted to authorized wallets only.</Trans>
              </p>
              <div style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#64748b" }}>
                <p>Connected: {account?.slice(0, 6)}...{account?.slice(-4)}</p>
                <p style={{ marginTop: "0.5rem" }}>Required: {HFDX_ADMIN_WALLET.slice(0, 6)}...{HFDX_ADMIN_WALLET.slice(-4)}</p>
              </div>
            </div>
          )}

          {/* Connected as admin but wrong chain */}
          {isConnected && isAdmin && !isSupportedChain && (
            <div className="admin-card admin-connect-prompt">
              <div className="admin-connect-icon">⛓️</div>
              <h2>
                <Trans>Wrong Network</Trans>
              </h2>
              <p>
                <Trans>Please switch to Arbitrum or Avalanche to configure fees.</Trans>
              </p>
              <div style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#64748b" }}>
                <p>Current: {getChainName()}</p>
                <p style={{ marginTop: "0.5rem" }}>Supported: Arbitrum, Avalanche</p>
              </div>
            </div>
          )}

          {/* Admin connected on supported chain */}
          {isConnected && isAdmin && isSupportedChain && (
            <>
              {/* Network Info */}
              <div className="admin-card admin-network-info">
                <div className="admin-network-badge">
                  {getChainName()} ✓
                </div>
                <div className="admin-wallet-info">
                  <span className="admin-label">Admin:</span>
                  <span className="admin-address">{account?.slice(0, 6)}...{account?.slice(-4)}</span>
                </div>
              </div>

              {/* Status Messages */}
              {error && (
                <div className="admin-alert admin-alert-error">
                  <span>⚠️</span> {error}
                </div>
              )}
              {success && (
                <div className="admin-alert admin-alert-success">
                  <span>✅</span> {success}
                  {txHash && (
                    <ExternalLink href={getExplorerUrl(txHash)} className="admin-tx-link">
                      View Transaction
                    </ExternalLink>
                  )}
                </div>
              )}

              {/* Set UI Fee Factor Section */}
              <div className="admin-card">
                <h2 className="admin-card-title">
                  <span className="admin-card-icon">💰</span>
                  <Trans>Set UI Fee Factor</Trans>
                </h2>
                <p className="admin-card-description">
                  <Trans>
                    Set the percentage fee charged on trades. This fee is added on top of the base protocol fees.
                  </Trans>
                </p>

                <div className="admin-info-box">
                  <div className="admin-info-row">
                    <span>Max Allowed Fee:</span>
                    <span className="admin-info-value">
                      {maxUiFeeFactor > 0n ? `${feeFactorToPercentage(maxUiFeeFactor)}%` : "Loading..."}
                    </span>
                  </div>
                  <div className="admin-info-row">
                    <span>ExchangeRouter:</span>
                    <span className="admin-info-value admin-address-small">
                      {exchangeRouterAddress ? `${exchangeRouterAddress.slice(0, 10)}...${exchangeRouterAddress.slice(-8)}` : "Not available"}
                    </span>
                  </div>
                  <div className="admin-info-row">
                    <span>Fee Receiver:</span>
                    <span className="admin-info-value admin-address-small">
                      {HFDX_FEE_RECEIVER.slice(0, 10)}...{HFDX_FEE_RECEIVER.slice(-8)}
                    </span>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">
                    <Trans>UI Fee Percentage (%)</Trans>
                  </label>
                  <div className="admin-input-group">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="0.5"
                      value={uiFeeFactor}
                      onChange={(e) => setUiFeeFactor(e.target.value)}
                      className="admin-input"
                      placeholder="0.1"
                    />
                    <span className="admin-input-suffix">%</span>
                  </div>
                  <p className="admin-hint">
                    <Trans>HFDX Fee: 0.1% on Open/Close positions = $1.00 fee on $1,000 trade</Trans>
                  </p>
                </div>

                <Button
                  variant="primary"
                  className="admin-button"
                  onClick={handleSetUiFeeFactor}
                  disabled={isSettingFee || !uiFeeFactor || !exchangeRouterAddress}
                >
                  {isSettingFee ? <Trans>Setting Fee...</Trans> : <Trans>Set UI Fee Factor</Trans>}
                </Button>
              </div>

              {/* Claim UI Fees Section */}
              <div className="admin-card">
                <h2 className="admin-card-title">
                  <span className="admin-card-icon">🏦</span>
                  <Trans>Claim Accumulated Fees</Trans>
                </h2>
                <p className="admin-card-description">
                  <Trans>
                    Claim UI fees that have been collected from trading activity. Fees are accumulated per market and token.
                  </Trans>
                </p>

                <div className="admin-form-group">
                  <label className="admin-label">
                    <Trans>Receiver Wallet Address</Trans>
                  </label>
                  <input
                    type="text"
                    value={receiverWallet}
                    onChange={(e) => setReceiverWallet(e.target.value)}
                    className="admin-input"
                    placeholder="0x..."
                  />
                  <p className="admin-hint">
                    <Trans>Address that will receive the claimed fees</Trans>
                  </p>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">
                    <Trans>Market Address</Trans>
                  </label>
                  <input
                    type="text"
                    value={claimMarket}
                    onChange={(e) => setClaimMarket(e.target.value)}
                    className="admin-input"
                    placeholder="0x..."
                  />
                  <p className="admin-hint">
                    <Trans>The market token address to claim fees from</Trans>
                  </p>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">
                    <Trans>Fee Token Address</Trans>
                  </label>
                  <input
                    type="text"
                    value={claimToken}
                    onChange={(e) => setClaimToken(e.target.value)}
                    className="admin-input"
                    placeholder="0x..."
                  />
                  <p className="admin-hint">
                    <Trans>The token address of the accumulated fees (e.g., USDC, WETH)</Trans>
                  </p>
                </div>

                <Button
                  variant="primary"
                  className="admin-button"
                  onClick={handleClaimFees}
                  disabled={isClaiming || !receiverWallet || !claimMarket || !claimToken || !exchangeRouterAddress}
                >
                  {isClaiming ? <Trans>Claiming...</Trans> : <Trans>Claim UI Fees</Trans>}
                </Button>
              </div>

              {/* Documentation Section */}
              <div className="admin-card admin-docs">
                <h2 className="admin-card-title">
                  <span className="admin-card-icon">📚</span>
                  <Trans>How UI Fees Work</Trans>
                </h2>

                <div className="admin-docs-content">
                  <div className="admin-docs-section">
                    <h3>Fee Collection</h3>
                    <ul>
                      <li>UI fees are automatically collected when users execute trades</li>
                      <li>For swaps/deposits/withdrawals: fee is % of input amount</li>
                      <li>For positions: fee is % of position size (increase/decrease)</li>
                    </ul>
                  </div>

                  <div className="admin-docs-section">
                    <h3>Important Notes</h3>
                    <ul>
                      <li>The <code>uiFeeReceiver</code> parameter must be passed in all order creation calls</li>
                      <li>Fees accumulate per market and per token</li>
                      <li>You can claim fees at any time using the claim function</li>
                    </ul>
                  </div>

                  <div className="admin-docs-section">
                    <h3>Integration Required</h3>
                    <p>
                      To collect fees, the frontend must pass your wallet address as the <code>uiFeeReceiver</code> 
                      parameter when creating orders. This is configured in the trading components.
                    </p>
                  </div>
                </div>

                <ExternalLink href="https://docs.gmx.io/docs/api/contracts#ui-fee" className="admin-docs-link">
                  <Trans>Read Full Documentation →</Trans>
                </ExternalLink>
              </div>
            </>
          )}
          </div>
        </div>
      </SEO>
    </AppPageLayout>
  );
}

export default AdminPage;
