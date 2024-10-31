<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'
import * as cheerio from 'cheerio'

// 导入Naive UI的消息提示组件
import { useMessage } from 'naive-ui'

interface EpisodeCollection {
  title?: string,
  url?: string
}
const props = defineProps({
  books: Array<EpisodeCollection>
})
const books = ref(props.books ?? [])
const ChapterList = ref<EpisodeCollection[]>([])

const readerContent = ref('')

const ReaderProp = ref<EpisodeCollection>();

const NeworldscroEX = ref<HTMLElement | null>(null)
// 初始化消息提示组件
const message = useMessage()

watch(props, (newVal, oldVal) => {
  books.value = []
  console.log('阅读')
  console.log('Favorite changed from', oldVal, 'to', newVal)
  ChapterList.value = newVal.books ?? [] // 修复类型不匹配的问题
  active.value = true;
  // if (NeworldscroE.value) {//将页面滚动到顶部
  //   NeworldscroE.value.scrollTop = 0
  // }
  setTimeout(() => {
    if (props.books) {
      axios.get(props.books[0].url ?? '')
        .then((resp) => {
          if (props.books) {
            ReaderProp.value = props.books[0];
          }
          const $ = cheerio.load(resp.data);
          readerContent.value = $("div#content").html() ?? ''

        })
        .catch((err) => [
          console.log(err)
        ]);
    }
  }, 500)
})

async function showActive() {
  active.value = !active.value;
}

//设置文章
async function setReaderBook(epi: EpisodeCollection) {
  if (NeworldscroEX.value) {//将页面滚动到顶部
    NeworldscroEX.value.scrollTop = 0
  }
  message.loading('正在加载...', { duration: 1500 });
  axios.get(epi.url ?? '')
    .then((resp) => {
      ReaderProp.value = epi;
      const $ = cheerio.load(resp.data);
      readerContent.value = $("div#content").html()?.replace("全本小说网 www.quanben.so", "") ?? '';
      message.success('加载完毕', { duration: 1500 });
    })
    .catch((err) => [
      console.log(err)
    ]);
}
const active = ref(false)

const readerbackgroundcolor = ref('color:#555; background-color:#1b1b1f')
const readerFontSizeNumber = ref(18)
const readerFontSize = ref('font-size: ' + readerFontSizeNumber.value + 'px;')
const readerFontFamily = ref('font-family: "SimHei", sans-serif;')
const setbookAddFontSizeStart = async () => {
  readerFontSizeNumber.value = readerFontSizeNumber.value + 1
  readerFontSize.value = 'font-size: ' + readerFontSizeNumber.value + 'px;'
}

const setbookAddFontSizeEnd = async () => {
  readerFontSizeNumber.value = readerFontSizeNumber.value - 1
  readerFontSize.value = 'font-size: ' + readerFontSizeNumber.value + 'px;'
}
const setbookFontFamily = async (fonts: string) => {
  switch (fonts) {
    case '宋体':
      fonts = 'SimSun';
      break;
    case '黑体':
      fonts = 'SimHei';
      break;
    case '楷体':
      fonts = 'KaiTi';
      break;
    case '仿宋':
      fonts = 'FangSong';
      break;
    case '微软雅黑':
  }
  readerFontFamily.value = 'font-family:' + fonts + ';';
}
</script>

