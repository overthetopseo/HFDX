import ButtonLink from "components/Button/ButtonLink";

import logoIcon from "img/logo-icon.svg";
import LogoText from "img/logo-text.svg?react";

export function AppHeaderLogo() {
  return (
    <ButtonLink to="/" className="flex items-center gap-6 px-8 py-4 text-typography-primary lg:hidden">
      <img src={logoIcon} alt="HFDX Logo" className="block h-24 w-auto shrink-0" />
      <LogoText className="hidden md:block h-14 w-auto" />
    </ButtonLink>
  );
}
