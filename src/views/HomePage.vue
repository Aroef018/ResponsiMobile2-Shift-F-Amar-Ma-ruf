<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Data Pahlawan</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ editMode ? "Edit Pahlawan" : "Tambah Pahlawan" }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label position="floating"></ion-label>
            <ion-input v-model="newPahlawan.nama" placeholder="Masukkan nama"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating"></ion-label>
            <ion-textarea v-model="newPahlawan.deskripsi" placeholder="Masukkan deskripsi"></ion-textarea>
          </ion-item>
          <ion-button @click="addPahlawan()">
            {{ editMode ? "Simpan" : "Tambah" }}
          </ion-button>
        </ion-card-content>
      </ion-card>

      <!-- Daftar Pahlawan -->
      <ion-card v-for="pahlawan in pahlawans" :key="pahlawan.id" class="todo-item">
        <ion-card-header>
          <ion-card-subtitle class="ion-text-wrap">{{ pahlawan.deskripsi }}</ion-card-subtitle>
          <ion-card-title class="ion-text-wrap">{{ pahlawan.nama }}</ion-card-title>
          
        </ion-card-header>
        <ion-card-content>
          <ion-button color="primary" size="small" @click="editPahlawan(pahlawan)">Edit</ion-button>
          <ion-button color="danger" size="small" @click="deletePahlawan(pahlawan.id!)">Hapus</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { Timestamp } from "firebase/firestore";
import { firestoreService, type Pahlawan } from '@/utils/firestore';

export default defineComponent({
  name: "PahlawanPage",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
  },
  data() {
    return {
      pahlawans: [] as Pahlawan[],
      newPahlawan: {
        nama: "",
        deskripsi: "",
      },
      editMode: false,
      editId: "",
    };
  },
  methods: {
    async fetchPahlawans() {
      try {
        this.pahlawans = await firestoreService.getPahlawans();
      } catch (error) {
        console.error("Error fetching pahlawans:", error);
      }
    },

    async addPahlawan() {
      if (!this.newPahlawan.nama || !this.newPahlawan.deskripsi) {
        alert("Nama dan Deskripsi harus diisi!");
        return;
      }
      try {
        if (this.editMode) {
          await firestoreService.updatePahlawan(this.editId, {
            nama: this.newPahlawan.nama,
            deskripsi: this.newPahlawan.deskripsi,
            updatedAt: Timestamp.now(),
          });
          this.editMode = false;
          this.editId = ""; 
        } else {
          await firestoreService.addPahlawan({
            nama: this.newPahlawan.nama,
            deskripsi: this.newPahlawan.deskripsi,
            status: false,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
        }
        this.newPahlawan = { nama: "", deskripsi: "" };
        this.fetchPahlawans();
      } catch (error) {
        console.error("Error:", error);
      }
    },

    editPahlawan(pahlawan: Pahlawan) {
      this.editMode = true;
      this.editId = pahlawan.id!;
      this.newPahlawan = {
        nama: pahlawan.nama,
        deskripsi: pahlawan.deskripsi
      };
    },

    async deletePahlawan(id: string) {
      try {
        await firestoreService.deletePahlawan(id);
        this.fetchPahlawans();
      } catch (error) {
        console.error("Error deleting pahlawan:", error);
      }
    },
  },
  async mounted() {
    await this.fetchPahlawans();
  },
});
</script>

<style scoped>
.todo-item {
  margin-bottom: 16px;
}
</style>