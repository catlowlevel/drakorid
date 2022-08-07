<script lang="ts">
	import { search } from "../utils/api";

	import type { ISearch } from "../utils/types";

	import PostContainer from "../lib/shared/PostContainer.svelte";
	let query = "";
	let posts: ISearch[] = [];
	const doSearch = async () => {
		if (query.length <= 0) {
			return;
		}
		posts = await search(query);
		console.log("posts", posts);
	};
</script>

<div class="container">
	<div class="search-box">
		<input
			type="text"
			name="search"
			id="search"
			placeholder="Nama Drakor"
			class="search-input"
			bind:value={query}
		/>
		<input
			type="button"
			value="Cari"
			class="search-button"
			on:click={doSearch}
		/>
	</div>
	<div class="result-box">
		{#each posts as post}
			<PostContainer {post} />
		{/each}
	</div>
</div>

<style>
	:global(body) {
		background-color: #10172e;
		padding: 0px;
		margin: 0px;
	}
	.container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.search-box {
		width: 100%;
		height: 50px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		margin-top: 10px;
	}
	.search-input {
		width: 50%;
		height: 100%;
		border: none;
		border-radius: 5px;
		background-color: #fff;
		padding: 0px 10px;
		font-size: 16px;
		color: #10172e;
		text-align: center;
		margin: 10px;
		border: none;
		outline: none;
	}
	.search-button {
		width: 50px;
		height: 100%;
		border: none;
		border-radius: 5px;
		background-color: #fff;
		font-size: 16px;
		color: #10172e;
	}
	.result-box {
		margin: 10px;
		width: 50%;
		height: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	}
</style>
