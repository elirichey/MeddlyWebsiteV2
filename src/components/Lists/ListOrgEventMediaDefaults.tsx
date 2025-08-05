import SecondaryTitleBar from '../TitleBar/SecondaryTitleBar';

export default function ListOrgEventMediaDefaults(props: any) {
	const { viewEvent } = props;

	return (
		<div id="list-event-defaults">
			<SecondaryTitleBar
				leftIcon={null}
				leftAction={undefined}
				title="Event Defaults"
				rightIcon={null}
				rightAction={undefined}
			/>
			<div>Default Video</div>
		</div>
	);
}
