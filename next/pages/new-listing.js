import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Banner from "../components/Banner";
import styled from "styled-components";
import Head from "next/head";
import { useState } from "react";
import { ethers } from "ethers";
import { abi } from "../abi.js";

export default function NewListing() {
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();
  const contractAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
  const [item, setItem] = useState("");
  const [price, setPrice] = useState();
  const [sellerPhysicalAddress, setSellerPhysicalAddress] = useState("");

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);
  }

  async function handleOnSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(
      ({ name }) => name == "file"
    );
    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append("file", file);
    }

    formData.append("upload_preset", "my-uploads");

    if (fileInput) {
      const data = await fetch(
        "https://api.cloudinary.com/v1_1/duvfr5qnr/image/upload",
        {
          method: "POST",
          body: formData,
        }
      ).then((r) => r.json());

      setImageSrc(data.secure_url);
    }

    const provider = await new ethers.providers.Web3Provider(window.ethereum);
    let signer;
    await provider.listAccounts().then(async function (accounts) {
      signer = await provider.getSigner(accounts[0]);
    });
    const contract = await new ethers.Contract(contractAddress, abi, signer);
    await contract.createTxContract(
      item,
      price,
      sellerPhysicalAddress,
      imageSrc,
      { value: price }
    );
    checkEvents();
  }

  const checkEvents = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    contract.on("Created", (_contractAddress) => {
      console.log(_contractAddress);
    });
  };

  return (
    <div>
      <Head>
        <title>dSETTLE</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/handshake.png" />
      </Head>
      <Header />
      <div className="flex">
        <Sidebar />
        <Container className="w-full pb-10">
          <Banner />
          <h3 className="m-5 text-2xl font-extrabold text-gray-400">
            Create a new Listing
          </h3>
          <form method="post" onSubmit={handleOnSubmit}>
            <div className="flex m-5">
              <div className="flex flex-col w-1/2">
                <Input
                  onChange={(e) => setItem(e.target.value)}
                  type="text"
                  placeholder="item name"
                />
                <Input
                  onChange={(e) => setPrice(e.target.value)}
                  type="text"
                  placeholder="price in USD"
                />
                <Input
                  onChange={(e) => setSellerPhysicalAddress(e.target.value)}
                  type="text"
                  placeholder="seller physical address"
                />
                <TextArea placeholder="description" />
              </div>
              <div className="flex flex-col justify-center items-center m-5 w-1/2">
                <img src={imageSrc} height={300} width={300} />
                <p>
                  <input
                    onChange={handleOnChange}
                    className="mt-5"
                    type="file"
                    name="file"
                  />
                </p>
              </div>
            </div>

            <div className="flex justify-center items-center">
              <button className="w-1/2 mx-5 my-1 rounded-md py-2 bg-blue-400 text-white">
                Create
              </button>
            </div>
          </form>
        </Container>
      </div>
    </div>
  );
}

const Container = styled.div`
  background-color: whitesmoke;
  margin-right: 5px;
`;

const Input = styled.input`
  margin-top: 2px;
  margin-bottom: 2px;
  padding: 5px;
  border-radius: 10px;
`;

const TextArea = styled.textarea`
  margin-top: 2px;
  margin-bottom: 2px;
  padding: 5px;
  border-radius: 10px;
  height: 100%;
`;
