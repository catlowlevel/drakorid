import { getDownloadLink, getEpisodes, search } from "./api.js";

const inputQuery = document.querySelector('#textQuery');
const btnSearch = document.querySelector("#searchBtn");
const listResult = document.querySelector("#resultList");

async function handleDownloadLink(showId, epsNumber) {
    const downloadList = document.querySelector(`.download${showId}${epsNumber}`)
    try {

        downloadList.innerHTML = "Loading...";
        const data = await getDownloadLink(showId, epsNumber);

        // 360p: "http://vod28.drakor.id/download/sk4.drakor.id/f26081b1726f3cdf63c82b989c3e05414cf06dd299e97d20192c6453ad2624176febdb27702cab704d86fbde40e1707f7c8274c135060dca0b499ac5009836a181d456f2d3064e3f138eec87aef90f50e7b3ba52c8d7e8497270100574c427897fab1866d05cb56b461927f85c70f6c7cc675905bdb7f0f79b6bff52df7300f6a6c9c3944c78db6e889738bed7f071e57d44ab9efda86c29d78470a4a6d81f87/drakor.id.360p.farewell-vivian-2022-episode-1.mp4"
        // 360p_size: "96.2 MB"
        // 480p: "http://vod28.drakor.id/download/sk4.drakor.id/7be8d1ffd99481531404374eccfe2ccdd077376dd1279b2413f8e9c7cc177d92b665e69c949f3ed47011b2444d58ee058178fd0f9d7daea22a016cdd1c40baa01a19f5e15535d71d87c777b4fa43739eb6a597bf51eec52fec03b2a980d829600339b23c549d34bf840697350aac55ad283d975e9ee062fb67d46190b0d2ffb21b6802505179adfde83c9e5609d1da999dc4dbb19277c097af344971f3439d93/drakor.id.480p.farewell-vivian-2022-episode-1.mp4"
        // 480p_size: "130. MB"
        // 720p: "http://vod28.drakor.id/download/sk4.drakor.id/4092c04589b60aa913b03dd2a68c1ccd8726a452b588f6183a0c69c4d8371df9a0a3f7cc0e88dcb9597ef65fc26d895f074d30e4a86c2e68d38c4a502a8b03e90dc753c80ba52706e512fe23f3aa15cbe37aa76d2828fbefd8ea2aefdcb28dea0bb8ba76b30604d7ab4fc6472e0a65ab3ecb8b232e7c567a305b18d91bf912a794b6d21140682b380f2a211652dea692e43620f5b3b252266398b5e673a33888/drakor.id.720p.farewell-vivian-2022-episode-1.mp4"
        // 720p_size: "382. MB"
        downloadList.innerHTML = "";
        const res = ["360p", "480p", "720p"];
        res.forEach(res => {
            const li = document.createElement("li");
            li.innerHTML = `
        <a href="${data[res]}" download>${res} (${data[res + "_size"]})</a>
        `
            downloadList.appendChild(li);
        })
    } catch (error) {
        downloadList.innerHTML = "Error";
        setTimeout(() => downloadList.innerHTML = "", 1000)
    }
}

async function handleGetEpisodes(showId) {
    const ulEps = document.querySelector(`.showId${showId}`);
    ulEps.innerHTML = "Loading...";
    try {
        const data = await getEpisodes(showId);
        ulEps.innerHTML = "";
        data.forEach(episode => {
            const li = document.createElement("li");
            li.innerHTML = `
            <input type="button" value="${episode.episode_name}">
            <ul id="downloadList" class="download${showId}${episode.episode_number}"></ul>
            `
            ulEps.appendChild(li);
            const button = li.children[0];
            button.addEventListener("click", () => handleDownloadLink(showId, episode.episode_number));
        })
    } catch (error) {
        ulEps.innerHTML = "Error";
        setTimeout(() => ulEps.innerHTML = "", 1000)
    }
}


btnSearch.addEventListener("click", async () => {
    const query = inputQuery.value;
    const result = await search(query);
    listResult.innerHTML = "";
    result.forEach(item => {
        // category: "2022,Drama Korea,Law,mystery,Thriller"
        // date: "2022-07-27"
        // hits: "56.6K"
        // id: "3453"
        // image: "https://image-drakor.b-cdn.net/img/2022/07/938-big-mouth-01.jpg"
        // jumlah_favorit: "-"
        // link: "big-mouth-2022"
        // shoot: "3453"
        // time: "12:20:00"
        // tipe: "2"
        // title: "Big Mouth (2022)"
        // title_eps: "Big Mouth (2022)"
        const li = document.createElement("li");
        li.innerHTML = `
            <input type="button" value="${item.title}">
            <ul id="epsList" class="showId${item.id}"></ul>
       `
        listResult.appendChild(li);
        const button = li.children[0];
        button.addEventListener("click", () => handleGetEpisodes(item.id));
    })
})