import * as SecureStore from "expo-secure-store";
import { UserProfile } from "../types/User";

const TOKEN_KEY = "userToken";
const USERDATA_KEY = "userData";

export const saveUser = async (token: string, user: UserProfile) => {
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
    let parsedUser: UserProfile | null = null;
    if (user) {
      try {
        parsedUser = JSON.parse(user) as UserProfile;
      } catch {
        console.log("Unable to parse user profile from secure store.");
      }
    }
    return {
      token,
      user: parsedUser,
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
