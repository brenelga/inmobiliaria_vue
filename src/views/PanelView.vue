<script>

</script>
<template>
    <div class="layout">
        <header class="encabezado">
            <h1>Panel de Control</h1>
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
        </header>
        <div class="contenido">
            <aside class="sidebar">
                <ul>
                    <li><a href="#">Inicio</a></li>
                    <li><a href="#">Multas</a></li>
                    <li><a href="#">Mensajes</a></li>
                </ul>
            </aside>
            <main class="main">
                <button @click="mostrarFormulario = !mostrarFormulario" class="btn">
                    {{ mostrarFormulario ? 'Ocultar' : 'Mostrar' }} formulario
                </button>
                <Transition name="fade">
                    <div v-if="mostrarNotificacion":class="['notificacion', tipoNotificacion === 'success' ? 'notificacion-exito' : 'notificacion-error']">
                        {{ mensajeNotificación }}
                    </div>
                </Transition>
                <Transition name="fade">
                    <form v-if="mostrarFormulario" class="formulario" @submit.prevent="enviarMulta">
                        <label>Id del Departamento: </label>
                        <input type="text" v-model="departamentoId">
                        <label>Monto: </label>
                        <input type="number" v-model="monto">
                        <label>Mensaje: </label>
                        <input type="text" v-model="mensaje">
                        <button type="submit" class="btn">Enviar</button>
                    </form>
                </Transition>
            </main>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import axios from 'axios';
    import { useNotificationStore } from '@/stores/notification';
    import { useRouter } from 'vue-router';
    import { defineStore } from 'pinia';

    const router = useRouter();
    const store = useNotificationStore();
    const mostrarFormulario = ref(false);
    const departamentoId = ref('');
    const monto = ref('');
    const mensaje = ref('');
    const mensajeNotificación = ref('');
    const tipoNotificacion = ref('');
    const mostrarNotificacion = ref('');

    const enviarMulta = async() => {
        try {
            const response = await axios.post('http://localhost:8000/api/multas', {
                departamento_id: departamentoId.value,
                monto: monto.value,
                mensaje: mensaje.value
            });
            
            mensajeNotificación.value = 'Multa enviada correctamente';
            tipoNotificacion = 'success';
            mostrarNotificacion.value = true;

            departamentoId.value = '';
            monto.value = '';
            mensaje.value = '';
        } catch (error) {
            console.error(error);
            mensajeNotificación = 'Error al enviar la multa';
            tipoNotificacion.value = 'error';
            mostrarNotificacion.value = true;
        }

        setTimeout(() => {
            mostrarNotificacion.value = false;
        }, 3000);
    };

    function irAMultas() {
  store.limpiarNotificaciones();
  router.push('/multas');
}

</script>

<style scoped>
    .layout {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .encabezado {
        background-color: #3b82f6;
        color: white;
        padding: 1rem;
    }
    .contenido {
        display: flex;
        flex: 1;
    }
    .sidebar {
        width: 200px;
        background-color: #e5e7eb;
        padding: 1rem;
    }
    .sidebar ul {
        list-style: none;
        padding: 0;
    }
    .sidebar li {
        margin-bottom: 1rem;
    }
    .main {
        flex: 1;
        padding: 2rem;
    }
    .btn {
        padding: 0.5rem 1rem;
        background-color: #2563eb;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 1rem;
    }
    .formulario {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.5s ease;
    }
    .fade-enter-from, .fade-leave-to {
        opacity: 0;
    }
    .notificacion {
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        font-weight: bold;
        text-align: center;
        max-width: 400px;
    }

    .notificacion-exito{
        background-color: #d1fae5;
        color: #065f46;
    }

    .notificacion-error{
        background-color: #fee2e2;
        color: #991b1b;
    }
</style>