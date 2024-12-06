import { auth, db } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';

export interface Pahlawan {
    id?: string;
    nama: string;
    deskripsi: string;
    status: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export const firestoreService = {
    getPahlawanRef() {
        return collection(db, 'pahlawan');
    },

    async addPahlawan(pahlawan: Omit<Pahlawan, 'id'>) {
        try {
            const pahlawanRef = this.getPahlawanRef();
            const docRef = await addDoc(pahlawanRef, {
                ...pahlawan,
                status: false,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            return docRef.id;
        } catch (error) {
            console.error('Error Tambah Pahlawan:', error);
            throw error;
        }
    },

    async getPahlawans(): Promise<Pahlawan[]> {
        try {
            const pahlawanRef = this.getPahlawanRef();
            const q = query(pahlawanRef, orderBy('updatedAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            } as Pahlawan));
        } catch (error) {
            console.error('Error Get Pahlawan:', error);
            throw error;
        }
    },

    async updatePahlawan(id: string, pahlawan: Partial<Pahlawan>) {
        try {
            const pahlawanRef = this.getPahlawanRef();
            const docRef = doc(pahlawanRef, id);
            await updateDoc(docRef, {
                ...pahlawan,
                updatedAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error Update Pahlawan:', error);
            throw error;
        }
    },

    async deletePahlawan(id: string) {
        try {
            const pahlawanRef = this.getPahlawanRef();
            const docRef = doc(pahlawanRef, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error Delete Pahlawan:', error);
            throw error;
        }
    },

    async updateStatus(id: string, status: boolean) {
        try {
            const pahlawanRef = this.getPahlawanRef();
            const docRef = doc(pahlawanRef, id);
            await updateDoc(docRef, { status: status, updatedAt: Timestamp.now() });
        } catch (error) {
            console.error('Error Update Status:', error);
            throw error;
        }
    }

}