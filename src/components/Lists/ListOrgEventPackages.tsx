import AddIcon from '@icons/AddIcon';
import EventPackageHTTP from '@utilities/http/admin/event-packages';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getCookieValue } from '@/storage/cookies';
import refreshUser from '@/utilities/RefreshUser';
import PackageForm from '../Forms/Packages/PackageForm';
import Loader from '../Loader/Loader';
import Modal from '../Modal/Modal';
import SecondaryTitleBar from '../TitleBar/SecondaryTitleBar';

export default function ListOrgEventPackages(props: any) {
	const router = useRouter();

	const { viewEvent } = props;

	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState([]);

	const [eventPackages, setEventPackages] = useState([]);
	const [viewPackage, setViewPackage] = useState(null);
	const [showModal, setShowModal] = useState(false);

	const openModal = (pkg?: any) => {
		if (pkg) {
			setViewPackage(pkg);
			setShowModal(true);
		} else {
			setViewPackage(null);
			setShowModal(true);
		}
	};

	// ********* Lifecycle ********* //

	useEffect(() => {
		viewEvent ? getEventPackages(viewEvent.id) : null;
	}, []);

	const getEventPackages = async (id: string) => {
		const roleCookie = getCookieValue('role');
		const accessToken = getCookieValue('accessToken');
		const role = roleCookie ? JSON.parse(roleCookie) : null;

		setLoading(true);
		try {
			const res: any = await EventPackageHTTP.getEventPackages(id, accessToken || '');
			if (res.status === 200) {
				// const {packages, totalPackages} = res.data
				setEventPackages(res.data.packages);
				setTimeout(() => setLoading(false), 500);
			} else if (res.status === 403) {
				await refreshUser(router);
				await getEventPackages(id);
			} else {
				console.error('PackageForm - getOrgRoles - Non 200 Response:', res);
				setTimeout(() => setLoading(false), 500);
			}
		} catch (e: any) {
			const { data } = e.response;
			console.error('Error', data);
			setTimeout(() => setLoading(false), 500);
		}
	};

	// ********* Package Actions ********* //

	const routeToPackage = (pkg: any) => {
		router.push(`/admin/event/${viewEvent.id}/package/${pkg.id}`);
	};

	return (
		<div id="list-event-packages">
			<SecondaryTitleBar
				leftIcon={null}
				leftAction={undefined}
				title="Packages"
				rightIcon={<AddIcon className="add-icon" />}
				rightAction={() => openModal()}
			/>

			{loading ? (
				<div className="loader-sub">
					<div className="loader-box">
						<Loader loaderId="colored-dots" />
					</div>
				</div>
			) : (
				<ul>
					{eventPackages.map((pkg) => {
						const {
							id,
							title,
							isDefault,
							priceAttendees,
							priceNonAttendees,
							totalImages,
							totalVideoDuration,
							totalVideos,
							type,
						} = pkg;

						return (
							<li
								key={id}
								onClick={() => routeToPackage(pkg)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										routeToPackage(pkg);
									}
								}}
							>
								<div className="primary">
									<p className="title">{title}</p>
									<p className="prices">
										{priceAttendees} / {priceNonAttendees}
									</p>
								</div>
								<div className="secondary">
									<div className="totals">
										<span>Images:</span> {totalImages}
									</div>
									<div className="totals">
										<span>Video:</span> {totalVideos}
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			)}

			{/* For New Packages */}
			<Modal show={showModal} close={() => setShowModal(false)} id="edit-package-modal" size="Extra Small">
				<PackageForm
					viewEvent={viewEvent}
					viewPackage={viewPackage}
					getPackages={getEventPackages}
					close={() => setShowModal(false)}
					getPackage={async (val: string) => {
						// getPackage(viewPackage.id);
						await new Promise((resolve) => {
							return resolve(true);
						});
					}}
				/>
			</Modal>
		</div>
	);
}
