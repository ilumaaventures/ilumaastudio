import baseApi from "./baseApi";

export const getLoyaltyAccount = async () => {
  const response = await baseApi.get("/loyalty/account");
  return response.data;
};

export const getLoyaltyTransactions = async () => {
  const response = await baseApi.get("/loyalty/transactions");
  return response.data;
};

export const getReferrals = async () => {
  const response = await baseApi.get("/loyalty/referrals");
  return response.data;
};

export const getActiveRewards = async () => {
  const response = await baseApi.get("/loyalty/rewards");
  return response.data;
};

export const redeemReward = async (rewardId) => {
  const response = await baseApi.post(`/loyalty/rewards/${rewardId}/redeem`);
  return response.data;
};

export const getMyRedemptions = async () => {
  const response = await baseApi.get("/loyalty/my-redemptions");
  return response.data;
};
