<script setup lang="ts">
import { useDialog, useMessage } from "naive-ui";
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

import * as iconv from 'iconv-lite';

const dialog = useDialog();
const message = useMessage();
const router = useRouter()
const store = useStore()
const focusState = ref(false)
const searchInputValue = ref('')

interface pageStatus {
  name: string
}


const source = computed(() => store.getters.getSource)
const PageStatus = computed(() => store.getters.getPageStatus)

const setPageStatus = (PageStatus: pageStatus[]) => {
  store.commit('SET_PAGESTATUS', PageStatus)
}

const setSearchContent = (SearchContent: string) => {
  store.commit('SET_SEARCHCONTENT', SearchContent)
}
const ipcHandleMax = () => window.electron.ipcRenderer.send("MaxWin");
const ipcHandleMin = () => window.electron.ipcRenderer.send("MinWin");
const ipcHandleClose = () => {

  //
  dialog.warning({
    title: "警告",
    content: "你确定关闭？",
    positiveText: "确定",
    negativeText: "不确定",
    closable: false,
    onPositiveClick: () => {
      window.electron.ipcRenderer.send("closeWin");
    },
    onNegativeClick: () => {
      message.success("欢迎你回啦");
    }
  });
};
const isUpdate = () => {
  router.push({
    path: '/update'
  })
}

//输入框的focus状态下css变化
const Onfocus = () => [
  focusState.value = true
]
//输入框的Blur状态下css变化
const OnBlur = () => {
  if (searchInputValue.value.length <= 0) {
    focusState.value = false
  }

}

const OnClickSearch = () => {

  // 获取当前时间的时间戳
  const timestamp = Date.now()

  setSearchContent(source.value + 'modules/article/search.php?searchkey=' + encodeGBK(searchInputValue.value) + '${' + `${timestamp}`)
  setPageStatus([{ name: 'searchX' }])
}

function encodeGBK(str: string): string {
  // 将字符串转换为 GBK 编码的 Buffer
  const buffer = iconv.encode(str, 'gbk');

  // 将 Buffer 转换为 URL 编码
  let encodedStr = '';
  for (let i = 0; i < buffer.length; i++) {
    encodedStr += '%' + buffer[i].toString(16).toUpperCase().padStart(2, '0');
  }

  return encodedStr;
}

const OnSetPageStaus = () => {
  setPageStatus([{ name: 'home' }])
}

</script>


