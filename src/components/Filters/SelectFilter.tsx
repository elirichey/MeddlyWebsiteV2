interface Props {
	name: string;
	label: string;
	value: string;
	onChange: (val: any) => void;
	disabled?: boolean;
	options: Array<string>;
	showOptions: boolean;
	setShowOptions: (val: boolean) => void;
}

export default function SelectFilter(props: Props) {
	const { name, label, value, onChange, disabled, options, showOptions, setShowOptions } = props;

	return (
		<>
			<div className={showOptions ? 'input-field relative-index select-filter' : 'input-field select-filter'}>
				<label htmlFor={name} className="label mb-5">
					{label}
				</label>

				<div className="select-input-container">
					{/* Main Selector */}
					<span
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								!disabled ? setShowOptions(!showOptions) : null;
							}
						}}
						className={
							!disabled
								? showOptions
									? 'input select-input open'
									: 'input select-input'
								: 'input select-input no-click disabled'
						}
						onClick={() => (!disabled ? setShowOptions(!showOptions) : null)}
					>
						<span className={value ? undefined : 'low-opacity'}>{value}</span>
						<span className={showOptions ? 'indicator open' : 'indicator'}>{!disabled ? '«' : null}</span>
					</span>

					{/* List dropdown */}
					{showOptions ? (
						<div className="list-options">
							<ul>
								{options.map((item) => {
									return (
										<li className={value === item ? 'option selected' : 'option'} key={item}>
											<span
												onKeyDown={(e) => {
													if (e.key === 'Enter' || e.key === ' ') {
														onChange(item);
														setShowOptions(false);
													}
												}}
												onClick={() => {
													onChange(item);
													setShowOptions(false);
												}}
												className="option-span"
											>
												{item}
											</span>
										</li>
									);
								})}
							</ul>
						</div>
					) : null}
				</div>
			</div>

			{/* List Dropdown - Background Listener */}
			{showOptions ? (
				<span
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							setShowOptions(false);
						}
					}}
					onClick={() => setShowOptions(false)}
					className="select-external-listener"
				/>
			) : null}
		</>
	);
}
