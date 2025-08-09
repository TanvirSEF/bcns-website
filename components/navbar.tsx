import { NavbarClient } from "./navbarclient";

export async function Navbar() {
  // Example: fetch auth/session in server if needed
  const isAuthenticatedInitial = false;
  return <NavbarClient isAuthenticatedInitial={isAuthenticatedInitial} />;
}