<template>
  <div id="titleLabel">

    <div style="
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      ">
      <div style="flex: 25%" class="titleName">
        <div v-show="PageStatus[0].name == 'home'" class="iconTitle">
          <svg t="1723891845235" class="icon" viewBox="0 0 1210 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="4635" width="18" height="18">
            <path
              d="M183.687107 1023.999958H38.963932a38.963932 38.963932 0 0 1-38.963932-38.963932V38.963932A38.963932 38.963932 0 0 1 38.963932 0h144.723175a38.963932 38.963932 0 0 1 38.963932 38.963932v946.072094a38.963932 38.963932 0 0 1-38.963932 38.963932z m-139.156899-44.530207h133.590623V44.530208H44.530208zM450.951847 1023.999958H306.145178a38.963932 38.963932 0 0 1-38.963932-38.963932V38.963932a38.963932 38.963932 0 0 1 38.963932-38.963932h144.723175a38.963932 38.963932 0 0 1 38.963932 38.963932v946.072094a38.963932 38.963932 0 0 1-38.880438 38.963932z m-139.156899-44.530207h133.590623V44.530208H311.711454z"
              fill="#333333" p-id="4636"></path>
            <path
              d="M550.620305 159.603932l154.281267-89.074331 489.734875 848.245686-154.281267 89.074331-489.734875-848.245686Z"
              fill="#FF505E" p-id="4637"></path>
            <path
              d="M1046.52946 1023.999958a38.963932 38.963932 0 0 1-33.801211-19.481966L539.692202 185.203917a38.963932 38.963932 0 0 1 14.263582-53.227514l125.366451-72.361587a38.963932 38.963932 0 0 1 53.213598 14.263582l473.036047 819.300159a38.963932 38.963932 0 0 1-14.263582 53.227514l-125.36645 72.361588a38.671702 38.671702 0 0 1-19.412388 5.232299z m-465.493743-856.2324L1048.505488 977.43806l115.722878-66.795312L696.758594 100.944415z"
              fill="#333333" p-id="4638"></path>
          </svg>
        </div>
        <div v-show="PageStatus[0].name == 'home'" class="titleText">Global Book</div>
        <div v-show="PageStatus[0].name != 'home'">
          <n-button dashed circle ghost round style="  -webkit-app-region: no-drag;" size="small"
            @click="OnSetPageStaus">

            <template #icon>
              <svg t="1724037538747" class="icon" viewBox="0 0 1025 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="14443" width="24" height="24">
                <path
                  d="M999.918589 914.938096c-11.34786 0-21.2637-7.968773-23.558543-19.280532-0.311675-1.505427-16.066308-73.448214-83.253344-144.105794C807.557312 661.577557 675.185663 612.072967 509.209666 607.7396l0 195.482841c0 9.033763-5.067427 17.333466-13.11081 21.410513-8.061433 4.113148-17.71975 3.379087-25.045919-1.945863L9.944721 488.423406c-6.225078-4.517483-9.933891-11.752196-9.933891-19.445395s3.672712-14.927912 9.878535-19.463446l461.109419-335.806416c7.326169-5.32495 17.00374-6.096316 25.082021-2.001219 8.061433 4.113148 13.128861 12.3948 13.128861 21.446614l0 207.564762c29.710215 1.083041 81.527699 5.489813 141.608783 21.446614 95.630093 25.376848 175.00976 69.665995 235.971718 131.619537 93.811788 95.37257 139.974595 229.122087 137.182757 397.502435-0.184117 12.30214-9.622215 22.438198-21.869 23.540493C1001.369863 914.900791 1000.634599 914.938096 999.918589 914.938096zM485.174585 559.337305c106.591669 0 201.083365 16.783522 280.903469 49.87162 64.690025 26.808869 119.867342 64.341045 164.02893 111.494233 14.505526 15.461009 26.84497 30.958119 37.348059 45.905284-16.012156-97.50255-54.46251-177.598228-114.946726-239.074028C722.3208 395.179613 529.573239 388.477998 492.261281 388.477998c-3.984387 0-6.169722 0.091457-6.205824 0.091457-6.536753 0.220218-12.871338-2.203386-17.572938-6.72087-4.700397-4.553585-7.363474-10.796713-7.363474-17.333466L461.119046 180.417443 64.975226 468.904605 461.120249 756.069253 461.120249 583.39164C461.120249 570.097917 471.879657 559.337305 485.174585 559.337305z"
                  p-id="14444" data-spm-anchor-id="a313x.search_index.0.i10.2c6a3a81Jb7npG" class="selected"
                  fill="#e6e6e6"></path>
              </svg>
            </template>
          </n-button>
        </div>
      </div>
      <div style="
          flex: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 10px;
        ">
        <div :class="focusState == true ? 'animated-input expanded' : 'animated-input'"
          style="-webkit-app-region: no-drag;">
          <n-input-group>
            <n-button type="info" size="tiny">
              <svg t="1723901601418" class="icon" viewBox="0 0 1337 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="2989" width="10" height="10">
                <path
                  d="M192.481199 878.21683l357.422008 145.78315a89.25499 89.25499 0 0 0 89.295194-89.3354V324.373538A324.333334 324.333334 0 0 0 314.824863 0h-114.383084A83.224247 83.224247 0 0 0 117.237635 83.204145v683.926408a121.17772 121.17772 0 0 0 75.243564 111.086277z m959.068986 0l-357.422008 145.78315a89.25499 89.25499 0 0 1-89.295195-89.3354V324.373538A324.333334 324.333334 0 0 1 1029.206521 0h114.383083a83.224247 83.224247 0 0 1 83.204145 83.204145v683.926408a121.238027 121.238027 0 0 1-75.263667 111.086277z m0 0"
                  fill="#31c445" p-id="2990"></path>
                <path
                  d="M1307.887133 187.274658l-29.992892-29.550638-11.780051-9.830111v619.156234a159.392525 159.392525 0 0 1-99.386637 147.893909l-67.664931 27.761519c18.092228 5.166336 38.194703 8.925499 56.950312 7.518325l103.829284-8.684269c45.009442-10.31257 77.575451-56.28693 77.575451-109.920334v-570.910293c-0.462357-28.364592-11.016156-55.080782-29.530536-73.353932zM177.46465 914.783233a159.010578 159.010578 0 0 1-99.406739-147.89391V141.802859l-18.996839 15.921161-29.992893 29.550638C10.553799 205.547808 0 232.263997 0 260.38736v570.709269c0 53.693711 32.586112 99.627867 77.575451 109.940436l103.849387 8.664167c20.102475 1.648403 41.953866-2.794244 60.930602-8.664167z m0 0"
                  fill="#31c445" p-id="2991"></path>
              </svg>
            </n-button>
            <n-popover trigger="click">
              <template #trigger>
                <n-input @focus="Onfocus" @blur="OnBlur" placeholder="宁可少字，也别错字" size="tiny" :style="{ width: '50%' }"
                  v-model:value="searchInputValue" />
              </template>
              <div class="large-text">
                <n-tabs type="line" animated>
                  <n-tab-pane name="热搜" tab="热搜">
                    <div class="accountPmc_Card accountPmc_Card_row " style="margin-top: 0px">
                      <div class="accountPmc_Card_P accountPmc_Card_P_Hideout setup_button_height"
                        style="justify-content: flex-start;background-color: rgb(181 168 168 / 10%);">
                        <div style="display: flex; align-items: flex-start; justify-content: space-between">
                          <n-button text style="font-size: 24px">
                            <svg t="1723896190096" class="icon" viewBox="0 0 1024 1024" version="1.1"
                              xmlns="http://www.w3.org/2000/svg" p-id="1448" width="24" height="24">
                              <path
                                d="M206.9 348.7c53.2-60.2 95.8-127.2 90.6-200.9-0.5-7.5-0.4-15-0.9-22.4-0.3-3.6 2.4-6.7 6.1-7 2.2-0.1 4.3-0.3 6.4-0.3 160.2 0 290.1 124 290.1 276.9 0 11.5-0.8 22.7-2.3 33.8-0.8 6.1 6.4 9.7 10.8 5.4 46.2-44.6 76.7-103.9 82.8-170.2 0.4-4.6 5.5-7.3 9.7-4.9 106.4 62.5 177.5 174.3 177.5 302.3 0 146.3-92.9 271.9-225.5 326-24 9.8-50.7 11.2-75.7 4-57.3-16.4-111.5-46.7-156.9-90.8-17-16.6-31.8-34.5-44.9-53.2-3-4.4-9.7-3.4-11.3 1.5-13.5 39.1-19.9 79.9-19.3 120.8 0.1 4.8-4.9 8-9.3 5.9-118.5-59.3-199.7-177.5-199.7-314.2 0-76.2 24.1-149.5 67-207.3"
                                fill="#F02D63" p-id="1449"></path>
                            </svg>
                            <p style="color: #c4c4c4;font-size: 12px;">极品修真狂少</p>
                          </n-button>

                          <p style="color: #c4c4c4">热门小说</p>
                        </div>
                      </div>
                    </div>
                    <div class="accountPmc_Card accountPmc_Card_row " style="margin-top: 0px">
                      <div class="accountPmc_Card_P accountPmc_Card_P_Hideout setup_button_height"
                        style="justify-content: flex-start;background-color: rgb(181 168 168 / 10%);">
                        <div style="display: flex; align-items: flex-start; justify-content: space-between">
                          <n-button text style="font-size: 24px">
                            <svg t="1723896190096" class="icon" viewBox="0 0 1024 1024" version="1.1"
                              xmlns="http://www.w3.org/2000/svg" p-id="1448" width="24" height="24">
                              <path
                                d="M206.9 348.7c53.2-60.2 95.8-127.2 90.6-200.9-0.5-7.5-0.4-15-0.9-22.4-0.3-3.6 2.4-6.7 6.1-7 2.2-0.1 4.3-0.3 6.4-0.3 160.2 0 290.1 124 290.1 276.9 0 11.5-0.8 22.7-2.3 33.8-0.8 6.1 6.4 9.7 10.8 5.4 46.2-44.6 76.7-103.9 82.8-170.2 0.4-4.6 5.5-7.3 9.7-4.9 106.4 62.5 177.5 174.3 177.5 302.3 0 146.3-92.9 271.9-225.5 326-24 9.8-50.7 11.2-75.7 4-57.3-16.4-111.5-46.7-156.9-90.8-17-16.6-31.8-34.5-44.9-53.2-3-4.4-9.7-3.4-11.3 1.5-13.5 39.1-19.9 79.9-19.3 120.8 0.1 4.8-4.9 8-9.3 5.9-118.5-59.3-199.7-177.5-199.7-314.2 0-76.2 24.1-149.5 67-207.3"
                                fill="#F02D63" p-id="1449"></path>
                            </svg>
                            <p style="color: #c4c4c4;font-size: 12px;">万相之王</p>
                          </n-button>

                          <p style="color: #c4c4c4">热门小说</p>
                        </div>
                      </div>
                    </div>
                    <div class="accountPmc_Card accountPmc_Card_row " style="margin-top: 0px">
                      <div class="accountPmc_Card_P accountPmc_Card_P_Hideout setup_button_height"
                        style="justify-content: flex-start;background-color: rgb(181 168 168 / 10%);">
                        <div style="display: flex; align-items: flex-start; justify-content: space-between">
                          <n-button text style="font-size: 24px">
                            <svg t="1723896190096" class="icon" viewBox="0 0 1024 1024" version="1.1"
                              xmlns="http://www.w3.org/2000/svg" p-id="1448" width="24" height="24">
                              <path
                                d="M206.9 348.7c53.2-60.2 95.8-127.2 90.6-200.9-0.5-7.5-0.4-15-0.9-22.4-0.3-3.6 2.4-6.7 6.1-7 2.2-0.1 4.3-0.3 6.4-0.3 160.2 0 290.1 124 290.1 276.9 0 11.5-0.8 22.7-2.3 33.8-0.8 6.1 6.4 9.7 10.8 5.4 46.2-44.6 76.7-103.9 82.8-170.2 0.4-4.6 5.5-7.3 9.7-4.9 106.4 62.5 177.5 174.3 177.5 302.3 0 146.3-92.9 271.9-225.5 326-24 9.8-50.7 11.2-75.7 4-57.3-16.4-111.5-46.7-156.9-90.8-17-16.6-31.8-34.5-44.9-53.2-3-4.4-9.7-3.4-11.3 1.5-13.5 39.1-19.9 79.9-19.3 120.8 0.1 4.8-4.9 8-9.3 5.9-118.5-59.3-199.7-177.5-199.7-314.2 0-76.2 24.1-149.5 67-207.3"
                                fill="#F02D63" p-id="1449"></path>
                            </svg>
                            <p style="color: #c4c4c4;font-size: 12px;">混世小魔女</p>
                          </n-button>

                          <p style="color: #c4c4c4">热门小说</p>
                        </div>
                      </div>
                    </div>
                    <div class="accountPmc_Card accountPmc_Card_row " style="margin-top: 0px">
                      <div class="accountPmc_Card_P accountPmc_Card_P_Hideout setup_button_height"
                        style="justify-content: flex-start;background-color: rgb(181 168 168 / 10%);">
                        <div style="display: flex; align-items: flex-start; justify-content: space-between">
                          <n-button text style="font-size: 24px">
                            <svg t="1723896190096" class="icon" viewBox="0 0 1024 1024" version="1.1"
                              xmlns="http://www.w3.org/2000/svg" p-id="1448" width="24" height="24">
                              <path
                                d="M206.9 348.7c53.2-60.2 95.8-127.2 90.6-200.9-0.5-7.5-0.4-15-0.9-22.4-0.3-3.6 2.4-6.7 6.1-7 2.2-0.1 4.3-0.3 6.4-0.3 160.2 0 290.1 124 290.1 276.9 0 11.5-0.8 22.7-2.3 33.8-0.8 6.1 6.4 9.7 10.8 5.4 46.2-44.6 76.7-103.9 82.8-170.2 0.4-4.6 5.5-7.3 9.7-4.9 106.4 62.5 177.5 174.3 177.5 302.3 0 146.3-92.9 271.9-225.5 326-24 9.8-50.7 11.2-75.7 4-57.3-16.4-111.5-46.7-156.9-90.8-17-16.6-31.8-34.5-44.9-53.2-3-4.4-9.7-3.4-11.3 1.5-13.5 39.1-19.9 79.9-19.3 120.8 0.1 4.8-4.9 8-9.3 5.9-118.5-59.3-199.7-177.5-199.7-314.2 0-76.2 24.1-149.5 67-207.3"
                                fill="#F02D63" p-id="1449"></path>
                            </svg>
                            <p style="color: #c4c4c4;font-size: 12px;">无尽世界直播系统</p>
                          </n-button>

                          <p style="color: #c4c4c4">热门小说</p>
                        </div>
                      </div>
                    </div>
                  </n-tab-pane>
                  <n-tab-pane name="玄幻" tab="玄幻"></n-tab-pane>
                  <n-tab-pane name="都市" tab="都市"></n-tab-pane>
                  <n-tab-pane name="女生" tab="女生"></n-tab-pane>
                  <n-tab-pane name="男生" tab="男生"></n-tab-pane>
                </n-tabs>
              </div>
            </n-popover>
            <n-button type="info" size="tiny" @click="OnClickSearch">
              搜索
            </n-button>
          </n-input-group>
        </div>


      </div>
      <div style="flex: 25%">
        <div class="Ternarylinkage">
          <div class="BinarylinkageGan" @click="ipcHandleClose">
            <svg t="1679034496978" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="9573" width="15" height="15">
              <path
                d="M548.992 503.744L885.44 167.328a31.968 31.968 0 1 0-45.248-45.248L503.744 458.496 167.328 122.08a31.968 31.968 0 1 0-45.248 45.248l336.416 336.416L122.08 840.16a31.968 31.968 0 1 0 45.248 45.248l336.416-336.416L840.16 885.44a31.968 31.968 0 1 0 45.248-45.248L548.992 503.744z"
                p-id="9574" fill="#8a8a8a"></path>
            </svg>
          </div>

          <div class="Binarylinkage" @click="ipcHandleMax">
            <svg t="1679034543228" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="10836" width="15" height="15">
              <path
                d="M832 640l-128 0 0-256 128 0c105.9 0 192-86.1 192-192s-86.1-192-192-192-192 86.1-192 192l0 128L384 320l0-128c0-105.9-86.1-192-192-192s-192 86.1-192 192 86.1 192 192 192l128 0 0 256L192 640c-105.9 0-192 86.1-192 192 0 105.9 86.1 192 192 192s192-86.1 192-192l0-128 256 0 0 128c0 105.9 86.1 192 192 192s192-86.1 192-192S937.9 640 832 640zM704 192c0-70.6 57.4-128 128-128s128 57.4 128 128-57.4 128-128 128l-128 0L704 192zM192 320c-70.6 0-128-57.4-128-128s57.4-128 128-128 128 57.4 128 128l0 128L192 320zM320 832c0 70.6-57.4 128-128 128s-128-57.4-128-128 57.4-128 128-128l128 0L320 832zM384 384l256 0 0 256L384 640 384 384zM832 960c-70.6 0-128-57.4-128-128l0-128 128 0c70.6 0 128 57.4 128 128S902.6 960 832 960z"
                p-id="10837" fill="#8a8a8a"></path>
            </svg>
          </div>
          <div class="Binarylinkage" @click="ipcHandleMin">
            <svg t="1679034573870" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="11924" width="15" height="15">
              <path d="M832 521.6H192c-19.2 0-32-12.8-32-32s12.8-32 32-32h640c19.2 0 32 12.8 32 32s-12.8 32-32 32z"
                fill="#bfbfbf" p-id="11925"></path>
            </svg>
          </div>
          <div class="Binarylinkage" style="width: 15%">
            <n-popover trigger="hover">
              <template #trigger>
                <div>
                  <svg t="1710922892877" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="7749" width="15" height="15">
                    <path
                      d="M509.043157 417.431158c-52.987818 0-96.134501 43.098587-96.134501 96.133478 0 52.989865 43.146683 96.136547 96.134501 96.136547s96.134501-43.146683 96.134501-96.136547C605.178681 460.57784 562.030975 417.431158 509.043157 417.431158z"
                      fill="#272636" p-id="7750"></path>
                    <path
                      d="M962.204074 505.346463c-1.732457-27.29567-8.763594-53.700039-20.889773-78.843696-4.623297-9.657964-13.860682-15.379269-25.25315-14.802124l-60.943001 3.778046c-7.297197-26.613124-17.48421-51.862181-30.391171-75.487252l48.923246-55.43352c7.033184-7.977695 8.555863-19.422352 3.829212-28.976962-12.33391-25.090445-28.975938-46.925752-49.340755-64.881706-20.422122-18.003026-44.148499-31.756261-70.501704-40.943504-9.971096-3.463891-21.205974-0.576121-28.29237 7.454786l-40.368406 45.721321c-23.883967-13.542434-48.925293-24.199145-74.854848-31.757285l-4.619204-73.963549c-0.683569-10.602476-7.664563-19.789719-17.743106-23.202445-24.783453-8.4126-50.126654-12.388145-76.031651-11.190877l0 0.082888-1.52575 0 0-0.082888c-25.90295-1.198292-51.248198 2.778276-76.030627 11.190877-10.079566 3.412726-17.060561 12.599969-17.743106 23.202445l-4.619204 73.963549c-25.931602 7.55814-50.971905 18.21485-74.854848 31.757285l-40.368406-45.721321c-7.088442-8.03193-18.322297-10.918677-28.293393-7.454786-26.353205 9.187243-50.079582 22.940478-70.500681 40.943504-20.36584 17.955954-37.007869 39.792285-49.341778 64.881706-4.725628 9.55461-3.202948 20.999266 3.830235 28.976962l48.924269 55.43352c-12.909008 23.62507-23.094998 48.874127-30.392194 75.487252l-60.943001-3.778046c-11.391445-0.577145-20.629853 5.143137-25.252127 14.802124-12.126178 25.143657-19.158339 51.548026-20.890796 78.843696-1.629103 27.244504 2.046612 54.384631 10.969842 80.736812 3.411703 10.027377 12.598946 17.009396 23.150256 17.691941l73.963549 4.618181c7.614421 25.931602 18.267039 51.074236 31.81459 74.855872l-45.828768 40.418548c-7.979742 7.090489-10.918677 18.269086-7.402597 28.293393 9.18622 26.354228 22.890336 50.030463 40.948621 70.659293 18.10945 20.36584 39.946804 37.007869 64.87966 49.29266 9.553587 4.720511 21.051455 3.201925 28.975938-3.88754l55.486732-48.873104c23.620977 12.915148 48.870034 23.044856 75.483158 30.342052l-3.77907 60.891835c-0.626263 10.658757 5.14416 20.577664 14.753005 25.195845 24.982998 12.181437 51.444673 19.266809 78.896908 20.998243 1.195222 0.092098 2.382257 0.153496 3.568269 0.211824l0 0.172939 3.158946 0 0-0.198521c1.041726-0.054235 2.082428-0.105401 3.131317-0.186242 27.452235-1.730411 53.91391-8.815783 78.897931-20.998243 9.608845-4.618181 15.379269-14.537088 14.753005-25.195845l-3.77907-60.891835c26.613124-7.29822 51.863205-17.426905 75.484182-30.342052l55.486732 48.873104c7.924483 7.089465 19.422352 8.608052 28.975938 3.88754 24.932856-12.284791 46.77021-28.92682 64.87966-49.29266 18.057261-20.62883 31.762401-44.305065 40.948621-70.659293 3.51608-10.025331 0.577145-21.203928-7.402597-28.293393l-45.828768-40.418548c13.546527-23.781636 24.199145-48.925293 31.81459-74.855872l73.963549-4.618181c10.55131-0.682545 19.736507-7.664563 23.14821-17.691941C960.157461 559.731094 963.833177 532.590967 962.204074 505.346463zM511.034511 705.69856c-105.96745 0-191.869912-86.424348-191.869912-193.032388 0-106.609063 85.902462-193.032388 191.869912-193.032388 105.966427 0 191.867866 86.423325 191.867866 193.032388C702.902376 619.274212 616.999914 705.69856 511.034511 705.69856z"
                      fill="#bfbfbf" p-id="7751" data-spm-anchor-id="a313x.search_index.0.i11.19ff3a81MiiXrv"
                      class="selected"></path>
                  </svg>
                </div>
              </template>
              <!-- Blogger -->

              <div class="accountPmc_Card accountPmc_Card_row ">
                <div class="accountPmc_Card_P accountPmc_Card_P_Hideout setup_button_height"
                  style="justify-content: flex-start">
                  <div style="display: flex; align-items: flex-start; justify-content: space-between">
                    <span>开启本地阅读器</span>
                    <n-switch :round="false" />
                  </div>
                </div>
              </div>
              <div class="accountPmc_Card accountPmc_Card_row ">
                <div class="accountPmc_Card_P accountPmc_Card_P_Hideout setup_button_height"
                  style="justify-content: flex-start">
                  <div style="display: flex; align-items: flex-start; justify-content: space-between">
                    <span>暗黑/耀白</span>
                    <n-switch :round="false" :value="true" />
                  </div>
                </div>
              </div>
              <div class="accountPmc_Card accountPmc_Card_row ">
                <div class="accountPmc_Card_P accountPmc_Card_P_Hideout setup_button_height"
                  style="justify-content: flex-start; height: 250px">
                  <div style="display: flex; align-items: flex-start; justify-content: space-between">
                    <span>当前版本：v0.0.1</span>
                    <n-button size="tiny" @click="isUpdate">检查版本</n-button>
                  </div>
                </div>
              </div>
            </n-popover>
          </div>


        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.setup_button_height {
  height: 55px !important;
}

