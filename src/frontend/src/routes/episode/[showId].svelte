<script lang="ts">
	import { page } from "$app/stores";
	import { getDownloadLinks, getEpisodes } from "../../utils/api";
	import type { IDownloadLink, IEpisode } from "../../utils/types";
	import { onMount } from "svelte";
	const showId = $page.params.showId as string;

	let loading = true;
	let epsImg = "";
	let epsStream = "";

	let episodes: IEpisode[] = [];

	let downloadLink: IDownloadLink | undefined;
	const res = ["360p", "480p", "720p"];

	let data: { link: string; quality: string; size: string }[] = [];
	const addData = (link: string, quality: string, size: string) => {
		data = [...data, { link, quality, size }];
		console.log(data);
	};
	$: {
		if (downloadLink) {
			res.forEach((r) => {
				const key = r as keyof typeof downloadLink;
				const link = downloadLink?.[key] ?? "";
				const quality = r;
				const size = downloadLink?.[`${key}_size`] ?? "";
				addData(link, quality, size);
			});
		}
	}

	const doEpisode = async (epsNumber: string) => {
		data = [];
		downloadLink = undefined;
		epsImg = "";
		epsStream = "";
		const episode = await getDownloadLinks(showId, epsNumber);
		epsImg = (episode as any).streamingInfo.img;
		epsStream = (episode as any).streamingInfo.streaming_firebase;
		downloadLink = episode;
		console.log("episode", episode);
	};

	onMount(async () => {
		episodes = await getEpisodes(showId);
		console.log("episodes", episodes);
		loading = false;
	});
</script>

<div class="container">
	{#if loading}
		<div class="loading-container"><div>Loading...</div></div>
	{:else}
		<div class="episode-container">
			{#each episodes as episode}
				<div class="episode" on:click={() => doEpisode(episode.episode_number)}>
					{episode.episode_name}
				</div>
			{/each}
			<!-- Seperator -->
			<div class="seperator" />
			{#if data.length > 0}
				<div class="download-container">
					{#each data as data}
						<a
							class="download-link"
							target="_blank"
							rel="noopener noreferrer"
							href={data.link}
						>
							{data.quality} ({data.size})
						</a>
					{/each}
				</div>
			{/if}
			{#if epsImg.length > 0 && epsStream.length > 0}
				<!-- <a target="_blank" rel="noopener noreferrer" href={epsStream}> -->
				<img src={epsImg} alt="thumb" width="80%" />
				<!-- </a> -->
			{/if}
		</div>
	{/if}
</div>

<style>
	:global(body) {
		background-color: #10172e;
		padding: 0px;
		margin: 0px;
		overflow-x: hidden;
	}
	a {
		display: flex;
		justify-content: center;
		align-items: center;
		text-decoration: none;
	}
	.seperator {
		height: 1px;
		background-color: #fff;
		margin: 10px 0px;
	}
	.container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.episode-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 10px;
	}
	.loading-container {
		display: flex;
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 10px;
		font-size: 3rem;
		color: #616174;
	}
	.episode {
		width: 100%;
		font-size: 20px;
		color: #fff;
		margin-bottom: 10px;
		background-color: #131b33;
		padding: 10px;
		border-radius: 5px;
		text-align: center;
	}
	.episode:hover {
		background-color: #17203a;
		color: #b19b9b;
		cursor: pointer;
	}
	.download-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 10px;
	}
	.download-link {
		width: 100%;
		font-size: 20px;
		color: #fff;
		margin-bottom: 10px;
		background-color: #131b33;
		padding: 10px;
		border-radius: 5px;
		text-align: center;
	}
</style>
