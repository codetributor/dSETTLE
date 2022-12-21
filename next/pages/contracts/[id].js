import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { ethers } from "ethers";
import { txAbi } from "../../txAbi";

function AccountPage() {
  const router = useRouter();

  const [contractAddress, setContractAddress] = useState();
  const [contractImageUrl, setContractImageUrl] = useState();
  const [contractItemName, setContractItemName] = useState();
  const [sellerAddress, setSellerAddress] = useState();
  const [buyerAddress, setBuyerAddress] = useState();

  useEffect(() => {
    setContractAddress(router.query.id);

    async function setData() {
      const provider = await new ethers.providers.Web3Provider(window.ethereum);
      let signer;
      await provider.listAccounts().then((accounts) => {
        signer = accounts[0];
      });
      const contract = await new ethers.Contract(
        contractAddress,
        txAbi,
        signer
      );
      await contract.on("e_ImageUrl", (imageUrl) => {
        setContractImageUrl(imageUrl);
      });
      await contractImageUrl;
      await contract.on("e_ItemName", (itemName) => {
        setContractItemName(itemName);
      });
      await contractItemName;
      await contract.on("e_SellerAddress", (sellerAddress) => {
        setSellerAddress(sellerAddress);
      });
      await sellerAddress;
      await contract.on("e_BuyerAddress", (buyerAddress) => {
        setBuyerAddress(buyerAddress);
      });
      await buyeraddress;
    }
    setData();
  }, []);

  return (
    <div>
      <Header />
      <div className="flex">
        <Sidebar />
        <div>
          <h3>{contractAddress}</h3>
          <h3>{contractImageUrl}</h3>
          <h3>{contractItemName}</h3>
          <h3>{sellerAddress}</h3>
          <h3>{buyerAddress}</h3>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
