<script lang="ts">
	import Input from '$lib/forms/Input.svelte';
	import Button from '$lib/button/Button.svelte';
	import { db } from '$modules/firebase/firebase';
	import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
	import { goto } from '$app/navigation';

	let name = '';
	let sessionLink = '';

	const register = async () => {
		try {
			await addDoc(collection(db, 'tunes'), {
				name,
				sessionLink,
				category: 'irish',
				created: serverTimestamp(),
				modified: serverTimestamp()
			});
			goto('/admin');
		} catch (e) {
			console.error(e.message);
		}
	};
</script>

<svelte:head>
	<title>曲登録</title>
</svelte:head>

<div class="min-w-md flex justify-center items-center self-center pt-20">
	<div class="flex flex-col px-4 py-6 bg-white rounded-lg shadow-md w-full max-w-md">
		<h1>曲登録</h1>
		<form>
			<Input bind:value={name} type="email" label="曲名" className="mt-2" />
			<Input bind:value={sessionLink} label="the session page" className="mt-2" />
			<Button block className="mt-5" on:click={register}>登録</Button>
		</form>
	</div>
</div>
