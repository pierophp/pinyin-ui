import LocalStorage from "@/helpers/local-storage";

let url = "";
if (LocalStorage.has("browser-url")) {
  url = LocalStorage.get("browser-url");
}

export default {
  url,
};
