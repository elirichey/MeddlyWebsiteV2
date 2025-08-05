import type { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

export default function MenuBar(props: Props) {
	const { children } = props;
	return <div id="events-menu-bar">{children}</div>;
}
