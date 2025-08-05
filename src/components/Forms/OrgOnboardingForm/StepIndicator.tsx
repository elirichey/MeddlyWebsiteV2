import ChevronLeft from '@/components/Icons/ChevronLeft';

interface Props {
	step: number;
	goToStep: (val: number) => void;
	loading: boolean;
}

export default function StepIndicator(props: Props) {
	const { step, goToStep, loading } = props;

	return (
		<div className="form-steps-container">
			<div className="row align-center justify-center">
				{step === 1 && !loading ? (
					<span onClick={() => goToStep(0)} className="form-go-back" onKeyDown={() => goToStep(0)}>
						<ChevronLeft className="step-indicator-back-icon" />
						BACK
					</span>
				) : (
					<div className="flex1" />
				)}

				<div
					onClick={() => goToStep(0)}
					onKeyDown={() => goToStep(0)}
					className="column m-10 align-center justify-center"
				>
					<p
						className={
							step >= 0
								? step === 1
									? 'form-step-title active opacity-low'
									: 'form-step-title active'
								: 'form-step-title'
						}
					>
						OVERVIEW
					</p>
					<div className={step >= 0 ? 'form-step-marker active' : 'form-step-marker'} />
				</div>

				<div className="column m-10 align-center justify-center">
					<p className={step > 0 ? 'form-step-title active' : 'form-step-title'}>CONTACT</p>

					<div className={step > 0 ? 'form-step-marker active' : 'form-step-marker'} />
				</div>
				<div className="flex1" />
			</div>
		</div>
	);
}
