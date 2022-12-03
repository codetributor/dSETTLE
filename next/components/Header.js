import Logo from "./Logo";
import ConnectBtn from "./ConnectBtn";

function Header() {
  return (
    <div className="shadow-md flex justify-between p-5 border-gray-200 border-solid border-b items-center px-20">
      <Logo />
      <ConnectBtn />
    </div>
  );
}

export default Header;
