import SelectFilter from './SelectFilter';

interface Props {
	selected: string;
	options: string[];
	onSelect: (selected: string) => void;
	showOptions: boolean;
	setShowOptions: (val: boolean) => void;
}

export default function EventFilter(props: Props) {
	const { selected, options, onSelect, showOptions, setShowOptions } = props;

	return (
		<div id="events-filter">
			<SelectFilter
				name="event-status"
				label="Event Status"
				value={selected}
				onChange={onSelect}
				options={options}
				showOptions={showOptions}
				setShowOptions={setShowOptions}
			/>
		</div>
	);
}
