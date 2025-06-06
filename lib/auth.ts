import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export const loginUser = (email: string) => {
  setCookie('isAuthenticated', true, { maxAge: 60 * 60 * 24 * 7 }); // 7 days
  setCookie('userEmail', email);
};

export const logoutUser = () => {
  deleteCookie('isAuthenticated');
  deleteCookie('userEmail');
};

export const isAuthenticated = () => {
  return getCookie('isAuthenticated') === 'true';
};

export const getCurrentUserEmail = () => {
  return getCookie('userEmail') || '';
};
