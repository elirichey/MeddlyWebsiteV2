import DocumentHeader from '@components/Documents/DocumentHeader';
import TroubleshootingList from '@components/Troubleshooting/TroubleshootingList';
import PrimaryLayout from '@layout/PrimaryLayout';
import '@styles/globals.sass';

export default function TroubleshootingAndroid() {
	return (
		<PrimaryLayout>
			<main id="help" className="column">
				<div className="header">
					<DocumentHeader
						title="Troubleshooting Android"
						secondaryTitle="Troubleshoot iOS"
						secondaryUrl="/docs/devices/troubleshooting-ios"
						size="Small"
					/>
				</div>

				<div className="body bg-light">
					<div className="container-sm">
						<div className="content">
							<div className="page-intro mb-30">
								<p>
									Welcome to our Android Troubleshooting page, designed to assist you in resolving any issues you may
									encounter while using our mobile application on Android devices. Whether you're facing app crashes,
									performance concerns, or connectivity issues, we've compiled a comprehensive guide to help you
									navigate through common challenges and get back to enjoying a seamless experience on your Android
									device. Explore the solutions below to troubleshoot and optimize your app functionality.
								</p>
							</div>

							<TroubleshootingList os="Android" />
						</div>
					</div>
				</div>
			</main>
		</PrimaryLayout>
	);
}
