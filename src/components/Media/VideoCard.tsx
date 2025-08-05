import type { AudioItem, VideoItem } from '@/interfaces/Post';
import type { Sequence } from '@/interfaces/Sequence';
import { formatDate, formatTime } from '@/utilities/conversions/dates';
import { formatSecondsToTime } from '@/utilities/helpers/format-seconds-to-time';
import Image from 'next/image';

interface Props {
	post: VideoItem | AudioItem | Sequence;
	onClick?: (item: VideoItem | AudioItem | Sequence) => void;
}

export default function VideoCard(props: Props) {
	const { post, onClick } = props;

	const { id, duration, preview, gif, orientation, created } = post;
	const dateVal = new Date(created);
	const date = formatDate(dateVal);
	const time = formatTime(dateVal);

	return (
		<div
			className="video-preview"
			onClick={() => (onClick ? onClick(post) : null)}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					onClick ? onClick(post) : null;
				}
			}}
		>
			{preview || gif ? (
				<Image src={preview || gif || ''} alt="sequence-gif" height={320} width={320} className="video-preview-img" />
			) : (
				<div className="video-preview-img" />
			)}

			<div className="preview-info">
				<p className="duration">{formatSecondsToTime(duration)}</p>
				<p className="date-time">{date}</p>
				<p className="date-time">{time}</p>
			</div>
		</div>
	);
}
