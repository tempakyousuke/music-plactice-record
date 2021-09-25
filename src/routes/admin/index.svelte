<script lang="ts">
	import { db } from '$modules/firebase/firebase';
	import { collection, getDocs } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import type { Tune } from '$types/tune';

	let tunes: Tune[] = [];

	onMount(async () => {
		const co = collection(db, 'tunes');
		const snapshots = await getDocs(co);
		const arr: Tune[] = [];
		snapshots.forEach((snapshot) => {
			const tune = {
				id: snapshot.id,
				...snapshot.data()
			} as Tune;
			arr.push(tune);
		});
		tunes = arr;
	});
</script>

<svelte:head>
	<title>管理画面トップ</title>
</svelte:head>
<div class="pt-10">
	<div class="max-w-lg mx-auto bg-white rounded p-5">
		{#each tunes as tune (tune.id)}
			<div>
				<a class="hover:text-blue-500" href="/admin/tune/{tune.id}">{tune.name}</a>
			</div>
		{/each}
	</div>
</div>
