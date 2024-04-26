import {
  Box,
  Input,
  Textarea,
  Button,
  Heading,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import '../css/CreatePage.css';
import { GENERATE_KEYS, POST_TRANSACTION, FETCH_TRANSACTION } from "../utils/resDbApi";
import { sendRequest } from "../utils/ResDbClient";

function CreatePage() {
  const [charityInfo, setCharityInfo] = useState({
    name: "",
    charityamount: 0,
    description: "",
  });
  const [keys, setKeys] = useState({ publicKey: '', privateKey: '' });
  const [charity, setCharity] = useState([]);

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

  useEffect(() => {
    fetchCharity();
  }, []);

  const fetchCharity = async () => {
    console.log("Fetching charity...", metadata);
    const query = FETCH_TRANSACTION(
      metadata.signerPublicKey,
      metadata.recipientPublicKey
    );
    try {
      await sendRequest(query).then((res) => {
        if (res && res.data && res.data.getFilteredTransactions) {
          let json = [];
          res.data.getFilteredTransactions.forEach((item) => {
            json.push(JSON.parse(item.asset.replace(/'/g, '"')).data);
          });
          setCharity(json);
        }
      });
    } catch (error) {
      console.log("Fetch charity error ", error);
    }
  };

  const createCharity = async () => {
    if (!charityInfo.name || !charityInfo.charityamount || !charityInfo.description) {
      alert("Please fill all the fields");
      return;
    }
    try {
      await sendRequest(POST_TRANSACTION(metadata, JSON.stringify(charityInfo))).then((res) => {
        console.log("Charity created successfully ", res);
      });
    } catch (error) {
      console.log("Create Charity error ", error);
    }
  };

  const handleInputChange = (field, value) => {
    setCharityInfo({ ...charityInfo, [field]: value });
  };

  return (
    <Box className="charity-container" p={5}>
      <Heading mb={4}>Create a Charity Fund</Heading>
      <Box className="charity-section" p={5}>
        <FormControl id="charity-form">
          <FormLabel>Charity Name</FormLabel>
          <Input
            type="text"
            placeholder="Charity Name"
            value={charityInfo.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          <FormLabel mt={4}>Funds to be Raised</FormLabel>
          <Input
            type="number"
            placeholder="Funds to be raised"
            min="1"
            step="1"
            value={charityInfo.charityamount}
            onChange={(e) => handleInputChange("charityamount", e.target.value)}
          />
          <FormLabel mt={4}>Description</FormLabel>
          <Textarea
            placeholder="Description"
            value={charityInfo.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          ></Textarea>
          <Button onClick={createCharity} colorScheme="blue" mt={4}>Create</Button>
        </FormControl>
      </Box>
    </Box>
  );
}

export default CreatePage;
