<!--
 * @职业: 自由 开发者
 * @Description:
 * @Author: KeHan
 * @Date: 2024-03-21 10:16:51
 * @LastEditTime: 2024-03-21 10:56:43
 * @LastEditors: KeHan
-->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const percentageRef = ref(0)
const isDisplay = ref(false)
const router = useRouter()

const intervalId = setInterval(() => {
  if (percentageRef.value < 100) {
    percentageRef.value += 1; // 每100毫秒增加0.67%
  } else {
    isDisplay.value = true
    clearInterval(intervalId)

    router.push({ path: '/load' }) // 修改这里
  }
}, 100) // 每1000毫秒执行一次
</script>

<template>
  <div class="Load_layout">

    <div
      style="
        text-align: center;
        border-radius: 20px;
        width: 160px;
        height: 150px;
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      "
    >

      <div class="animate__animated animate__lightSpeedInRight animate__delay-2s">
        <svg t="1723861966864" class="icon" viewBox="0 0 1210 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4868" width="64" height="64"><path d="M183.687107 1023.999958H38.963932a38.963932 38.963932 0 0 1-38.963932-38.963932V38.963932A38.963932 38.963932 0 0 1 38.963932 0h144.723175a38.963932 38.963932 0 0 1 38.963932 38.963932v946.072094a38.963932 38.963932 0 0 1-38.963932 38.963932z m-139.156899-44.530207h133.590623V44.530208H44.530208zM450.951847 1023.999958H306.145178a38.963932 38.963932 0 0 1-38.963932-38.963932V38.963932a38.963932 38.963932 0 0 1 38.963932-38.963932h144.723175a38.963932 38.963932 0 0 1 38.963932 38.963932v946.072094a38.963932 38.963932 0 0 1-38.880438 38.963932z m-139.156899-44.530207h133.590623V44.530208H311.711454z" fill="#333333" p-id="4869"></path><path d="M550.620305 159.603932l154.281267-89.074331 489.734875 848.245686-154.281267 89.074331-489.734875-848.245686Z" fill="#FF505E" p-id="4870"></path><path d="M1046.52946 1023.999958a38.963932 38.963932 0 0 1-33.801211-19.481966L539.692202 185.203917a38.963932 38.963932 0 0 1 14.263582-53.227514l125.366451-72.361587a38.963932 38.963932 0 0 1 53.213598 14.263582l473.036047 819.300159a38.963932 38.963932 0 0 1-14.263582 53.227514l-125.36645 72.361588a38.671702 38.671702 0 0 1-19.412388 5.232299z m-465.493743-856.2324L1048.505488 977.43806l115.722878-66.795312L696.758594 100.944415z" fill="#333333" p-id="4871"></path></svg>

      </div>
     <h1 class="animate__animated animate__lightSpeedInLeft animate__delay-2s">Global Book</h1>
      <div style="text-align: center; padding-left: 50%; padding-top: 2%; margin-top: 5%">
        <div class="dot-flashing"></div>
      </div>
      <n-progress type="line" :percentage="percentageRef" :show-indicator="false" processing />
      <div class="animate__animated animate__jello" v-show="isDisplay">加载完成</div>
      <!-- <video autoplay>
        <source src="../assets/loadMusic.mp3" type="audio/mpeg">
      </video> -->

    </div>
  </div>
</template>

<style scoped>
video {
  width: 0;
  height: 0;
  overflow: hidden;
}

/* CSS */
.circle {
  width: 550px;
  height: 550px;
  border: 2px solid #eac5e8;
  border-radius: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: glow-559fb83f 1s ease-in-out infinite;
  margin: auto;
  position: absolute;
  top: -180px;
  left: 0;
  right: -8px;
  bottom: 0;

}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 10px #eac5e8, 0 0 20px #eac5e8, 0 0 30px #eac5e8, 0 0 40px #eac5e8;
  }
  50% {
    box-shadow: 0 0 20px #eac5e8, 0 0 30px #eac5e8, 0 0 40px #eac5e8, 0 0 50px #eac5e8, 0 0 65px #eac5e8;
  }
}

.Load_layout {
  background-color: #222222;
  height: 100%;
  background-image: url("../assets/laodx1.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
