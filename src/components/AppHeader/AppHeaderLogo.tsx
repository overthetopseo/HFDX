import ButtonLink from "components/Button/ButtonLink";

import logoIcon from "img/logo-icon.svg";
import LogoText from "img/logo-text.svg?react";

export function AppHeaderLogo() {
  return (
    <ButtonLink to="/" className="flex items-center gap-10 px-8 py-4 text-typography-primary lg:hidden">
      <img src={logoIcon} alt="HFDX Logo" className="block h-32 w-auto" />
      <LogoText className="hidden md:block h-20" />
    </ButtonLink>
  );
}
