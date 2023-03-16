import axios from "axios";
const config = require("../config/config.js")["server"];

const api = axios.create({
  baseURL: config.url,
});

const login = (email, password) => {
  return api.get("Token", {
    params: { email: email, pass: password },
  });
};

const getEmployeeList = (jwtToken, page, size, search) => {
  return api.post("Employee/filter", search, {
    params: { pageNumber: page ? page : 1, pageSize: size },
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
};

export default {
  getEmployeeList,
  login,
};
