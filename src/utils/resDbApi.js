// this is the only way can can generate key
export const GENERATE_KEYS = `
mutation{
    generateKeys{
      publicKey,
      privateKey
    }
  }`;

// this is the only way we can postTransaction
export const POST_TRANSACTION = (metadata, asset) => `
mutation {
  postTransaction(data: {
    operation: "CREATE",
    amount: 1,
    signerPublicKey: "${metadata?.signerPublicKey}",
    signerPrivateKey: "${metadata?.signerPrivateKey}",
    recipientPublicKey: "${metadata?.recipientPublicKey}",
    asset: """{
      "data": ${JSON.stringify(asset)}
    }"""
  }) {
    id
  }
}`;

// filter based on "signerPublicKey, recipientPublicKey"
export const FETCH_TRANSACTION = (signerPublicKey, recipientPublicKey) => `
query { 
  getFilteredTransactions(filter: {
    ownerPublicKey: "${signerPublicKey}",
    recipientPublicKey: "${recipientPublicKey}"
  }) {
    metadata
    operation
    id
    version
    amount
    uri
    type
    asset
    publicKey
  }
}`;

// Shuhao adds
export const SAVE_PROFILE = (profileData) => `
mutation {
  saveProfile(
    username: "${profileData.username}",
    name: "${profileData.name}",
    profession: "${profileData.profession}",
    email: "${profileData.email}",
    profileText: "${profileData.profileText}",
    profileImage: "${profileData.profileImage}"
  ) {
    success
  }
}`;

export const GET_PROFILE = (username) => `
query {
  getProfile(username: "${username}") {
    name
    profession
    email
    profileText
    profileImage
  }
}`;
