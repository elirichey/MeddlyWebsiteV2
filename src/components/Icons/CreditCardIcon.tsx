interface Props {
	className: string;
}

const CreditCardIcon = ({ className }: Props) => {
	return (
		<svg viewBox="0 0 16 16" className={className} aria-label="credit-card-icon" role="img">
			<path
				d="M0,4c0-1.1,0.9-2,2-2h12c1.1,0,2,0.9,2,2v8c0,1.1-0.9,2-2,2H2c-1.1,0-2-0.9-2-2V4z M2,3C1.4,3,1,3.4,1,4v1h14V4
	c0-0.6-0.4-1-1-1H2z M15,7H1v5c0,0.6,0.4,1,1,1h12c0.6,0,1-0.4,1-1V7z M2,10c0-0.6,0.4-1,1-1h1c0.6,0,1,0.4,1,1v1c0,0.6-0.4,1-1,1H3
	c-0.6,0-1-0.4-1-1V10z"
			/>
		</svg>
	);
};

export default CreditCardIcon;
