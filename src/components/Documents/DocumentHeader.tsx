import Link from 'next/link';

interface Props {
	title: string;
	secondaryTitle?: string;
	secondaryUrl?: string;
	size?: string;
}

export default function DocumentHeader(props: Props) {
	const { title, secondaryTitle, secondaryUrl, size } = props;

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
		<div id="document-header">
			<div className={returnSize()}>
				<h1>{title}</h1>

				{secondaryTitle && secondaryUrl && (
					<span>
						<Link href={secondaryUrl}>{secondaryTitle}</Link>
					</span>
				)}
			</div>
		</div>
	);
}
