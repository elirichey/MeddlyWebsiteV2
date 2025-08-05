import Image from 'next/image';

interface Props {
	name: string;
	value: string;
	onChange: (val: string) => void;
	placeholder?: string;
	isComplete: boolean;
	label: string;
	rows?: number;
	error?: null | string;
	disabled?: boolean;
}

export default function Input(props: Props) {
	const { name, value, onChange, placeholder, isComplete, label, rows, error, disabled } = props;

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

				<textarea
					id={name}
					name={name}
					className={disabled ? 'input text-area disabled' : 'input text-area'}
					placeholder={placeholder}
					value={value}
					onChange={(e: any) => onChange(e.target.value)}
					rows={rows ? rows : 4}
					disabled={disabled}
				/>
			</div>
		</div>
	);
}
