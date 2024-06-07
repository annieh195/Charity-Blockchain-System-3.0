const config = {
  userKeys: { publicKey: "", privateKey: "" },
  adminKeys: { publicKey: "", privateKey: "" },
};

export const setUserKeys = (keys) => {
  config.userKeys = keys;
};

export const getUserKeys = () => config.userKeys;

export const setAdminKeys = (keys) => {
  config.adminKeys = keys;
};

export const getAdminKeys = () => config.adminKeys;

export default config;
