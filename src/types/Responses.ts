export const errResps = {
	400: {
		code: 400,
		desc: "Bad Request",
	},
	415: {
		code: 415,
		desc: "Unsupported Media Type",
	},
	404: {
		code: 404,
		desc: "Endpoint Not Found",
	},
	401: {
		code: 401,
		desc: "Unauthorized",
	},
	405: {
		code: 405,
		desc: "Method Not Allowed",
	},
	500: {
		code: 500,
		desc: "An Error Occurred",
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
	[C in ErrResponseCode]: ErrResps[C];
};

export type ErrResp<C extends keyof ErrRespsDev> = ErrRespsDev[C];
export type OkResp<C extends keyof OkResps = never> = OkResps[C];
