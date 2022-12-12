import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Banner from "../components/Banner";
import styled from "styled-components";
import Head from "next/head";
import { useState } from "react";

export default function NewListing() {
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);
  }

  async function handleOnSubmit(event) {}

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
        <Container className="w-full">
          <Banner />
          <h3 className="m-5 text-2xl font-extrabold text-gray-400">
            Create a new Listing
          </h3>
          <form
            method="post"
            onChange={handleOnChange}
            onSubmit={handleOnSubmit}
          >
            <div className="flex m-5">
              <div className="flex flex-col w-1/2">
                <Input type="text" placeholder="item name" />
                <Input type="text" placeholder="price in USD" />
                <Input type="text" placeholder="seller physical address" />
                <TextArea placeholder="description" />
              </div>
              <div className="flex flex-col justify-center items-center m-5 w-1/2">
                <img src={imageSrc} height={150} width={150} />
                <p>
                  <input className="mt-5" type="file" name="file" />
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
