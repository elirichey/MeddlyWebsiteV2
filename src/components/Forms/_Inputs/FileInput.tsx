import DocumentOutline from '@icons/DocumentOutline';
import Image from 'next/image';

interface Props {
	id: string;
	name: string;
	value: string;
	onChange: (val: any) => void;
	setFile: (val: File) => void;
	type?: string;
	placeholder?: string;
	isComplete: boolean;
	label: string;
	error?: null | string;
	disabled?: boolean;
	formats?: string;
}

export default function FileInput(props: Props) {
	const { id, name, value, onChange, setFile, type, placeholder, isComplete, label, error, disabled, formats } = props;

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

				<div className="file-input-container">
					<button
						type="button"
						tabIndex={0}
						aria-label="Browse files"
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								disabled ? null : document?.getElementById(id || '')?.click();
							}
						}}
						className="file-input"
						onClick={() => (disabled ? null : document?.getElementById(id || '')?.click())}
					>
						<span className={value ? 'file-input-text' : 'file-input-text empty'}>
							{value ? <DocumentOutline className="file-input-icon" /> : null}
							{value ? `${value.replace(/^.*[\\/]/, '')}` : 'Browse'}
						</span>
					</button>

					{value ? (
						<button
							type="button"
							tabIndex={0}
							aria-label="Clear file selection"
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									onChange('');
								}
							}}
							className="file-clear-btn"
							onClick={() => onChange('')}
						>
							[ Clear ]
						</button>
					) : null}
				</div>

				<input
					id={id}
					name={name}
					type={type ? type : 'text'}
					className={disabled ? 'input disabled' : 'input'}
					placeholder={placeholder}
					value={value}
					onChange={(e: any) => {
						console.log({ e, test: e.target.files[0] });
						setFile(e.target.files[0]);
						return onChange(e.target.value);
					}}
					disabled={disabled}
					accept={formats ? formats : undefined}
					hidden
				/>
			</div>
		</div>
	);
}
