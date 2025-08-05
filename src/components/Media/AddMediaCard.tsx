import AddIcon from '../Icons/AddIcon';

interface Props {
	title?: string;
	type?: 'video' | 'audio';
	onClick: () => void;
	disabled?: boolean;
	size?: 'full' | 'half';
}

export default function AddMediaCard(props: Props) {
	const { title, type, onClick, disabled, size } = props;

	const isHalfWidth = size === 'half';
	const containerClass = disabled
		? isHalfWidth
			? 'media-source-card add-media no-hover half-width'
			: 'media-source-card add-media no-hover'
		: isHalfWidth
			? 'media-source-card add-media half-width'
			: 'media-source-card add-media';

	//const returnIcon = () => {
	//  if (type === "audio") {
	//    return <MediaAudioIcon className="media-icon" />;
	//  } else {
	//    return <MediaVideoIcon className="media-icon" />;
	//  }
	//};

	const titleText = title ? title : 'Add Media';

	return (
		<div
			className={containerClass}
			onClick={() => onClick()}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					onClick();
				}
			}}
		>
			<div className="text-container">
				{/*<div className="icon-container">{returnIcon()}</div>*/}
				<div className="icon-container">{title ? null : <AddIcon className="add-icon" />}</div>
				<p>{titleText}</p>
			</div>
		</div>
	);
}
