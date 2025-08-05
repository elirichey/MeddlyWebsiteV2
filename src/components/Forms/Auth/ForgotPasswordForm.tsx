import UserAuthHTTP from '@utilities/http/user/auth';
import { useEffect, useState } from 'react';
import isEmail from 'validator/lib/isEmail';
import Loader from '@/components/Loader/Loader';
import Input from '../_Inputs/Input';

interface Values {
	email: string;
}

interface Props {
	setCompleted: (val: boolean) => void;
}

export default function ForgotPasswordForm(props: Props) {
	const { setCompleted } = props;

	const [loading, setLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState<any>([]);

	const [email, setEmail] = useState<string>('');
	const [emailComplete, setEmailComplete] = useState<boolean>(false);

	useEffect(() => {
		if (email !== '' && isEmail(email.trim())) setEmailComplete(true);
		else if (emailComplete) setEmailComplete(false);
	}, [email, emailComplete]);

	const submitForm = async (e: any) => {
		e.preventDefault();
		setLoading(true);

		const values: Values = { email };
		const payload: Values = values;

		try {
			const res: any = await UserAuthHTTP.requestPasswordReset(payload);
			if (res?.status === 201) {
				setLoading(false);
				setCompleted(true);
			} else {
				console.log('RESET PASSWORD NON-200 RESPONSE:', res);
				setLoading(false);
				setErrors([res.response.data]);
			}
		} catch (e: any) {
			setLoading(false);
		}
	};

	const formIsComplete = emailComplete;

	return (
		<form id="forgot-password-form" className={loading ? 'form loading' : 'form'} onSubmit={submitForm}>
			{loading ? (
				<div className="form-loader-container">
					<div className="loader-block">
						<Loader loaderId="colored-dots" />
					</div>
					<span>SUBMITTING</span>
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
						error={null}
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
		</form>
	);
}
