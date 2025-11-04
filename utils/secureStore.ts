import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "userToken";
const USERDATA_KEY = "userData";

export const saveUser = async (
  token: string,
  user: { firstName: string; lastName: string }
) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USERDATA_KEY, JSON.stringify(user));
};

export const loadUser = async () => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const user = await SecureStore.getItemAsync(USERDATA_KEY);
    if (!token) {
      console.log("No values stored under that key.");
      return null;
    }
    return {
      token,
      user,
    };
  } catch {
    console.log("Getting user from the store error.");
  }
};

export const removeUserToken = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USERDATA_KEY);
  } catch {
    console.log("Error happened while deleting user token.");
  }
};

