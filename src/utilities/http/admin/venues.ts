import axios, { type AxiosResponse } from 'axios';
import API_URL from '../_url';

const searchVenues = async (keyword: string, accessToken: string): Promise<AxiosResponse> => {
	return await axios
		.get(`${API_URL}/places/search?keyword=${keyword}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		})
		.then((res) => res)
		.catch((error) => error);
};

const VenuesHttp = {
	searchVenues,
};

export default VenuesHttp;
