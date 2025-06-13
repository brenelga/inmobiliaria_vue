<script setup>
import { useRouter } from 'vue-router';
import { useNotificationStore } from '../stores/notification'
import { defineStore } from 'pinia';
import { onMounted, onUnmounted } from 'vue';
import { api } from '@/utils/index';

const router = useRouter();
const store = useNotificationStore();
const departamentoId = '001';

let intervalo = null;

async function irAMultas() {
  await store.marcarNotificacionesLeidas(departamentoId);
  store.limpiarNotificaciones();
  router.push('/multas');
}

async function verificarNotificaciones() {
  try {
    const respuesta = await api(departamentoId);
    const notificaciones = Array.isArray(respuesta.data) ? respuesta.data : [];

    const unread = notificaciones.filter(n => n.read === 'unread');
    store.setNewNotifications(unread.length);
    store.setUnreadIds(unread.map(n => n._id));
  } catch (error) {
    console.error('Error al verificar notificaciones:', error);
  }
}

onMounted(() => {
  verificarNotificaciones();
  intervalo = setInterval(verificarNotificaciones, 5000);
});

onUnmounted(() => {
  if (intervalo) clearInterval(intervalo);
})

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
