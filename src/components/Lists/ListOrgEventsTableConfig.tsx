import { formatDateTimeGetTime } from '@utilities/conversions/dates';
import Image from 'next/image';
import EventStatus from '../Badges/EventStatus';

const accessorAvatar = (props: any) => {
	const imgSrc = props?.coverImg ? props.coverImg : '/image/webp/placeholders/no-cover.webp';
	return <Image src={imgSrc} height={64} width={64} alt="img" />;
};

const accessorStatus = (props: any) => {
	return <EventStatus status={props.status} />;
};

const accessorDate = (props: any) => {
	const date = formatDateTimeGetTime(props.dateTime, 'date');
	return <span>{date}</span>;
};

const accessorTime = (props: any) => {
	const date = formatDateTimeGetTime(props.dateTime, 'time');
	return <span>{date}</span>;
};

const accessorCity = (props: any) => {
	const city = props.venue.addressCity;
	return <span>{city}</span>;
};

const accessorManager = (props: any) => {
	const mananger = props.manager ? props.manager.name || props.manager.username : null;
	return <span>{mananger}</span>;
};

const eventsColumns = [
	{
		Header: 'Cover',
		accessor: (props: any) => accessorAvatar(props),
		Cell: (props: any) => props.value,
	},
	{
		Header: 'Status',
		accessor: (props: any) => accessorStatus(props),
		Cell: (props: any) => props.value,
	},
	{
		Header: 'Date',
		accessor: (props: any) => accessorDate(props),
		Cell: (props: any) => props.value,
	},

	{
		Header: 'City',
		accessor: (props: any) => accessorCity(props),
		Cell: (props: any) => props.value,
	},
	{
		Header: 'Title',
		accessor: (props: any) => props.title,
		Cell: (props: any) => props.value,
	},
	{
		Header: 'Manager',
		accessor: (props: any) => accessorManager(props),
		Cell: (props: any) => props.value,
	},

	{
		Header: 'Time',
		accessor: (props: any) => accessorTime(props),
		Cell: (props: any) => props.value,
	},
];

export default eventsColumns;
