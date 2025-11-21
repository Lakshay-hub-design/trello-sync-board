const axios = require("axios");
require("dotenv").config();

const BASE_URL = "https://api.trello.com/1";

const trelloRequest = async (method, endpoint, params = {}, body = {}) => {
  try {
    const authParams = {
      key: process.env.TRELLO_KEY,
      token: process.env.TRELLO_TOKEN,
      ...params,
    };

    const url = `${BASE_URL}${endpoint}`;

    const config = {
      method,
      url,
      params: authParams,
    };

    if (method !== "GET") {
      config.data = body;
    }

    const response = await axios(config);
    return response.data;

  } catch (error) {
    console.error("Trello API Error:", error?.response?.data || error.message);

    throw {
      success: false,
      message:
        error?.response?.data?.message ||
        "Trello API error, please check your request.",
      raw: error?.response?.data,
    };
  }
};

module.exports = trelloRequest;
