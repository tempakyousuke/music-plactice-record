<script context="module">
	export async function load({ page }) {
		const tuneDoc = await getDoc(doc(db, 'tunes', page.params.id));
		return {
			props: {
				tuneId: page.params.id,
				tune: tuneDoc.data()
			}
		};
	}
</script>

<script lang="ts">
	import { db, firestorage } from '$modules/firebase/firebase';
	import { doc, getDoc, getDocs } from 'firebase/firestore';
	import Button from '$lib/button/Button.svelte';
	import type { Tune, Record } from '$types/tune';
	import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
	import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
	import dayjs from 'dayjs';
	import { user } from '$modules/store/store';
	import { onMount } from 'svelte';

	export let tune: Tune;
	export let tuneId;
	let fileinput;
	let previewUrl;
	let ext;
	let uid;
	let records: Record[] = [];
	let selected = false;
	let file;

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
		await addDoc(collection(db, 'tunes', tuneId, 'records'), {
			uid,
			path,
			created: serverTimestamp(),
			modified: serverTimestamp()
		});
		getRecords(tuneId);
	};

	user.subscribe((user) => {
		uid = user.uid;
	});

	const getRecords = async (id) => {
		const snapshots = await getDocs(collection(db, 'tunes', id, 'records'));
		const arr = [];
		snapshots.forEach(async (snapshot) => {
			const record = {
				id: snapshot.id,
				...snapshot.data()
			} as Record;
			arr.push(record);
		});
		records = await Promise.all(
			arr.map(async (val) => {
				val.src = await getDownloadURL(ref(firestorage, val.path));
				return val;
			})
		);
	};

	onMount(() => {
		getRecords(tuneId);
	});
</script>

<svelte:head>
	<title>{tune.name}</title>
</svelte:head>

<div class="min-w-md justify-center items-center self-center pt-20">
	<div class="flex flex-col px-4 py-6 bg-white rounded-lg shadow-md w-full max-w-lg mx-auto">
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
	<div class="max-w-lg mx-auto bg-white rounded p-5 mt-10">
		<h1>録音</h1>
		{#each records as record (record.id)}
			<div>
				<audio controls src={record.src}>
					Your browser does not support the
					<code>audio</code> element.
				</audio>
				<!-- <Button on:click={() => play(record)}>再生</Button>
				<Button on:click={stop}>停止</Button> -->
			</div>
		{/each}
	</div>
</div>
