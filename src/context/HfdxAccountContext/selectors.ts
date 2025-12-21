import { createSelectionContext } from "@taskworld.com/rereselect";

import { getToken } from "sdk/configs/tokens";
import { parseValue } from "sdk/utils/numbers";

import type { HfdxAccountContext } from "./HfdxAccountContext";

//#region Pure selectors

export const selectGmxAccountModalOpen = (s: HfdxAccountContext) => s.modalOpen;
export const selectGmxAccountSetModalOpen = (s: HfdxAccountContext) => s.setModalOpen;

export const selectGmxAccountSettlementChainId = (s: HfdxAccountContext) => s.settlementChainId;
export const selectGmxAccountSetSettlementChainId = (s: HfdxAccountContext) => s.setSettlementChainId;

export const selectGmxAccountDepositViewChain = (s: HfdxAccountContext) => s.depositViewChain;
export const selectGmxAccountSetDepositViewChain = (s: HfdxAccountContext) => s.setDepositViewChain;
export const selectGmxAccountDepositViewTokenAddress = (s: HfdxAccountContext) => s.depositViewTokenAddress;
export const selectGmxAccountSetDepositViewTokenAddress = (s: HfdxAccountContext) => s.setDepositViewTokenAddress;
export const selectGmxAccountDepositViewTokenInputValue = (s: HfdxAccountContext) => s.depositViewTokenInputValue;
export const selectGmxAccountSetDepositViewTokenInputValue = (s: HfdxAccountContext) => s.setDepositViewTokenInputValue;

export const selectGmxAccountWithdrawalViewChain = (s: HfdxAccountContext) => s.withdrawalViewChain;
export const selectGmxAccountsetWithdrawalViewChain = (s: HfdxAccountContext) => s.setWithdrawalViewChain;
export const selectGmxAccountWithdrawalViewTokenAddress = (s: HfdxAccountContext) => s.withdrawalViewTokenAddress;
export const selectGmxAccountSetWithdrawalViewTokenAddress = (s: HfdxAccountContext) => s.setWithdrawalViewTokenAddress;
export const selectGmxAccountWithdrawalViewTokenInputValue = (s: HfdxAccountContext) => s.withdrawalViewTokenInputValue;
export const selectGmxAccountSetWithdrawalViewTokenInputValue = (s: HfdxAccountContext) =>
  s.setWithdrawalViewTokenInputValue;

export const selectGmxAccountSelectedTransferGuid = (s: HfdxAccountContext) => s.selectedTransferGuid;
export const selectGmxAccountSetSelectedTransferGuid = (s: HfdxAccountContext) => s.setSelectedTransferGuid;

//#endregion Pure selectors

//#region Derived selectors

const selectionContext = createSelectionContext<HfdxAccountContext>();
const createSelector = selectionContext.makeSelector;

export const selectGmxAccountDepositViewTokenInputAmount = createSelector((q) => {
  const settlementChainId = q(selectGmxAccountSettlementChainId);

  const tokenAddress = q(selectGmxAccountDepositViewTokenAddress);

  if (tokenAddress === undefined) {
    return undefined;
  }

  const inputValue = q(selectGmxAccountDepositViewTokenInputValue);

  if (inputValue === undefined) {
    return undefined;
  }

  const token = getToken(settlementChainId, tokenAddress);

  return parseValue(inputValue, token.decimals);
});

//#endregion Derived selectors
