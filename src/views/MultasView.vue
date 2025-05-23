<script setup>
import { onMounted } from 'vue';
import { api } from '../utils/index.js'
import { onUnmounted } from 'vue';
async function respuestas(){
    const respuesta = await api("001");
    console.log(respuesta);
}

let IntervalId;

onMounted(()=> {
    respuestas();
    IntervalId = setInterval(respuestas, 5000)
});

onUnmounted(()=>{
    clearInterval(IntervalId);
})

</script>
<template>
</template>