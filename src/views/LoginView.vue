<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-6 rounded shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1" for="username">Usuario</label>
          <input
            v-model="form.username"
            type="text"
            id="username"
            class="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1" for="password">Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            class="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Ingresar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const form = reactive({
  username: '',
  password: ''
})

const error = ref(null)
const auth = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  error.value = null
  try {
    await auth.login(form)

    if (auth.user.tipo === 'admin') {
      router.push({ name: 'panel' })
    } else if (auth.user.tipo === 'inquilino') {
      router.push({ name: 'multas' })
    } else {
      router.push({ name: 'home' })
    }
  } catch (err) {
    error.value = 'Credenciales inválidas o error de conexión.'
    console.error(err)
  }
}
</script>

<style scoped>

</style>
