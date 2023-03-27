import axios from "axios";
const config = require("../config/config.js")["server"];

const api = axios.create({
  baseURL: config.url,
});

const login = (email, password) => {
  return api.get("Account", {
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

const getAccountList = (jwtToken) => {
  return api.get("Admin", {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
};

const getAccountInfo = (jwtToken, email) => {
  return api.get(`Account/${email}`, {
    params: { email: email },
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
};

const createNewAccount = (jwtToken, newAccountInfo) => {
  return api.post("Admin/insert", newAccountInfo, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
};

const deleteAccount = (jwtToken, email) => {
  return api.get(`Account/${email}`, {
    params: { email: email },
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
};

const deleteEmployee = (jwtToken, id) => {
  return api.get(`Account/${id}`, {
    params: { id: id },
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
};

const updateAccount = (jwtToken, data) => {
  return api.put("Account/update", data, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
};

export default {
  getEmployeeList,
  login,
  getAccountList,
  getAccountInfo,
  createNewAccount,
  deleteAccount,
  deleteEmployee,
  updateAccount
};
