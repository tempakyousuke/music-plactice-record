<script context="module">
	export async function load({ page }) {
		const today = dayjs().format('YYYY-MM-DD');
		const records = await DayRecordModelFactory.getRecords(today);
		return {
			props: {
				records
			}
		};
	}
</script>

<script lang="ts">
	import { DayRecordModelFactory } from '$model/dayRecord';
	import type { DayRecordModel } from '$model/dayRecord';
	import dayjs from 'dayjs';
	import { tick } from 'svelte';
	import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	export let records: DayRecordModel[];
	let paused = true;
	let player;
	let selectedRecord = records[0];

	const selectRecord = async (record: DayRecordModel) => {
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

<div class="min-w-md justify-center items-center self-center pt-10">
	<div class="max-w-lg ml-20 py-5">
		<h1 class="text-3xl">本日の録音</h1>
		<audio
			class="mt-5 bg-white"
			bind:this={player}
			controls
			src={selectedRecord.record.src}
			on:pause={updatePaused}
			on:play={updatePaused}
		>
			Your browser does not support the
			<code>audio</code> element.
		</audio>
	</div>
	{#each records as dayRecord (dayRecord.id)}
		<div class="cursor-pointer hover:bg-blue-200 py-5" on:click={() => selectRecord(dayRecord)}>
			<div class="mx-20 flex">
				<div class="rounded-3xl bg-gray-100 w-8 flex justify-center content-center">
					{#if dayRecord.id === selectedRecord?.id && !paused}
						<Fa icon={faPause} size="2x" scale="0.5" />
					{:else}
						<Fa icon={faPlay} size="2x" scale="0.5" />
					{/if}
				</div>
				<div class="ml-3 align-middle leading-loose	">
					{dayRecord.name}
				</div>
			</div>
		</div>
	{/each}
</div>
