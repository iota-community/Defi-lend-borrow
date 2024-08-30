import React, { useContext, useState, useEffect } from "react";
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
import { Context } from "../context/Context";
import formatAddress from "../utils/formats";
import { getNativeBalance } from "../utils/ethersUtils";

export const NavigationBar = ({ setIsAccountsComponent }) => {
  const { address, tokenBal, bnbBal, disconnectWallet } = useContext(Context);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  useEffect(() => {
    const init = async () => {
      const bal = await getNativeBalance();
      setBal(bal);
    };
    init();
  }, []);
  const [bal, setBal] = useState(0);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div>
      <Navbar className="navbar">
        <NavbarBrand href="/">Defi Lend Borrow</NavbarBrand>
        <Nav className="ml-auto">
          <ConnectWallet />
          {address && (
            <div className="nav-right">
              <div
                className="accountDropdown"
                style={{
                  backgroundColor: "white",
                  color: "rgb(30 36 49)",
                  height: "37px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => setIsAccountsComponent(true)}
              >
                Go to Accounts Section
              </div>
              <Dropdown isOpen={isDropdownOpen} toggle={toggleDropdown}>
                <DropdownToggle
                  tag="span"
                  onClick={toggleDropdown}
                  data-toggle="dropdown"
                  aria-expanded={isDropdownOpen}
                  className="accountDropdown"
                >
                  Address: {formatAddress(address)}
                </DropdownToggle>
                <DropdownMenu end>
                  <DropdownItem>Balance: {bal} </DropdownItem>
                  <DropdownItem onClick={disconnectWallet}>
                    Disconnect Wallet
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          )}
        </Nav>
      </Navbar>
    </div>
  );
};
