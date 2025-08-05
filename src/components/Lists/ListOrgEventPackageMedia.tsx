import refreshUser from '@/utilities/RefreshUser';
import { formatSecondsToTime } from '@utilities/helpers/format-seconds-to-time';
import EventPostHTTP from '@utilities/http/admin/event-posts';
import { getCookie } from 'cookies-next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import Modal from '../Modal/Modal';

export default function ListOrgEventPackageMedia(props: any) {
	const router = useRouter();

	const { viewPackage, eventId, packageId } = props;

	const [loading, setLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState<any[]>([]);

	const [selectedPosts, setSelectedPosts] = useState<any[]>([]);
	const [filteredMedia, setFilteredMedia] = useState<any[]>([]);
	const [filterType, setFilterType] = useState<string>('All');

	const [viewPostModal, setViewPostModal] = useState(false);
	const [viewPost, setViewPost] = useState<any | null>(null);

	// ********** Lifecycle ********** //

	useEffect(() => {
		if (viewPackage?.packagePosts) {
			setInitialPosts(viewPackage.packagePosts);
		}
		getEventPostsByType('All');
	}, []);

	const setInitialPosts = async (allPosts: any) => {
		const posts: any[] = [];
		await Promise.all(
			allPosts.map(async (item: any) => {
				return await new Promise((resolve) => resolve(posts.push(item.post)));
			}),
		);
		setSelectedPosts(posts);
	};

	// ********** Session Functions ********** //

	const updatePackagePosts = async (posts: any) => {
		const accessToken = getCookie('accessToken');

		try {
			const res: any = await EventPostHTTP.editorBulkAddPosts(packageId, posts, accessToken || '');

			if (res.status === 200 || res.status === 201) {
				return res;
			}
			if (res.status === 403) {
				await refreshUser(router);
				await updatePackagePosts(posts);
				return res;
			}
			console.error('Update Package Posts Error:', { res });
			return res;
		} catch (e: any) {
			console.error('Update Package Posts Error:', { e });
			return e;
		}
	};

	const submitUpdatePackagePosts = async () => {
		const payload: any = [];
		await Promise.all(
			selectedPosts.map(async (post) => {
				await new Promise((resolve) => {
					resolve(payload.push({ postId: post.id }));
				});
			}),
		);

		setLoading(true);
		const res = await updatePackagePosts(payload);

		if (res.status === 200 || res.status === 201) {
			setLoading(false);
			return setTimeout(() => alert('Update Successful'), 500);
		}
		if (res.status === 403) {
			await refreshUser(router);
			await submitUpdatePackagePosts();
		} else {
			const { data, response } = res;
			if (data) {
				setTimeout(() => {
					setErrors(data);
					setLoading(false);
				}, 1250);
			}
			if (response) {
				const { data } = response;
				setTimeout(() => {
					setErrors(data.message);
					setLoading(false);
				}, 1250);
			}
		}
	};

	// ********** Filters ********** //

	useEffect(() => {
		getEventPostsByType(filterType);
	}, [filterType]);

	const getEventPostsByType = async (type: any) => {
		const accessToken = getCookie('accessToken');

		setLoading(true);
		try {
			const res: any = await EventPostHTTP.editorGetEventPostsByType(eventId, type, accessToken || '');
			if (res.status === 200) {
				setFilteredMedia(res.data);
				setTimeout(() => setLoading(false), 500);
			} else if (res.status === 403) {
				await refreshUser(router);
				await getEventPostsByType(type);
			} else {
				console.log('getEventPostsByType Response Error:', res);
				setTimeout(() => setLoading(false), 500);
			}
		} catch (e) {
			console.log('getEventPostsByType Catch Error:', e);
			setTimeout(() => setLoading(false), 500);
		}
	};

	// ********** Selectors ********** //

	const selectObject = (obj: any) => {
		const isIncluded = selectedPosts.some((x) => x.id === obj.id);
		console.log('Select Object:', isIncluded, obj);

		if (isIncluded) {
			const newArray = [...selectedPosts].filter((x) => x.id !== obj.id);
			// isInit ? setIsInit(false) : null;
			return setSelectedPosts(newArray);
		}
		const newArray = [...selectedPosts];
		newArray.push(obj);
		// isInit ? setIsInit(false) : null;
		return setSelectedPosts(newArray);
	};

	const playMedia = (obj: any) => {
		console.log('Play Media:', obj);
		setViewPost(obj);
		setViewPostModal(true);
	};
	const closeMediaModal = () => {
		setViewPostModal(false);
		setViewPost(null);
	};

	// ********** Renders ********** //

	const renderPreview = (post: any) => {
		const { type, preview, src } = post;

		let value: string | null = null;
		const isImage = type.includes('image');
		const isVideo = type.includes('video');
		const isAudio = type.includes('audio');
		if (isImage) value = 'Image';
		if (isVideo) value = 'Video';
		if (isAudio) value = 'Audio';

		switch (value) {
			case 'Image':
				return <img src={src} className="preview" alt="preview" />;
			case 'Video':
				return <img src={preview} className="preview" alt="preview" />;
			case 'Audio':
				return <p className="audio">Audio</p>;
			default:
				return <p className="none">Not Set</p>;
		}
	};

	return (
		<div id="list-package-media">
			<div className="title-section">
				<div className="title">All Posts</div>

				<div className="sorting-options">
					<span>Type: </span>
					<button
						type="button"
						onClick={() => setFilterType('All')}
						className={filterType === 'All' ? 'active' : undefined}
					>
						All
					</button>
					<button
						type="button"
						onClick={() => setFilterType('Images')}
						className={filterType === 'Images' ? 'active' : undefined}
					>
						Images
					</button>
					<button
						type="button"
						onClick={() => setFilterType('Video')}
						className={filterType === 'Video' ? 'active' : undefined}
					>
						Video
					</button>
					<button
						type="button"
						onClick={() => setFilterType('Audio')}
						className={filterType === 'Audio' ? 'active' : undefined}
					>
						Audio
					</button>
				</div>

				<div className="flex align-center justify-center">
					<button type="button" onClick={submitUpdatePackagePosts} className="save-btn">
						Save
					</button>
				</div>
			</div>

			<div className={loading || filteredMedia.length === 0 ? 'body-section grow-1' : 'body-section'}>
				{loading ? (
					<div className="flex flex1 justify-center align-center">
						<div className="loader-sub">
							<Loader loaderId="colored-dots" />
						</div>
					</div>
				) : filteredMedia.length > 0 ? (
					filteredMedia.map((post, i) => {
						const { id, creator, type } = post;
						const isIncluded = selectedPosts.some((x) => x.id === id);

						const creatorAvatar = creator.avatar ? creator.avatar : '/image/webp/placeholders/avatar.webp';

						const isVideo = type.includes('video');
						const isAudio = type.includes('audio');

						return (
							<div className={isIncluded ? 'single-post active' : 'single-post'} key={id}>
								{renderPreview(post)}
								<div className={isIncluded ? 'overlay' : 'not-selected'}>
									<div
										className="clickable"
										onClick={() => selectObject(post)}
										onKeyDown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												selectObject(post);
											}
										}}
									>
										{isIncluded ? (
											<div className="selected">
												<Image src="/svg/check-white.svg" width={18} height={18} alt="check" />
											</div>
										) : null}
									</div>

									<div
										className="overview-bar"
										onClick={() => playMedia(post)}
										onKeyDown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												playMedia(post);
											}
										}}
									>
										<div className="img avatar">
											<Image src={creatorAvatar} height={30} width={30} alt="avatar" />
										</div>

										<div className="overview">
											<span className="username">{post.creator.username}</span>
											{isVideo || isAudio ? (
												<span className="info">
													{isVideo ? `${formatSecondsToTime(post.duration)} @ ${post.fps}` : post.duration}
												</span>
											) : null}
										</div>

										{isVideo || isAudio ? (
											<span className="img">
												<Image src="/svg/player/player-play.svg" height={20} width={20} alt="play" />
											</span>
										) : null}
									</div>
								</div>
							</div>
						);
					})
				) : (
					<div className="flex align-center justify-center">No Posts</div>
				)}
			</div>

			<Modal show={viewPostModal} close={closeMediaModal} id="play-media-modal" size="Large">
				<div style={{ color: '#FFF' }}>{JSON.stringify(viewPost)}</div>
			</Modal>
		</div>
	);
}
