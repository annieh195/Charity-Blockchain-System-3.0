import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/DonationPage.css";
import { generateKeys, postTransaction, fetchTransactions } from "../../utils/resDbClient";

function DonationPage() {
  const { charityName } = useParams(); // Getting the charity name from URL
  const [charityInfo, setCharityInfo] = useState({
    name: "",
    description: "",
    targetAmount: 0,
  });

  const [donations, setDonations] = useState([]);
  const [donationAmount, setDonationAmount] = useState("");
  const [keys, setKeys] = useState({ publicKey: '', privateKey: '' });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const keys = await generateKeys();
        setKeys({
          publicKey: keys.generateKeys.publicKey,
          privateKey: keys.generateKeys.privateKey
        });

        // Fetch donations and donations for the charity for the charity from ResilientDB
        const { charityData, donationsData } = await fetchCharityAndDonations(charityName);
        setCharityInfo(charityData); 
        setDonations(donationsData); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchInitialData();
  }, [charityName]);

  const fetchCharityAndDonations = async (charityName) => {
    const res = await fetchTransactions(process.env.REACT_APP_ADMIN_PUBLIC_KEY, "");
    const charityTransaction = res.getFilteredTransactions.find(
      (transaction) => transaction.asset.data.name === charityName
    );
    
    const charityData = {
      name: charityTransaction.asset.data.name,
      description: charityTransaction.asset.data.description,
      targetAmount: charityTransaction.asset.data.charityamount,
      publicKey: charityTransaction.publicKey,
    };

    const donationsData = res.getFilteredTransactions
      .filter(transaction => transaction.metadata.signerPublicKey !== process.env.REACT_APP_ADMIN_PUBLIC_KEY)
      .map(transaction => ({
        name: transaction.metadata.signerPublicKey,
        amount: transaction.amount,
      }));

    return { charityData, donationsData };
  };

  const handleDonate = async () => {
    if (parseFloat(donationAmount) > 0) {
      if (totalAmount + Number(donationAmount) <= charityInfo.targetAmount) {
        try {
          const metadata = {
            signerPublicKey: keys.publicKey,
            signerPrivateKey: keys.privateKey,
            recipientPublicKey: process.env.REACT_APP_ADMIN_PUBLIC_KEY,
          };

          const asset = { name: keys.publicKey, amount: donationAmount };

          const result = await postTransaction(metadata, asset);
          if (result) {
            console.log("Donation successful:", result);

            const newDonation = {
              name: keys.publicKey,
              amount: donationAmount
            };
            setDonations([...donations, newDonation]);
          }
        } catch (error) {
          console.error("Transaction failed:", error);
        }
      } else {
        alert(
          "Please adjust the amount, you cannot make more donation than required."
        );
        return;
      }
    }
  };

  const totalAmount = donations.reduce(
    (sum, donation) => sum + Number(donation.amount),
    0
  );

  const handleAmountChange = (e) => {
    setDonationAmount(e.target.value);
  };

  return (
    <div className="donation-page">
      <div className="left-section">
        <section className="charity-info">
          <h2>{charityInfo.name || "Charity Name"}</h2>
          <div className="media-container"></div>
          <textarea
            className="textarea"
            placeholder="Charity description"
            value={charityInfo.description || ""}
            readOnly
          ></textarea>
        </section>
      </div>

      <div className="right-section">
        <section className="donation-info">
          <p>Current amount: ${totalAmount}</p>
          <p>Amount required: ${charityInfo.targetAmount}</p>
          <p>Number donations: {donations.length}</p>
          <label htmlFor="donationAmount">Enter your donation amount:</label>
          <input
            type="number"
            id="donationAmount"
            value={donationAmount}
            onChange={handleAmountChange}
            placeholder="Amount"
            className="donation-amount-input"
          />
          <button onClick={handleDonate}>Donate Here</button>
          <table className="donation-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation, index) => (
                <tr key={index}>
                  <td>{donation.name}</td>
                  <td>${donation.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default DonationPage;