interface Props {
	name: string;
	active: boolean;
	onChange: (val: boolean) => void;
	label: string;
	disabled?: boolean;
}

export default function Switch(props: Props) {
	const { name, label, active, onChange } = props;

	return (
		<div className="row">
			<div className="flex1 column">
				<label htmlFor={name} className="label mb-5">
					{label}
				</label>

				<label className="switch">
					<input type="checkbox" className="checkbox" checked={active} onChange={() => onChange(!active)} />
					<span className="switch-slider round" />
				</label>
			</div>
		</div>
	);
}
