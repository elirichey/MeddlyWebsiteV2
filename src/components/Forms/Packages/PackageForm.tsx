import refreshUser from '@/utilities/RefreshUser';
import EventPackageHTTP from '@utilities/http/admin/event-packages';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Loader from '../../Loader/Loader';
import Input from '../_Inputs/Input';
import Switch from '../_Inputs/Switch';

interface Props {
	viewEvent: any;
	viewPackage: any;
	getPackage: (val: string) => Promise<void>;
	getPackages: (val: string) => Promise<void>;
	close: () => void;
}

export default function PackageForm(props: Props) {
	const { viewEvent, viewPackage, getPackage, getPackages, close } = props;

	const router = useRouter();

	const [loading, setLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState<Array<any>>([]);

	// ********** Form Inputs ********** //

	const [packageEventId, setPackageEventId] = useState<string>(viewPackage ? viewPackage.event.id : viewEvent.id);
	const [packageTitle, setPackageTitle] = useState<string>(viewPackage ? viewPackage.title : '');
	//const [packageType, setPackageType] = useState<string>(
	//  viewPackage ? viewPackage.type : ""
	//);
	const [packageIsDefault, setPackageIsDefault] = useState<boolean>(viewPackage ? viewPackage.isDefault : false);

	//const [showTypeOptions, setShowTypeOptions] = useState<boolean>(false);
	const [formSelectionUpdated, setFormSelectionUpdated] = useState<boolean>(false);

	useEffect(() => {
		let updated = false;
		if (viewPackage) {
			if (packageTitle && viewPackage.title !== packageTitle) updated = true;
			//if (packageType && viewPackage.type !== packageType) updated = true;
			if (packageIsDefault && viewPackage.isDefault !== packageIsDefault) {
				updated = true;
			}
		}

		if (updated && !formSelectionUpdated) setFormSelectionUpdated(true);
		if (!updated && formSelectionUpdated) setFormSelectionUpdated(false);
	}, [
		packageTitle,
		//packageType,
		packageIsDefault,
	]);

	// ********** Form Actions ********** //

	const validateInputs = async (values: any) => {
		const payload: any = {};
		const validationErrors: Array<any> = [];
		return await new Promise((resolve) => {
			const { title, type, isDefault, priceAttendees, priceNonAttendees } = values;

			// Title
			if (title === '') {
				validationErrors.push({
					type: 'Title',
					message: 'Please add event Title',
				});
			} else {
				payload.title = title;
				setPackageTitle(title);
			}

			//// Type
			//if (type === "") {
			//  validationErrors.push({
			//    type: "Type",
			//    message: `Please add event Type`,
			//  });
			//} else {
			//  payload.type = type;
			//  setPackageType(type);
			//}

			// Is Default
			payload.isDefault = packageIsDefault;

			// EventId
			payload.eventId = packageEventId;

			if (validationErrors.length > 0) {
				return resolve({ status: 400, errors: validationErrors });
			}
			return resolve({ status: 200, payload });
		});
	};

	// ********** Session Functions ********** //

	const onSubmit = async (values: any) => {
		const accessToken = getCookie('accessToken');

		setLoading(true);

		const validate: any = await validateInputs(values);
		if (validate.status === 400) {
			setLoading(false);
			return setErrors(validate.errors);
		}

		// Create Event
		if (!viewPackage) {
			try {
				const res: any = await EventPackageHTTP.createEventPackage(validate.payload, accessToken || '');
				if (res.status === 201) {
					setPackageTitle(res.data.title);
					//setPackageType(res.data.type);
					setPackageIsDefault(res.data.isDefault);

					await getPackages(packageEventId);

					setTimeout(() => {
						setErrors([]);
						setLoading(false);
						return setTimeout(close, 500);
					}, 500);
				} else if (res.status === 403) {
					await refreshUser(router);
					// await onSubmit(values);
				} else {
					console.log('Create Package Response Error', res);
					// setErrors([data])
					return setLoading(false);
				}
			} catch (e: any) {
				const { data } = e.response;
				console.log('Create Package Catch Error', data);
				setErrors([data]);
				return setLoading(false);
			}
		}

		// Update Event
		try {
			const res: any = await EventPackageHTTP.updateEventPackage(
				packageEventId,
				viewPackage.id,
				validate.payload,
				accessToken || '',
			);
			if (res.status === 200) {
				setPackageTitle(res.data.title);
				//setPackageType(res.data.type);
				setPackageIsDefault(res.data.isDefault);

				await getPackage(packageEventId);
				setErrors([]);
				setLoading(false);
				setTimeout(close, 500);
			} else if (res.status === 403) {
				await refreshUser(router);
				// await onSubmit(values);
			} else {
				console.log('Update Package Response Error', res);
				// setErrors([data])
				setLoading(false);
			}
		} catch (e) {
			// const { data } = e.response;
			console.log('Update Package Catch Error', e);
			// setErrors([data]);
			setLoading(false);
		}
	};

	const removeError = (type: string) => {
		const hasError = errors.some((x) => x.message.includes(type));
		if (hasError) {
			const newErrors = [...errors].filter((x) => !x.message.includes(type));
			setErrors(newErrors);
		}
	};

	const packageTypes = ['Pay Per View', 'Digital Download'];

	return (
		<>
			{loading ? (
				<div className="loader-container">
					<div className="loader-list">
						<Loader loaderId="circle-eq" />
					</div>
				</div>
			) : (
				<form id="package-form" className="form" onSubmit={onSubmit}>
					<div className="row">
						<div className="flex1 column">
							<Input
								name="title"
								label="Title"
								value={packageTitle}
								placeholder="Package Title"
								onChange={setPackageTitle}
								type="text"
								isComplete={false}
								disabled={false}
							/>
						</div>
					</div>

					<div className="row mobile-column-small pb-15">
						{/*<div className="mr-15">
              <SelectCustom
                name="type"
                label="Type"
                value={packageType}
                onChange={(x: any) => {
                  setPackageType(x);
                  removeError("Type");
                }}
                isComplete={false}
                // error={null}
                disabled={false}
                options={packageTypes}
                showOptions={showTypeOptions}
                setShowOptions={() => setShowTypeOptions(!showTypeOptions)}
              />
            </div>*/}

						<Switch name="switch" label="Is Default?" active={packageIsDefault} onChange={setPackageIsDefault} />
					</div>

					{/* Submit */}
					<button
						className={!formSelectionUpdated ? 'submit-btn mt-15 mb-5 disabled' : 'submit-btn mt-15 mb-5 '}
						type="submit"
						disabled={!formSelectionUpdated}
					>
						Submit
					</button>
				</form>
			)}
		</>
	);
}
