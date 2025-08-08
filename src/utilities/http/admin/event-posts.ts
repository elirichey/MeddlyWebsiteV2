import axios from 'axios';
import type { PostItem } from '../../../interfaces/Post';
import API from '../_url';
import cookieStorage from '@/storage/cookies';

interface EditorByType {
	eventId: string;
	type: string;
	page?: number;
}

interface EditorBulkAddPosts {
	packageId: string;
	payload: PostItem[];
}

interface MediaDefaults {
	eventId: string;
	page?: number;
}

async function editorGetEventPostsByType(data: EditorByType): Promise<any> {
	const { eventId, type, page } = data;

	const token = cookieStorage.getItem('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	const pageIsNumber = typeof page === 'number';
	const route = `${API.url}/event/${eventId}/posts/${type}${pageIsNumber ? `?page=${page}` : ''}`;

	return await axios
		.get(route, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((error) => error);
}

async function editorBulkAddPosts(data: EditorBulkAddPosts): Promise<any> {
	const { packageId, payload } = data;

	const token = cookieStorage.getItem('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	// Returns new viewPackage item
	return await axios
		.post(`${API.url}/package/${packageId}/posts`, payload, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((error) => error);
}

async function getEventDefaultAudios(data: MediaDefaults): Promise<any> {
	const { eventId, page } = data;

	const token = cookieStorage.getItem('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	const pageIsNumber = typeof page === 'number';
	const route = `${API.url}/event/${eventId}/posts/org/default/audio${pageIsNumber ? `?page=${page}` : ''}`;

	return await axios
		.get(route, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((error) => error);
}

async function getEventDefaultVideos(data: MediaDefaults): Promise<any> {
	const { eventId, page } = data;

	const token = cookieStorage.getItem('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	const pageIsNumber = typeof page === 'number';
	const route = `${API.url}/event/${eventId}/posts/org/default/video${pageIsNumber ? `?page=${page}` : ''}`;

	return await axios
		.get(route, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((error) => error);
}

async function generateAudioFileForPost(data: { postId: string }): Promise<any> {
	const { postId } = data;

	const token = cookieStorage.getItem('accessToken');
	if (!token) {
		return Promise.reject(new Error('No token found'));
	}

	const route = `${API.url}/post/${postId}/generate-audio`;

	return await axios
		.post(route, {}, { headers: { Authorization: `Bearer ${token}` } })
		.then((res) => res)
		.catch((error) => error);
}

const EventPostHTTP = {
	editorGetEventPostsByType,
	editorBulkAddPosts,
	getEventDefaultAudios,
	getEventDefaultVideos,
	generateAudioFileForPost,
};

export default EventPostHTTP;
