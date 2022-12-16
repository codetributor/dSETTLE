import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

function AccountPage() {
  const router = useRouter();

  const [contractAddress, setContractAddress] = useState();

  useEffect(() => {
    setContractAddress(router.query.id);
  });

  return (
    <div>
      <Header />
      <div className="flex">
        <Sidebar />
        <div>
          <h3>{contractAddress}</h3>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
