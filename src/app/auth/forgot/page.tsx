'use client';

import ForgotPasswordForm from '@components/Forms/Auth/ForgotPasswordForm';
import PrimaryLayout from '@layout/PrimaryLayout';
import Link from 'next/link';
import { useState } from 'react';
import '@styles/globals.sass';

export default function ForgotPassword() {
	const [completed, setCompleted] = useState<boolean>(false);

	return (
		<PrimaryLayout>
			<main>
				<div id="auth" className="body">
					<div className="auth-background">
						<div className="container mt-15">
							<div id="auth-form" className="flex1 column">
								<h1>FORGOT PASSWORD</h1>
								<div className="auth-form flex1 column forgot-password">
									{completed ? (
										<div className="flex1 column">
											<p>
												A password reset link will be sent to your email. If you don’t receive an email within a few
												minutes, please check your spam folder.
											</p>

											<div className="row">
												<div className="flex1 column">
													<Link href="/auth/login" className="login-btn">
														Go to Login
													</Link>
												</div>
											</div>

											{/*<ActionButton text="Go Back" color="blue" action={goBack} />*/}
										</div>
									) : (
										<>
											<div className="row">
												<div className="flex1 column">
													<p>Please enter the email associated with your account to reset your password.</p>
												</div>
											</div>

											<ForgotPasswordForm setCompleted={setCompleted} />
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</PrimaryLayout>
	);
}
