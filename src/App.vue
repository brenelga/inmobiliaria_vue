<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import NotificationButton from '@/components/';

const route = useRoute();
const showNotificationButton = ref(false);

const routesWithNotification = ['/', '/multas'];

watch(route, (newRoute) => {
  showNotificationButton.value = routesWithNotification.includes(newRoute.path);
}, { immediate: true });
</script>

<template>
  <div>
    <header v-if="showNotificationButton" class="fixed top-4 right-4 z-50">
      <NotificationButton departamento-id="001" />
    </header>
    
    <router-view />
  </div>
</template>