.accountPmc_Card_P_Hideout {
  height: 40px !important;

}

.accountPmc_Card_row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}

.accountPmc_Card {
  margin-top: 3px;
  flex: 1 1 auto;
}

.animated-input {
  transition: width 0.5s ease-in-out;
  width: 130px;

  outline: none;
  cursor: pointer;
}

.animated-input.expanded {
  width: 250px;
}

.Binarylinkage {
  width: 15%;
  height: 28px;
  /* background-color: aqua; */
  /* padding-top: 10%; */
  float: right;
  padding: 6px;
  /* margin-top: 6px; */
  /* padding-top: 6px; */
  text-align: center;
  -webkit-app-region: no-drag;
  margin-top: 4px;
  border-radius: 5px;
}

.Binarylinkage:hover {
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.2);
  border-color: #eee;
  transition: all 0.2s ease-in-out;
  background-color: #333333;
}

.BinarylinkageGan {
  width: 15%;
  height: 28px;
  /* background-color: aqua; */
  /* padding-top: 10%; */
  float: right;
  padding: 6px;
  border-top-right-radius: 5px;
  text-align: center;
  -webkit-app-region: no-drag;
  margin-top: 4px;
  border-radius: 5px;
  border-top-right-radius: 10px;
  margin-right: 5px;
}

