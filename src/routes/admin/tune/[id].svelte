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
	import { db, firestorage } from '$modules/firebase/firebase';
	import Button from '$lib/button/Button.svelte';
	import { ref, uploadBytes } from 'firebase/storage';
	import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
	import dayjs from 'dayjs';
	import { user } from '$modules/store/store';
	import Fa from 'svelte-fa';
	import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
	import { tick } from 'svelte';
	import Input from '$lib/forms/Input.svelte';

	let player;
	let paused = true;

	export let tune: TuneModel;
	export let tuneId;
	let fileinput;
	let previewUrl;
	let ext;
	let uid;
	let selected = false;
	let file;
	let name = tune.name;
	let sessionLink = tune.sessionLink;

	let selectedRecord: RecordModel | null = null;

	const getExtFromName = (name: string): string => {
		let index = name.lastIndexOf('.');
		return name.slice(index + 1);
	};

	const onFileSelected = (e) => {
		selected = true;
		file = e.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (e) => {
			previewUrl = e.target.result;
		};
		const name = file.name;
		ext = getExtFromName(name);
	};

	const getNowTime = () => {
		const now = dayjs();
		return now.format('YYYY_MM_DD_HH_mm_ss');
	};

	const upload = async () => {
		const now = getNowTime();
		const path = `/${uid}/tunes/${tuneId}/${now}.${ext}`;
		const upRef = ref(firestorage, `/${uid}/tunes/${tuneId}/${now}.${ext}`);
		await uploadBytes(upRef, file);
		const recordRef = await addDoc(collection(db, 'tunes', tuneId, 'records'), {
			uid,
			path,
			created: serverTimestamp(),
			modified: serverTimestamp()
		});
		await addDoc(collection(db, 'dayRecords', dayjs().format('YYYY-MM-DD')), {
			name: tune.name,
			tuneId: tune.id,
			recordRef
		});
		tune = await TuneModelFactory.getDoc(tuneId);
		tune.update({});
	};

	user.subscribe((user) => {
		uid = user.uid;
	});

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

	const updateTune = async () => {
		await tune.update({
			name,
			sessionLink
		});
		tune = await TuneModelFactory.getDoc(tuneId);
	};

	const updatePaused = () => {
		paused = player.paused;
	};
</script>

<svelte:head>
	<title>{tune.name}</title>
</svelte:head>

<div class="min-w-md justify-center items-center self-center pt-20">
	<h1 class="text-3xl ml-20">
		{tune.name}
		{#if tune.sessionLink}
			<a
				class="ml-2 rounded-2xl hover:bg-gray-300 p-2 px-4 bg-gray-200 text-sm"
				href={tune.sessionLink}
			>
				view the session page
			</a>
		{/if}
	</h1>
	<div class="flex flex-col px-4 py-6 bg-white rounded-lg shadow-md w-full max-w-lg ml-20 mt-5">
		<form>
			<Input bind:value={name} type="email" label="曲名" className="mt-2" />
			<Input bind:value={sessionLink} label="the session page" className="mt-2" />
			<Button block className="mt-5" on:click={updateTune}>更新</Button>
		</form>
	</div>
	<div class="flex flex-col px-4 py-6 bg-white rounded-lg shadow-md w-full max-w-lg ml-20 mt-5">
		<h1>録音追加</h1>
		<Button
			on:click={() => {
				fileinput.click();
			}}
		>
			音声ファイルを選択
		</Button>
		<input
			style="display:none"
			type="file"
			accept="audio/*"
			on:change={(e) => onFileSelected(e)}
			bind:this={fileinput}
		/>
		<audio controls src={previewUrl}>
			Your browser does not support the
			<code>audio</code> element.
		</audio>
		<Button on:click={upload} disabled={!selected}>アップロード</Button>
	</div>
	<div class="max-w-lg ml-20 py-5">
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
