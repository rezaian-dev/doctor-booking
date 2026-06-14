// 🏠 Shared header — reads no cookies server-side so every page stays prerenderable (ISR/SSG).
//    Auth resolves client-side behind a stable skeleton → never the login button first, no shift. 🧠
import { HeaderShell, NAV_ITEMS } from "./header-shell";
import { HomeHeaderAuthDesktop, HomeHeaderAuthMobile } from "./home-header-auth";

export default function HomeHeader() {
  return (
    <HeaderShell
      mobileSlot={<HomeHeaderAuthMobile navItems={NAV_ITEMS} />}
      desktopUserSlot={<HomeHeaderAuthDesktop />}
    />
  );
}
