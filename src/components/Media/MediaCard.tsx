import type { AudioItem, VideoItem } from '@/interfaces/Post';
import { formatSecondsToTime } from '@/utilities/helpers/format-seconds-to-time';
import MediaAudioIcon from '../Icons/MediaAudioIcon';
import MediaVideoIcon from '../Icons/MediaVideoIcon';

interface Props {
	cardName?: string;
	post: VideoItem | AudioItem;
	onClick?: (item: VideoItem | AudioItem) => void;
	selected?: boolean;
}

export default function MediaCard(props: Props) {
	const { cardName, post, onClick, selected } = props;

	const isAudio = post?.type.toLowerCase().includes('audio');
	const isVideo = post?.type.toLowerCase().includes('video');
	const type = isAudio ? 'audio' : isVideo ? 'video' : 'media';

	const returnIcon = () => {
		switch (type) {
			case 'audio':
				return <MediaAudioIcon className="media-icon" />;
			case 'video':
				return <MediaVideoIcon className="media-icon" />;
			default:
				return <MediaVideoIcon className="media-icon" />;
		}
	};

	const creatorName = post?.creator?.name || post?.creator?.username;
	const duration = post?.duration ? formatSecondsToTime(post.duration) : null;

	const containerClass = onClick
		? selected
			? 'media-source-card selected'
			: 'media-source-card'
		: selected
			? 'media-source-card selected no-hover'
			: 'media-source-card no-hover';

	return (
		<div
			className={containerClass}
			onClick={() => (onClick ? onClick(post) : null)}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					onClick ? onClick(post) : null;
				}
			}}
		>
			<div className="icon-container">{returnIcon()}</div>
			<div className="flex1 column">
				{cardName ? <p className="source-name">{cardName}</p> : <></>}
				{creatorName ? <p className="footnote">Creator: {creatorName}</p> : null}

				{duration ? <p className="footnote">Runtime: {duration}</p> : null}
			</div>

			{selected ? (
				<div className="is-playing">
					<p>Selected</p>
				</div>
			) : null}
		</div>
	);
}
