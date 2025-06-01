import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notificaciones', () => {
  const hayNotificaciones = ref(false);
  const nuevasMultas = ref([]);
  const todasLasMultas = ref([]);

  function establecerNuevasMultas(nuevas) {
    nuevasMultas.value = nuevas;
    hayNotificaciones.value = nuevas.length > 0;
    if (nuevas.length > 0) {
      todasLasMultas.value = [...todasLasMultas.value, ...nuevas];
    }
  }

  function limpiarNotificaciones() {
    nuevasMultas.value = [];
    hayNotificaciones.value = false;
  }

  return {
    hayNotificaciones,
    nuevasMultas,
    todasLasMultas,
    establecerNuevasMultas,
    limpiarNotificaciones,
  };
});
