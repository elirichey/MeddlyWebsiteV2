import Image from 'next/image';

interface Props {
	name: string;
	label: string;
	value: string;
	onChange: (val: any) => void;
	placeholder: string;
	isComplete: boolean;
	error?: string;
	required?: boolean;
	disabled?: boolean;
}

export default function DateInput(props: Props) {
	const { name, label, value, onChange, placeholder, isComplete, error, required, disabled } = props;

	return (
		<div className="column time">
			<label htmlFor={name} className="label mb-5">
				{label}

				{isComplete && !error ? (
					<Image src="/svg/checkmark-circle.svg" height={16} width={16} className="field-check" alt="check-icon" />
				) : null}

				{error ? <span className="input-error">{error}</span> : null}
			</label>

			<input
				value={value}
				type="date"
				onChange={onChange}
				placeholder={placeholder}
				className={disabled ? 'input disabled' : 'input'}
				required={required}
				disabled={disabled}
			/>
		</div>
	);
}
