import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    async login(credentials) {
      const { data } = await axios.post('http://localhost/api/login', credentials)
      this.user = data.user
      this.token = data.access_token
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
    },
    logout() {
      this.user = null
      this.token = null
      delete axios.defaults.headers.common['Authorization']
    },
  },
})
