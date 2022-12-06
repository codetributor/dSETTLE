function Banner() {
  return (
    <div className="m-5 bg-white p-5 rounded-md shadow-md">
      <h3>Decentralized Peer to Peer dCommerce</h3>
      <p className="text-gray-400">
        Buyers and sellers both lock collateral into a smart contract to ensure
        each party acts fairly. When the buyer recieves the item in the mail and
        approves that everything is okay, the collateral gets released back to
        the buyer and seller and the seller recieves the sale price held in the
        contract. In the case of a dispute, the buyer can mail back the item and
        when the seller recieves the items and approves everything is okay, the
        collateral gets released back to the seller and buyer.
      </p>
    </div>
  );
}

export default Banner;
