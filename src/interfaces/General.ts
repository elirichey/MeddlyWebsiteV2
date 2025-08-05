export interface Error {
	type: string;
	message: string;
}

export interface ResponseError {
	status: number;
	errors: Array<Error>;
}
