'use client';

import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { parse } from 'node-html-parser';

interface Props {
	id?: string;
	data: any;
}

export default function RichText({ id, data }: Props) {
	const docString = documentToHtmlString(data);
	const doc = parse(docString);

	return <div id={id ? id : undefined} dangerouslySetInnerHTML={{ __html: doc }} />;
}
