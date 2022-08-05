import { createCipheriv } from "crypto";
import { readFileSync, writeFileSync } from "fs";
import { fetch } from "undici";
import { ICredential, IDownloadLink, IEpisode, ISearch } from "./types";

const powderCache = {
	powder: "",
	lastUpdate: 0,
};

export const generatePowder = () => {
	if (
		powderCache.powder.length > 0 &&
		Date.now() - powderCache.lastUpdate < 1000 * 60 * 30
	) {
		console.log("Using cached powder", powderCache.powder);
		return powderCache.powder;
	}

	const getTime = () => `::${(Date.now() / 1000).toFixed(0)}`;

	const pad = (str: string) => {
		var length = 16 - (str.length % 16);
		for (var i = 0; i < length; i++) {
			str += " ";
		}
		return str;
	};
	const iv = Buffer.from("Wm1OaU5UUmtOR016", "utf-8");
	const secretKey = Buffer.from("TURjd016RmtZMlk9", "utf-8");
	const cipher = createCipheriv("aes-128-cbc", secretKey, iv);
	const powder = cipher.update(pad(getTime()), "utf-8", "hex");
	console.log("new powder", powder);
	powderCache.powder = powder;
	powderCache.lastUpdate = Date.now();
	return powder;
};

export const drakorHeaders = {
	"Cache-Control": "max-age=0",
	"Data-Agent": "Drakor.id+ Engine",
	"Accept-Encoding": "gzip, deflate",
	"User-Agent": "okhttp/3.12.12",
};
export const getCredentials = async (email: string, password?: string) => {
	const data = readFileSync("data.json", "utf8");
	const credentials = JSON.parse(data) as ICredential[];
	let credential = credentials.find((c) => c.data.email === email);
	if (credential) {
		console.log("Returning credential from cache");
		return credential;
	} else {
		console.log(
			"Credentials with email " + email + " not found, trying to login..."
		);
	}
	if (!password) {
		throw new Error("Password is required");
	}

	const loginOpt = {
		url:
			"https://rw1.drakor.id:443/login.php?version=3.6&key=941301bfce8fb05c314761ec7715a00e&hs=09fa00215116bd4884c4520cd27939ee&email=" +
			email +
			"&password=" +
			password,
		headers: drakorHeaders,
		method: "GET",
	};
	console.log('url', loginOpt.url);
	const response = await fetch(loginOpt.url, {
		headers: loginOpt.headers,
		method: loginOpt.method,
	});
	credential = ((await response.json()) as any).data as ICredential;
	if (response.status === 200) {
		if (credential && credential.status === 1) {
			credentials.push(credential);
			writeFileSync("data.json", JSON.stringify(credentials));
		} else {
			throw new Error("Something went wrong");
		}
	} else {
		throw new Error(
			`Something went wrong with status ${response.status}, ${response.statusText}`
		);
	}
	return credential;
};
// var searchOpt = {
//     url: "https://rw1.drakor.id:443/m_by_search.php?version=3.6&key=941301bfce8fb05c314761ec7715a00e&hs=09fa00215116bd4884c4520cd27939ee&page=1&q=running%20man&limit=10&tipe=1&order=1",
//     headers: searchHeaders,
//     method: "GET",
// }
export const searchDrakor = async (query: string) => {
	console.log("searching for " + query);
	const url =
		"https://rw1.drakor.id:443/m_by_search.php?version=3.6&key=941301bfce8fb05c314761ec7715a00e&hs=09fa00215116bd4884c4520cd27939ee&page=1&q=" +
		query +
		"&limit=10&tipe=1&order=1";
	console.log("url", url);
	const response = await fetch(url, {
		headers: drakorHeaders,
		method: "GET",
	});
	if (response.status !== 200)
		throw new Error(
			`Something went wrong with status ${response.status}, ${response.statusText}`
		);
	const json = await response.json();
	return (json as any).data as ISearch[];
};

