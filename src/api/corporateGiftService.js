import baseApi from "./baseApi";

export const getCorporateEmployees = async () => {
  const response = await baseApi.get("/employees", { params: { limit: 500 } });
  const employees =
    response.data?.employees || response.data?.data || response.data;
  return Array.isArray(employees) ? employees : [];
};

export const createCorporateCampaign = async (payload) => {
  const response = await baseApi.post("/corporate-campaigns", payload);
  return response.data;
};

export const addCorporateRecipients = async (campaignId, recipients) => {
  const response = await baseApi.post(
    `/corporate-campaigns/${campaignId}/recipients`,
    { recipients },
  );
  return response.data;
};

export const reviewCorporateCampaign = async (campaignId) => {
  const response = await baseApi.post(
    `/corporate-campaigns/${campaignId}/review`,
  );
  return response.data;
};

export const createCorporatePayment = async (campaignId) => {
  const response = await baseApi.post(
    `/corporate-campaigns/${campaignId}/payment`,
  );
  return response.data;
};

export const verifyCorporatePayment = async (campaignId, payload) => {
  const response = await baseApi.post(
    `/corporate-campaigns/${campaignId}/payment/verify`,
    payload,
  );
  return response.data;
};
