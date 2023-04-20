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
  return api.get("Employee/detailEmployee", {
    params: { id: id },
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
};

const getInfoEmployeePrivate = (id, pass) => {
  return api.post("Client/detail", pass, {
    params: { id: id },
    headers: {
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
  return api.post(`Client/update?ID=${id}&value=${value}`, {
    headers: {
      accept: "text/plain",
    },
  });
};

const getHistoryData = (jwtToken) => {
  return api.get("History", {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
};

const getHistoryDataByName = (jwtToken, name) => {
  return api.get("History/searchbyname", {
    params: { value: name },
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
};

const getAccountByEmail = (jwtToken, key) => {
  return api.get(`Admin/search`, {
    params: { search: key },
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type": "application/json",
    },
  });
};

const getHistoryDataDownloadExcel = (jwtToken, id) => {
  return api.get("History/download", {
    params: { IDHistory: id },
    headers: {
      Authorization: `Bearer ${jwtToken}`,
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
  updateEmployeePayCheckStatus,
  getHistoryData,
  getHistoryDataByName,
  getHistoryDataDownloadExcel,
  getInfoEmployeePrivate,
  getAccountByEmail,
};
