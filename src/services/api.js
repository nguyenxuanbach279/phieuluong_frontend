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
  return api.post("Employee/filter", JSON.stringify(search), {
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

const getAccountInfo = (jwtToken, id) => {
  return api.get(`Account/${id}`, {
    params: { id: id },
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
  return api.delete(`Admin/${email}`, {
    params: { email: email },
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
};

const deleteEmployee = (jwtToken, id) => {
  return api.delete("Employee/id", {
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

const forgotPassword = (email) => {
  return api.get(`Account/recoverPassword/${email}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const getInfoEmployee = (jwtToken, id) => {
  return api.get("Employee/detail", {
    params: { id: id },
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
};

const updateInfoEmployee = (jwtToken, data) => {
  return api.put("Employee/update", data, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
};

const createEmployee = (jwtToken, data) => {
  return api.post("Employee/insert", data, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
};

const sendPaycheckNow = (jwtToken, data) => {
  return api.post("Schedule/sendNow", data, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
};

const sendPaycheckSetCalendar = (jwtToken, data) => {
  return api.post("Schedule/setCalendar", data, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
};

const uploadExcel = (jwtToken, data) => {
  return api.post("Employee/excel", data, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

const updateEmployeePayCheckStatus = (id, value) => {
  return api.post(`Employee/update?ID=${id}&value=${value}`, {
    // params: { ID: id, value: value },
    headers: {
      "accept": "text/plain",
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
  updateAccount,
  forgotPassword,
  getInfoEmployee,
  updateInfoEmployee,
  createEmployee,
  sendPaycheckNow,
  uploadExcel,
  sendPaycheckSetCalendar,
  updateEmployeePayCheckStatus
};
