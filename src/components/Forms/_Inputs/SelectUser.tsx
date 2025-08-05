import Image from 'next/image';
import type { FullUser } from '@/interfaces/User';
import UserTicket from '../../Tickets/UserTicket';

interface Props {
	name: string;
	label: string;
	user: FullUser;
	isComplete: boolean;
	error?: string;
	disabled?: boolean;
	options: Array<any>;
	showOptions: boolean;
	setShowOptions: (val: boolean) => void;
	setSelected: (val: any) => void;
}

export default function SelectUser(props: Props) {
	const { name, label, options, showOptions, setShowOptions, user, isComplete, setSelected, disabled, error } = props;

	const active_style = showOptions
		? user !== null
			? 'select-input clickable-div mt-5 user open'
			: 'select-input clickable-div mt-5 user open light'
		: user !== null
			? 'select-input clickable-div mt-5 user'
			: 'select-input clickable-div mt-5 user light';

	const inactive_style = showOptions
		? user !== null
			? 'select-input clickable-div mt-5 user open disabled'
			: 'select-input clickable-div mt-5 user open light disabled'
		: user !== null
			? 'select-input clickable-div mt-5 user disabled'
			: 'select-input clickable-div mt-5 user light disabled';

	return (
		<>
			<div className="select-input-container select-user-dropdown">
				<div className={showOptions ? 'input-field relative-index' : 'input-field'}>
					<label htmlFor={name} className="label mb-5">
						{label}

						{isComplete && !error ? (
							<Image src="/svg/checkmark-circle.svg" height={16} width={16} className="field-check" alt="check-icon" />
						) : null}

						{error ? <span className="input-error">{error}</span> : null}
					</label>

					<div
						className={!disabled ? active_style : inactive_style}
						onClick={() => (!disabled ? setShowOptions(!showOptions) : null)}
					>
						<UserTicket user={user}>
							{!disabled ? <span className={showOptions ? 'indicator open' : 'indicator'}>{`«`}</span> : null}
						</UserTicket>
					</div>

					{showOptions ? (
						<div className="list-options user">
							<ul>
								{options.map((item, i) => {
									return (
										<li className={user && user.id === item.user.id ? 'option user active' : 'option user'} key={i}>
											<span
												onClick={() => setSelected(item)}
												className={user && user.id === item.user.id ? 'clickable-div selected' : 'clickable-div'}
											>
												<UserTicket user={item.user} />
											</span>
										</li>
									);
								})}
							</ul>
						</div>
					) : null}
				</div>

				{showOptions ? <span className="select-external-listener" onClick={() => setShowOptions(false)} /> : null}
			</div>
		</>
	);
}
