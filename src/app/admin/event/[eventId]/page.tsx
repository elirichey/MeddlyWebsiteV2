'use client';

import AudioWaveform from '@/components/Media/AudioWaveform';
import ListEventDefaultAudio from '@/components/Media/Defaults/ListEventDefaultAudio';
import ListEventDefaultVideo from '@/components/Media/Defaults/ListEventDefaultVideo';
import MediaCard from '@/components/Media/MediaCard';
import Modal from '@/components/Modal/Modal';
import VantagePlayer from '@/components/Player/VantagePlayer/VantagePlayer';
import VideoPlayer from '@/components/Player/VideoPlayer/VideoPlayer';
import EventListSequences from '@/components/Sequences/EventListSequences';
import type { MeddlyEvent } from '@/interfaces/Event';
import type { PackageItem } from '@/interfaces/Package';
import type { AudioItem, VideoItem } from '@/interfaces/Post';
import type { Sequence } from '@/interfaces/Sequence';
import refreshUser from '@/utilities/RefreshUser';
import EventPackageHTTP from '@/utilities/http/admin/event-packages';
import EventSequenceHTTP from '@/utilities/http/admin/event-sequences';
// import AuthUserHTTP from "@/utilities/http/user/auth";
import EventForm from '@components/Forms/Events/EventForm';
import Loader from '@components/Loader/Loader';
import MenuBar from '@components/MenuBar/MenuBar';
import ChevronLeft from '@icons/ChevronLeft';
import TrashIcon from '@icons/TrashIcon';
import AdminLayout from '@layout/AdminLayout';
import OrgEventHTTP from '@utilities/http/admin/events';
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import '@styles/globals.sass';

interface Props {
	eventId: string;
}

