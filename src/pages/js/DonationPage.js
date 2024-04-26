import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/DonationPage.css";
import { FETCH_TRANSACTION } from "../utils/resDbApi";
import { sendRequest } from "../utils/resDbClient";

function DonationPage() {
  const { charityName } = useParams(); // Getting the charity name from URL
  const [charityInfo, setCharityInfo] = useState({
    name: "",
    description: "",
    targetAmount: 0,
  });

  const [keys, setKeys] = useState({ publicKey: '', privateKey: '' });

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const res = await sendRequest(GENERATE_KEYS);
        setKeys({
          publicKey: res.data.generateKeys.publicKey,
          privateKey: res.data.generateKeys.privateKey
        });
      } catch (error) {
        console.error("Failed to generate keys: ", error);
      }
    };
    fetchKeys();
  }, []);

  const metadata = {
    signerPublicKey: keys.publicKey,
    signerPrivateKey: keys.privateKey,
    recipientPublicKey: keys.recipientPublicKey,
  };

  const [donations, setDonations] = useState([]);
  const [donationInfo, setDonationInfo] = useState({ account: "", amount: 0 });

    // Fetch charity information from LocalStorage
    const allCharities = JSON.parse(localStorage.getItem("charities")) || [];
    const foundCharity = allCharities.find(
      (charity) => charity.name === charityName
    );

    const donationKey = `donations_${charityName}`;
    const savedDonations = JSON.parse(localStorage.getItem(donationKey)) || [];
    setDonations(savedDonations);

    if (foundCharity) {
      // Assuming that the charity's description and targetAmount are stored as well
      setCharityInfo({
        name: foundCharity.name,
        description: foundCharity.description,
        targetAmount: foundCharity.number,
      });
    }
    const fetchDonations = async () => {
      console.log("Fetching donation...", metadata);
      const response = await fetch("/api/donations");
      const data = await response.json();
      // Set state with fetched data
    };
    fetchDonations();
  }, [charityName]);
  const [accountName, setAccountName] = useState("");
  const [donationAmount, setDonationAmount] = useState("");

  const handleDonate = async () => {
    if (parseFloat(donationAmount) > 0) {
      if (totalAmount + Number(donationAmount) <= charityInfo.targetAmount) {
        try {
          const fundIndex = 0;
          const result = await donateToFund(fundIndex, donationAmount);

          if (result.success) {
            console.log("Donation made by account:", result.account);
            console.log("Donation amount:", result.amount);

            const newDonation = { name: result.account, amount: result.amount };
            const updatedDonations = [...donations, newDonation];
            setDonations(updatedDonations);

            // Define a unique key for the charity's donations
            const donationKey = `donations_${charityName}`;

            // Save to localStorage under the specific charity's key
            localStorage.setItem(donationKey, JSON.stringify(updatedDonations));
          } else {
            console.log("Donation failed");
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

// start here
// const DonationPage = () => {
//   const handleClick = () => {

//   }
//   return (

//   );
// }
export default DonationPage;
