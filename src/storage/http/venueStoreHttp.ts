// import Toast from 'react-native-toast-message';
// import { ToastError } from '../../config/toastConfig';
import UserStoreHttp from './userStoreHttp';
import { timeout } from '../../config/variables';
import VenuesHttp from '../../utilities/http/admin/venues';
import { useVenueStore } from '../stores/useVenueStore';
import delay from '../../utilities/helpers/delay';

export async function searchVenues(search: string, retryCount = 0) {
	const { loadingVenues, setSearchVenues, setLoadingVenues, setVenuesError } = useVenueStore.getState();

	const maxRetries = 1;

	if (!loadingVenues) setLoadingVenues(true);
	if (retryCount === 0) setVenuesError(null);

	try {
		const encodedSearch = encodeURIComponent(search);
		const response = await VenuesHttp.searchVenues(encodedSearch);
		if (response.status === 200) {
			setSearchVenues(response.data);
			setLoadingVenues(false);
			return response.data;
		}
		if (response?.message?.includes('403')) {
			if (retryCount < maxRetries) {
				await UserStoreHttp.refreshUser();
				await delay(timeout.auth);
				return searchVenues(search, retryCount + 1);
			}

			await UserStoreHttp.tryLogout();
			setLoadingVenues(false);
			return;
		}

		// Toast.show(ToastError('Oops!', 'Failed to search venues'));
		// console.log('searchVenues: Error 1', { response });
		setLoadingVenues(false);
		return;
	} catch (err) {
		// Toast.show(ToastError('Oops!', 'An unexpected error occurred'));
		// console.log('searchVenues: Error', { err });
		setLoadingVenues(false);
		return;
	}
}

const VenueStoreHttp = {
	searchVenues,
};

export default VenueStoreHttp;
