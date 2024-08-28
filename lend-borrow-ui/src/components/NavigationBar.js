import React, { useContext, useState } from "react";
import ConnectWallet from "./ConnectWallet";
import {
  Navbar,
  NavbarBrand,
  Nav,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { WalletContext } from "../context/WalletContext";
import formatAddress from "../utils/formats";

export const NavigationBar = ({ setIsAccountsComponent }) => {
  const { address, tokenBal, bnbBal, disconnectWallet } =
    useContext(WalletContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div>
      <Navbar className="navbar">
        <NavbarBrand href="/">Defi Lend Borrow</NavbarBrand>
        <Nav className="ml-auto">
          <ConnectWallet />
          {address && (
            <Dropdown isOpen={isDropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle
                tag="span"
                onClick={toggleDropdown}
                data-toggle="dropdown"
                aria-expanded={isDropdownOpen}
                className="accountDropdown"
              >
                Address: {formatAddress(address)} ↓
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem header>Wallet Details</DropdownItem>
                <DropdownItem onClick={() => setIsAccountsComponent(true)}>
                  Go to Accounts Section{" "}
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={disconnectWallet}>
                  Disconnect Wallet
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </Nav>
      </Navbar>
    </div>
  );
};
