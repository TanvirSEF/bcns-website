import { NavbarClient } from "./navbarclient";

export async function Navbar() {
  // Server component - pass minimal props to client component
  return <NavbarClient />;
}
