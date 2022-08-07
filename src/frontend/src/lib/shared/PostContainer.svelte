<script lang="ts">
	import { goto } from "$app/navigation";

	import type { ISearch } from "src/utils/types";
	export let post: ISearch;
	export let onClick: (post: ISearch) => void = () => {
		console.log(post);
		goto(`/episode/${post.id}`);
	};
</script>

<div class="post-container" on:click={() => onClick(post)}>
	<img
		class="post-image"
		src={`${post.image}?width=100`}
		alt={post.link}
		width="150"
	/>
	<div class="post-title">{post.title}</div>
</div>

<style>
	.post-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 10px;
		padding: 10px;
		border-radius: 5px;
		background-color: #121a31;
		user-select: none;
	}
	/* post container mouse hover */
	.post-container:hover {
		background-color: #161d33;
		cursor: pointer;
	}
	.post-title {
		color: #fff;
		font-size: 16px;
		font-weight: bold;
		margin-top: 10px;
	}
	.post-image {
		border-radius: 5px;
		background-color: #121a31;
	}
</style>
