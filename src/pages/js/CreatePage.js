import {
  Box,
  Input,
  Textarea,
  Button,
  Heading,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import "../css/CreatePage.css";
import { generateKeys, postTransaction } from "../../utils/resDbClient";

function CreatePage() {
  const [charityInfo, setCharityInfo] = useState({
    name: "",
    charityamount: 0,
    description: "",
  });
  const [keys, setKeys] = useState({ publicKey: "", privateKey: "" });

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const keys = await generateKeys();
        setKeys({
          publicKey: keys.generateKeys.publicKey,
          privateKey: keys.generateKeys.privateKey,
        });
      } catch (error) {
        console.error("Failed to generate keys: ", error);
      }
    };
    fetchKeys();
  }, []);

  const createCharity = async () => {
    if (
      !charityInfo.name ||
      !charityInfo.charityamount ||
      !charityInfo.description
    ) {
      alert("Please fill all the fields");
      return;
    }
    console.log("Creating fund:", charityInfo);
    try {
      const metadata = {
        signerPublicKey: keys.publicKey,
        signerPrivateKey: keys.privateKey,
        recipientPublicKey: process.env.REACT_APP_ADMIN_PUBLIC_KEY,
      };
      const asset = {
        name: charityInfo.name,
        charityamount: charityInfo.charityamount,
        description: charityInfo.description,
      };
      const result = await postTransaction(metadata, asset);
      if (result) {
        console.log("Charity created successfully", result);
        setCharityInfo({ name: "", charityamount: 0, description: "" });
        alert("Charity fund created successfully!");
      }
    } catch (error) {
      console.error("Error creating charity:", error);
      alert("Failed to create charity fund");
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
          <Button onClick={createCharity} colorScheme="blue" mt={4}>
            Create
          </Button>
        </FormControl>
      </Box>
    </Box>
  );
}

export default CreatePage;
