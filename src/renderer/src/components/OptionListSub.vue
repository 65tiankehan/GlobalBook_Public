<script setup lang="ts">
import { ref, watch } from 'vue'
// 导入Vuex的store工具
import { useStore } from 'vuex'
interface book {
  name?: string,
  chapter?: string,
  LatestChapterUrl?: string,
  author?: string,
  url?: string,
  LastUpdateTime?: string,
  typesOf?: string,
  favorites?: boolean
}

// 初始化Vuex store实例
const store = useStore()
const setBookDetailsLoading = (url: string) => {
  store.commit('SET_BOOKDETAILSLOADING', url)
}

const props = defineProps({
  books: Array<book>
})
const books = ref(props.books ?? [])
const NeworldscroE = ref<HTMLElement | null>(null)
watch(props, (newVal, oldVal) => {
  books.value = []
  console.log('Favorite changed from', oldVal, 'to', newVal)
  if (NeworldscroE.value) {//将页面滚动到顶部
    NeworldscroE.value.scrollTop = 0
  }
  setTimeout(() => {
    books.value = props.books ?? []
  }, 500)
})


//通知Layout进入详情加载
const showDetails = (url: string | undefined) => {

if (url) {
  console.log('url is not null')
  console.log(url);
  // 获取当前时间的时间戳
  const timestamp = Date.now()
  setBookDetailsLoading(url + '${' + `${timestamp}`)
} else {
  console.log('')
}

}
</script>

<template>
  <div class="optionList">
    <div class="div2_Layout">
      <div class="accountPmc_Card accountPmc_Card_row animate__animated animate__backInRight" style="margin-top: 0px">
        <div class="accountPmc_Card_P accountPmc_Card_P_Hideout setup_button_height accountPmc_Card_P_d"
          style="justify-content: flex-start;background-color: rgb(181 168 168 / 10%);">
          <div style="display: flex; align-items: flex-start; justify-content: space-between">
            <n-button text style="font-size: 24px">
              <svg t="1723896190096" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="1448" width="24" height="24">
                <path
                  d="M206.9 348.7c53.2-60.2 95.8-127.2 90.6-200.9-0.5-7.5-0.4-15-0.9-22.4-0.3-3.6 2.4-6.7 6.1-7 2.2-0.1 4.3-0.3 6.4-0.3 160.2 0 290.1 124 290.1 276.9 0 11.5-0.8 22.7-2.3 33.8-0.8 6.1 6.4 9.7 10.8 5.4 46.2-44.6 76.7-103.9 82.8-170.2 0.4-4.6 5.5-7.3 9.7-4.9 106.4 62.5 177.5 174.3 177.5 302.3 0 146.3-92.9 271.9-225.5 326-24 9.8-50.7 11.2-75.7 4-57.3-16.4-111.5-46.7-156.9-90.8-17-16.6-31.8-34.5-44.9-53.2-3-4.4-9.7-3.4-11.3 1.5-13.5 39.1-19.9 79.9-19.3 120.8 0.1 4.8-4.9 8-9.3 5.9-118.5-59.3-199.7-177.5-199.7-314.2 0-76.2 24.1-149.5 67-207.3"
                  fill="#F02D63" p-id="1449"></path>
              </svg>
            </n-button>
            <p style="color: #c4c4c4">热门小说</p>
          </div>
        </div>
      </div>

      <div ref="NeworldscroE" class="NeworldscroE" style="width: 100%; height: 94%">

        <n-skeleton v-if="books.length <= 0"
          style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;" width="100%"
          :height="40" :sharp="false" size="medium" />
        <n-skeleton v-if="books.length <= 0"
          style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;" width="100%"
          :height="40" :sharp="false" size="medium" />
        <n-skeleton v-if="books.length <= 0"
          style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;" width="100%"
          :height="40" :sharp="false" size="medium" />
        <n-skeleton v-if="books.length <= 0"
          style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;" width="100%"
          :height="40" :sharp="false" size="medium" />
        <n-skeleton v-if="books.length <= 0"
          style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;" width="100%"
          :height="40" :sharp="false" size="medium" />
        <n-skeleton v-if="books.length <= 0"
          style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;" width="100%"
          :height="40" :sharp="false" size="medium" />
        <n-skeleton v-if="books.length <= 0"
          style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;" width="100%"
          :height="40" :sharp="false" size="medium" />
        <n-skeleton v-if="books.length <= 0"
          style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;" width="100%"
          :height="40" :sharp="false" size="medium" />
        <n-skeleton v-if="books.length <= 0"
          style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;" width="100%"
          :height="40" :sharp="false" size="medium" />
        <n-skeleton v-if="books.length <= 0"
          style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;" width="100%"
          :height="40" :sharp="false" size="medium" />
        <n-skeleton v-if="books.length <= 0"
          style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;" width="100%"
          :height="40" :sharp="false" size="medium" />
        <n-skeleton v-if="books.length <= 0"
          style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;" width="100%"
          :height="40" :sharp="false" size="medium" />
        <n-skeleton v-if="books.length <= 0"
          style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;" width="100%"
          :height="40" :sharp="false" size="medium" />
        <n-skeleton v-if="books.length <= 0"
          style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;" width="100%"
          :height="40" :sharp="false" size="medium" />

        <n-skeleton v-if="books.length <= 0"
          style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;" width="100%"
          :height="40" :sharp="false" size="medium" />
        <n-skeleton v-if="books.length <= 0"
          style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;" width="100%"
          :height="40" :sharp="false" size="medium" />
        <n-skeleton v-if="books.length <= 0"
          style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;" width="100%"
          :height="40" :sharp="false" size="medium" />
        <n-skeleton v-if="books.length <= 0"
          style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;" width="100%"
          :height="40" :sharp="false" size="medium" />


        <div class="accountPmc_Card accountPmc_Card_row animate__animated animate__backInRight"
          v-for="(item, index) in props.books" :key="index">
          <div class="accountPmc_Card_P accountPmc_Card_P_Hideout setup_button_height "
            style="justify-content: flex-start">
            <div style="display: flex; align-items: flex-start; justify-content: space-between"  @click="showDetails(item.url)">

              <n-breadcrumb>
                <n-breadcrumb-item>

                  {{ item.typesOf }}

                </n-breadcrumb-item>
                <n-breadcrumb-item>
                  <div style="   max-width: 120px; /* 可以根据需要调整 */
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;">
                    {{ item.name }}
                  </div>


                </n-breadcrumb-item>

              </n-breadcrumb>

              <div style="color: #B3B3B3;
                 max-width: 120px; /* 可以根据需要调整 */
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;">{{ item.author }}</div>

            </div>
          </div>
        </div>





      </div>
    </div>
  </div>
