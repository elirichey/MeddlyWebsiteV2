import Image from 'next/image';

interface Props {
	name: string;
	label: string;
	value: string;
	onChange: (val: any) => void;
	isComplete: boolean;
	error?: string;
	disabled?: boolean;
	options: Array<string>;
	showOptions: boolean;
	setShowOptions: (val: boolean) => void;
	placeholder?: string;
}

export default function SelectCustom(props: Props) {
	const {
		name,
		label,
		value,
		onChange,
		isComplete,
		error,
		disabled,
		options,
		showOptions,
		setShowOptions,
		placeholder,
	} = props;

	return (
		<>
			<div className={showOptions ? 'input-field relative-index' : 'input-field'}>
				<label htmlFor={name} className="label mb-5">
					{label}

					{isComplete && !error ? (
						<Image src="/svg/checkmark-circle.svg" height={16} width={16} className="field-check" alt="check-icon" />
					) : null}

					{error ? <span className="input-error">{error}</span> : null}
				</label>

				<div className="select-input-container">
					{/* Main Selector */}
					<button
						type="button"
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
						<span className={value ? undefined : 'low-opacity'}>
							{value ? value : placeholder ? placeholder : 'Select'}
						</span>
						<span className={showOptions ? 'indicator open' : 'indicator'}>{!disabled ? '«' : null}</span>
					</button>

					{/* List dropdown */}
					{showOptions ? (
						<div className="list-options">
							<ul>
								{options.map((item, i) => {
									return (
										<li className={value === item ? 'option selected' : 'option'} key={item}>
											<button
												type="button"
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
											</button>
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
				<button
					type="button"
					className="select-external-listener"
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							setShowOptions(false);
						}
					}}
					onClick={() => setShowOptions(false)}
				/>
			) : null}
		</>
	);
}
