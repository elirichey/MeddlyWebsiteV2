'use client';

import { createClient } from 'contentful';
import { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import FaqListItem from './TroubleshootingListItem';

interface Props {
	os: string;
}

export default function TroubleshootingList(props: Props) {
	const { os } = props;
	const [loading, setLoading] = useState(false);
	const [listItems, setListItems] = useState([]);

	const getHelp = async () => {
		const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '';
		const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || '';
		const content_type = 'troubleshootListItem';
		const client = createClient({ space, accessToken });
		setLoading(true);
		const res: any = await client.getEntries({ content_type });
		setTimeout(() => {
			setLoading(false);
			setListItems(res.items);
		}, 750);
	};

	useEffect(() => {
		const controller = new AbortController();
		getHelp();
		return () => controller.abort();
	}, []);

	const ios = listItems.filter((x: any) => x.fields.category === 'iOS');
	const android = listItems.filter((x: any) => x.fields.category === 'Android');
	const both = listItems.filter((x: any) => x.fields.category === 'Both');

	let selection = ios.concat(both);
	if (os === 'Android') selection = android.concat(both);

	return (
		<div id="help-list" className={loading ? 'pt-60' : undefined}>
			{loading ? (
				<div className="loader-sub">
					<div className="loader-box">
						<Loader loaderId="colored-dots" />
					</div>
				</div>
			) : (
				<div className="flex1 column">
					<ul>
						{selection.length > 0
							? selection.map((item: any, index: number) => {
									const { issue, solution } = item.fields;
									return (
										<li key={issue}>
											<FaqListItem issue={issue} solution={solution} index={index} />
										</li>
									);
								})
							: 'No items found.'}
					</ul>
				</div>
			)}
		</div>
	);
}
