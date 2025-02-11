import instance from ".";

const makeFaceIdPayment = async (formData) => {
  console.log(formData);
  try {
    const res = await instance.post("/transaction/business/faceId", formData);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const makeQRCodePayment = async (qrData) => {
  //   console.log();
  //   console.log(qrData, "QRCode Payment -------------------");
  try {
    const res = await instance.post("/transaction/business/qrcode", qrData);
    console.log(res.status);
    console.log(res.statusText);
    console.log(res.data, "QRCode Payment -------------------");
    return res.data;
  } catch (error) {
    console.log(error);
    console.log(error);
    throw error;
  }
};

export { makeFaceIdPayment, makeQRCodePayment };
