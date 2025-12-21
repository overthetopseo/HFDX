import { useChainId } from "lib/chains";

import { useAvailableToTradeAssetSettlementChain } from "components/HfdxAccountModal/hooks";

export function useHfdxAccountShowDepositButton() {
  const { srcChainId } = useChainId();
  const { gmxAccountUsd, isGmxAccountLoading } = useAvailableToTradeAssetSettlementChain();
  const shouldShowDepositButton = !isGmxAccountLoading && gmxAccountUsd === 0n && srcChainId !== undefined;

  return { shouldShowDepositButton };
}
