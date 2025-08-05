import type { ReactNode } from 'react';

interface Props {
	leftIcon?: ReactNode;
	leftAction?: () => void;
	title: string;
	rightIcon?: ReactNode;
	rightAction?: () => void;
}

export default function SecondaryTitleBar(props: Props) {
	const { leftIcon, leftAction, title, rightIcon, rightAction } = props;

	return (
		<div className="secondary-title-bar">
			<div className="action">
				{leftIcon && leftAction ? (
					<span
						onClick={leftAction}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								leftAction();
							}
						}}
					>
						{leftIcon}
					</span>
				) : null}
			</div>
			<div className="flex flex1 title">{title}</div>
			<div className="action">
				{rightIcon && rightAction ? (
					<span
						onClick={rightAction}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								rightAction();
							}
						}}
					>
						{rightIcon}
					</span>
				) : null}
			</div>
		</div>
	);
}
