import { t } from "@lingui/macro";

import { StakingProcessedData } from "lib/legacy";
import { formatKeyAmount } from "lib/numbers";

import StatsTooltipRow from "components/StatsTooltip/StatsTooltipRow";

type Props = {
  processedData?: StakingProcessedData;
  nativeTokenSymbol: string;
  isUserConnected?: boolean;
};

function renderEscrowedHFDXApr(processedData) {
  if (!processedData?.gmxAprForEsGmx || processedData.gmxAprForEsGmx <= 0) return;
  return (
    <StatsTooltipRow
      label={t`Escrowed HFDX APR`}
      showDollar={false}
      value={`${formatKeyAmount(processedData, "gmxAprForEsGmx", 2, 2, true)}%`}
    />
  );
}

export default function HFDXAprTooltip({ processedData, nativeTokenSymbol, isUserConnected = false }: Props) {
  const escrowedHFDXApr = renderEscrowedHFDXApr(processedData);
  const gmxAprForNativeTokenPercentage = formatKeyAmount(processedData, "gmxAprForNativeToken", 2, 2, true);
  const gmxAprForGmxPercentage = formatKeyAmount(processedData, "gmxAprForGmx", 2, 2, true);

  const shouldShowNativeTokenApr = processedData?.gmxAprForNativeToken && processedData.gmxAprForNativeToken > 0;

  const aprUpdateMsg = t`APRs are updated weekly on Wednesday and will depend on the fees collected for the week.`;

  return (
    <>
      <div>
        <StatsTooltipRow label={t`HFDX APR`} showDollar={false} value={`${gmxAprForGmxPercentage}%`} />
        {isUserConnected && escrowedHFDXApr && (
          <>
            <br /> {escrowedHFDXApr}
          </>
        )}
        {shouldShowNativeTokenApr ? (
          <StatsTooltipRow
            label={t`${nativeTokenSymbol} APR`}
            showDollar={false}
            value={`${gmxAprForNativeTokenPercentage}%`}
          />
        ) : null}
      </div>
      <div>
        <br />
        {aprUpdateMsg}
      </div>
    </>
  );
}
