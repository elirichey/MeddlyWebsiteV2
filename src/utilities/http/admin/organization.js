import axios from 'axios';
import API_URL from '../_url';

const getOrgData = async (id, token) => {
	return await axios.get(`${API_URL}/page/${id}/all`, {
		headers: { Authorization: `Bearer ${token}` },
	});
};

const updateOrg = async (organization, payload, token) => {
	const initialPayload = { ...payload };
	if (initialPayload.avatar) initialPayload.avatar = undefined;

	const isEmptyObject = Object.entries(initialPayload).length === 0;
	if (isEmptyObject && payload.avatar) {
		try {
			const final = await uploadOrganizationalAvatar(organization.id, payload, token);
			if (final.status === 201) return final;
			return final;
		} catch (e) {
			return e;
		}
	} else {
		await axios
			.put(`${API_URL}/page/${organization.id}`, initialPayload, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then(async (res) => {
				if (res.status === 200) {
					if (payload.avatar && organization.avatar !== payload.avatar) {
						try {
							const final = await uploadOrganizationalAvatar(organization.id, payload, token);
							if (final.status === 201) return final;
							return res;
						} catch (e) {
							return e;
						}
					} else return res;
				}
				return res;
			})
			.catch((error) => error);
	}
};

const uploadOrganizationalAvatar = async (id, payload, token) => {
	const ts = new Date().getTime();
	const file = {
		uri: payload.avatar,
		name: `${id}__TS${ts}.jpg`,
		type: 'image/jpg',
	};

	const formData = new FormData();
	formData.append('file', file);

	return await axios({
		url: `${API_URL}/page/${id}/avatar`,
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/json',
			'content-type': 'multipart/form-data',
		},
		data: formData,
		onUploadProgress: ({ total, loaded }) => {
			const progress = (loaded / total) * 100;
			const percentage = Math.round(progress);
			console.log(`Uploading Org Avatar... ${percentage}%`);
			return percentage;
		},
	})
		.then((res) => res)
		.catch((error) => error);
};

const OrganizationHttp = {
	getOrgData,
	updateOrg,
};

export default OrganizationHttp;
