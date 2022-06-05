import { errResps, okResps } from "./types/Responses";

import type { ResponseError, ErrResps, OkResps } from "./types/Responses";
import type { ValueOf } from "@inrixia/helpers/ts";

// We support the GET, POST, HEAD, and OPTIONS methods from any origin,
// and accept the Content-Type header on requests. These headers must be
// present on all responses to all CORS requests. In practice, this means
// all responses to OPTIONS or POST requests.
export const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET,OPTIONS,POST,DELETE,PUT",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
	"Access-Control-Allow-Credentials": "true",
};

export const responses = {
	...errResps,
	...okResps,
};

type EnvInterface = { dev?: string };

type ErrRespBody = ValueOf<ErrResps>;
type OkRespBody = ValueOf<OkResps>;
export function genericResponse<T extends OkRespBody = OkRespBody>(status: T["code"], env?: EnvInterface): Response;
export function genericResponse<T extends ErrRespBody = ErrRespBody>(status: T["code"], env?: EnvInterface, err?: Error): Response;
export function genericResponse<T extends OkRespBody | ErrRespBody = OkRespBody | ErrRespBody>(status: T["code"], env?: EnvInterface, err?: Error): Response {
	let respDetails: ResponseError = {};
	if (err !== undefined) {
		respDetails.err = err.message;
		// if (env?.ENVIRONMENT === "dev")
		if (err.stack) respDetails.stack = err.stack.toString();
	}
	const response = {
		...responses[status as keyof (ErrResps & OkResps)],
		...respDetails,
	};
	const headers = {
		...corsHeaders,
		"Content-Type": "application/json",
	};
	return new Response(JSON.stringify(response), { status: status, headers });
}

export const jsonResponse = <T = unknown>(o: T, init?: ResponseInit & { headers?: Record<string, string> }): Response => {
	if (o === undefined) throw new Error("Attempted to respond with object of type undefined");
	init ??= {};
	init.headers ??= {};
	init.headers["Content-Type"] = "application/json";
	return new Response(JSON.stringify(o), { ...init });
};

export const patchResponse = (response: Response) => {
	for (const header of Object.entries(corsHeaders)) response.headers.set(header[0], header[1]);
	return response;
};

export const OPTIONS = (request: Request) => {
	if (
		request.headers.get("Origin") !== null &&
		request.headers.get("Access-Control-Request-Method") !== null &&
		request.headers.get("Access-Control-Request-Headers") !== null
	) {
		// Handle CORS pre-flight request.
		return new Response(null, {
			headers: corsHeaders,
		});
	} else {
		// Handle standard OPTIONS request.
		return new Response(null, {
			headers: {
				Allow: corsHeaders["Access-Control-Allow-Methods"],
			},
		});
	}
};
