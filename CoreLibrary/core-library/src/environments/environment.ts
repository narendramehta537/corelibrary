
export const environment = {
  serverUrl: 'https://localhost:44373/api/',
  serverOrigin: 'https://localhost:44373',
  tokenName: 'tokenDetails',
  apiEndPoint: {
    auth: {
      login: 'auth/login',
      register: 'auth/register',
    },
    user: {
      userLoggedIn: 'user/logged-in',
      profilePic: 'user/0/profile/picture',
    }

  },
  production: false
};
