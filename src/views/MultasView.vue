<script>
import { api } from '../utils/index.js'

export default {
  data() {
    return {
      multas: [],
      departamentoId: '001'
    }
  },
  mounted() {
    this.cargarMultas()
    this.interval = setInterval(this.cargarMultas, 5000)
  },
  beforeUnmount() {
    clearInterval(this.interval)
  },
  methods: {
    async cargarMultas() {
      this.multas = await api(this.departamentoId)
    }
  }
}
</script>
