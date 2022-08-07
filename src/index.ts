import Express from "express";
import {
	getDownloadLinks,
	getEpisodes,
	getFastDownliadLinks,
	getStreamingInfo,
	searchDrakor,
} from "./api/drakor.js";
//@ts-ignore
import { handler } from "./frontend/build/handler.js";
const app = Express();

app.use(Express.json());

// app.use(Express.static("public/"));

// app.get("/", (_req, res) => {
// 	res.sendFile(__dirname + "/index.html");
// });

app.post("/api/v1/search", async (req, res) => {
	console.log("Request made on /api/v1/search");
	try {
		const { query } = req.body;
		const result = await searchDrakor(query);
		res.json(result);
	} catch (error) {
		//send error to client
		console.log("error", error);
		res.status(500).send(error.message);
	}
});

app.post("/api/v1/episodes", async (req, res) => {
	console.log("Request made on /api/v1/episodes");
	try {
		const { showId } = req.body;
		const result = await getEpisodes(showId);
		res.json(result);
	} catch (error) {
		//send error to client
		console.log("error", error);
		res.status(500).send(error.message);
	}
});

app.post("/api/v1/download", async (req, res) => {
	console.log("Request made on /api/v1/download");
	try {
		const { showId, epsNumber } = req.body;
		const streamingInfo = (await getStreamingInfo(showId, epsNumber)) as any;
		const result = await getDownloadLinks(showId, streamingInfo.streaming);
		res.json({ ...result, streamingInfo: { ...streamingInfo } });
	} catch (error) {
		//send error to client
		console.log("error", error);
		res.status(500).send(error.message);
	}
});

app.post("/api/v1/fast_download", async (req, res) => {
	console.log("Request made on /fast_download");
	try {
		const { showId, epsNumber } = req.body;
		const streamingInfo = (await getStreamingInfo(showId, epsNumber)) as any;
		const result = await getFastDownliadLinks(streamingInfo.streaming);
		res.json({ ...result, streamingInfo: { ...streamingInfo } });
	} catch (error) {
		//send error to client
		console.log("error", error);
		res.status(500).send(error.message);
	}
});
app.use(handler);

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});

// import { getDownloadLinks, getStreamingId, getEpisodes, getFastDownliadLinks, searchDrakor } from "./api/drakor";

// (async () => {
// 	// const credentials = await getCredentials("abdtalib33@gmail.com");

// 	const results = await searchDrakor("big mouth");
// 	results.forEach((result) => {
// 		console.log(result.title, "| id =>", result.id);
// 	});

// 	const episodes = await getEpisodes("3453");
// 	episodes.forEach((eps) => {
// 		console.log(eps.episode_name, "| id =>", eps.episode_id, "| number =>", eps.episode_number);
// 	});
// 	const streamingId = await getStreamingId("3453", "1");

// 	const links = await getFastDownliadLinks(streamingId);
// 	console.log('links["720p"]', links["720p"])
// })();
