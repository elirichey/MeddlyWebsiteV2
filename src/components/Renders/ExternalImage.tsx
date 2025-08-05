import Image from 'next/image';

interface Props {
	id?: string;
	data: any;
	alt?: string;
	height?: number;
	width?: number;
}

export default function ExternalImage({ id, data, alt, height, width }: Props) {
	const file = data?.fields?.file?.url;
	const image = file ? `https:${file}` : undefined;

	if (!image) return <></>;
	return (
		<Image
			id={id ? id : undefined}
			src={image}
			alt={alt ? alt : 'image'}
			width={width ? width : 500}
			height={height ? height : 500}
		/>
	);
}
