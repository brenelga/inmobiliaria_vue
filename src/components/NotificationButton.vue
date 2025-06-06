<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '../stores/notification';
import axios from 'axios';
import { api } from '../utils/index.js';

const props = defineProps({ departamentoId: String });

const notificationStore = useNotificationStore();
const hasNewNotifications = ref(false);
const notificationCount = ref(0);
const router = useRouter();

let intervalId;

const checkNotifications = async () => {
  try {
    const respuestaRaw = await api(props.departamentoId);
    const multasArray = Array.isArray(respuestaRaw.data) ? respuestaRaw.data : [];

    const respuesta = multasArray.map(multa => ({
      id: multa._id?.$oid || multa._id?.toString() || multa.id || '',
      read: multa.read,
    }));

    const nuevas = respuesta.filter(notif => notif.read === 'unread');
    notificationStore.setNewNotifications(nuevas.length);
    notificationStore.setUnreadIds(nuevas.map(n => n.id));

    hasNewNotifications.value = notificationStore.hasNewNotifications;
    notificationCount.value = notificationStore.notificationCount;
  } catch (error) {
    console.error('Error al verificar notificaciones:', error);
  }
};

const goToNotifications = async () => {
  const unreadIds = notificationStore.unreadNotificationIds;
  if (unreadIds.length > 0) {
    try {
      await axios.post('http://localhost:8000/api/mark_as_read', {
    departamento_id: props.departamentoId      
  });
      notificationStore.setNewNotifications(0);
    } catch (err) {
      console.error('Error marcando como leídas:', err);
    }
  }
  router.push({path: '/multas'})
};

onMounted(() => {
  checkNotifications();
  intervalId = setInterval(checkNotifications, 10000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
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