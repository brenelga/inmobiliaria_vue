import { defineStore } from "pinia";
import { ref } from "vue";

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

  return { 
    hasNewNotifications, 
    notificationCount,
    unreadNotificationIds,
    setNewNotifications,
    setUnreadIds,
    limpiarNotificaciones
  };
});
