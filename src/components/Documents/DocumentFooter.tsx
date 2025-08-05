import ChevronLeft from '@icons/ChevronLeft';
import ChevronRight from '@icons/ChevronRight';
import Link from 'next/link';

interface Props {
	nextTitle?: string;
	nextUrl?: string;
	prevUrl?: string;
	prevTitle?: string;
	size?: string;
}

export default function DocumentFooter(props: Props) {
	const { nextTitle, nextUrl, prevTitle, prevUrl, size } = props;

	const returnSize = () => {
		const sizeVal = size?.toLowerCase() || '';
		switch (sizeVal) {
			case 'small':
				return 'container-sm';
			default:
				return 'container-xmd';
		}
	};

	return (
		<div id="document-footer">
			<div className={returnSize()}>
				{prevTitle && prevUrl ? (
					<span className="flex1 align-left">
						<Link href={prevUrl}>
							<ChevronLeft className="previous-icon" />
							{/* <span>Previous:</span> {prevTitle} */}
							{prevTitle}
						</Link>
					</span>
				) : (
					<span className="flex1 empty" />
				)}

				{nextTitle && nextUrl ? (
					<span className="flex1">
						<Link href={nextUrl}>
							{/* <span>Next:</span> {nextTitle} */}
							{nextTitle}
							<ChevronRight className="next-icon" />
						</Link>
					</span>
				) : (
					<span className="flex1 empty" />
				)}
			</div>
		</div>
	);
}