.BinarylinkageGan:hover {
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.2);
  border-color: #eee;
  transition: all 0.2s ease-in-out;
  background-color: #c20f1e;
}

.Ternarylinkage {
  width: 195px;
  height: 30px;
  /* background: #009966; */
  float: right;
}

.titleText {
  float: left;
  margin-left: 15px;
  color: #eaeaea;
}

.iconTitle {
  width: 16px;
  height: 16px;
  float: left;
}

.titleName {
  float: left;
  padding-top: 5px;
  padding-left: 10px;
  font-size: 13px;
}

#titleLabel {
  position: fixed;
  z-index: 100;
  height: 33px;
  width: 100%;
  top: 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  -webkit-app-region: drag;
  background-color: #1b1b1f;

}

.accountPmc_Card_P {
  width: 230px;
  height: 220px;
  background-color: #d5d2d203;
  border: 1px solid rgb(87 85 85);
  border-radius: 5px;
  margin: 4px;
  margin-bottom: 4px;
  cursor: pointer;
  flex: 1 1 auto;
  padding: 10px;
  text-align: center;
  transition: transform 0.3s,
    box-shadow 0.3s !important;
}

.accountPmc_Card_P:hover {
  /* box-shadow: 0 16px 32px 0 rgba(48, 55, 66, 0.15); */

  /* transition-delay: 0s !important; */
  /* border: 1px solid #78a4fa; */

  /* transform: translateY(-10px)  !important; */
  box-shadow: 0 0 10px rgba(182, 182, 182, 0.3);
  /* animation: sparkle 0.5s infinite; */
}

.accountPmc_Card_P_d {
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.setup_button_height {
  height: 55px !important;
}

.accountPmc_Card_P_Hideout {
  height: 40px !important;
}

.accountPmc_Card_row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}

.accountPmc_Card {
  margin-top: 3px;
  flex: 1 1 auto;
}

.n-input-group {
  justify-content: center;
}
</style>
