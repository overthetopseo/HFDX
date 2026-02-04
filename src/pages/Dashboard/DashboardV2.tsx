import { t } from "@lingui/macro";
import { Link } from "react-router-dom";

import { ARBITRUM, AVALANCHE } from "config/chains";
import { SyntheticsStateContextProvider } from "context/SyntheticsStateContext/SyntheticsStateContextProvider";
import { getPageTitle } from "lib/legacy";

import AppPageLayout from "components/AppPageLayout/AppPageLayout";
import { ChainContentHeader } from "components/ChainContentHeader/ChainContentHeader";
import { MarketsList } from "components/MarketsList/MarketsList";
import PageTitle from "components/PageTitle/PageTitle";
import SEO from "components/Seo/SEO";

import V2Icon from "img/ic_v2.svg?react";

import { OverviewCard } from "./OverviewCard";
import { StatsCard } from "./StatsCard";
import { useDashboardChainStatsMulticall } from "./useDashboardChainStatsMulticall";

import "./DashboardV2.css";

export const ACTIVE_CHAIN_IDS = [ARBITRUM, AVALANCHE];

export default function DashboardV2() {
  const statsArbitrum = useDashboardChainStatsMulticall(ARBITRUM);
  const statsAvalanche = useDashboardChainStatsMulticall(AVALANCHE);

  return (
    <SEO title={getPageTitle(t`Stats`)}>
      <AppPageLayout header={<ChainContentHeader />}>
        <div className="default-container DashboardV2 page-layout flex flex-col gap-20">
          <PageTitle
            title={t`Total Stats`}
            qa="dashboard-page"
            subtitle={
              <div className="flex items-center gap-6 font-medium text-typography-secondary">
                <Link
                  className="flex items-center gap-4 text-typography-secondary !no-underline hover:text-typography-primary"
                  to="/monitor"
                >
                  <V2Icon className="size-15" /> Pools Stats
                </Link>
              </div>
            }
          />
          <div className="flex flex-col gap-20">
            <div className="DashboardV2-cards">
              <OverviewCard statsArbitrum={statsArbitrum} statsAvalanche={statsAvalanche} />
              <StatsCard />
            </div>

            <SyntheticsStateContextProvider skipLocalReferralCode={false} pageType="pools">
              <MarketsList />
            </SyntheticsStateContextProvider>
          </div>
        </div>
      </AppPageLayout>
    </SEO>
  );
}
