/* eslint-disable @typescript-eslint/no-unused-vars */
import { BN_ZERO } from "lib/numbers";

export function useRecommendStakeHfdxAmount(
  p: {
    accumulatedHFDX?: bigint;
    accumulatedBnHFDX?: bigint;
    accumulatedEsHFDX?: bigint;
    stakedHFDX?: bigint;
    stakedBnHFDX?: bigint;
    stakedEsHFDX?: bigint;
  },
  conditions: {
    shouldStakeGmx?: boolean;
    shouldStakeEsGmx?: boolean;
  }
) {
  return BN_ZERO;
}
