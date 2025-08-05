'use client';

import WebsiteFormsHTTP from '@utilities/http/forms/website';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import isEmail from 'validator/lib/isEmail';
import Loader from '@/components/Loader/Loader';
import FileInput from '../_Inputs/FileInput';
import Input from '../_Inputs/Input';
import SelectCustom from '../_Inputs/SelectCustom';

const companyPositions = [
	// Tech
	'Full Stack Developer',
	'DevOps',

	// Design
	'UI/UX Designer',
	'Graphic Designer',

	// Content
	'Social Media Manager',
	'Video Editor',
	'Copy Writer',

	// Personal
	'Client Relations',
	'Marketing',
	'Sales',
];

export default function CareersForm() {
	const form = useRef(null);

	const [loading, setLoading] = useState<boolean>(false);

	const [submissionMessage, setSubmissionMessage] = useState<string>('');
	const [submissionError, setSubmissionError] = useState<string>('');

	const [name, setName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [resume, setResume] = useState<any>('');
	const [resumeFile, setResumeFile] = useState<any>(null);
	const [position, setPosition] = useState<string>('');
	const [showPositionOptions, setShowPositionOptions] = useState<boolean>(false);

	const [nameComplete, setNameComplete] = useState<boolean>(false);
	const [emailComplete, setEmailComplete] = useState<boolean>(false);
	const [resumeComplete, setResumeComplete] = useState<boolean>(false);
	const [positionComplete, setPositionComplete] = useState<boolean>(false);

	useEffect(() => {
		if (name !== '') setNameComplete(true);
		else if (nameComplete) setNameComplete(false);
	}, [name, nameComplete]);

	useEffect(() => {
		if (email !== '' && isEmail(email.trim())) setEmailComplete(true);
		else if (emailComplete) setEmailComplete(false);
	}, [email, emailComplete]);

	useEffect(() => {
		if (position !== '') setPositionComplete(true);
		else if (positionComplete) setPositionComplete(false);
	}, [position, positionComplete]);

	useEffect(() => {
		if (resume !== '') setResumeComplete(true);
		else if (resumeComplete) setResumeComplete(false);
	}, [resume, resumeComplete]);

	const clearError = () => {
		setSubmissionMessage('');
		setSubmissionError('');
	};

	const clearForm = () => {
		setName('');
		setEmail('');
		setResume('');
		setPosition('');
		setResumeFile(null);
		setSubmissionMessage('');
		setSubmissionError('');
	};

	async function submitForm(e: any) {
		e.preventDefault();

		const subject = 'Careers Form Submission';

		const values: any = {
			name,
			email,
			subject,
			file: resumeFile,
			position,
		};

		const timeout = 600;
		setLoading(true);
		setSubmissionMessage('');
		setSubmissionError('');

		// HTTP Call
		const response: any = await WebsiteFormsHTTP.submitUserCareersForm(values);
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
	}

	const formIsComplete = nameComplete && emailComplete && positionComplete && resumeComplete;

	const isSuccessful = submissionMessage === 'OK';
	const hasError = submissionError.trim() !== '';

	return (
		<>
			{isSuccessful ? (
				<div className="careers-submission-secondary">
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
					<span onClick={clearError} className="submit-btn" onKeyDown={clearError}>
						Try Again
					</span>
				</div>
			) : null}

			{!hasError && !isSuccessful ? (
				<form
					id="careers-contact-form"
					className={loading ? 'form loading' : 'form'}
					onSubmit={submitForm}
					encType="multipart/form-data"
					method="post"
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
								// error={nameError ? nameError.comments : null}
							/>

							<Input
								name="email"
								value={email}
								onChange={setEmail}
								type="text"
								placeholder="email@example.com"
								isComplete={emailComplete}
								label="Email"
								// error={emailError ? emailError.comments : null}
							/>

							<SelectCustom
								name="position"
								label="Desired Position"
								value={position}
								onChange={setPosition}
								options={companyPositions.sort()}
								showOptions={showPositionOptions}
								setShowOptions={setShowPositionOptions}
								isComplete={false}
								error={''}
								disabled={false}
								placeholder="Select a position"
							/>

							<FileInput
								id="resume"
								name="resume"
								value={resume}
								onChange={setResume}
								setFile={setResumeFile}
								type="file"
								placeholder="Resume"
								isComplete={resumeComplete}
								label="Upload Resume"
								formats="application/pdf, application/msword"
								// error={subjectError ? subjectError.comments : null}
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
			) : null}
		</>
	);
}
