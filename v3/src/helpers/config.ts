// @ts-ignore
import config from "@/.config";

class Config {
  static get(key: string) {
    // @ts-ignore
    return config[process.env.NODE_ENV][key];
  }
}

export default Config;
