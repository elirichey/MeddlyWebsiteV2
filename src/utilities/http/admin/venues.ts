import axios from 'axios';
import API from '../_url';
import cookieStorage from '@/storage/cookies';

async function searchVenues(keyword: string): Promise<any> {
	const token = cookieStorage.getItem('accessToken');
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
