import Cookies from "js-cookie";
import LocalStorage from "@/helpers/local-storage";
import Config from "@/helpers/config";
import http from "@/helpers/http";

const apiUrl = Config.get("apiUrl");

class User {
  static async login(parsed) {
    let auth = "google";
    if (parsed.route === "login-baidu") {
      auth = "baidu";
    }

    let response;

    if (auth === "google") {
      response = await http.get(`${apiUrl}auth/google/callback`, {
        params: { code: parsed.code },
      });
    } else if (auth === "baidu") {
      response = await http.get(`${apiUrl}auth/baidu/callback`, {
        params: { code: parsed.code },
      });
    }

    Cookies.set("token", response.data.token, {
      expires: 365 * 3, // 3 years
      domain: this.getDomain(),
    });

    // LocalStorage.save('token', response.data.token);
    LocalStorage.save("user", response.data.user);

    return response.data.user;
  }

  static logout() {
    Cookies.remove("token", { domain: this.getDomain() });
    // LocalStorage.remove('token');
    LocalStorage.remove("user");
    window.location = "/";
  }

  static isLogged() {
    return !!Cookies.get("token");
  }

  static async loadUser() {
    const response = await http.get(`${apiUrl}auth/is_logged_in`);
    LocalStorage.save("user", response.data.user);
  }

  static getUser() {
    let user = LocalStorage.get("user");

    if (user) {
      return user;
    }

    User.loadUser();

    const token = Cookies.get("token");
    if (!token) {
      return {};
    }

    user = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString("ascii")
    );

    return user;
  }

  static getDomain() {
    let domain = "";
    if (window.location.host.indexOf("2pinyin.net") !== -1) {
      domain = ".2pinyin.net";
    }

    if (window.location.host.indexOf("pinzi.org") !== -1) {
      domain = ".pinzi.org";
    }

    if (window.location.host.indexOf("giusit.com.br") !== -1) {
      domain = ".giusit.com.br";
    }

    return domain;
  }
}

export default User;
