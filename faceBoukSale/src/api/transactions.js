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

export { makeFaceIdPayment };
