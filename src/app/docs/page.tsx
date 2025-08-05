import DocumentHeader from '@components/Documents/DocumentHeader';
import CalendarOutline from '@icons/CalendarOutline';
import OSAndroid from '@icons/OSAndroid';
import OSiOS from '@icons/OSiOS';
import PrimaryLayout from '@layout/PrimaryLayout';
import Link from 'next/link';
import '@styles/globals.sass';

export default function DocumentationOverview() {
	return (
		<PrimaryLayout>
			<main id="documentation-overview" className="column">
				<div className="header">
					<DocumentHeader title="Documentation" />
				</div>

				<div className="body bg-light">
					<div className="container-xmd">
						<div className="content">
							<h3>The Basics</h3>

							<ul>
								<li>
									<Link href="/docs/onboarding/getting-started">
										<span className="icon-container">
											<CalendarOutline className="icon" />
											<span className="number">1</span>
										</span>
										<span className="title">Getting Started</span>
									</Link>
								</li>

								<li>
									<Link href="/docs/onboarding/organizations">
										<span className="icon-container">
											<CalendarOutline className="icon" />
											<span className="number">2</span>
										</span>
										<span className="title">Organizations</span>
									</Link>
								</li>

								<li>
									<Link href="/docs/onboarding/creating-events">
										<span className="icon-container">
											<CalendarOutline className="icon" />
											<span className="number">3</span>
										</span>
										<span className="title">Creating Events</span>
									</Link>
								</li>

								<li>
									<Link href="/docs/onboarding/recording-events">
										<span className="icon-container">
											<CalendarOutline className="icon" />
											<span className="number">4</span>
										</span>
										<span className="title">Recording Events</span>
									</Link>
								</li>

								<li>
									<Link href="/docs/onboarding/edit-and-generate">
										<span className="icon-container">
											<CalendarOutline className="icon" />
											<span className="number">5</span>
										</span>
										<span className="title">Edit Media</span>
									</Link>
								</li>

								<li>
									<Link href="/docs/onboarding/edit-and-generate">
										<span className="icon-container">
											<CalendarOutline className="icon" />
											<span className="number">6</span>
										</span>
										<span className="title">Generate Sequences</span>
									</Link>
								</li>

								{/* <li>
                <Link href="/docs/onboarding/packages">
                  <span className="icon-container">
                    <CalendarOutline className="icon" />
                    <span className="number">6</span>
                  </span>
                  <span className="title">Packages</span>
                </Link>
              </li> */}

								{/* <li>
                <Link href="/docs/onboarding/sequences">
                  <span className="icon-container">
                    <CalendarOutline className="icon" />
                    <span className="number">7</span>
                  </span>
                  <span className="title">Sequences</span>
                </Link>
              </li> */}
							</ul>

							<hr />

							<h3>Device Troubleshooting</h3>

							<ul>
								<li>
									<Link href="/docs/devices/troubleshooting-ios">
										<span className="icon-container">
											<OSiOS className="icon os-icon" />
										</span>
										<span className="title">iOS</span>
									</Link>
								</li>
								<li>
									<Link href="/docs/devices/troubleshooting-android">
										<span className="icon-container">
											<OSAndroid className="icon os-icon" />
										</span>
										<span className="title">Android</span>
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</main>
		</PrimaryLayout>
	);
}
