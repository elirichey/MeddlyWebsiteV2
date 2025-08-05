import type { AudioItem, VideoItem } from '@/interfaces/Post';
import type { Sequence } from '@/interfaces/Sequence';
import VideoCard from '../Media/VideoCard';

interface Props {
	sequences: Sequence[];
	onSelectSequence: (sequence: VideoItem | AudioItem | Sequence) => void;
}

export default function EventListSequences(props: Props) {
	const { sequences, onSelectSequence } = props;
	const hasSequences = sequences.length > 0;

	return (
		<div id="event-list-sequences" className="event-section-container">
			{hasSequences ? (
				sequences.map((sequence: Sequence, i: number) => (
					<VideoCard post={sequence} key={i} onClick={onSelectSequence} />
				))
			) : (
				<p className="no-items-found">No Sequences Found</p>
			)}
		</div>
	);
}