export const getEpisodes = async (showId: string) => {
	console.log("getEpisodes", showId);
	var getEpisodesHeader = {
		"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
		"User-Agent":
			"Dalvik/2.1.0 (Linux; U; Android 12; M2102J20SG Build/SQ3A.220705.003.A1)",
		// 'Connection': "Keep-Alive",
		"Accept-Encoding": "gzip, deflate",
		// "Content-Length": "40",
		// 'Cookie': drakoridCookie
	};
	const url = `https://rw1.drakor.id:443/get_episodes.php?key=941301bfce8fb05c314761ec7715a00e&id=${showId}`;
	console.log("url", url);
	
	const response = await fetch(url, {
		headers: getEpisodesHeader,
		method: "GET",
	});
	if (response.status !== 200)
		throw new Error(
			`Something went wrong with status ${response.status}, ${response.statusText}`
		);
	const json = await response.json();
	return (json as any).data as IEpisode[];
};

export const getDownloadLinks = async (showId: string, streamingId: string) => {
	console.log("getDownloadLinks", showId, streamingId);
	const url = `https://rw1.drakor.id:443/generate_link_download_ep.php?key=941301bfce8fb05c314761ec7715a00e&id=${streamingId}&ep=28&aid=${showId}&premium=yes`;
	console.log("url", url);
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			"User-Agent":
				"Dalvik/2.1.0 (Linux; U; Android 12; M2102J20SG Build/SQ3A.220705.003.A1)",
			// 'Connection': "Keep-Alive",
			"Accept-Encoding": "gzip, deflate",
			// "Content-Length": "40",
			// 'Cookie': drakoridCookie
		},
		body: `powder=${generatePowder()}`,
	});
	if (response.status !== 200) {
		throw new Error(
			`Something went wrong with status ${response.status}, ${response.statusText}`
		);
	}

	const json = await response.json();
	return json as IDownloadLink;
};

//curl -s 'http://rw1.drakor.id/generate_link_cdn.php?tipe=download&key=941301bfce8fb05c314761ec7715a00e&id=42453&premium=yes' -b 'PHPSESSID=v3pknhfctu22feg70igvjuq4k5' -X POST -H "Content-Type: application/x-www-form-urlencoded" --data-binary 'powder=22602f47c5ea7679cbd6f78a3c7eef43'
export const getFastDownliadLinks = async (streamingId: string) => {
	console.log("getFastDownliadLinks", streamingId);
	const url = `https://rw1.drakor.id:443/generate_link_cdn.php?tipe=download&key=941301bfce8fb05c314761ec7715a00e&id=${streamingId}&premium=yes`;
	console.log("url", url);
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: `powder=${generatePowder()}`,
	});

	if (response.status !== 200) {
		throw new Error(
			`Something went wrong with status ${response.status}, ${response.statusText}`
		);
	}
	const json = await response.json();
	return json as IDownloadLink;
};

// var burp0_bodyString = "powder=4e966fc7f512f53871ea8b04176240e3&"

// var burp0_headers = {
//     "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
//     "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 12; M2102J20SG Build/SQ3A.220705.003.A1)",
//     "Connection": "Keep-Alive",
//     "Accept-Encoding": "gzip, deflate",
//     "Content-Length": "40",
//     'Cookie': burp0_cookie
// }

// var burp0_options = {
//     url: "https://rw1.drakor.id:443/get_data_episode.php?key=941301bfce8fb05c314761ec7715a00e&id=3453&episode_number=1&premium=yes",
//     headers: burp0_headers,
//     method: "post",
//     body: burp0_bodyString
// }
// request(burp0_options, function (error, response, body) {
// console.log('statusCode:', response && response.statusCode)
// console.log('error: ', error)
// console.log('body: ', body)
// })

export const getStreamingId = async (showId: string, episodeNumber: string) => {
	console.log("getEpisodeData", showId, episodeNumber);
	const url = `https://rw1.drakor.id:443/get_data_episode.php?key=941301bfce8fb05c314761ec7715a00e&id=${showId}&episode_number=${episodeNumber}&premium=yes`;
	console.log("url", url);
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			"User-Agent":
				"Dalvik/2.1.0 (Linux; U; Android 12; M2102J20SG Build/SQ3A.220705.003.A1)",
			// 'Connection': "Keep-Alive",
			"Accept-Encoding": "gzip, deflate",
			// "Content-Length": "40",
			// 'Cookie': drakoridCookie
		},
		body: `powder=${generatePowder()}`,
	});
	if (response.status !== 200) {
		throw new Error(
			`Something went wrong with status ${response.status}, ${response.statusText}`
		);
	}

	const json = await response.json();
	return (json as any).streaming as string;
};