import type { FullUser } from '@interfaces/User';
import Image from 'next/image';
import type { ReactNode } from 'react';

interface Props {
	user: FullUser;
	children?: ReactNode;
}

export default function UserTicket(props: Props) {
	const { user, children } = props;

	if (!user)
		return (
			<>
				<p className="low-opacity-text">( Select User )</p> {children}
			</>
		);

	const image = user?.avatar ? user.avatar : '/image/webp/placeholders/avatar.webp';

	return (
		<div className="user-ticket">
			<div className="avatar">
				<Image src={image} height={40} width={40} alt="avatar" />
			</div>

			<div className="select-user-body">
				{user.name ? <span className="title">{user.name}</span> : null}
				<span className="secondary">{user.email}</span>
			</div>

			{children}
		</div>
	);
}
