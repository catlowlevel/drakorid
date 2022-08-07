import Express from "express";
import { getDownloadLinks, getEpisodes, getFastDownliadLinks, getStreamingId, searchDrakor, } from "./api/drakor.js";
import { handler } from "../frontend/build/handler.js";
const app = Express();
app.use(Express.json());
app.use(handler);
app.post("/api/v1/search", async (req, res) => {
    console.log("Request made on /api/v1/search");
    try {
        const { query } = req.body;
        const result = await searchDrakor(query);
        res.json(result);
    }
    catch (error) {
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
    }
    catch (error) {
        console.log("error", error);
        res.status(500).send(error.message);
    }
});
app.post("/api/v1/download", async (req, res) => {
    console.log("Request made on /api/v1/download");
    try {
        const { showId, epsNumber } = req.body;
        const streamingId = await getStreamingId(showId, epsNumber);
        const result = await getDownloadLinks(showId, streamingId);
        res.json(result);
    }
    catch (error) {
        console.log("error", error);
        res.status(500).send(error.message);
    }
});
app.post("/api/v1/fast_download", async (req, res) => {
    console.log("Request made on /fast_download");
    try {
        const { showId, epsNumber } = req.body;
        const streamingId = await getStreamingId(showId, epsNumber);
        const result = await getFastDownliadLinks(streamingId);
        res.json(result);
    }
    catch (error) {
        console.log("error", error);
        res.status(500).send(error.message);
    }
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
