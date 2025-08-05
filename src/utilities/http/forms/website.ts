import axios, { type AxiosProgressEvent, type AxiosResponse } from 'axios';
import type { OrgFormPayload } from '../../validations/OrgFormValidator';
import API_URL from '../_url';

interface GeneralFormInputs {
	name: string;
	email: string;
	subject: string;
	message: string;
}

interface CareersFormInputs {
	name: string;
	email: string;
	subject: string;
	file: any;
	position: string;
}

const submitGeneralContactForm = async (payload: GeneralFormInputs): Promise<AxiosResponse> => {
	return await axios({
		url: `${API_URL}/form/website/general`,
		method: 'POST',
		headers: { Accept: 'application/json' },
		data: payload,
	})
		.then((res) => res)
		.catch((error) => error);
};

const submitUserCareersForm = async (payload: CareersFormInputs): Promise<AxiosResponse> => {
	const { name, email, subject, file, position } = payload;
	const formData = new FormData();
	formData.append('file', file);
	formData.append('name', name);
	formData.append('email', email);
	formData.append('subject', subject);
	formData.append('position', position);

	return await axios({
		url: `${API_URL}/form/website/careers`,
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'content-type': 'multipart/form-data',
		},
		data: formData,
		onUploadProgress: ({ total, loaded }: AxiosProgressEvent) => {
			const t = total || 1;
			const progress = (loaded / t) * 100;
			const percentage = Math.round(progress);
			console.log(`Uploading User Resume... ${percentage}%`);
			return percentage;
		},
	})
		.then((res) => res)
		.catch((error) => error);
};

const submitWaitListUser = async (payload: OrgFormPayload): Promise<AxiosResponse> => {
	const {
		name,
		recordsEveryShow,
		website,
		contactName,
		contactPhone,
		contactEmail,
		isRepresentative,
		noEventsPerMonth,
		hiddenInput,
	} = payload;

	const formattedPayload = {
		name: name.trim(),
		recordsEveryShow,
		website: website.trim().toLowerCase(),
		contactName,
		contactPhone,
		contactEmail,
		isRepresentative,
		noShowsPerMonth: noEventsPerMonth,
		hiddenInput: hiddenInput.trim(),
	};

	return await axios
		.post(`${API_URL}/waitlist`, formattedPayload)
		.then((res: any) => res)
		.catch((error: any) => error);
};

const WebsiteFormsHTTP = {
	submitGeneralContactForm,
	submitUserCareersForm,
	submitWaitListUser,
};

export default WebsiteFormsHTTP;
