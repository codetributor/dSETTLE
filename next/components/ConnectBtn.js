import { useState } from "react";
import styled from "styled-components";

function ConnectBtn() {
  const [address, setAddress] = useState();
  const connectToMetaMask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(accounts[0]);
      } catch (e) {
        console.log(e);
      }
    }
  };

  if (!address) {
    return (
      <div>
        <Button
          onClick={connectToMetaMask}
          className="shadow-md bg-blue-400 py-2 px-4 rounded-md text-white"
        >
          Connect Wallet
        </Button>
      </div>
    );
  } else {
    return <p>{address}</p>;
  }
}

export default ConnectBtn;

const Button = styled.button``;
