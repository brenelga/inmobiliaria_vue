<script setup>
import { onMounted, onUnmounted } from 'vue';
import { api } from '../utils/index.js';
import { useNotificationStore } from '../stores/notificaciones';

const store = useNotificationStore();

async function respuestas() {
  try {
    const respuestaRaw = await api("001");

    const respuesta = respuestaRaw.map(multa => ({
      id: multa._id?.$oid || multa._id?.toString(),
      departamento_id: multa.departamento_id,
      monto: multa.monto,
      mensaje: multa.mensaje,
      fecha: multa.fecha,
      status: multa.status,
    }));

    const anterioresIds = store.todasLasMultas.map(m => m.id);
    const nuevas = respuesta.filter(m => !anterioresIds.includes(m.id));

    store.establecerNuevasMultas(nuevas);
  } catch (e) {
    console.error("Error al consultar multas:", e);
  }
}

let intervalId;

onMounted(() => {
  store.limpiarNotificaciones();
  respuestas();
  intervalId = setInterval(respuestas, 5000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">📋 Multas</h2>
    <ul v-if="store.todasLasMultas.length">
      <li v-for="multa in store.todasLasMultas" :key="multa.id">
        {{ multa.mensaje }} - ${{ multa.monto }}
      </li>
    </ul>
    <p v-else>No hay multas registradas.</p>
  </div>
</template>
