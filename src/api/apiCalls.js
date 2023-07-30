import axios from "axios";
import i18n from "../locale/i18n";

export const signup = (body) => {
  return axios.post(`http://localhost:8080/api/1.0/users`, body, {
    headers: {
      "Accept-Language": i18n.language,
    },
  });
};

export const activate = (token) => {
  return axios.post(`http://localhost:8080/api/1.0/users/token/:` + token);
};
