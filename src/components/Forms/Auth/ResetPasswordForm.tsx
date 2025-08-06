'use client';

import UserAuthHTTP from '@utilities/http/user/auth';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loader from '@/components/Loader/Loader';
import Password from '../_Inputs/Password';

interface Values {
	newPassword: string;
}

export default function ResetPasswordForm() {
	const router = useRouter();

	const searchParams = useSearchParams();
	const token = searchParams.get('token');

	const [loading, setLoading] = useState<boolean>(false);
	const [hidePassword, setHidePassword] = useState<boolean>(true);

	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const [confirmPasswordComplete, setConfirmPasswordComplete] = useState<boolean>(false);
	const [passwordComplete, setPasswordComplete] = useState<boolean>(false);

	const [formSuccess, setFormSuccess] = useState<boolean>(false);

	useEffect(() => {
		if (formSuccess) {
			// setTimeout(() => router.push('/auth/login'), 4000);
			setTimeout(() => router.push('/'), 4000);
		}
	}, [formSuccess, router]);

	useEffect(() => {
		if (confirmPassword !== '' && confirmPassword === password) {
			setConfirmPasswordComplete(true);
		} else if (confirmPasswordComplete) setConfirmPasswordComplete(false);
	}, [confirmPassword, confirmPasswordComplete, password]);

	useEffect(() => {
		if (password !== '') setPasswordComplete(true);
		else if (passwordComplete) setPasswordComplete(false);
	}, [password, passwordComplete]);

	const ToastMessage = (props: any) => <p>{props?.message}</p>;

	const submitHttp = async () => {
		const payload: Values = { newPassword: password };

		try {
			const res: any = await UserAuthHTTP.resetPassword(payload, token || '');
			if (res?.status === 200 || res?.status === 201) {
				setFormSuccess(true);
				return 'Password Updated!';
			}
			const response = res?.response?.data?.message || 'Error';
			console.log('RESET PASSWORD NON-201 RESPONSE:', response);
			setLoading(false);
			return response;
		} catch (e: any) {
			if (e.response) {
				const { data } = e.response;
				const status = data.code;
				const message = data.message;
				console.log('RESET PASSWORD CATCH ERROR', message);
				setLoading(false);
				return message;
			}
		}
	};

	const submitForm = async (e: any) => {
		e.preventDefault();
		setLoading(true);

		return toast.promise(submitHttp, {
			pending: {
				render({ data }) {
					const message = 'Submitting';
					console.log('Submitting...', data);
					return <ToastMessage message={message} />;
				},
			},
			success: {
				render({ data }) {
					return <ToastMessage message={data} class="error" />;
				},
				icon: false,
			},
			error: {
				render({ data }) {
					console.log('ERROR!', data);
					return <ToastMessage message={data} />;
				},
			},
		});
	};

	const formIsComplete = passwordComplete && confirmPasswordComplete;

	return (
		<form id="reset-form" className={loading ? 'form loading' : 'form'} onSubmit={submitForm}>
			{token ? (
				<>
					{loading ? (
						<div className="form-loader-container">
							<div className="loader-block">
								<Loader loaderId="colored-dots" />
							</div>
							<span>SUBMITTING</span>
						</div>
					) : (
						<>
							<Password
								name="password"
								value={password}
								onChange={setPassword}
								type="text"
								placeholder="Password"
								isComplete={passwordComplete}
								label="Password"
								hidePassword={hidePassword}
								toggleHidePassword={setHidePassword}
								error={null}
								showToggle={true}
							/>

							<Password
								name="confirmPassword"
								value={confirmPassword}
								onChange={setConfirmPassword}
								type="text"
								placeholder="Confirm Password"
								isComplete={confirmPasswordComplete}
								label="Verify Password"
								hidePassword={hidePassword}
								toggleHidePassword={setHidePassword}
								error={null}
								showToggle={false}
							/>

							<div className="row">
								<div className="flex1 column">
									<button type="submit" onClick={submitForm} className="submit-btn" disabled={!formIsComplete}>
										Submit
									</button>
								</div>
							</div>
						</>
					)}
				</>
			) : (
				<>
					<p className="txt-center mb-15">URL Error. Please go to Forgot Password page to reset your password. </p>
					<div className="row">
						<div className="flex1 column">
							<Link href="/auth/forgot" className="button">
								Reset Password
							</Link>
						</div>
					</div>
				</>
			)}
		</form>
	);
}
