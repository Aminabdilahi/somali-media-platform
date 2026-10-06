/** Browser talks only to Next; Next proxies /api/* to FastAPI, so the auth cookie stays same-origin
 *  and no API URL, token or key is ever shipped to the client bundle. */
const API_URL = process.env.API_URL ?? "http://localhost:8000";
export default {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/:path*` }];
  },
};
