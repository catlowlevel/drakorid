import type { IDownloadLink, IEpisode, ISearch } from "./types";

export const search = async (query: string) => {
	console.log("search", query);

	const response = await fetch("/api/v1/search", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ query }),
	});
	if (response.status !== 200) {
		throw new Error(`Error while searching for ${query}`);
	}
	const data = (await response.json()) as ISearch[];
	return data;
};

export const getEpisodes = async (showId: string) => {
	console.log("getEpisodes", showId);

	const response = await fetch("/api/v1/episodes", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ showId }),
	});
	if (response.status !== 200) {
		throw new Error(`Error while getting episodes for ${showId}`);
	}
	const data = (await response.json()) as IEpisode[];
	return data;
};

export const getDownloadLinks = async (showId: string, epsNumber: string) => {
	console.log("getDownloadLinks", showId, epsNumber);

	const response = await fetch("/api/v1/download", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ showId, epsNumber }),
	});
	if (response.status !== 200) {
		throw new Error(
			`Error while getting download links for ${showId} ${epsNumber}`
		);
	}
	const data = (await response.json()) as IDownloadLink;
	return data;
};
