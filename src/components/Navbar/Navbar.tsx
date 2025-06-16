import React from "react";
import NavbarUpper from "./NavbarUpper";
import NavbarLower from "./NavbarLower";
import { NavbarMiddle } from "./NavbarMiddle";

export default function Navbar() {
  return (
    <div>
      <NavbarUpper />
      <NavbarMiddle />
      <NavbarLower />
    </div>
  );
}
