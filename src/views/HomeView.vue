<script setup>
import { useRouter } from 'vue-router';
import { useNotificationStore } from '../stores/notification'

const router = useRouter();
const store = useNotificationStore();

function irAMultas() {
  store.limpiarNotificaciones();
  router.push('/multas');
}
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-6">Inicio</h1>

    <button
      @click="irAMultas"
      :class="[
        'px-4 py-2 rounded-full font-bold shadow transition',
        store.hayNotificaciones ? 'bg-red-600 text-white animate-bounce' : 'bg-gray-300 text-black'
      ]"
    >
      🔔 Notificaciones
      <span v-if="store.hayNotificaciones" class="ml-1">(¡Nuevas!)</span>
    </button>
  </div>
</template>
