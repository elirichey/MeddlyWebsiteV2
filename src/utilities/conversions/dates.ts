// Day of Month
export function GetDay(date: string): number {
	const d = Number.parseInt(date);
	const r = new Date(d).getDate();
	return r;
}

// Day of Week
export function GetDayOfWeek(date: string): string {
	const d = Number.parseInt(date);
	const day = new Date(d).getDay();

	const weekday = new Array(7);
	weekday[0] = 'Sunday';
	weekday[1] = 'Monday';
	weekday[2] = 'Tuesday';
	weekday[3] = 'Wednesday';
	weekday[4] = 'Thursday';
	weekday[5] = 'Friday';
	weekday[6] = 'Saturday';

	const r = weekday[day];
	return r;
}

// Month - Full Text
export function GetMonthStr(date: string): string {
	const d = Number.parseInt(date);
	const m = new Date(d);

	const month = new Array();
	month[0] = 'January';
	month[1] = 'February';
	month[2] = 'March';
	month[3] = 'April';
	month[4] = 'May';
	month[5] = 'June';
	month[6] = 'July';
	month[7] = 'August';
	month[8] = 'September';
	month[9] = 'October';
	month[10] = 'November';
	month[11] = 'December';

	const r = month[m.getMonth()];
	return r;
}

// Month - As Number
export function GetMonthStrShort(date: string): number {
	const d = Number.parseInt(date);
	const m = new Date(d);
	const r = m.getMonth() + 1;
	return r;
}

// Year
export function GetFullYear(date: string): number {
	const d = Number.parseInt(date);
	const r = new Date(d).getFullYear();
	return r;
}

// FROM FORMS LIBRARY

export const combineWebDateAndTime = async (date: any, time: any): Promise<Date> => {
	return await new Promise((resolve) => {
		const splitDate = date.split('-');
		const year = splitDate[0];
		const month = splitDate[1] - 1;
		const day = splitDate[2];
		const splitTime = time.split(':');
		const hours = splitTime[0];
		const minutes = splitTime[1];
		const dateTime = new Date();
		dateTime.setFullYear(year);
		dateTime.setMonth(month);
		dateTime.setDate(day);
		dateTime.setHours(hours);
		dateTime.setMinutes(minutes);
		dateTime.setSeconds(0);
		return resolve(dateTime);
	});
};

export const combineMobileDateAndTime = async (date: number, time: number): Promise<number> => {
	return await new Promise((resolve) => {
		const year = new Date(date).getFullYear();
		const month = new Date(date).getMonth();
		const day = new Date(date).getDate();

		const hours = new Date(time).getHours();
		const minutes = new Date(time).getMinutes();

		const dateTime = new Date();
		dateTime.setFullYear(year);
		dateTime.setMonth(month);
		dateTime.setDate(day);
		dateTime.setHours(hours);
		dateTime.setMinutes(minutes);

		const res = new Date(dateTime).getTime();
		return resolve(res);
	});
};

export const getDateMinimum = async (): Promise<string> => {
	return await new Promise((resolve) => {
		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const res = `${year}-${month < 10 ? `0${month}` : month}-${day}`;
		return resolve(res);
	});
};

// Formatting..

export const formatDateTimeGetTime = (value: string, type: string): string => {
	if (value && type === 'date') {
		const newDate = new Date(Number.parseInt(value));
		return formatDate(newDate);
	}
	if (value && type === 'time') {
		const newDate = new Date(Number.parseInt(value));
		return formatTime(newDate);
	}

	const newDate = new Date(Number.parseInt(value));
	const fullDate = formatDate(newDate);
	const fullTime = formatTime(newDate);
	const fullDateTime = `${fullDate} ${fullTime}`;
	return fullDateTime;
};

export const formatDateTimeUTC = (value: string, type: string): string => {
	if (value && type === 'date') {
		const newDate = new Date(value);
		return formatDate(newDate);
	}
	if (value && type === 'time') {
		const newDate = new Date(value);
		return formatTime(newDate);
	}
	if (value && type === 'full') {
		const newDate = new Date(value);
		const fullDate = formatDate(newDate);
		const fullTime = formatTime(newDate);
		const fullDateTime = `${fullDate} ${fullTime}`;
		return fullDateTime;
	}
	return 'Unset';
};

