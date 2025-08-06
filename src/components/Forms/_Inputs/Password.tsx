import Image from 'next/image';

interface Props {
	name: string;
	value: string;
	onChange: (val: string) => void;
	type: string;
	placeholder: string;
	isComplete: boolean;
	label: string;
	error: null | string;
	hidePassword: boolean;
	toggleHidePassword: (val: boolean) => void;
	showToggle?: boolean;
}

export default function Password(props: Props) {
	const {
		name,
		value,
		onChange,
		type,
		placeholder,
		isComplete,
		label,
		error,
		hidePassword,
		toggleHidePassword,
		showToggle,
	} = props;

	return (
		<div className="row">
			<div className="flex1 column">
				<label htmlFor={name} className="label mb-5">
					{label}

					{isComplete && !error ? (
						<Image src="/svg/checkmark-circle.svg" height={16} width={16} className="field-check" alt="check-icon" />
					) : null}

					{error ? <span className="input-error">{error}</span> : null}
				</label>

				<div className="password-input-container">
					<input
						id={name}
						name={name}
						type={hidePassword ? 'password' : 'text'}
						className="input"
						placeholder={placeholder}
						value={value}
						onChange={(e: any) => onChange(e.target.value)}
					/>

					{showToggle ? (
						<button
							type="button"
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									toggleHidePassword(!hidePassword);
								}
							}}
							className="show-hide"
							onClick={() => toggleHidePassword(!hidePassword)}
						>
							{hidePassword ? '[ SHOW ]' : '[ HIDE ]'}
						</button>
					) : null}
				</div>
			</div>
		</div>
	);
}
