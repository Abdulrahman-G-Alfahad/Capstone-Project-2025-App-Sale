import { saveToken } from "./storage";
import instance from ".";
import transactionApi from "./transactionApi";

const login = async (userInfo) => {
  // const { accountType, setAccountType } = useContext(UserContext);
  //   console.log(userInfo);
  try {
    const res = await instance.post("/auth/login", userInfo);
    const token = res.data.token;
    if (token) {
      saveToken(token);
      //   console.log(token);
    }

    // console.log("first");

    return res.data;
  } catch (error) {
    throw error;
  }
};

const getProfile = async (id) => {
  console.log(id);
  try {
    const res = await instance.get(`/business/associate/${id}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const getBusinessProfile = async (id) => {
  console.log(id);
  try {
    const res = await instance.get(`/business/associate/${id}/business`);
    console.log(res.data);

    return res.data;
  } catch (error) {
    throw error;
  }
};

export { login, getProfile, getBusinessProfile };
