const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type FetchType = typeof fetch;

type RateLimitType = {
	global: boolean;
	message: string;
	retry_after: number;
};

export const fetchWithTimeout = async (...args: Parameters<FetchType>): ReturnType<FetchType> => {
	const response = await fetch(...args);
	const clonedResponse = response.clone();
	try {
		const { retry_after } = await clonedResponse.json<RateLimitType>();
		if (retry_after !== undefined) {
			await sleep(retry_after * 1000);
			return fetchWithTimeout(...args);
		}
		return response;
	} catch (err) {
		const { message, stack } = <Error>err;
		throw new Error(`${message}\n${stack}\nResponseBody: ${await clonedResponse.text()}`);
	}
};
