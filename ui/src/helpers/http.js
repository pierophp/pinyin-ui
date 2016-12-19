import axios from 'axios';
import LocalStorage from 'src/helpers/local-storage';
import Config from 'src/helpers/config';

const baseURL = Config.get('apiUrl');
axios.defaults.headers.common.Authorization = `Bearer ${LocalStorage.get('token')}`;

const instance = axios.create({
  baseURL,
});

export default instance;
