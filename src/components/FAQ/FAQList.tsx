'use client';

import { createClient } from 'contentful';
import { useCallback, useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import FaqListItem from './FAQListItem';

export default function FAQList() {
	const [loading, setLoading] = useState(false);
	const [listItems, setListItems] = useState([]);

	const getHelp = useCallback(async () => {
		const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '';
		const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || '';
		const content_type = 'faqListItem';
		const client = createClient({ space, accessToken });
		setLoading(true);
		const res: any = await client.getEntries({ content_type });
		setTimeout(() => {
			setLoading(false);
			setListItems(res.items);
		}, 750);
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		getHelp();
		return () => controller.abort();
	}, [getHelp]);

	const general = listItems.filter((x: any) => x.fields.category === 'General');
	const account = listItems.filter((x: any) => x.fields.category === 'Account');
	const production = listItems.filter((x: any) => x.fields.category === 'Production');

	return (
		<div id="help-list" className={loading ? 'pt-60' : undefined}>
			{loading ? (
				<div className="loader-sub">
					<div className="loader-box">
						<Loader loaderId="colored-dots" />
					</div>
				</div>
			) : general.length > 0 ? (
				<div className="column">
					<h3>General</h3>
					<ul>
						{general.map((item: any, index: number) => {
							const { question, answer } = item.fields;
							return (
								<li key={item.id}>
									<FaqListItem question={question} answer={answer} index={index} />
								</li>
							);
						})}
					</ul>

					<hr />

					<h3>Account</h3>
					<ul>
						{account.map((item: any, index: number) => {
							const { question, answer } = item.fields;
							return (
								<li key={item.id}>
									<FaqListItem question={question} answer={answer} index={index} />
								</li>
							);
						})}
					</ul>

					<hr />

					<h3>Production</h3>
					<ul>
						{production.map((item: any, index: number) => {
							const { question, answer } = item.fields;
							return (
								<li key={item.id}>
									<FaqListItem question={question} answer={answer} index={index} />
								</li>
							);
						})}
					</ul>
				</div>
			) : (
				'No items found.'
			)}
		</div>
	);
}