export const formatDate = (date: Date): string => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const fullDate = `${month}/${day}/${year}`;
	return fullDate;
};

export const formatTime = (date: Date): string => {
	const tmpHours = date.getHours();
	const tmpMinutes = date.getMinutes();
	let hoursIndicator: string;
	if (tmpHours >= 12) hoursIndicator = 'PM';
	else hoursIndicator = 'AM';
	const hours = tmpHours > 12 ? tmpHours - 12 : tmpHours === 0 ? 12 : tmpHours;
	const minutes = tmpMinutes < 10 ? `0${tmpMinutes}` : tmpMinutes;
	const fullTime = `${hours}:${minutes} ${hoursIndicator}`;
	return fullTime;
};
export const formatMonthBy12 = (num: number): string | undefined => {
	if (num === 1) return 'January';
	if (num === 2) return 'February';
	if (num === 3) return 'March';
	if (num === 4) return 'April';
	if (num === 5) return 'May';
	if (num === 6) return 'June';
	if (num === 7) return 'July';
	if (num === 8) return 'August';
	if (num === 9) return 'September';
	if (num === 10) return 'October';
	if (num === 11) return 'November';
	if (num === 12) return 'December';
};

export const formatMonthBy12Shorthand = (num: number): string | undefined => {
	if (num === 1) return 'Jan.';
	if (num === 2) return 'Feb.';
	if (num === 3) return 'Mar.';
	if (num === 4) return 'Apr.';
	if (num === 5) return 'May';
	if (num === 6) return 'Jun.';
	if (num === 7) return 'Jul.';
	if (num === 8) return 'Aug.';
	if (num === 9) return 'Sept.';
	if (num === 10) return 'Oct.';
	if (num === 11) return 'Nov.';
	if (num === 12) return 'Dec.';
};

/* export const formatDateForInput = date => {
  let year = 0;
  let month = 0;
  let day = 0;

  if (date) {
    const fDate = new Date(date);
    year = fDate.getFullYear();
    month = fDate.getMonth() + 1;
    day = fDate.getDate();
  } else {
    const fDate = new Date();
    year = fDate.getFullYear();
    month = fDate.getMonth() + 1;
    day = fDate.getDate();
  }

  const dateString = `${formatMonthBy12(month)} ${day}, ${year}`;
  return dateString;
}; */

export const formatDateForInput = (date: number | undefined): string => {
	if (date) {
		const fDate = new Date(date);
		const year = fDate.getFullYear();
		const month = fDate.getMonth() + 1;
		const day = fDate.getDate() + 1;
		return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
	}

	// Set Today's Date
	const fDate = new Date();
	const year = fDate.getFullYear();
	const month = fDate.getMonth() + 1;
	const day = fDate.getDate();
	return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
};

/* export const formatTimeForInput = (date) => {
  let hours = 0;
  let minutes = 0;

  if (date) {
    const fDate = new Date(date);
    const getHours = fDate.getHours();
    const getMinutes = fDate.getMinutes();
    hours = getHours < 10 ? `0${getHours}` : getHours;
    minutes = getMinutes < 10 ? `0${getMinutes}` : getMinutes;
  } else {
    const fDate = new Date();
    const getHours = fDate.getHours();
    const getMinutes = fDate.getMinutes();
    hours = getHours < 10 ? `0${getHours}` : getHours;
    minutes = getMinutes < 10 ? `0${getMinutes}` : getMinutes;
  }

  const formattedHours = hours > 12 ? hours - 12 : hours;
  const isAMorPM = hours > 11 ? "PM" : "AM";

  const timeString = `${formattedHours}:${minutes} ${isAMorPM}`;
  return timeString;
}; */

export const formatTimeForInput = (date: number): string => {
	if (date) {
		const fDate = new Date(date);
		return `${fDate.getHours() < 10 ? `0${fDate.getHours()}` : fDate.getHours()}:${
			fDate.getMinutes() < 10 ? `0${fDate.getMinutes()}` : fDate.getMinutes()
		}`;
	}

	// Set Today's Date
	const fDate = new Date();
	return `${
		fDate.getHours() < 10 ? `0${fDate.getHours()}` : fDate.getHours()
	}:${fDate.getMinutes() < 10 ? `0${fDate.getMinutes()}` : fDate.getMinutes()}`;
};
