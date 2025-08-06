import axios from 'axios';
import API from '../_url';

async function searchVenues(keyword: string, accessToken: string): Promise<any> {
	return axios
		.get(`${API.url}/ticketmaster/search/venues?keyword=${keyword}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		})
		.then((res) => res)
		.catch((error) => error);
}

const VenuesHttp = {
	searchVenues,
};

export default VenuesHttp;
