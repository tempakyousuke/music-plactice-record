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
	import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
	import { tick } from 'svelte';
	let player;
	let paused = true;

	export let tune: TuneModel;
	let selectedRecord: RecordModel | null = null;

	const selectRecord = async (record: RecordModel) => {
		if (selectedRecord?.id !== record.id) {
			selectedRecord = record;
			await tick();
			player.play();
		} else {
			if (player.paused) {
				player.play();
			} else {
				player.pause();
			}
		}
		updatePaused();
	};

	const updatePaused = () => {
		paused = player.paused;
	};
</script>

<svelte:head>
	<title>{tune.name}</title>
</svelte:head>

<div class="min-w-md justify-center items-center self-center pt-10">
	<div class="max-w-lg ml-3 lg:ml-20 py-5 ">
		<h1 class="text-3xl whitespace-pre-wrap sm:whitespace-normal">
			{tune.name}
			{'\n'}
			{#if tune.sessionLink}
				<a
					class="ml-2 rounded-2xl hover:bg-gray-300 p-2 px-4 bg-gray-200 text-sm"
					href={tune.sessionLink}
				>
					view the session page
				</a>
			{/if}
		</h1>
		<audio
			class="mt-5 bg-white"
			bind:this={player}
			controls
			src={selectedRecord?.src}
			on:pause={updatePaused}
			on:play={updatePaused}
		>
			Your browser does not support the
			<code>audio</code> element.
		</audio>
	</div>
	{#each tune.records as record (record.id)}
		<div class="cursor-pointer hover:bg-blue-200 py-5" on:click={() => selectRecord(record)}>
			<div class="mx-20 flex">
				<div class="rounded-3xl bg-gray-100 w-8 flex justify-center content-center">
					{#if record.id === selectedRecord?.id && !paused}
						<Fa icon={faPause} size="2x" scale="0.5" />
					{:else}
						<Fa icon={faPlay} size="2x" scale="0.5" />
					{/if}
				</div>
				<div class="ml-3 align-middle leading-loose	">
					{record.createdDatetime}
				</div>
			</div>
		</div>
	{/each}
</div>
