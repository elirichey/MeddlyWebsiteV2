import API_URL from '@/utilities/http/_url';
import Uppy from '@uppy/core';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import DashboardModal from '@uppy/react/lib/DashboardModal';
import ThumbnailGenerator from '@uppy/thumbnail-generator';
import XHR from '@uppy/xhr-upload';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

interface Props {
	type?: string;
}

export default function AudioUpload(props: Props) {
	const { type } = props;

	const roleCookie: any = getCookie('role');
	const accessToken: any = getCookie('accessToken');
	const refreshToken: any = getCookie('refreshToken');
	const role = roleCookie ? JSON.parse(roleCookie) : null;

	const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
	const uploadEndpoint = `${API_URL}/`;

	const createUppy = () => {
		const uppyOptions = {
			id: 'audio-upload-settings',
			autoProceed: false,
			allowMultipleUploads: false,
			restrictions: {
				maxFileSize: 1024 * 1024 * 500, // 500MB,
				maxNumberOfFiles: 1,
				minNumberOfFiles: 1,
				allowedFileTypes: ['.mp3'],
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
				console.log('Audio File Added', file);
			})
			.on('upload-progress', (file: any, progress: any) => {
				console.log('Audio Upload Progress', file, progress);
			})
			.on('complete', (result: any) => {
				console.log('Audio Upload Complete', result);
			})
			.on('error', (error: any) => {
				console.log('Audio Upload Error', error);
			});
	};

	const [uppy]: any[] = useState(createUppy());
	useEffect(() => {
		return () => uppy.close();
	}, [uppy]);

	return (
		<>
			<div id="audio-upload-button">
				<div
					className="upload-button new-audio"
					onClick={() => setShowUploadModal(!showUploadModal)}
					onKeyDown={() => setShowUploadModal(!showUploadModal)}
				>
					UPLOAD FILE
				</div>
			</div>

			<DashboardModal uppy={uppy} open={showUploadModal} />
		</>
	);
}