</template>

<style scoped>
.NeworldscroE {
  /* height: 430px; */
  overflow-y: auto;
}

.NeworldscroE::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0px;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 0px;
}

.NeworldscroE::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 0px;
  -webkit-box-shadow: inset 0 0 5px rgba(235, 238, 240, 0.2);
  background: #ebeef0;
}

.NeworldscroE::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(235, 238, 240, 0.2);
  border-radius: 0px;
  background: #f1f6fa;
}

.accountPmc_Card_P {
  width: 230px;
  height: 220px;
  background-color: #d5d2d203;
  border: 1px solid rgb(40 40 40);
  border-radius: 5px;
  margin: 4px;
  margin-bottom: 4px;
  cursor: pointer;
  flex: 1 1 auto;
  padding: 7px;
  text-align: center;
  transition: transform 0.3s,
    box-shadow 0.3s !important;
}

.accountPmc_Card_P:hover {
  /* box-shadow: 0 16px 32px 0 rgba(48, 55, 66, 0.15); */

  /* transition-delay: 0s !important; */
  /* border: 1px solid #78a4fa; */

  /* transform: translateY(-10px)  !important; */
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  /* animation: sparkle 0.5s infinite; */
}

.accountPmc_Card_P_d {
  box-shadow: 0 0 10px rgb(155 155 155 / 30%)
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

.optionList {
  width: 100%;
  height: 100%;

  padding: 5px;
}

.div2_Layout {
  flex: 1 0 100%;
  padding: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  background-color: #1d1d20;
  border-radius: 5px;
  color: #eaeaea;
  /* border: 1px solid rgb(50, 50, 50); */
  height: 100%;
}
</style>
