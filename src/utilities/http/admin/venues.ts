import axios from 'axios';
import API from '../_url';
import { getCookie } from 'cookies-next';

async function searchVenues(keyword: string): Promise<any> {
	const token = getCookie('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	return axios
		.get(`${API.url}/ticketmaster/search/venues?keyword=${keyword}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		.then((res) => res)
		.catch((error) => error);
}

const VenuesHttp = {
	searchVenues,
};

export default VenuesHttp;
