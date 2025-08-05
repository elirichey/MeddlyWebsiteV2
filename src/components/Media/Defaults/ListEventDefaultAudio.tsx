import type { AudioItem, VideoItem } from '@/interfaces/Post';
import type { Sequence } from '@/interfaces/Sequence';
import refreshUser from '@/utilities/RefreshUser';
import EventPostHTTP from '@/utilities/http/admin/event-posts';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AddMediaCard from '../AddMediaCard';
import AudioWaveform from '../AudioWaveform';
import MediaCard from '../MediaCard';

interface Props {
	eventId: string;
	currentDefault: VideoItem | AudioItem | Sequence;
}

export default function ListEventDefaultAudio(props: Props) {
	const router = useRouter();

	const { eventId, currentDefault } = props;

	const accessToken = getCookie('accessToken');

	const [loading, setLoading] = useState<boolean>(false);
	const [audios, setAudios] = useState<VideoItem[] | AudioItem[] | Sequence[]>([]);
	const [totalAudios, setTotalAudios] = useState<number>(0);
	const [selectedAudio, setSelectedAudio] = useState<VideoItem | AudioItem | Sequence | null>(null);

	const getEventDefaultAudios = async () => {
		setLoading(true);
		try {
			const res: any = await EventPostHTTP.getEventDefaultAudios(eventId, accessToken || '');

			if (res.status === 200) {
				setAudios(res.data.posts);
				setTotalAudios(res.data.totalPosts);
				setTimeout(() => setLoading(false), 750);
			} else if (res.status === 403) {
				await refreshUser(router);
				// await getEventDefaultAudios();
			} else {
				console.error('GetEventDefaultAudios Non-200 Response:', res);
				setTimeout(() => setLoading(false), 750);
			}
		} catch (error) {
			console.error('Error fetching event default audios:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const controller = new AbortController();
		getEventDefaultAudios();
		return () => controller.abort();
	}, []);

	const hasAudio = audios.length > 0;

	if (loading) {
		return <p>Loading...</p>;
	}

	if (!hasAudio) {
		return <p>No audio available.</p>;
	}

	const defaultIsSelected = currentDefault.id === selectedAudio?.id;

	return (
		<>
			<div className="default-media-title">
				<p>{defaultIsSelected ? 'Default Audio' : 'Custom Audio'}</p>
			</div>

			<div id="list-event-media-default-audio">
				<div className="list-default-sources">
					<div className="flex1">
						<AddMediaCard onClick={() => alert()} size="half" />
						{defaultIsSelected ? null : <AddMediaCard title="Save" onClick={() => alert()} size="half" />}
					</div>

					{audios.map((audio: any) => {
						const audioSelected = selectedAudio?.id === audio.id;
						return (
							<>
								<MediaCard post={audio} onClick={(x) => setSelectedAudio(x)} selected={audioSelected} key={audio.id} />
							</>
						);
					})}
				</div>
			</div>

			{selectedAudio ? (
				<div id="currently-selected-audio">
					<AudioWaveform post={selectedAudio} />
				</div>
			) : (
				<div id="currently-selected-audio" className="no-audio-selected" />
			)}
		</>
	);
}
