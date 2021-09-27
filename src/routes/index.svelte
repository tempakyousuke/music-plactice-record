<script context="module">
	export async function load({ page }) {
		const co = collection(db, 'tunes');
		const snapshots = await getDocs(co);
		const tunes = [];
		snapshots.forEach((snapshot) => {
			const tune = {
				id: snapshot.id,
				...snapshot.data()
			};
			tunes.push(tune);
		});
		return {
			props: {
				tunes
			}
		};
	}
</script>

<script lang="ts">
	import { db } from '$modules/firebase/firebase';
	import { collection, getDocs } from 'firebase/firestore';
	import type { Tune } from '$types/tune';

	export let tunes: Tune[] = [];
</script>

<svelte:head>
	<title>トップページ</title>
</svelte:head>
<div class="pt-10">
	<div class="max-w-lg mx-auto bg-white rounded p-5">
		{#each tunes as tune (tune.id)}
			<div>
				<a class="hover:text-blue-500" href="/tune/{tune.id}">{tune.name}</a>
			</div>
		{/each}
	</div>
</div>