<template>
  <div style="width: 100%;height: 100%;">
    <n-drawer v-model:show="active" :width="302" placement="right">
      <n-drawer-content title="医武兵王" :native-scrollbar="false">
        <n-space vertical>
          <div :style="ReaderProp?.title == item.title ? 'box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);' : ''"
            class="BookChapter" v-for="(item, index) in ChapterList" :key="index" @click="setReaderBook(item)">
            <n-space justify="space-between">
              <div style="max-width: 200px; /* 可以根据需要调整 */
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;margin-top: 7px">
                {{ item.title }}
              </div>
              <div>
                <svg t="1725859481016" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="5420" width="17" height="17">
                  <path
                    d="M741.658197 70.618522C741.624512 70.618522 741.510198 970.8933 741.510198 970.8933 741.510198 967.484367 744.402062 960.328787 757.172574 955.341177 765.103987 952.243531 772.645392 953.032622 778.15685 955.73258 779.929322 956.60087 780.347896 956.945082 780.026811 956.581185L538.476226 682.823858C524.419874 666.893325 499.580126 666.893325 485.523774 682.823858L243.973189 956.581185C243.625181 956.975607 244.002266 956.664356 245.716407 955.815063 251.170364 953.112862 258.658982 952.274232 266.612622 955.317131 279.571439 960.274922 282.489802 967.49526 282.489802 970.8933L282.489802 70.729905C282.489802 70.66506 741.658197 70.618522 741.658197 70.618522ZM211.87128 970.8933C211.87128 1023.036375 262.443093 1042.384138 296.925623 1003.303936L538.476226 729.54659 485.523774 729.54659 727.074377 1003.303936C761.63909 1042.477283 812.12872 1022.758279 812.12872 970.8933L812.12872 70.729905C812.12872 31.552656 780.676537 0 741.658197 0L282.341803 0C243.451901 0 211.87128 31.745727 211.87128 70.729905L211.87128 970.8933Z"
                    fill="#389BFF" p-id="5421"></path>
                </svg>
              </div>
            </n-space>
          </div>

        </n-space>
      </n-drawer-content>
    </n-drawer>
    <!--  功能区块  -->
    <div style="width: 100%;height: 40px;padding-left: 1%;padding-right: 1%;">
      <n-space>
        <n-button-group>
          <n-button strong secondary @click="showActive">
            展开目录
          </n-button>

        </n-button-group>
        <n-button-group>
          <n-button strong secondary @click="setbookAddFontSizeEnd">
            <template #icon>
              <svg t="1725861109584" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="7681" width="14" height="14">
                <path
                  d="M375 102L62.2 923h117.1l79-224.7h341.9L684 923h117.1L488.4 102H375z m-83.3 503.5l123-341.4c4.9-13.4 9.4-32.5 13.2-57.2h2.7c4.6 27.2 8.8 46.3 12.7 57.2l124 341.4H291.7zM725.4 283.6h235v90.6h-235z"
                  p-id="7682"></path>
              </svg>
            </template>
            字体
          </n-button>
          <n-button strong secondary>
            <span style="font-size: 15px;">{{ readerFontSizeNumber }}</span>
          </n-button>
          <n-button strong secondary @click="setbookAddFontSizeStart">
            <template #icon>
              <svg t="1725861126100" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="8743" width="14" height="14">
                <path
                  d="M313.6 184.8L63.6 841h93.6l63.1-179.6h273.3l67 179.6h93.6L404.3 184.8h-90.7z m-66.5 402.5l98.3-272.8c4-10.7 7.5-26 10.6-45.8h2.1c3.7 21.8 7.1 37 10.2 45.8l99.1 272.8H247.1zM825.9 319.5V186h-66.7v133.5H625.7v67h133.5v132.9h66.7V386.5h132.9v-67z"
                  p-id="8744"></path>
              </svg>
            </template>
            字体
          </n-button>
        </n-button-group>
        <n-button-group>
          <n-button strong secondary @click="setbookFontFamily('黑体')">
            黑体
          </n-button>
          <n-button strong secondary @click="setbookFontFamily('宋体')">
            宋体
          </n-button>
          <n-button strong secondary @click="setbookFontFamily('楷体')">
            楷体
          </n-button>
        </n-button-group>

        <n-button-group>
          <n-button color="#1b1b1f" @click="readerbackgroundcolor = 'color:#555; background-color:#1b1b1f'">
            #1b1b1f
          </n-button>
          <n-button color="#f1ede4" @click="readerbackgroundcolor = 'color:#555; background-color:#f1ede4'">
            #f1ede4
          </n-button>
          <n-button color="#efe7cd" @click="readerbackgroundcolor = 'color:#555; background-color:#efe7cd'">
            #efe7cd
          </n-button>
          <n-button color="#d6edd6" @click="readerbackgroundcolor = 'color:#555; background-color:#d6edd6'">
            #d6edd6
          </n-button>
          <n-button color="#d8e5e9" @click="readerbackgroundcolor = 'color:#555; background-color:#d8e5e9'">
            #d8e5e9
          </n-button>
          <n-button color="#121215" @click="readerbackgroundcolor = 'color:#555; background-color:#121215'">
            #121215
          </n-button>
        </n-button-group>

      </n-space>
    </div>
    <div ref="NeworldscroEX" class="chapterReader NeworldscroE"
      :style="readerFontFamily + readerFontSize + readerbackgroundcolor" v-html="readerContent">

    </div>
  </div>
</template>

<style scoped>
.chapterReader {
  width: 100%;
  height: 95.5%;
  padding-left: 1%;
  padding-right: 1%;
}

.BookChapter {
  width: 100%;
  height: 40px;
  background-color: #2c2c32;
  border: 1px solid #474747;
  border-radius: 5px;
  transition: transform 0.3s;
  cursor: pointer;
  padding-left: 10px;
}


.BookChapter:hover {

  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);

}

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
</style>
