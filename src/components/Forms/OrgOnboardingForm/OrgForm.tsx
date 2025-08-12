'use client';

import Loader from '@/components/Loader/Loader';
import { enforceFormat, formatToPhone } from '@/utilities/helpers/format-phone';
import WebsiteFormsHTTP from '@/utilities/http/forms/website';
import { type OrgFormPayload, type Values, formatOrgFormPayload } from '@/utilities/validations/OrgFormValidator';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import isEmail from 'validator/lib/isEmail';
import isURL from 'validator/lib/isURL';
import StepIndicator from './StepIndicator';

export default function OrgForm() {
	const [loading, setLoading] = useState<boolean>(false);
	const [formStep, setFormStep] = useState<number>(0);
	const goToStep = (step: number) => setFormStep(step);

	const [submitResponse, setSubmitResponse] = useState<any | null>(null);

	const [name, setName] = useState('');
	const [contactName, setContactName] = useState('');
	const [contactPhone, setContactPhone] = useState('');
	const [contactEmail, setContactEmail] = useState('');
	const [noEventsPerMonth, setNoEventsPerMonth] = useState('');
	const [website, setWebsite] = useState('');
	const [recordsEveryShow, setRecordsEveryShow] = useState<boolean | null>(null);
	const [isRepresentative, setIsRepresentative] = useState<boolean | null>(null);
	const [hiddenInput, setHiddenInput] = useState('');

	// ********** VALIDATIONS ********** //

	const [nameComplete, setNameComplete] = useState<boolean>(false);
	const [contactNameComplete, setContactNameComplete] = useState<boolean>(false);
	const [contactPhoneComplete, setContactPhoneComplete] = useState<boolean>(false);
	const [contactEmailComplete, setContactEmailComplete] = useState<boolean>(false);
	const [noEventsPerMonthComplete, setNoEventsPerMonthComplete] = useState<boolean>(false);
	const [websiteComplete, setWebsiteComplete] = useState<boolean>(false);
	const [recordsEveryShowComplete, setRecordsEveryShowComplete] = useState<boolean>(false);
	const [representativeComplete, setRepresentativeComplete] = useState<boolean>(false);

	useEffect(() => {
		if (name !== '' && name.trim().length > 2) setNameComplete(true);
		else if (nameComplete) setNameComplete(false);
	}, [name, nameComplete]);

	useEffect(() => {
		if (contactName !== '' && contactName.trim().length > 2) setContactNameComplete(true);
		else if (contactNameComplete) setContactNameComplete(false);
	}, [contactName, contactNameComplete]);

	// Update - Confirm it works..
	useEffect(() => {
		const testString = contactPhone.replace(/\D/g, '');
		if (contactPhone !== '' && testString.trim().length > 9) {
			setContactPhoneComplete(true);
		} else if (contactPhoneComplete) setContactPhoneComplete(false);
	}, [contactPhone, contactPhoneComplete]);

	useEffect(() => {
		if (contactEmail !== '' && isEmail(contactEmail.trim())) setContactEmailComplete(true);
		else if (contactEmailComplete) setContactEmailComplete(false);
	}, [contactEmail, contactEmailComplete]);

	useEffect(() => {
		if (noEventsPerMonth !== '' && noEventsPerMonth.trim() !== '') setNoEventsPerMonthComplete(true);
		else if (noEventsPerMonth) setNoEventsPerMonthComplete(false);
	}, [noEventsPerMonth]);

	useEffect(() => {
		if (website !== '' && isURL(website.trim()) && !isEmail(website.trim())) setWebsiteComplete(true);
		else if (websiteComplete) setWebsiteComplete(false);
	}, [website, websiteComplete]);

	useEffect(() => {
		if (typeof recordsEveryShow === 'boolean') setRecordsEveryShowComplete(true);
		else if (recordsEveryShowComplete) setRecordsEveryShowComplete(false);
	}, [recordsEveryShow, recordsEveryShowComplete]);

	useEffect(() => {
		if (typeof isRepresentative === 'boolean') setRepresentativeComplete(true);
		else if (representativeComplete) setRepresentativeComplete(false);
	}, [isRepresentative, representativeComplete]);

	const firstStepCompleted = nameComplete && noEventsPerMonthComplete && websiteComplete && recordsEveryShowComplete;

	const formIsComplete =
		nameComplete &&
		contactNameComplete &&
		// contactPhoneComplete &&
		contactEmailComplete &&
		noEventsPerMonthComplete &&
		websiteComplete &&
		recordsEveryShowComplete &&
		representativeComplete;

	// ********** SUBMIT ********** //

	const submitForm = async (e: any) => {
		e.preventDefault();
		setLoading(true);

		const values: Values = {
			name,
			contactName,
			contactPhone,
			contactEmail,
			noEventsPerMonth: Number.parseInt(noEventsPerMonth),
			website,
			recordsEveryShow,
			isRepresentative,
			hiddenInput,
		};

		const payload: OrgFormPayload = formatOrgFormPayload(values);
		const res: any = await WebsiteFormsHTTP.submitWaitListUser(payload);

		if (res.status !== 201) {
			return setTimeout(() => {
				setLoading(false);
				// console.log("SUBMIT_ERROR:", res);
				if (res.message === 'Network Error') {
					// return alert("Network Error: Are you connected to the internet?");
					return alert(JSON.stringify(res));
				}

				if (res?.response?.data?.code === 400) {
					return alert(res.response.data.message);
				}
			}, 1200);
		}

		return setTimeout(() => {
			setLoading(false);
			setSubmitResponse(res);
		}, 1200);
	};

	const resetForm = () => {
		setSubmitResponse(null);
		goToStep(0);

		setName('');
		setContactName('');
		setContactPhone('');
		setContactEmail('');
		setNoEventsPerMonth('');
		setWebsite('');
		setRecordsEveryShow(null);
		setIsRepresentative(null);

		setNameComplete(false);
		setContactNameComplete(false);
		setContactPhoneComplete(false);
		setContactEmailComplete(false);
		setNoEventsPerMonthComplete(false);
		setWebsiteComplete(false);
		setRecordsEveryShowComplete(false);
		setRepresentativeComplete(false);
	};

	// ********** RENDERS ********** //

	const renderStepOne = () => {
		return (
			<>
				<div className="row">
					<div className="flex1 column">
						<label htmlFor="represent" className="label mb-5">
							Who Do You Represent?
							{nameComplete ? (
								<Image
									src="/svg/checkmark-circle.svg"
									height={16}
									width={16}
									className="field-check"
									alt="check-icon"
								/>
							) : null}
						</label>
						<input
							id="name"
							name="name"
							type="text"
							className="input"
							placeholder="Name of Artist"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
				</div>

				<div className="row">
					<div className="flex1 column">
						<label htmlFor="website" className="label mb-5">
							Website
							{websiteComplete ? (
								<Image
									src="/svg/checkmark-circle.svg"
									height={16}
									width={16}
									className="field-check"
									alt="check-icon"
								/>
							) : null}
						</label>
						<input
							id="website"
							name="website"
							type="url"
							className="input"
							placeholder="www.website.com"
							value={website}
							onChange={(e) => setWebsite(e.target.value)}
						/>
					</div>
				</div>

				<div className="row">
					<div className="flex1 column">
						<label htmlFor="number-of-shows-per-month" className="label mb-5">
							Number of Events Each Month
							{noEventsPerMonthComplete ? (
								<Image
									src="/svg/checkmark-circle.svg"
									height={16}
									width={16}
									className="field-check"
									alt="check-icon"
								/>
							) : null}
						</label>

						<input
							id="number-of-shows-per-month"
							name="number-of-shows-per-month"
							type="number"
							className="input number"
							placeholder="0"
							min="0"
							value={noEventsPerMonth}
							onKeyDown={enforceFormat}
							onChange={(e) => setNoEventsPerMonth(e.target.value)}
						/>
					</div>
				</div>

				<div className="row">
					<div className="flex1 column">
						<label htmlFor="is-representative" className="label mb-5">
							Do you record every event?
							{recordsEveryShowComplete ? (
								<Image
									src="/svg/checkmark-circle.svg"
									height={16}
									width={16}
									className="field-check"
									alt="check-icon"
								/>
							) : null}
						</label>

						<div className="row radios">
							<label className="label">
								Yes
								<input
									type="radio"
									id="records-yes"
									name="does-record"
									className="ml-5"
									value="Yes"
									checked={typeof recordsEveryShow === 'boolean' && recordsEveryShow}
									onChange={() => setRecordsEveryShow(true)}
								/>
							</label>

							<label className="label ml-15">
								No
								<input
									type="radio"
									id="records-no"
									name="does-record"
									className="ml-5"
									value="No"
									checked={typeof recordsEveryShow === 'boolean' && !recordsEveryShow}
									onChange={() => setRecordsEveryShow(false)}
								/>
							</label>
						</div>
					</div>
				</div>

				<input
					id="hiddenInput"
					name="hiddenInput"
					type="hidden"
					className="input"
					placeholder=""
					value={hiddenInput}
					onChange={(e) => setHiddenInput(e.target.value)}
				/>

				<div className="row">
					<div className="flex1 column">
						<button onClick={() => goToStep(1)} className="go-next-btn" disabled={!firstStepCompleted} type="button">
							Continue
						</button>
					</div>
				</div>
			</>
		);
	};
	const renderStepTwo = () => {
		return (
			<>
				<div className="row">
					<div className="flex1 column">
						<label htmlFor="name" className="label mb-5">
							Contact Name
							{contactNameComplete ? (
								<Image
									src="/svg/checkmark-circle.svg"
									height={16}
									width={16}
									className="field-check"
									alt="check-icon"
								/>
							) : null}
						</label>
						<input
							id="contact-name"
							name="contact-name"
							type="text"
							className="input"
							placeholder="Name"
							value={contactName}
							onChange={(e) => setContactName(e.target.value)}
						/>
					</div>
				</div>

				<div className="row">
					<div className="flex1 column">
						<label htmlFor="phone" className="label mb-5">
							Contact Phone
							<span className="optional">(Optional)</span>
							{contactPhoneComplete ? (
								<Image
									src="/svg/checkmark-circle.svg"
									height={16}
									width={16}
									className="field-check"
									alt="check-icon"
								/>
							) : null}
						</label>
						<input
							id="contact-phone"
							name="contact-phone"
							type="tel"
							className="input"
							placeholder="xxx-xxx-xxxx"
							value={contactPhone}
							onKeyUp={formatToPhone}
							onKeyDown={enforceFormat}
							pattern="^((+1)?[s-]?)?(?[1-9]dd)?[s-]?[1-9]dd[s-]?dddd"
							onChange={(e) => setContactPhone(e.target.value)}
						/>
					</div>
				</div>

				<div className="row">
					<div className="flex1 column">
						<label htmlFor="email" className="label mb-5">
							Contact Email
							{contactEmailComplete ? (
								<Image
									src="/svg/checkmark-circle.svg"
									height={16}
									width={16}
									className="field-check"
									alt="check-icon"
								/>
							) : null}
						</label>
						<input
							id="contact-email"
							name="contact-email"
							type="email"
							className="input"
							placeholder="email@example.com"
							value={contactEmail}
							onChange={(e) => setContactEmail(e.target.value)}
						/>
					</div>
				</div>

				<div className="row">
					<div className="flex1 column">
						<label htmlFor="is-representative" className="label mb-5">
							Are you an official representative of the organization?
							{representativeComplete ? (
								<Image
									src="/svg/checkmark-circle.svg"
									height={16}
									width={16}
									className="field-check"
									alt="check-icon"
								/>
							) : null}
						</label>

						<div className="row radios">
							<label className="label">
								Yes
								<input
									type="radio"
									id="representative-yes"
									name="is-representative"
									className="ml-5"
									value="Yes"
									checked={typeof isRepresentative === 'boolean' && isRepresentative}
									onChange={() => setIsRepresentative(true)}
								/>
							</label>

							<label className="label ml-15">
								No
								<input
									type="radio"
									id="representative-no"
									name="is-representative"
									className="ml-5"
									value="No"
									checked={typeof isRepresentative === 'boolean' && !isRepresentative}
									onChange={() => setIsRepresentative(false)}
								/>
							</label>
						</div>
					</div>
				</div>

				<div className="row my-15">
					<div className="flex1 column">
						<p className="agreement">
							By submitting this form, you acknowledge and agree to our{' '}
							<Link href="/terms-and-conditions">Terms and Conditions</Link> and{' '}
							<Link href="/privacy-policy">Privacy Policy</Link>. Additionally, you consent to receive emails from us,
							which may include news, updates, and promotional offers. You can unsubscribe at any time.
						</p>
					</div>
				</div>

				<div className="row">
					<div className="flex1 column">
						<button onClick={submitForm} className="submit-btn" disabled={!formIsComplete} type="submit">
							Submit
						</button>
					</div>
				</div>
			</>
		);
	};

	const renderSuccessfulSubmission = () => {
		return (
			<div id="successful-submission" className="form-loader-container">
				<div className="column flex align-center justify-center my-10">
					<div className="checkmark-container">
						<Image src="/svg/checkmark.svg" height={36} width={36} className="submission-check" alt="check-icon" />
					</div>
					<p className="success-txt text-center">THANK YOU</p>
				</div>

				<p className="text-center my-10">Your submission was successful</p>
				<p className="text-center my-10">{`We'll be in contact soon`}</p>

				<span className="reset-form" onClick={resetForm} onKeyDown={resetForm}>
					OK
				</span>
			</div>
		);
	};

	return (
		<form id="artist-form" className={loading ? 'form loading' : 'form'} onSubmit={submitForm}>
			{loading ? (
				<div className="form-loader-container">
					<div className="loader-block">
						<Loader loaderId="colored-dots" />
					</div>
					<span>SUBMITTING</span>
				</div>
			) : submitResponse?.data ? (
				renderSuccessfulSubmission()
			) : (
				<>
					<StepIndicator step={formStep} goToStep={goToStep} loading={loading} />
					{formStep === 0 ? renderStepOne() : null}
					{formStep === 1 ? renderStepTwo() : null}
				</>
			)}
		</form>
	);
}
