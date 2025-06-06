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
                    <form v-if="mostrarFormulario" class="formulario">
                        <label>Id del Departamento: </label>
                        <input type="text">
                        <label>Monto: </label>
                        <input type="number">
                        <label>Mensaje: </label>
                        <input type="text">
                    </form>
                </Transition>
            </main>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { useNotificationStore } from '@/stores/notification';
    import { useRouter } from 'vue-router';
    import { defineStore } from 'pinia';

    const router = useRouter();
    const store = useNotificationStore();
    const mostrarFormulario = ref(false);

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
</style>