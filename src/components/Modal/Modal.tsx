import AddIcon from '@icons/AddIcon';
import type { ReactNode } from 'react';

interface Props {
	show: boolean;
	close: () => void;
	children: ReactNode;
	id: string;
	size:
		| 'Extra Small'
		| 'Small'
		| 'Medium'
		| 'Large'
		| '1080p Horizontal'
		| '1080p Vertical'
		| 'Audio Player'
		| 'Audio Selection';
}

export default function Modal(props: Props) {
	const { show, close, children, id, size } = props;

	let modalSize: string;

	if (size === 'Extra Small') modalSize = 'modal-xsmall';
	else if (size === 'Small') modalSize = 'modal-small';
	else if (size === 'Medium') modalSize = 'modal-medium';
	else if (size === 'Large') modalSize = 'modal-large';
	else if (size === '1080p Horizontal') modalSize = 'modal-1080p-horizontal';
	else if (size === '1080p Vertical') modalSize = 'modal-1080p-vertical';
	else if (size === 'Audio Player') modalSize = 'modal-audio-player';
	else if (size === 'Audio Selection') modalSize = 'modal-audio-selection';
	else modalSize = 'modal-small';

	if (!show) return null;

	const isVideo = size === '1080p Horizontal' || size === '1080p Vertical';
	const modalContainerClass = isVideo ? 'modal-display-video' : 'modal-display';
	return (
		<div id={id} className={modalContainerClass}>
			<div
				className="modal-backdrop"
				onClick={close}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						close();
					}
				}}
			/>
			<div className={`modal-content ${modalSize}`}>
				<button type="button" className="modal-exit-icon" onClick={close}>
					<AddIcon className="exit-icon" />
				</button>

				{children}
			</div>
		</div>
	);
}
