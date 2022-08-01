import { Message } from "element-ui";

export default function ({ $axios, redirect }) {
  $axios.create({
    baseURL: process.env.baseUrl,
  });

  // 正常请求返回处理
  $axios.onRequest((config) => {
    try {
      const cookies = document.cookie.split(";").reduce((res, co) => {
        const str = co.split("=");
        if (str) {
          res[str[0].replace(/^\s+|\s+$/, "")] = str[1];
        }
        return res;
      }, {});
      if (cookies.csrfToken) {
        Object.assign(config.headers, { "x-csrf-token": cookies.csrfToken });
      }
    } catch (error) {}
    return config;
  });

  $axios.onResponse((response) => {
    const { data, status } = response;
    if (status >= 200 && status < 300) {
      return data.data;
    }
    return Promise.reject(data.data);
  });

  // 错误请求返回处理
  $axios.onError(({ response }) => {
    const code = parseInt(response && response.status);
    switch (code) {
      case 400:
        Message("参数错误");
        break;
      case 401:
        redirect("/backend/login");
        break;
      case 500:
        Message("服务器错误");
        break;
      default:
        break;
    }
    if (response.data && response.data.message) {
      Message(response.data.message);
    }
    return Promise.reject(response);
  });
}
