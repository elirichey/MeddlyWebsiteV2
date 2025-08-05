import API_URL from '@/utilities/http/_url';
import Uppy from '@uppy/core';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import DashboardModal from '@uppy/react/lib/DashboardModal';
import ThumbnailGenerator from '@uppy/thumbnail-generator';
import XHR from '@uppy/xhr-upload';
import { getCookie } from 'cookies-next';
import Image from 'next/image';
import { useState } from 'react';

interface Props {
	value: any;
	type?: 'user-avatar' | 'org-avatar' | 'event-cover';
	eventId?: string | undefined;
	orgId?: string | undefined;
	onComplete?: (url: string) => void;
	disabled?: boolean;
}

export default function ImageUpload(props: Props) {
	const { value, type, eventId, orgId, onComplete, disabled } = props;

	const roleCookie: any = getCookie('role');
	const accessToken: any = getCookie('accessToken');
	const refreshToken: any = getCookie('refreshToken');
	const role = roleCookie ? JSON.parse(roleCookie) : null;

	const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
	let uploadEndpoint = `${API_URL}`;

	const userAvatarRoute = '/user/avatar';
	const orgAvatarRoute = `/page/${orgId}/avatar`;
	const eventCoverRoute = `/event/${eventId}/cover`;

	const isUserAvatar = type === 'user-avatar';
	const isOrgAvatar = type === 'org-avatar';
	const isEventCover = type === 'event-cover';

	if (isUserAvatar) uploadEndpoint = uploadEndpoint + userAvatarRoute;
	if (isOrgAvatar) uploadEndpoint = uploadEndpoint + orgAvatarRoute;
	if (isEventCover) uploadEndpoint = uploadEndpoint + eventCoverRoute;

	const createUppy = () => {
		const uppyOptions = {
			id: 'image-upload-settings',
			autoProceed: false,
			allowMultipleUploads: false,
			restrictions: {
				maxFileSize: 1024 * 1024 * 5, // 5MB,
				maxNumberOfFiles: 1,
				minNumberOfFiles: 1,
				allowedFileTypes: ['.jpg', '.jpeg', '.png', '.gif'],
			},
		};

		// NOTE: Uppy automatically uses a POST request
		return new Uppy(uppyOptions)
			.use(XHR, {
				endpoint: uploadEndpoint || '',
				// chunkSize: 5242880, // 5MB
				headers: { Authorization: `Bearer ${accessToken}` },
			})
			.use(ThumbnailGenerator, {
				thumbnailType: 'image/*',
				waitForThumbnailsBeforeUpload: true,
			})
			.on('file-added', (file: any) => {
				console.log('Image File Added', file);
			})
			.on('upload-progress', (file: any, progress: any) => {
				console.log('Image Upload Progress', file, progress);
			})
			.on('complete', (result: any) => {
				console.log('Image Upload Complete', result);
				if (onComplete) {
					onComplete(result);
				}
			})
			.on('error', (error: any) => {
				console.error('Image Upload Error', error);
			});
	};

	const [uppy]: any[] = useState(createUppy());

	const clickUpload = () => {
		if (disabled) return;
		setShowUploadModal(!showUploadModal);
	};

	let errorMsg = '';
	if (isOrgAvatar && !orgId) {
		errorMsg = 'Please include an orgId prop when using "org-avatar" type';
	}
	if (isEventCover && !eventId) {
		errorMsg = 'Please include an eventId prop when using "event-cover" type';
	}
	const hasError = errorMsg !== '';

	return (
		<>
			<div id="image-selection" className={value ? undefined : 'no-img'} onClick={clickUpload} onKeyDown={clickUpload}>
				{value && !hasError ? (
					<Image src={value} alt="current-cover-image" layout="fill" objectFit="cover" />
				) : (
					<p className="no-img-txt">{hasError ? errorMsg : 'CLICK TO UPLOAD'}</p>
				)}
			</div>

			<DashboardModal uppy={uppy} open={showUploadModal} />
		</>
	);
}
