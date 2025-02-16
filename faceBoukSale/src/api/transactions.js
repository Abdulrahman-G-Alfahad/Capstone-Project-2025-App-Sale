import instance from ".";
import transactionApi from "./transactionApi";

const makeFaceIdPayment = async (formData) => {
  console.log("face id request: ", formData);
  try {
    const res = await transactionApi.post(
      "/transactions/business/transfer/faceid",
      formData
    );
    console.log(res.data.status);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const makeQRCodePayment = async (qrData) => {
  console.log("first");
  console.log(qrData);
  //   console.log(qrData, "QRCode Payment -------------------");
  try {
    const res = await transactionApi.post(
      "/transactions/transactions/qr-code",
      qrData
    );
    console.log(res.status);
    console.log(res.statusText);
    console.log(res.data, "HERE -------------------");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { makeFaceIdPayment, makeQRCodePayment };
