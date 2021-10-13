<script context="module">
	export async function load({ page }) {
		const id = page.params.id;
		const tune = await TuneModelFactory.getDoc(id);
		return {
			props: {
				tuneId: id,
				tune
			}
		};
	}
</script>

<script lang="ts">
	import { TuneModelFactory } from '$model/tune';
	import type { TuneModel, RecordModel } from '$model/tune';
	import Fa from 'svelte-fa';
	import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
	import { tick } from 'svelte';
	let player;

	export let tune: TuneModel;
	let selectedRecord: RecordModel | null = null;

	const selectRecord = async (record: RecordModel) => {
		selectedRecord = record;
		await tick();
		player.play();
	};
</script>

<svelte:head>
	<title>{tune.name}</title>
</svelte:head>

<div class="min-w-md justify-center items-center self-center pt-20">
	<div class="max-w-lg mx-auto bg-white rounded p-5 mt-10">
		<h1>録音</h1>
		<audio bind:this={player} controls src={selectedRecord?.src}>
			Your browser does not support the
			<code>audio</code> element.
		</audio>
		{#each tune.records as record (record.id)}
			<div class="flex cursor-pointer bg-blue-100" on:click={() => selectRecord(record)}>
				<Fa icon={faCaretRight} size="lg" />
				{record.createdDatetime}
			</div>
		{/each}
	</div>
</div>
