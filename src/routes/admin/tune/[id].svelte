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
	import Button from '$lib/button/Button.svelte';
	import type { Tune } from '$types/tune';
	export let tune: Tune;
	let fileinput;
	let previewUrl;
	const onFileSelected = (e) => {
		let music = e.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(music);
		reader.onload = (e) => {
			previewUrl = e.target.result;
		};
	};
</script>

<svelte:head>
	<title>{tune.name}</title>
</svelte:head>

<div class="min-w-md flex justify-center items-center self-center pt-20">
	<div class="flex flex-col px-4 py-6 bg-white rounded-lg shadow-md w-full max-w-md">
		<h1>ファイルアップロード</h1>
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
	</div>
</div>
