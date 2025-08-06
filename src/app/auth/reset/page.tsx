import ResetPasswordForm from '@components/Forms/Auth/ResetPasswordForm';
import ResetPasswordLayout from '@layout/ResetPasswordLayout';
import '@styles/globals.sass';

export default function Reset() {
	return (
		<ResetPasswordLayout>
			<main>
				<div id="auth" className="body forgot-body">
					<div className="auth-background">
						<div className="container mt-15">
							<div id="auth-form" className="flex1 column">
								<h1>Reset Password</h1>
								<div className="auth-form flex1 column">
									<ResetPasswordForm />
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</ResetPasswordLayout>
	);
}
