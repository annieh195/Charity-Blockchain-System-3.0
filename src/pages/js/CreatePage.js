import React, { useEffect, useState } from "react";
import {
  Box,
  Input,
  Textarea,
  Button,
  Heading,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import "../css/CreatePage.css";
import { generateKeys, postTransaction } from "../../utils/resDbClient";
import {
  setUserKeys,
  getUserKeys,
  setAdminKeys,
  getAdminKeys,
} from "../../utils/configuration";

function CreatePage() {
  const [charityInfo, setCharityInfo] = useState({
    name: "",
    charityamount: 0,
    description: "",
  });

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        // Generate user keys
        const userKeyPair = await generateKeys();
        const userKeys = {
          publicKey: userKeyPair.generateKeys.publicKey,
          privateKey: userKeyPair.generateKeys.privateKey,
        };
        setUserKeys(userKeys);

        // Generate admin keys
        const adminKeyPair = await generateKeys();
        const adminKeys = {
          publicKey: adminKeyPair.generateKeys.publicKey,
          privateKey: adminKeyPair.generateKeys.privateKey,
        };
        setAdminKeys(adminKeys);
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
      const userKeys = getUserKeys();
      const adminKeys = getAdminKeys();

      if (!adminKeys.publicKey) {
        throw new Error("Admin public key is not defined");
      }

      const metadata = {
        signerPublicKey: userKeys.publicKey,
        signerPrivateKey: userKeys.privateKey,
        recipientPublicKey: adminKeys.publicKey,
      };

      const asset = {
        name: charityInfo.name,
        charityamount: charityInfo.charityamount,
        description: charityInfo.description,
      };

      console.log("Metadata:", metadata);
      console.log("Asset:", asset);

      const result = await postTransaction(metadata, asset);
      console.log("Result:", result);

      if (result) {
        console.log("Charity created successfully", result);
        setCharityInfo({ name: "", charityamount: 0, description: "" });
        alert("Charity fund created successfully!");
      } else {
        console.log("No result received from postTransaction");
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
