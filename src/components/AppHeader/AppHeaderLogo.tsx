import ButtonLink from "components/Button/ButtonLink";

import logoIcon from "img/logo-icon.svg";
import LogoText from "img/logo-text.svg?react";

export function AppHeaderLogo() {
  return (
    <ButtonLink to="/" className="flex items-center gap-16 px-12 py-8 text-typography-primary lg:hidden">
      <img src={logoIcon} alt="HFDX Logo" className="block h-[72px] w-auto" />
      <LogoText className="hidden md:block h-[48px]" />
    </ButtonLink>
  );
}
