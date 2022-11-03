import config from "@/.config";

class Config {
  static get(key) {
    return config[process.env.NODE_ENV][key];
  }
}

export default Config;
