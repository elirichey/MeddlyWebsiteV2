import { ToastContainer } from 'react-toastify';
import HeaderLogo from './components/HeaderLogo';

export default function MinimalHeader() {
	return (
		<section id="header" className="flex1 column no-border">
			<div id="header-body">
				<div className="container row centered">
					<HeaderLogo />
				</div>
			</div>

			<div className="toast-container">
				<ToastContainer
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
			</div>
		</section>
	);
}
