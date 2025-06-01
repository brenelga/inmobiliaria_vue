import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../utils/index.js';

export const useNotificationStore = defineStore('notification', () => {
  const hasNewNotifications = ref(false);
  const notificationCount = ref(0);
  let intervalId = null;
  
  const startPolling = (departamentoId, interval = 10000) => {
    stopPolling();
    
    const checkNotifications = async () => {
      try {
        const respuestaRaw = await api(departamentoId);
        const respuesta = respuestaRaw.map(multa => ({
          id: multa._id.$oid || multa._id.toString(),
          status: multa.status,
        }));
        
        const nuevas = respuesta.filter(notif => notif.status === 'unread');
        hasNewNotifications.value = nuevas.length > 0;
        notificationCount.value = nuevas.length;
      } catch (error) {
        console.error('Error al verificar notificaciones:', error);
      }
    };
    
    checkNotifications();
    intervalId = setInterval(checkNotifications, interval);
  };
  
  const stopPolling = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
  
  return { hasNewNotifications, notificationCount, startPolling, stopPolling };
});