'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import isEmail from 'validator/lib/isEmail';
import Loader from '@/components/Loader/Loader';
import { useUserStore } from '@/storage/stores/useUserStore';
import { formatLoginFormPayload } from '@/utilities/validations/AuthFormValidator';
import { getCookieValue } from '../../../storage/cookies';
import Input from '../_Inputs/Input';
import Password from '../_Inputs/Password';
import UserStoreHttp from '@/storage/http/userStoreHttp';
// import { useUserStore } from '@/storage/stores/useUserStore';

interface Values {
	email: string;
	password: string;
}

export default function LoginForm() {
	const router = useRouter();

	const userStore = useUserStore();
	const { loading } = userStore;

	const profileCookie = getCookieValue('profile');
	const profile = profileCookie ? JSON.parse(profileCookie) : null;

	const checkIfSignedIn = useCallback(() => {
		const accessToken: any = getCookieValue('accessToken');
		const refreshToken: any = getCookieValue('refreshToken');
		console.log('checkIfSignedIn: accessToken', { accessToken, refreshToken });
		if (accessToken && refreshToken) router.push('/admin');
	}, [router]);

	useEffect(() => {
		const controller = new AbortController();
		checkIfSignedIn();
		return () => controller.abort();
	}, [checkIfSignedIn]);

	const [errors, setErrors] = useState<any>([]);
	const emailError = errors.find((x: any) => x.message.toLowerCase().includes('user'));

	const passwordError = errors.find((x: any) => x.message.toLowerCase().includes('credentials'));

	const [hidePassword, setHidePassword] = useState<boolean>(true);

	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const [emailComplete, setEmailComplete] = useState<boolean>(false);
	const [passwordComplete, setPasswordComplete] = useState<boolean>(false);

	useEffect(() => {
		if (email !== '' && isEmail(email.trim())) setEmailComplete(true);
		else if (emailComplete) setEmailComplete(false);
	}, [email, emailComplete]);

	useEffect(() => {
		if (password !== '') setPasswordComplete(true);
		else if (passwordComplete) setPasswordComplete(false);
	}, [password, passwordComplete]);

	const submitForm = async (e: any) => {
		e.preventDefault();
		const values: Values = { email, password };
		const payload: Values = formatLoginFormPayload(values);

		console.log('submitForm: payload', { payload });
		await UserStoreHttp.tryLogin(payload);
	};

	const formIsComplete = emailComplete && passwordComplete;

	return (
		<form id="login-form" className={loading ? 'form loading' : 'form'} onSubmit={submitForm}>
			{loading ? (
				<div className="form-loader-container">
					<div className="loader-block">
						<Loader loaderId="colored-dots" />
					</div>
					{/*<span>SUBMITTING</span>*/}
				</div>
			) : (
				<>
					<Input
						name="email"
						value={email}
						onChange={setEmail}
						type="text"
						placeholder="email@example.com"
						isComplete={emailComplete}
						label="Email"
						error={emailError ? emailError.message : null}
					/>

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
						error={passwordError ? passwordError.message : null}
						showToggle={true}
					/>

					<div className="row forgot-password-container">
						<div className="flex1 column">
							<Link href="/auth/forgot">Forgot Password?</Link>
						</div>
					</div>

					<div className="row">
						<div className="flex1 column">
							<button type="submit" onClick={submitForm} className="submit-btn" disabled={!formIsComplete}>
								Submit
							</button>
						</div>
					</div>
				</>
			)}
		</form>
	);
}
