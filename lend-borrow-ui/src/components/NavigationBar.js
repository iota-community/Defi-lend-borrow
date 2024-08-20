import React, { useContext } from "react";
import ConnectWallet from "./ConnectWallet";
import { Navbar, NavbarBrand, Nav } from "reactstrap";
import { WalletContext } from "../context/WalletContext";
import formatAddress from "../utils/formats";

export const NavigationBar = () => {
  const { address, tokenBal, bnbBal, disconnectWallet } =
    useContext(WalletContext);
  return (
    <div>
      <Navbar className="navbar">
        <NavbarBrand href="/">Defi lend borrow</NavbarBrand>
        <Nav className="navbar-right">
          <ConnectWallet />
          {address && <div>Address : {`${formatAddress(address)}`}</div>}
        </Nav>
      </Navbar>
    </div>
  );
};
