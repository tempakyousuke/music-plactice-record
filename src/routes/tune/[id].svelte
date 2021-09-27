<script context="module">
	export async function load({ page }) {
		const tuneDoc = await getDoc(doc(db, 'tunes', page.params.id));
		const snapshots = await getDocs(collection(db, 'tunes', page.params.id, 'records'));
		const arr = [];
		snapshots.forEach(async (snapshot) => {
			const record = {
				id: snapshot.id,
				...snapshot.data()
			};
			arr.push(record);
		});
		const records = await Promise.all(
			arr.map(async (val) => {
				val.src = await getDownloadURL(ref(firestorage, val.path));
				return val;
			})
		);
		return {
			props: {
				tuneId: page.params.id,
				tune: tuneDoc.data(),
				records
			}
		};
	}
</script>

<script lang="ts">
	import { db, firestorage } from '$modules/firebase/firebase';
	import { doc, getDoc, getDocs } from 'firebase/firestore';
	import type { Tune, Record } from '$types/tune';
	import { ref, getDownloadURL } from 'firebase/storage';
	import { collection } from 'firebase/firestore';

	export let tune: Tune;
	export let records: Record[] = [];
</script>

<svelte:head>
	<title>{tune.name}</title>
</svelte:head>

<div class="min-w-md justify-center items-center self-center pt-20">
	<div class="max-w-lg mx-auto bg-white rounded p-5 mt-10">
		<h1>録音</h1>
		{#each records as record (record.id)}
			<div>
				<audio controls src={record.src}>
					Your browser does not support the
					<code>audio</code> element.
				</audio>
			</div>
		{/each}
	</div>
</div>
