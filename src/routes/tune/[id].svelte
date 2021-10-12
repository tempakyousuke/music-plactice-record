<script context="module">
	export async function load({ page }) {
		const tune = await TuneModelFactory.getDoc(page.params.id);
		console.log(tune);
		return {
			props: {
				tuneId: page.params.id,
				tune
			}
		};
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { TuneModelFactory } from '$model/tune';
	import type { TuneModel, RecordModel } from '$model/tune';

	export let tune: TuneModel;
	let selectedRecord: RecordModel | null = null;

	onMount(() => {
		selectedRecord = tune.records[0];
	});
</script>

<svelte:head>
	<title>{tune.name}</title>
</svelte:head>

<div class="min-w-md justify-center items-center self-center pt-20">
	<div class="max-w-lg mx-auto bg-white rounded p-5 mt-10">
		<h1>録音</h1>
		{#if selectedRecord !== null}
			<audio controls src={selectedRecord.src}>
				Your browser does not support the
				<code>audio</code> element.
			</audio>
		{/if}
		{#each tune.records as record (record.id)}
			<div
				on:click={() => {
					selectedRecord = record;
				}}
			>
				{record.createdDatetime}
			</div>
		{/each}
	</div>
</div>
