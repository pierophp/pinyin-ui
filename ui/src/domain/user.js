import LocalStorage from 'src/helpers/local-storage';
import Config from 'src/helpers/config';
import http from 'src/helpers/http';

const apiUrl = Config.get('apiUrl');

class User {
  static login(code) {
    return new Promise((resolve, reject) => {
      http
      .get(`${apiUrl}auth/google/callback`, {
        params: { code },
      })
      .then((response) => {
        LocalStorage.save('token', response.data.token);
        LocalStorage.save('user', response.data.user);

        return resolve(response.data.user);
      })
      .catch(({ body }) => {
        const { errorCode } = body || {};

        return reject(errorCode);
      });
    });
  }

  static logout() {
    LocalStorage.remove('token');
    LocalStorage.remove('user');
    window.location = '/';
  }

  static isLogged() {
    return LocalStorage.has('token');
  }

  static getUser() {
    return LocalStorage.get('user') || {};
  }
}

export default User;
