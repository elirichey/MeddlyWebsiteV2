export const formatSecondsToTime = (time: number) => {
	const hrs = Math.floor(time / 3600);
	const mins = Math.floor((time % 3600) / 60);
	const secs = Math.floor(time % 60);
	const ms = time.toString().split('.')[1];

	const hours = hrs === 0 ? '' : `${hrs}:`;
	const minutes = mins === 0 ? '00:' : `${mins > 9 ? mins : `0${mins}`}:`;
	const seconds = secs === 0 ? '00' : `${secs > 9 ? secs : `0${secs}`}`;

	return hours + minutes + seconds;
};
