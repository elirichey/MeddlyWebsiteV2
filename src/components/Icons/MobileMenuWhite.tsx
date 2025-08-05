interface Props {
	className: string;
}

const MobileMenuWhite = ({ className }: Props) => {
	return (
		<svg
			className={className}
			width="512"
			height="512"
			viewBox="0 0 512 512"
			aria-label="mobile-menu-white-icon"
			role="img"
		>
			<line
				x1="88"
				y1="152"
				x2="424"
				y2="152"
				style={{
					fill: 'none',
					stroke: 'currentColor',
					strokeLinecap: 'round',
					strokeMiterlimit: 10,
					strokeWidth: '48px',
				}}
			/>
			<line
				x1="88"
				y1="256"
				x2="424"
				y2="256"
				style={{
					fill: 'none',
					stroke: 'currentColor',
					strokeLinecap: 'round',
					strokeMiterlimit: 10,
					strokeWidth: '48px',
				}}
			/>
			<line
				x1="88"
				y1="360"
				x2="424"
				y2="360"
				style={{
					fill: 'none',
					stroke: 'currentColor',
					strokeLinecap: 'round',
					strokeMiterlimit: 10,
					strokeWidth: '48px',
				}}
			/>
		</svg>
	);
};

export default MobileMenuWhite;

/*
<svg
      xmlns="http://www.w3.org/2000/svg"
      width="512"
      height="512"
      viewBox="0 0 512 512"
      className={className}
      stroke="currentColor"
    >
      <title>ionicons-v5-m</title>
      <path d="M289.94,256l95-95A24,24,0,0,0,351,127l-95,95-95-95A24,24,0,0,0,127,161l95,95-95,95A24,24,0,1,0,161,385l95-95,95,95A24,24,0,0,0,385,351Z" />
    </svg>
    */
