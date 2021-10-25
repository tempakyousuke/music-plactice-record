import type { Timestamp } from 'firebase/firestore';
import { db, firestorage } from '$modules/firebase/firebase';
import {
	doc,
	getDoc,
	getDocs,
	updateDoc,
	collection,
	serverTimestamp,
	deleteDoc
} from 'firebase/firestore';
import type { DocumentReference, DocumentData } from 'firebase/firestore';
import { ref, getDownloadURL, deleteObject } from 'firebase/storage';
import dayjs from 'dayjs';

export class TuneModel {
	id: string;
	name: string;
	sessionLink: string;
	created: Timestamp;
	records: RecordModel[];

	constructor(init: Required<TuneModel>) {
		this.id = init.id;
		this.name = init.name;
		this.sessionLink = init.sessionLink;
		this.records = init.records;
		this.created = init.created;
	}

	get createdDay(): dayjs.Dayjs {
		return dayjs(this.created.toDate());
	}

	get createdDatetime(): string {
		return this.createdDay.format('YYYY-MM-DD HH:mm');
	}

	update(tune: { name?: string; sessionLink?: string }): Promise<void> {
		return updateDoc(doc(db, 'tunes', this.id), {
			...tune,
			modified: serverTimestamp()
		});
	}
}

export type Tune = Exclude<
	TuneModel,
	| 'constructor'
	| 'createdDay'
	| 'createdDatetime'
	| 'update'
	| 'id'
	| 'created'
	| 'modified'
	| 'records'
>;

export class RecordModel {
	id: string;
	tuneId: string;
	src: string;
	path: string;
	created: Timestamp;

	constructor(init: Exclude<RecordModel, 'src'>) {
		this.id = init.id;
		this.tuneId = init.tuneId;
		this.path = init.path;
		this.created = init.created;
		getDownloadURL(ref(firestorage, this.path)).then((src) => {
			this.src = src;
		});
	}

	get createdDay(): dayjs.Dayjs {
		return dayjs(this.created.toDate());
	}

	get createdDatetime(): string {
		return this.createdDay.format('YYYY-MM-DD HH:mm');
	}

	get docRef(): DocumentReference<DocumentData> {
		return doc(db, 'tunes', this.tuneId, 'records', this.id);
	}

	async delete(): Promise<void> {
		try {
			const fileRef = ref(firestorage, this.path);
			await deleteObject(fileRef);
			return deleteDoc(this.docRef);
		} catch (error) {
			console.error(error);
		}
	}
}

export const TuneModelFactory = {
	getDoc: async (id: string, getRecord = true): Promise<TuneModel> => {
		const tuneDoc = await getDoc(doc(db, 'tunes', id));
		const tune = tuneDoc.data();
		const records: RecordModel[] = [];

		if (getRecord) {
			const snapshots = await getDocs(collection(db, 'tunes', id, 'records'));
			snapshots.forEach(async (snapshot) => {
				const data = {
					id: snapshot.id,
					tuneId: id,
					...snapshot.data()
				} as Required<RecordModel>;
				const record = new RecordModel(data);
				records.push(record);
			});
		}

		const data = {
			...tune,
			records: records
		} as Required<TuneModel>;
		return new TuneModel(data);
	}
};
