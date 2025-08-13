import LoginForm from '@components/Forms/Auth/LoginForm';
import AuthLayout from '@layout/AuthLayout';
import Snackbar from '@components/Notifications/Snackbar';
import '@styles/globals.sass';

export default function Login() {
	return (
		<AuthLayout>
			<main>
				<div id="auth" className="body">
					<div className="auth-background">
						<div className="container mt-15">
							<div id="auth-form" className="flex1 column">
								<h1>Login</h1>
								<div className="auth-form flex1 column">
									<LoginForm />
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>

			<Snackbar />
		</AuthLayout>
	);
}
