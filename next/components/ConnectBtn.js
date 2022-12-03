import styled from "styled-components";

function ConnectBtn() {
  return (
    <div>
      <Button className="shadow-md bg-blue-400 py-2 px-4 rounded-md text-white">
        Connect Wallet
      </Button>
    </div>
  );
}

export default ConnectBtn;

const Button = styled.button``;
