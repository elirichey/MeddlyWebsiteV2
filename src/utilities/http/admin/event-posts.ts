import axios from 'axios';
import API_URL from '../_url';

const editorGetEventPostsByType = async (eventId: string, type: string, accessToken: string) => {
	return await axios
		.get(`${API_URL}/event/${eventId}/posts/${type}`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		})
		.then((res) => res)
		.catch((error) => error);
};

const editorBulkAddPosts = async (packageId: string, payload: any, accessToken: string) => {
	return await axios
		.post(`${API_URL}/package/${packageId}/posts`, payload, {
			headers: { Authorization: `Bearer ${accessToken}` },
		})
		.then((res) => res)
		.catch((error) => error);
};

const getEventDefaultAudios = async (eventId: string, accessToken: string) => {
	return await axios
		.get(`${API_URL}/event/${eventId}/posts/org/default/audio`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		})
		.then((res) => res)
		.catch((error) => error);
};

const getEventDefaultVideos = async (eventId: string, accessToken: string) => {
	return await axios
		.get(`${API_URL}/event/${eventId}/posts/org/default/video`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		})
		.then((res) => res)
		.catch((error) => error);
};

const EventPostHTTP = {
	editorGetEventPostsByType,
	editorBulkAddPosts,
	getEventDefaultAudios,
	getEventDefaultVideos,
};

export default EventPostHTTP;
