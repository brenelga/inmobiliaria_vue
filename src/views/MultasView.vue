<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import { api } from '../utils/index.js';
import { useNotificationStore } from '../stores/notification';

const Multas_Totales = ref([]);
const multasAnteriores = ref([]);
const nuevasMultas = ref([]);
const mostrarNotificacion = ref(false);
const NotificationStore = useNotificationStore();

const markAsRead = async () => {
  try {
    await axios.post('http://localhost:8000/api/mark_as_read', {
      departamento_id: "001"
    });
    NotificationStore.setNewNotifications(0);
  } catch (error) {
    console.error('Error al marcar como leídas:', error);
  }
};


async function respuestas() {
  const respuestaRaw = await api("001");
  
  if (!respuestaRaw || !Array.isArray(respuestaRaw)) {
    console.warn("Respuesta inválida o no es un array:", respuestaRaw);
    return;
  }
  
  const respuesta = respuestaRaw.map(multa => ({
    id: multa._id.$oid || multa._id.toString(),
    departamento_id: multa.departamento_id,
    monto: multa.monto,
    mensaje: multa.mensaje,
    fecha: multa.fecha,
    status: multa.status,
  }));

  console.log("Datos recibidos:", respuesta);

  const idsAnteriores = new Set(multasAnteriores.value.map(m => m.id));
  const nuevasDetectadas = respuesta.filter(m => !idsAnteriores.has(m.id));

  console.log("Nuevas multas detectadas:", nuevasDetectadas);

  if (nuevasDetectadas.length > 0) {
    nuevasMultas.value = nuevasDetectadas;
    mostrarNotificacion.value = true;
    
    NotificationStore.setNewNotifications(nuevasDetectadas.length);
    
    multasAnteriores.value = respuesta;

    setTimeout(() => {
      mostrarNotificacion.value = false;
    }, 5000);
  }

  Multas_Totales.value = respuesta;
}

let intervalId;

onMounted(() => {
  respuestas();
  intervalId = setInterval(respuestas, 5000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div class="p-6 min-h-screen bg-gray-100">
    <div 
      v-if="mostrarNotificacion"
      class="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg max-w-xs z-50"
      role="alert"
    >
      <p class="font-bold">Nuevas multas detectadas</p>
      <p>Tienes {{ nuevasMultas.length }} nueva(s) multa(s)</p>
    </div>

    <div class="max-w-4xl mx-auto space-y-6">
      <div class="bg-white rounded-xl shadow p-4">
        <h2 class="text-xl font-bold mb-4">🔔 Notificaciones de Nuevas Multas</h2>
        <div v-if="nuevasMultas.length > 0">
          <ul class="space-y-3">
            <li
              v-for="multa in nuevasMultas"
              :key="multa.id"
              class="p-3 border rounded-lg bg-red-50 border-red-300"
            >
              <p><strong>Tipo:</strong> {{ multa.tipo }}</p>
              <p><strong>Fecha:</strong> {{ multa.fecha }}</p>
              <p><strong>Descripción:</strong> {{ multa.mensaje }}</p>
              <p><strong>Monto:</strong> {{ multa.monto }}</p>
            </li>
          </ul>
        </div>
        <p v-else class="text-gray-500">Sin nuevas multas por el momento.</p>
      </div>

      <div class="bg-white rounded-xl shadow p-4">
        <h2 class="text-xl font-bold mb-4">📋 Historial de Multas</h2>
        <div v-if="Multas_Totales.length > 0">
          <ul class="space-y-3">
            <li
              v-for="multa in Multas_Totales"
              :key="multa.id"
              class="p-3 border rounded-lg hover:bg-gray-50"
              :class="{
                'bg-red-50 border-red-300': nuevasMultas.some(m => m.id === multa.id),
                'border-gray-200': !nuevasMultas.some(m => m.id === multa.id)
              }"
            >
              <p><strong>Tipo:</strong> {{ multa.tipo }}</p>
              <p><strong>Fecha:</strong> {{ multa.fecha }}</p>
              <p><strong>Descripción:</strong> {{ multa.mensaje }}</p>
              <p><strong>Monto:</strong> {{ multa.monto }}</p>
              <p><strong>Estado:</strong> {{ multa.status }}</p>
            </li>
          </ul>
        </div>
        <p v-else class="text-gray-500">No hay multas registradas.</p>
      </div>
    </div>
  </div>
</template>
