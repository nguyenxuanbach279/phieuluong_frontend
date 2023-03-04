import axios from "axios";
const config = require("../config/config.js")["server"];

const api = axios.create({
  baseURL: config.url,
});

const getEmployeeList = (page, size, search) => {
  return api.get("Employee/filter", {
    params: { pageNumber: page ? page : 1, pageSize: size, filter: search },
    // headers: {
    //   Authorization: `Bearer ${jwtToken}`,
    // },
  });
};

export default {
  getEmployeeList,
};
