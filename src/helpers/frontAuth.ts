const KEY_TOKEN = "jwt";
const KEY_USERID = "userId";
const KEY_USERNAME = "username";

export function saveUser(token: string, userId: string, username: string) {
  localStorage.setItem(KEY_TOKEN, token);
  localStorage.setItem(KEY_USERID, userId);
  localStorage.setItem(KEY_USERNAME, username);
}

export function logoutUser() {
  localStorage.removeItem(KEY_TOKEN);
  localStorage.removeItem(KEY_USERID);
  localStorage.removeItem(KEY_USERNAME);
}

export function getUser() {
  return {
    token: localStorage.getItem(KEY_TOKEN),
    userId: localStorage.getItem(KEY_USERID),
    username: localStorage.getItem(KEY_USERNAME)
  };
}

export function authHeaders(): HeadersInit {
  const token = localStorage.getItem(KEY_TOKEN);
  return token ? { Authorization: `Bearer ${token}` } : {};
}