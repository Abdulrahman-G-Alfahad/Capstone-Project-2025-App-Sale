import instance from ".";

const makeFaceIdPayment = async (formData) => {
  console.log(formData);
  try {
    const res = await instance.post("/transactions/business/faceid", formData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export { makeFaceIdPayment };
