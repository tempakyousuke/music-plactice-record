import { db } from '$modules/firebase/firebase';
import { getDoc, getDocs, collection } from 'firebase/firestore';
import { RecordModel } from '$model/tune';

export class DayRecordModel {
	id: string;
	tuneId: string;
	name: string;
	record: RecordModel;

	constructor(init: Required<DayRecordModel>) {
		this.id = init.id;
		this.tuneId = init.tuneId;
		this.name = init.name;
		this.record = init.record;
	}
}

export const DayRecordModelFactory = {
	getRecords: async (date: string): Promise<DayRecordModel[]> => {
		const snapshots = await getDocs(collection(db, 'dayRecords', date, 'records'));
		const promises: Promise<DayRecordModel>[] = [];
		snapshots.forEach((snapshot) => {
			const recordPromise = (async () => {
				const data = snapshot.data();
				const recordDoc = await getDoc(data.recordRef);
				const recordData = {
					id: recordDoc.id,
					...(recordDoc.data() as Required<RecordModel>)
				} as Required<RecordModel>;
				console.log(recordData);
				const record = new RecordModel(recordData);
				const dayRecordData = {
					id: snapshot.id,
					record,
					...data
				} as Required<DayRecordModel>;
				const dayRecord = new DayRecordModel(dayRecordData);
				return dayRecord;
			})();
			promises.push(recordPromise);
		});
		return Promise.all(promises);
	}
};
