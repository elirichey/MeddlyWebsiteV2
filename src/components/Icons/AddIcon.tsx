interface Props {
	className: string;
}

const AddIcon = ({ className }: Props) => {
	return (
		<svg
			width="512"
			height="512"
			viewBox="0 0 512 512"
			className={className}
			stroke="currentColor"
			aria-label="add-icon"
			role="img"
		>
			<line
				x1="256"
				y1="112"
				x2="256"
				y2="400"
				style={{
					fill: 'none',
					stroke: 'currentColor',
					strokeLinecap: 'round',
					strokeLinejoin: 'round',
					strokeWidth: '32px',
				}}
			/>
			<line
				x1="400"
				y1="256"
				x2="112"
				y2="256"
				style={{
					fill: 'none',
					stroke: 'currentColor',
					strokeLinecap: 'round',
					strokeLinejoin: 'round',
					strokeWidth: '32px',
				}}
			/>
		</svg>
	);
};

export default AddIcon;
