import axios from "axios";

export async function api(departamentoId) {
    const options = {
        method: 'GET',
        url: `http://localhost:8000/api/notificaciones/${departamentoId}`,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
    try {
        const respuesta = await axios.request(options);
        
        if (respuesta.data && typeof respuesta.data.success !== 'undefined') {
            return respuesta.data.data;
        }
        
        return respuesta.data || [];
    } catch (error) {
        console.error('Error al conectarse a la API', error);
        if (error.response) {
            console.error("Detalles del error:", error.response.data);
        }
        return [];
    }
}