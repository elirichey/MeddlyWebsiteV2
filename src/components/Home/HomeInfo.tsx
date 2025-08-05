interface Props {
	showForm: boolean;
	setShowForm: (val: boolean) => void;
}

export default function HomeInfo(props: Props) {
	const { showForm, setShowForm } = props;

	// COLLABORATIVE CONCERTS
	// CROWDSOURCE <br /> YOUR CONCERTS

	return (
		<div className="flex flex1 column justify-center text-container">
			<h1>
				CROWDSOURCE <br /> YOUR CONCERTS
			</h1>

			<p className="my-10">Record, package, and release recordings of every concert.</p>

			<p className="mt-10 mb-15">Get the most out of each performance. Use Meddly.</p>

			<div className={showForm ? 'access-container hidden' : 'access-container'}>
				{showForm ? null : (
					<div className="access-button" onClick={() => setShowForm(true)} onKeyDown={() => setShowForm(true)}>
						Get First Access
					</div>
				)}
			</div>
		</div>
	);
}
