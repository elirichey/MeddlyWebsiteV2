'use client';

import refreshUser from '@/utilities/RefreshUser';
// import AuthUserHTTP from "@/utilities/http/user/auth";
// import PackageForm from "@components/Forms/Packages/PackageForm";
import ListOrgEventPackageMedia from '@components/Lists/ListOrgEventPackageMedia';
import Loader from '@components/Loader/Loader';
import MenuBar from '@components/MenuBar/MenuBar';
import ChevronLeft from '@icons/ChevronLeft';
import TrashIcon from '@icons/TrashIcon';
import AdminLayout from '@layout/AdminLayout';
import EventPackageHTTP from '@utilities/http/admin/event-packages';
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
	eventId: string;
	packageId: string;
}

export default function Packages(props: Props) {
	const router = useRouter();
	const { eventId, packageId } = props;
	const [loading, setLoading] = useState<boolean>(false);
	const [viewPackage, setViewPackage] = useState<any>(null);

	// ********* Lifecycle ********* //

	useEffect(() => {
		const controller = new AbortController();
		getEventPackage();
		return () => controller.abort();
	}, []);

	const getEventPackage = async () => {
		const roleCookie = await getCookie('currentRole');
		const currentRole = roleCookie ? JSON.parse(roleCookie) : null;

		setLoading(true);
		try {
			const res: any = await EventPackageHTTP.getEventPackage({ eventId, packageId });
			if (res.status === 200) {
				setViewPackage(res.data);
				setTimeout(() => setLoading(false), 750);
			} else if (res.status === 403) {
				await refreshUser(router);
				await getEventPackage();
			} else {
				console.log('GetPackage - getOrgRoles - Non 200 Response:', res);
				setTimeout(() => setLoading(false), 750);
			}
		} catch (e: any) {
			const { data } = e.response;
			console.log('GetPackage Catch Error', data);
			setTimeout(() => setLoading(false), 750);
		}
	};

	// ********* Actions ********* //

	const goBack = () => router.back();

	const deletePackage = async () => {
		const confirmDelete = confirm(`Are you sure you want to delete ${viewPackage.title}`);

		if (confirmDelete) {
			setLoading(true);
			try {
				const res: any = await EventPackageHTTP.deleteEventPackage({ eventId, packageId });
				if (res.status === 200) {
					goBack();
				} else if (res.status === 403) {
					await refreshUser(router);
					await deletePackage();
				} else {
					console.log('Delete Package Response Error', res);
					// setErrors([data])
					return setLoading(false);
				}
			} catch (e: any) {
				const { data } = e.response;
				console.log('Delete Package Catch Error', data);
				// setErrors([data]);
				return setLoading(false);
			}
		}
	};

	return (
		<AdminLayout>
			<main id="admin" className="admin-package">
			<MenuBar>
				<button className="menu-bar-go-back" onClick={goBack} onKeyDown={goBack} type="button">
					<ChevronLeft className="back-icon" />
					<span>Back</span>
				</button>

				<div className="flex1 flex" />

				{viewPackage ? (
					<div className="menu-bar-delete-item">
						<button onClick={deletePackage} type="button">
							<TrashIcon className="delete-icon" />
							<span>Delete</span>
						</button>
					</div>
				) : null}
			</MenuBar>

			{loading ? (
				<div className="loader-container">
					<div className="loader-list">
						<Loader loaderId="circle-eq" />
					</div>
				</div>
			) : (
				<div id="package-overview-container" className="overview-body">
					{/*<div id="package-form-container">
            <PackageForm
              viewEvent={{ id: eventId }}
              viewPackage={viewPackage}
              getPackage={getEventPackage}
              getPackages={async () => router.reload()}
              close={() => alert("PACKAGE_FORM_CLOSE")}
            />
          </div>*/}

					<div id="package-media-container">
						<ListOrgEventPackageMedia eventId={eventId} packageId={packageId} viewPackage={viewPackage} />
					</div>
				</div>
			)}
			</main>
		</AdminLayout>
	);
}
