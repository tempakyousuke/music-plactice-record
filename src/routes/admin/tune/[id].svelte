<script context="module">
	import { db } from '$modules/firebase/firebase';
	import { doc, getDoc } from 'firebase/firestore';
	export async function load({ page }) {
		const tuneDoc = await getDoc(doc(db, 'tunes', page.params.id));

		return {
			props: {
				tune: tuneDoc.data()
			}
		};
	}
</script>

<script lang="ts">
	import type { Tune } from '$types/tune';
	export let tune: Tune;
</script>

<svelte:head>
	<title>{tune.name}</title>
</svelte:head>

<div class="min-w-md flex justify-center items-center self-center pt-20">
	<div class="flex flex-col px-4 py-6 bg-white rounded-lg shadow-md w-full max-w-md" />
</div>
