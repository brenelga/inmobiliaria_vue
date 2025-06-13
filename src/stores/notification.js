import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useNotificationStore = defineStore('notification', () => {
  const hasNewNotifications = ref(false);
  const notificationCount = ref(0);
  const unreadNotificationIds = ref([]);

  const setNewNotifications = (count) => {
    notificationCount.value = count;
    hasNewNotifications.value = count > 0;
  };

  const setUnreadIds = (ids) => {
    unreadNotificationIds.value = ids;
  };

  const limpiarNotificaciones = () => {
    setNewNotifications(0);
    setUnreadIds([]);
  };

  const marcarNotificacionesLeidas = async () => {
  try {
    const response = await axios.post('http://localhost:8000/api/mark_as_read', 
      JSON.stringify({ departamento_id: "001" }), // Asegura que es string JSON
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    if (response.data.success) {
      NotificationStore.setNewNotifications(0);
      console.log('Multas marcadas como leídas:', response.data.updated_count);
    } else {
      console.error('Error en la respuesta:', response.data.message);
    }
  } catch (error) {
    console.error('Error al marcar como leídas:', error.response?.data || error.message);
  }
};

  return {
    hasNewNotifications,
    notificationCount,
    unreadNotificationIds,
    setNewNotifications,
    setUnreadIds,
    limpiarNotificaciones,
    marcarNotificacionesLeidas
  };
});
