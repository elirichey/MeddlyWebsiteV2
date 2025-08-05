const isDevelopent = process.env.NEXT_PUBLIC_IS_DEVELOPMENT;
const isDev = isDevelopent === 'true';
const productionURL = 'https://api.meddly.app';
const developmentURL = 'https://api.meddly.dev';

const API_URL: string = isDev ? developmentURL : productionURL;

export default API_URL;