export default function Event(props: Props) {
	const router = useRouter();
	const { eventId } = props;
	const [loading, setLoading] = useState<boolean>(false);
	const [loadingSequences, setLoadingSequences] = useState<boolean>(false);

	const [viewEvent, setViewEvent] = useState<MeddlyEvent | null>(null);
	const [viewEventPackages, setViewEventPackages] = useState<any[]>([]);
	const [sequences, setSequences] = useState<Sequence[]>([]);

	const [videoPlayerData, setVideoPlayerData] = useState<VideoItem | AudioItem | Sequence | null>(null);
	const [audioPlayerData, setAudioPlayerData] = useState<VideoItem | AudioItem | null>(null);
	const [vantagePlayerData, setVantagePlayerData] = useState<PackageItem | null>(null);

	const [showMediaDefaultAudio, setShowMediaDefaultAudio] = useState<boolean>(false);
	const [showMediaDefaultVideo, setShowMediaDefaultVideo] = useState<boolean>(false);

	const getOrgEventPackages = useCallback(
		async (id: string) => {
			try {
				setLoading(true);
				const res: any = await EventPackageHTTP.orgGetEventPackages({ id });

				if (res.status === 200) {
					setViewEventPackages(res.data.packages);
					setTimeout(() => setLoading(false), 750);
				} else if (res.status === 403) {
					await refreshUser(router);
					// await getOrgEventPackages(id);
				} else {
					console.error('GetOrgEventPackages Non-200 Response:', res);
					setTimeout(() => setLoading(false), 750);
				}
			} catch (e) {
				console.error('GetOrgEventPackages Error', e);
				setTimeout(() => setLoading(false), 750);
			}
		},
		[router],
	);

	const getOrgEvent = useCallback(async () => {
		try {
			setLoading(true);
			const res = await OrgEventHTTP.getOrgEvent({ eventId });
			if (res.status === 200) {
				setViewEvent(res.data);
				await getOrgEventPackages(res.data.id);

				setTimeout(() => setLoading(false), 750);
			} else if (res.status === 403) {
				await refreshUser(router);
				// await getOrgEvent();
			} else {
				console.error('GetOrgEvent Non-200 Response:', res);
				setTimeout(() => setLoading(false), 750);
			}
		} catch (e) {
			console.error('GetOrgEvent Error', e);
			setTimeout(() => setLoading(false), 750);
		}
	}, [router, eventId, getOrgEventPackages]);

	const getEventSequences = useCallback(async () => {
		try {
			setLoadingSequences(true);
			const res = await EventSequenceHTTP.orgGetEventSequences({ eventId });
			if (res.status === 200) {
				setSequences(res.data);
				setTimeout(() => setLoadingSequences(false), 750);
			} else if (res.status === 403) {
				await refreshUser(router);
				// await getEventSequences();
			} else {
				console.error('GetEventSequences Non-200 Response:', res);
				setTimeout(() => setLoadingSequences(false), 750);
			}
		} catch (e) {
			console.error('GetEventSequences Error', e);
			setTimeout(() => setLoadingSequences(false), 750);
		}
	}, [router, eventId]);

	const makeInitHttpCalls = useCallback(async () => {
		await Promise.all([getOrgEvent(), getEventSequences()]);
	}, [getOrgEvent, getEventSequences]);

	useEffect(() => {
		const controller = new AbortController();
		makeInitHttpCalls();
		return () => controller.abort();
	}, [makeInitHttpCalls]);

	const goBack = () => router.back();

	const goToPackage = (id: string) => router.push(`/admin/event/${eventId}/package/${id}`);

	const deleteEvent = async () => {
		if (!viewEvent) return;

		const confirmDelete = confirm(`Are you sure you want to delete ${viewEvent.title}`);

		if (confirmDelete) {
			try {
				const res: any = await OrgEventHTTP.deleteEvent({ eventId: viewEvent.id });
				if (res.status === 200) {
					return goBack();
				}
				if (res.status === 403) {
					await refreshUser(router);
					// await deleteEvent();
				} else {
					console.error('Delete Event Response Error', res);
				}
			} catch (e) {
				console.error('Delete Event Catch Error', e);
			}
		}
	};

	const currentStatus = viewEvent?.status || '';
	const completedStatuses = ['Post Production', 'Completed', 'Published'];
	const isCompletedEvent = completedStatuses.includes(currentStatus);
	const videoOrientation =
		videoPlayerData?.orientation?.toLowerCase() === 'portrait' ? '1080p Vertical' : '1080p Horizontal';

	return (
		<AdminLayout>
			<main id="admin" className="admin-event">
				<MenuBar>
					<button className="menu-bar-go-back" onClick={goBack} onKeyDown={goBack} type="button">
						<ChevronLeft className="back-icon" />
						<span>Back</span>
					</button>

					<div className="flex1 flex" />
					{viewEvent ? (
						<div className="menu-bar-delete-item">
							<button onClick={deleteEvent} type="button">
								<TrashIcon className="delete-icon" />
								<span>Delete</span>
							</button>
						</div>
					) : null}
				</MenuBar>

				{loading ? (
					<div className="loader-container">
						<div className="loader-list">
							<Loader loaderId="circle-eq" />
						</div>
					</div>
				) : (
					<div id="list-events">
						<div id="list-events-container" className="overview-body">
							<div id="event-overview" className="column">
								<div className="mx-15">
									<h2>Event Overview</h2>
								</div>

								<EventForm
									viewEvent={viewEvent}
									getEvents={async () => alert('GET_EVENTS_ON_FORM')}
									updateViewEvent={getOrgEvent}
								/>
							</div>

							{isCompletedEvent ? (
								<>
									<div id="manage-event-media" className="column">
										<div className="mx-15">
											<h2>Event Media</h2>
										</div>

										<div className="event-section">
											<div className="flex1 row wrap">
												<div className="media-source-column">
													<div className="event-section-container">
														<div className="media-sources custom-sources">
															<p className="section-title">Custom Playback Sources</p>
															<p className="note">
																Playback Sources are fallbacks used for synchronizing event playback. If no other source
																is available at a given time, these will be used.
															</p>

															<div className="column">
																{viewEvent?.managerAudio ? (
																	<>
																		<p className="subsubtitle">Playback Audio</p>
																		<div className="flex1 row">
																			<MediaCard
																				// cardName="Master Audio"
																				post={viewEvent?.managerAudio}
																				onClick={(item: VideoItem | AudioItem) => {
																					//console.log("PLAYBACK AUDIO CLICKED", {
																					//  item,
																					//});
																					setAudioPlayerData(item);
																				}}
																			/>

																			<button
																				type="button"
																				className="edit-media-button"
																				onClick={() => {
																					setShowMediaDefaultAudio(true);
																				}}
																			>
																				Edit
																			</button>
																		</div>
																	</>
																) : null}

																{viewEvent?.managerVideo ? (
																	<>
																		<p className="subsubtitle mt">Playback Video</p>

																		<div className="flex1 row">
																			<MediaCard
																				// cardName="Master Video"
																				post={viewEvent?.managerVideo}
																				onClick={(item: VideoItem | AudioItem) => {
																					//console.log("PLAYBACK AUDIO CLICKED", {
																					//  item,
																					//});
																					setVideoPlayerData(item);
																				}}
																			/>

																			{/*<button
                                      className="edit-media-button"
                                      onClick={() => {
                                        setShowMediaDefaultVideo(true);
                                      }}
                                    >
                                      Edit
                                    </button>*/}
																		</div>
																	</>
																) : null}
															</div>
														</div>
													</div>
												</div>

												<div className="media-source-column">
													<div className="event-section-container">
														<div className="media-sources master-sources">
															<p className="section-title">Master Sources</p>
															<p className="note">
																These are the foundational audio and video sources, used for synchronizing all media
																content. They cannot be updated.
															</p>

															<div className="column">
																{viewEvent?.primaryAudio ? (
																	<>
																		<p className="subsubtitle">Master Audio</p>
																		<div className="flex1 row">
																			<MediaCard
																				post={viewEvent?.primaryAudio}
																				onClick={(item: VideoItem | AudioItem) => {
																					//console.log("MASTER AUDIO CLICKED", {
																					//  item,
																					//});
																					setAudioPlayerData(item);
																				}}
																			/>
																		</div>
																	</>
																) : null}

																{viewEvent?.primaryVideo ? (
																	<>
																		<p className="subsubtitle mt">Master Video</p>
																		<div className="flex1 row">
																			<MediaCard
																				post={viewEvent?.primaryVideo}
																				onClick={(item: VideoItem | AudioItem) => {
																					//console.log("MASTER VIDEO CLICKED", {
																					//  item,
																					//});
																					setVideoPlayerData(item);
																				}}
																			/>
																		</div>
																	</>
																) : null}
															</div>
														</div>

														{/*{viewEventPackages.map((pkg: any, i: number) => {
                          console.log("VIEW_EVENT_PACKAGES", pkg);
                          return (
                            <div key={i} className="event-package">
                              <button onClick={() => goToPackage(pkg.id)}>
                                Edit Event Media: {pkg.title}
                              </button>
                            </div>
                          );
                        })}*/}
													</div>
												</div>
											</div>
										</div>
									</div>

									<div id="event-sequences" className="column">
										<div className="mx-15">
											<h2>Video Sequences</h2>
										</div>

										<div className="event-section">
											<div className="flex1 row wrap">
												<EventListSequences
													sequences={sequences}
													onSelectSequence={(sequence: VideoItem | AudioItem | Sequence) => {
														// console.log("SELECTED SEQUENCE", sequence);
														setVideoPlayerData(sequence);
													}}
												/>
											</div>
										</div>
									</div>
								</>
							) : null}
						</div>
					</div>
				)}

				{/** MEDIA DEFAULT - AUDIO SELECTION  **/}
				{showMediaDefaultAudio && viewEvent?.primaryAudio ? (
					<Modal
						id="media-default-audio-modal"
						show={showMediaDefaultAudio}
						close={() => setShowMediaDefaultAudio(false)}
						size="Audio Selection"
					>
						<ListEventDefaultAudio eventId={eventId} currentDefault={viewEvent?.primaryAudio} />
					</Modal>
				) : null}

				{/** MEDIA DEFAULT - VIDEO SELECTION **/}
				{showMediaDefaultVideo && viewEvent?.primaryVideo ? (
					<Modal
						id="media-default-video-modal"
						show={showMediaDefaultVideo}
						close={() => setShowMediaDefaultVideo(false)}
						size="Medium"
					>
						<ListEventDefaultVideo eventId={eventId} currentDefault={viewEvent?.primaryVideo} />
					</Modal>
				) : null}

				{/** VIDEO PLAYER MODAL **/}
				{videoPlayerData ? (
					<Modal
						id="video-player-modal"
						show={!!videoPlayerData}
						close={() => setVideoPlayerData(null)}
						size={videoOrientation}
					>
						<VideoPlayer post={videoPlayerData} />
					</Modal>
				) : null}

				{/** VANTAGE PLAYER MODAL **/}
				{vantagePlayerData ? (
					<Modal
						id="vantage-player-modal"
						show={!!vantagePlayerData}
						close={() => setVantagePlayerData(null)}
						size={videoOrientation}
					>
						<VantagePlayer viewPackage={vantagePlayerData} />
					</Modal>
				) : null}

				{/** AUDIO PLAYER MODAL **/}
				{audioPlayerData ? (
					<Modal
						id="audio-player-modal"
						show={!!audioPlayerData}
						close={() => setAudioPlayerData(null)}
						size="Audio Player"
					>
						<AudioWaveform post={audioPlayerData} />
					</Modal>
				) : null}
			</main>
		</AdminLayout>
	);
}
