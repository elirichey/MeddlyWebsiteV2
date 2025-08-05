'use client';

import WebsiteFormsHTTP from '@utilities/http/forms/website';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import isEmail from 'validator/lib/isEmail';
import Loader from '@/components/Loader/Loader';
import { formatContactFormPayload } from '@/utilities/validations/GeneralContactFormValidator';
import Input from '../_Inputs/Input';
import SelectCustom from '../_Inputs/SelectCustom';
import Textarea from '../_Inputs/Textarea';

interface ContactFormValues {
	name: string;
	email: string;
	subject: string;
	message: string;
}

export default function GeneralContact() {
	const form = useRef(null);

	const [loading, setLoading] = useState<boolean>(false);

	const [showSubjectOptions, setShowSubjectOptions] = useState<boolean>(false);

	const [submissionMessage, setSubmissionMessage] = useState<string>('');
	const [submissionError, setSubmissionError] = useState<string>('');

	const [name, setName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [subject, setSubject] = useState<string>('');
	const [message, setMessage] = useState<string>('');

	const [nameComplete, setNameComplete] = useState<boolean>(false);
	const [emailComplete, setEmailComplete] = useState<boolean>(false);
	const [subjectComplete, setSubjectComplete] = useState<boolean>(false);
	const [messageComplete, setMessageComplete] = useState<boolean>(false);

	useEffect(() => {
		if (name !== '') setNameComplete(true);
		else if (nameComplete) setNameComplete(false);
	}, [name, nameComplete]);

	useEffect(() => {
		if (email !== '' && isEmail(email.trim())) setEmailComplete(true);
		else if (emailComplete) setEmailComplete(false);
	}, [email, emailComplete]);

	useEffect(() => {
		if (subject !== '') setSubjectComplete(true);
		else if (subjectComplete) setSubjectComplete(false);
	}, [subject, subjectComplete]);

	useEffect(() => {
		if (message !== '') setMessageComplete(true);
		else if (messageComplete) setMessageComplete(false);
	}, [message, messageComplete]);

	const clearError = () => {
		setSubmissionMessage('');
		setSubmissionError('');
	};

	const clearForm = () => {
		setName('');
		setEmail('');
		setSubject('');
		setMessage('');
		setSubmissionMessage('');
		setSubmissionError('');
	};

	const submitForm = async (e: any) => {
		e.preventDefault();

		const values: ContactFormValues = { name, email, subject, message };
		const payload: any = formatContactFormPayload(values);

		const timeout = 600;
		setLoading(true);
		setSubmissionMessage('');
		setSubmissionError('');

		const response: any = await WebsiteFormsHTTP.submitGeneralContactForm(payload);
		if (response.status === 200 || response.status === 201) {
			return setTimeout(() => {
				clearForm();
				setSubmissionMessage('OK');
				setLoading(false);
			}, timeout);
		}
		return setTimeout(() => {
			setSubmissionMessage('');
			setSubmissionError('Error');
			setLoading(false);
		}, timeout);
	};

	const formIsComplete = nameComplete && emailComplete && subjectComplete && messageComplete;
	const isSuccessful = submissionMessage === 'OK';
	const hasError = submissionError.trim() !== '';

	return (
		<>
			{isSuccessful ? (
				<div className="contact-submission-secondary">
					<div id="successful-submission" className="form-loader-container">
						<div className="column flex align-center justify-center my-10">
							<div className="checkmark-container">
								<Image src="/svg/checkmark.svg" height={36} width={36} className="submission-check" alt="check-icon" />
							</div>
							<p className="success-txt text-center">THANK YOU</p>
						</div>

						<p className="text-center my-10">Your submission was successful</p>

						<span className="reset-form" onClick={clearForm} onKeyDown={clearForm}>
							Reset
						</span>
					</div>
				</div>
			) : null}

			{hasError ? (
				<div className="contact-submission-secondary">
					<h3>Submission Error</h3>
					<span onClick={clearError} onKeyDown={clearError} className="submit-btn">
						Try Again
					</span>
				</div>
			) : null}

			{!hasError && !isSuccessful ? (
				<>
					<form
						id="general-contact-form"
						className={loading ? 'form loading' : 'form'}
						onSubmit={submitForm}
						ref={form}
					>
						{loading ? (
							<div className="form-loader-container py-5">
								<div className="loader-block">
									<Loader loaderId="colored-dots" />
								</div>
								<span>SUBMITTING</span>
							</div>
						) : (
							<>
								<Input
									name="name"
									value={name}
									onChange={setName}
									type="text"
									placeholder="Your Name"
									isComplete={nameComplete}
									label="Name"
									// error={nameError ? nameError.message : null}
								/>

								<Input
									name="email"
									value={email}
									onChange={setEmail}
									type="text"
									placeholder="email@example.com"
									isComplete={emailComplete}
									label="Email"
									// error={emailError ? emailError.message : null}
								/>

								<SelectCustom
									name="subject"
									value={subject}
									onChange={setSubject}
									label="How can we help?"
									options={[
										'General Contact',
										'Request Organization',
										// "Support",
										// "Partnerships & Collaborations",
										'Media & Press Inquiries',
										'Investor Relations',
									]}
									showOptions={showSubjectOptions}
									setShowOptions={setShowSubjectOptions}
									disabled={false}
									isComplete={subjectComplete}
									placeholder="Subject"
									// error={subjectError ? subjectError.message : null}
								/>

								<Textarea
									name="message"
									value={message}
									onChange={setMessage}
									placeholder="Your message..."
									isComplete={messageComplete}
									label="Message"
									rows={3}
									// error={messageError ? messageError.message : null}
								/>

								<div className="row">
									<div className="flex1 column">
										<button
											type="submit"
											onClick={submitForm}
											onKeyDown={submitForm}
											className="submit-btn"
											disabled={!formIsComplete}
										>
											Submit
										</button>
									</div>
								</div>
							</>
						)}
					</form>
				</>
			) : null}
		</>
	);
}
