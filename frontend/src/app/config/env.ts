declare global {
  interface Window {
    __env?: {
      API_URL?: string;
    };
  }
}

export const env = {
  API_URL: (window as Window).__env?.API_URL?.replace(/\/$/, '') ?? 'http://localhost:8083'
};

export default env;
