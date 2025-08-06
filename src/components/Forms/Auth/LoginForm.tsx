'use client';

import AuthHTTP from '@utilities/http/auth';
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import isEmail from 'validator/lib/isEmail';
import Loader from '@/components/Loader/Loader';
import { useUserStore } from '@/storage/stores/useUserStore';
import { formatLoginFormPayload } from '@/utilities/validations/AuthFormValidator';
import cookieStorage, { getCookieValue, setSecureAuthCookie, setSecureRefreshCookie } from '../../../storage/cookies';
import Input from '../_Inputs/Input';
import Password from '../_Inputs/Password';

interface Values {
	email: string;
	password: string;
}

export default function LoginForm() {
	const router = useRouter();

	const { profile, setProfile } = useUserStore();

	console.log({ profile });

	const checkIfSignedIn = useCallback(() => {
		const userCookie: any = getCookieValue('user');
		const accessToken: any = getCookieValue('accessToken');
		const refreshToken: any = getCookieValue('refreshToken');
		const user = userCookie ? JSON.parse(userCookie) : null;
		if (user && accessToken && refreshToken) router.push('/admin');
	}, [router]);

	useEffect(() => {
		const controller = new AbortController();
		checkIfSignedIn();
		return () => controller.abort();
	}, [checkIfSignedIn]);

	const [loading, setLoading] = useState<boolean>(false);

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
		setLoading(true);

		const values: Values = { email, password };
		const payload: Values = formatLoginFormPayload(values);

		try {
			const res: any = await AuthHTTP.login(payload);
			if (res?.status && res?.status === 201) {
				const accessToken = res?.data?.accessToken;
				const refreshToken = res?.data?.refreshToken;
				if (accessToken && refreshToken) {
					// Set secure authentication cookies
					setSecureAuthCookie('accessToken', accessToken);
					setSecureRefreshCookie('refreshToken', refreshToken);

					const userCreds = await AuthHTTP.userGetSelf(accessToken);
					if (userCreds.status === 200) {
						const user = userCreds.data;
						// Store user data in localStorage instead of cookies for better security
						setProfile(user);
						cookieStorage.setItem('user', user);
						// console.log({ profile });
						// return router.push('/admin');
					}
				}
				return;
			}

			console.log('LOGIN NON-201 RESPONSE:', res);
			setLoading(false);
			setErrors([res.response.data]);
		} catch (e: any) {
			if (e.response) {
				const { data } = e.response;
				const status = data.code;
				const message = data.message;
				// console.log("LOGIN CATCH ERROR", message);
				if (message.includes('User')) errors.email = 'User Does Not Exist';
				if (message.includes('credentials')) errors.password = 'Login Failed';
				setErrors([{ status, message }]);
				setLoading(false);
			}
		} finally {
			setLoading(false);
		}
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
