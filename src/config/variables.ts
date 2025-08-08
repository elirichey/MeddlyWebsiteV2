interface TimeoutObj {
	auth: number;
	toast: number;
	api: number;

	short: number;
	cameraEvents: number;
	fetch: number;
	medium: number;
	long: number;
	xlong: number;
}

export const timeout: TimeoutObj = {
	auth: 500,
	toast: 3000,
	api: 1000,

	short: 320,
	cameraEvents: 690,
	fetch: 500,
	medium: 1800,
	long: 2560,
	xlong: 4300,
};
