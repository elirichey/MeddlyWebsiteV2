'use client';

import Image from 'next/image';
import { useState } from 'react';
import RichText from '../Renders/RichText';

interface Props {
	question: string;
	answer: any;
	index: number;
}

export default function FaqListItem(props: Props) {
	const [show, setShow] = useState<boolean>(false);

	const { question, answer, index } = props;
	const id = `help-${index}`;
	const dropdownStyle = show ? 'help-dropdown-indicator active' : 'help-dropdown-indicator';

	return (
		<div id={id} className="help-list-item">
			<div
				className={show ? 'row clickable active' : 'row clickable'}
				onClick={() => setShow(!show)}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						setShow(!show);
					}
				}}
			>
				<p className={show ? 'question active' : 'question'}>{question}</p>

				<div className={dropdownStyle}>
					<Image src="/svg/arrow.svg" alt="arrow-icon" width={10} height={10} />
				</div>
			</div>

			{show ? (
				<div className="answer">
					<RichText data={answer} />
				</div>
			) : (
				<></>
			)}
		</div>
	);
}
