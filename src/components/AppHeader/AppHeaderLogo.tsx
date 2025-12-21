import ButtonLink from "components/Button/ButtonLink";

import logoIcon from "img/logo-icon.svg";
import LogoText from "img/logo-text.svg?react";

export function AppHeaderLogo() {
  return (
    <ButtonLink to="/" className="flex items-center gap-12 px-6 py-4 text-typography-primary lg:hidden">
      <img src={logoIcon} alt="HFDX Logo" className="block h-40 w-40" />
      <LogoText className="hidden md:block h-32" />
    </ButtonLink>
  );
}
