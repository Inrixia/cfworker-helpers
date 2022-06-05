export const errResps = {
	400: {
		code: 400,
		err: "Bad Request",
	},
	415: {
		code: 415,
		err: "Unsupported Media Type",
	},
	404: {
		code: 404,
		err: "Endpoint Not Found",
	},
	401: {
		code: 401,
		err: "Unauthorized",
	},
	405: {
		code: 405,
		err: "Method Not Allowed",
	},
	500: {
		code: 500,
		err: "An Arror Occurred",
	},
} as const;
export type ErrResps = typeof errResps;

export const okResps = {
	200: {
		code: 200,
		desc: "OK",
	},
	201: {
		code: 201,
		desc: "Created",
	},
	204: {
		code: 204,
		desc: "No Content",
	},
} as const;
export type OkResps = typeof okResps;

export type ResponseError = {
	err?: string;
	stack?: string;
};

export type CachedResponse<T> = (T & { cached: boolean; err?: undefined }) | { err: string };

export type OkResponseCode = keyof OkResps;
export type ErrResponseCode = keyof ErrResps;

type ErrRespsDev = {
	[C in ErrResponseCode]: {
		desc: ErrResps[C]["err"];
		code: C;
	} & ResponseError;
};

export type ErrResp<C extends keyof ErrRespsDev = never> = ErrRespsDev[500] | ErrRespsDev[C];
export type OkResp<C extends keyof OkResps = never> = OkResps[C];
