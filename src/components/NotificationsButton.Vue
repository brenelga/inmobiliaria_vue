<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../utils/index.js';

const props = defineProps({
  departamentoId: {
    type: String,
    required: true
  }
});

const router = useRouter();
const hasNewNotifications = ref(false);
const notificationCount = ref(0);
let intervalId;
let checkInterval = 10000;

const checkNotifications = async () => {
  try {
    const respuestaRaw = await api(props.departamentoId);
    const respuesta = respuestaRaw.map(multa => ({
      id: multa._id.$oid || multa._id.toString(),
      departamento_id: multa.departamento_id,
      monto: multa.monto,
      mensaje: multa.mensaje,
      fecha: multa.fecha,
      status: multa.status,
    }));

    const nuevas = respuesta.filter(notif => notif.status === 'unread');
    
    if (nuevas.length > 0) {
      hasNewNotifications.value = true;
      notificationCount.value = nuevas.length;
    } else {
      hasNewNotifications.value = false;
      notificationCount.value = 0;
    }
  } catch (error) {
    console.error('Error al verificar notificaciones:', error);
  }
};

onMounted(() => {
  checkNotifications();
  intervalId = setInterval(checkNotifications, checkInterval);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

const goToNotifications = () => {
  router.push('/notificaciones');
};
</script>

<template>
  <button 
    @click="goToNotifications"
    class="relative p-2 rounded-full hover:bg-gray-200 transition-colors"
    aria-label="Notificaciones"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
    
    <span 
      v-if="hasNewNotifications"
      class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"
    >
      {{ notificationCount }}
    </span>
  </button>
</template>