<script setup lang="ts">
import Taskbar from './Taskbar.vue'
import OptionListSub from './OptionListSub.vue'
import ArticlePage from "./ArticlePage.vue";
import SearchPage from "./SearchPage.vue";
import Reader from "./Reader.vue";
import { useRouter } from 'vue-router'

import { useStore } from 'vuex'
import { ref, computed, watch, onBeforeMount } from 'vue'
import axios from 'axios'
import * as cheerio from 'cheerio'
import IndexedDBManager from '../indexedDB.js'

// 导入Naive UI的消息提示组件
import { useMessage } from 'naive-ui'

interface pageStatus {
  name: string
}

const router = useRouter()
const showModel = ref(false)

const dbManager = new IndexedDBManager()
const store = useStore()
const RecommendedBookList = computed(() => store.getters.getRecommendedBookList)

// 初始化消息提示组件
const message = useMessage()

const PageStatus = computed(() => store.getters.getPageStatus)

const SearchContent = computed(() => store.getters.getSearchContent)

const protocol18 = computed(() => store.getters.getProtocol18)
// 使用computed属性来访问getter
const showUpdate = computed(() => store.getters.getShowUpdate)
// 使用computed属性来访问getter
const versionDescriptions = computed(() => store.getters.getVersionDescriptions)


// 使用computed属性来访问getter
const BookDetailsLoading = computed(() => store.getters.getBookDetailsLoading)

const setProtocol18 = (protocol18: boolean) => {
  store.commit('SET_PROTOCOL18', protocol18)
}

const setPageStatus = (PageStatus: pageStatus[]) => {
  store.commit('SET_PAGESTATUS', PageStatus)
}

// 使用store.commit来调用mutation
const setshowUpdate = (showUpdate: boolean) => {
  store.commit('SET_SHOWUPDATE', showUpdate)
}

const SearchLayout = ref('')



// 重置 dramaDetails 的函数
function resetDramaDetails() {
  dramaDetails.value = {
    title: '',
    imgUrl: '',
    tags: [],
    Scenario: '',
    streamingSources: []
  }
}


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

interface EpisodeCollection {
  title?: string,
  url?: string
}

interface tag {
  name?: string,
  color?: string
}

interface tvDrama {
  title?: string,
  imgUrl?: string,
  tags?: tag[],
  Scenario?: string,
  streamingSources?: EpisodeCollection[]
}

const Reads = ref<EpisodeCollection[]>([])

const RecommendedBook = ref<book[]>([])

function extractBeforeDollarBrace(str: string): string {
  const index = str.indexOf('${')
  if (index !== -1) {
    return str.slice(0, index)
  }
  return str // 如果没有找到 '${'，返回原始字符串
}

// 创建一个 tvDrama 类型的变量
const dramaDetails = ref<tvDrama>({
  title: '',
  imgUrl: '',
  tags: [],
  Scenario: '',
  streamingSources: []
})


//往DB插入用户同意或者取消协议
async function setProtocol18DB(value: boolean) {
  console.log('setProtocol18DB')
  let history = await dbManager.get('protocol18')

  // 如果`favorites`不存在，则创建一个新的`favorites`对象
  if (!history) {
    history = { id: 'protocol18', protocol18: false }
    await dbManager.add(history)
  }
  if (!value) {
    window.electron.ipcRenderer.send('closeWin')
  }
  history.protocol18 = value

  setProtocol18(false)
  // 更新`Protocol18`对象
  await dbManager.update(history.id, history)

}

//往DB，书架，插入书籍
async function setBook(bo_ok: book) {

  let history = await dbManager.get('bookshelf')
  const arrx: book[] = history?.bookshelf || []

  // 如果`history`不存在，则创建一个新的`history`对象
  if (!history) {
    history = { id: 'bookshelf', inventory: arrx }
    await dbManager.add(history)
  } else {
    // 如果`history`已存在，则直接修改`inventory`
    const itemToAdd = bo_ok
    const exists = arrx.some(item => item.name === itemToAdd.name)

    if (!exists) {
      arrx.unshift(itemToAdd)
      history.inventory = arrx
    }
  }
  // 更新`history`对象
  await dbManager.update(history.id, history)
}



watch(RecommendedBookList, (newVal, oldVal) => {
  console.log('Favorite changed from', oldVal, 'to', newVal)

  axios.get(extractBeforeDollarBrace(newVal))
    .then((resp) => {
      const RecommendedList: book[] = [];
      const $ = cheerio.load(resp.data);
      $($($("#newscontent").children('div.r')).children("ul")).children("li").each(function (_index, item) {
        const book: book = {
          name: $($(item).children("span.s2")).children('a').attr("title"),
          url: $($(item).children("span.s2")).children('a').attr("href"),
          author: $(item).children("span.s5").text(),
          typesOf: $(item).children("span.s1").text().replace(/\[|\]/g, '')
        };
        RecommendedList.push(book);
      });

      RecommendedBook.value = RecommendedList;

    })
    .catch((err) => {
      console.log(err);
    });
})

//搜索
watch(SearchContent, (newVal, oldVal) => {
  console.log('Favorite changed from', oldVal, 'to', newVal)

  SearchLayout.value = extractBeforeDollarBrace(newVal)
})

//随机返回标签颜色
function getRandomType(): 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error' {
  const types: ('default' | 'primary' | 'info' | 'success' | 'warning' | 'error')[] = ['default', 'primary', 'info', 'success', 'warning', 'error']
  const randomIndex = Math.floor(Math.random() * types.length)
  return types[randomIndex]
}

//监听是否需要展开详情
watch(BookDetailsLoading, (newVal, oldVal) => {
  console.log('videoDetailsLoading changed from', oldVal, 'to', newVal)
  message.loading('加载中...', { duration: 1500 });
  resetDramaDetails();
  axios.get(extractBeforeDollarBrace(newVal))
    .then((resp) => {
      const $ = cheerio.load(resp.data);

      dramaDetails.value.imgUrl = $("div#fmimg").children("img").attr("src");
      dramaDetails.value.title = $("div#fmimg").children("img").attr("alt");
      //tag

      $('div#info').children('p').each(function (_n, m) {
        if (dramaDetails.value.tags)
          dramaDetails.value.tags.push({
            name:
              ($(m).text().length > 20
                ? $(m).text().slice(0, 20) + '...'
                : $(m).text()), color: getRandomType()
          })
      })

      dramaDetails.value.Scenario = $('div#info').children('div#intro').text()


      $($('div#list').children('dl')).children('dd').each(function (_n, m) {
        if (dramaDetails.value.streamingSources) {
          if ($(m).children('a').text()) {


            const episodeCollection: EpisodeCollection = {
              title: $(m).children('a').text(),
              url: extractBeforeDollarBrace(newVal) + $(m).children('a').attr('href')
            }
            dramaDetails.value.streamingSources.push(episodeCollection)


          }

        }

      })

      message.success('加载完毕', { duration: 1500 });
      //当上方数据加载完成后，展开窗口
      showModel.value = true
    })
    .catch((err) => {
      console.log(err)
    })


})


//点击阅读，展开最新的小说章节
const expandReading = async (epi: EpisodeCollection[] | undefined) => {
  if (epi) {

    showModel.value = false;
    Reads.value = epi;
    setPageStatus([{ name: 'reader' }])
  }


}


//当应用启动后，2秒后，检查用户是否同意过使用协议，如果没同意，则弹出协议，反之不弹窗协议
const checkprotocol18 = async () => {
  const protocol18 = await dbManager.get('protocol18')


  // 设置相反的布尔值
  setProtocol18(!protocol18?.protocol18)

}

//取消更新
const cancelUpdate = () => {
  message.error('取消更新')
  setshowUpdate(false)
}

//开始更新
const startUpdate = () => {
  setshowUpdate(false)
  //先，通知主进程，修改窗口大小，变成更新窗口所需大小
  window.electron.ipcRenderer.send("UpdateUI");
  //在切换页面
  router.push({
    path: '/update'
  })
}


onBeforeMount(() => {
  setTimeout(checkprotocol18, 2000)
})
</script>

<template>
  <div class="layout" style="height: 100%; width: 100%">
    <Taskbar />
    <div style="width: 100%; height: 100%" v-show="PageStatus[0].name == 'home'">
      <div style="width: 100%; height: 100%">
        <div class="right_layout" style="padding-top: 39px">
          <OptionListSub :books="RecommendedBook" />
        </div>
        <div class="center_layout" style="padding-top: 39px">
          <ArticlePage />
        </div>
      </div>

    </div>
    <div v-show="PageStatus[0].name == 'searchX'" style="width: 100%; height: 100%">
      <div style="padding-top: 39px;width: 100%;height: 100%">

        <SearchPage :search-url="SearchLayout" />
      </div>
    </div>
    <div style="width: 100%; height: 100%" v-show="PageStatus[0].name == 'reader'">
      <div style="padding-top: 39px; height: 100%; width: 100%">
        <Reader :books="Reads" />
      </div>
    </div>

  </div>

  <n-modal v-model:show="showUpdate" :mask-closable="false">
    <n-card style="width: 600px" title="GlobeStream Update 通知" :bordered="false" size="huge" role="dialog"
      aria-modal="true">
      <template #header-extra>
        <n-badge :value="1" :max="99">
          <div>
            <svg t="1710925326942" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="8472" width="15" height="15">
              <path
                d="M889.828994 749.637494c-1.204099-1.720141-119.205779-165.821603-119.205779-287.435579 0-168.401814-76.202251-254.752898-162.725349-286.919536L607.897867 159.973123c0-52.980346-43.175542-95.983874-95.983874-95.983874S415.930119 107.164791 415.930119 159.973123l0 15.309256c-86.523098 32.166639-162.725349 118.517722-162.725349 286.919536 0 121.269948-118.00168 285.199395-119.205779 286.919536-5.332437 7.568621-7.396607 16.857383-5.332437 25.974131 2.064169 8.944734 7.912649 16.685369 15.997312 20.985721 5.676466 3.096254 107.336805 57.280699 233.423148 84.458928 21.32975 66.397447 73.966068 111.29313 133.654964 111.29313s112.325214-44.895683 133.654964-111.29313c126.086343-27.178229 227.746682-81.018646 233.423148-83.942886 8.256677-4.472367 13.933143-12.040988 16.169326-20.985721C897.225601 766.666891 895.333445 757.206115 889.828994 749.637494zM479.919368 159.973123c0-17.545439 14.449185-31.994625 31.994625-31.994625 17.545439 0 31.994625 14.449185 31.994625 31.994625l0 0.860071c-7.224593-0.516042-14.277171-0.860071-21.32975-0.860071l-21.32975 0c-7.052579 0-14.105157 0.344028-21.32975 0.860071L479.919368 159.973123 479.919368 159.973123zM511.913993 928.016126c-22.361834 0-43.175542-13.417101-57.968755-35.262893 19.26558 2.064169 38.531161 3.268268 57.968755 3.268268s38.875189-1.376113 57.968755-3.268268C555.089535 914.599026 534.275827 928.016126 511.913993 928.016126z"
                fill="#dbdbdb" p-id="8473"></path>
            </svg>
          </div>
        </n-badge>
      </template>
      <div>
        <p v-for="(item, index) in versionDescriptions" :key="index">{{ item }}</p>
      </div>
      <template #footer>
        <n-space justify="end">
          <n-button type="error" @click="startUpdate">
            更新
          </n-button>
          <n-button type="primary" @click="cancelUpdate">
            取消
          </n-button>
        </n-space>

      </template>
    </n-card>
  </n-modal>

  <!-- 18+协议 -->
  <n-modal v-model:show="protocol18" :mask-closable="false">

    <n-card class="space-card" style="width: 650px" title="用户使用协议18+内容" :bordered="false" size="huge" role="dialog"
      aria-modal="true">
      <template #header-extra>

        <n-popover trigger="hover" placement="bottom">
          <template #trigger>
            <n-badge :value="1" :max="99">
              <div>
                <svg t="1710925326942" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="8472" width="15" height="15">
                  <path
                    d="M889.828994 749.637494c-1.204099-1.720141-119.205779-165.821603-119.205779-287.435579 0-168.401814-76.202251-254.752898-162.725349-286.919536L607.897867 159.973123c0-52.980346-43.175542-95.983874-95.983874-95.983874S415.930119 107.164791 415.930119 159.973123l0 15.309256c-86.523098 32.166639-162.725349 118.517722-162.725349 286.919536 0 121.269948-118.00168 285.199395-119.205779 286.919536-5.332437 7.568621-7.396607 16.857383-5.332437 25.974131 2.064169 8.944734 7.912649 16.685369 15.997312 20.985721 5.676466 3.096254 107.336805 57.280699 233.423148 84.458928 21.32975 66.397447 73.966068 111.29313 133.654964 111.29313s112.325214-44.895683 133.654964-111.29313c126.086343-27.178229 227.746682-81.018646 233.423148-83.942886 8.256677-4.472367 13.933143-12.040988 16.169326-20.985721C897.225601 766.666891 895.333445 757.206115 889.828994 749.637494zM479.919368 159.973123c0-17.545439 14.449185-31.994625 31.994625-31.994625 17.545439 0 31.994625 14.449185 31.994625 31.994625l0 0.860071c-7.224593-0.516042-14.277171-0.860071-21.32975-0.860071l-21.32975 0c-7.052579 0-14.105157 0.344028-21.32975 0.860071L479.919368 159.973123 479.919368 159.973123zM511.913993 928.016126c-22.361834 0-43.175542-13.417101-57.968755-35.262893 19.26558 2.064169 38.531161 3.268268 57.968755 3.268268s38.875189-1.376113 57.968755-3.268268C555.089535 914.599026 534.275827 928.016126 511.913993 928.016126z"
                    fill="#dbdbdb" p-id="8473"></path>
                </svg>
              </div>
            </n-badge>
          </template>
          <span>请咨询阅读使用协议内容！</span>
        </n-popover>


      </template>
      <!--内容-->
      <n-scrollbar style="max-height: 300px">
        <p>1. 年龄确认<br>
          &nbsp;&nbsp;&nbsp;&nbsp;用户必须<strong style="color: red;">年满 18 周岁</strong>或根据所在国家/地区的法律规定达到<strong
            style="color: red;">合法成年年龄</strong>，方可访问本平台提供的内容。<br>
          &nbsp;&nbsp;&nbsp;&nbsp;用户在访问本平台之前必须确认自己的年龄符合上述要求。</p>

        <p>2. 责任声明<br>
          &nbsp;&nbsp;&nbsp;&nbsp;用户需自行确保遵守所在国家/地区有关访问成人内容的所有法律法规。<br>
          &nbsp;&nbsp;&nbsp;&nbsp;用户需<strong style="color: red;">自行承担</strong>因违反当地法律而可能产生的任何法律责任。
        </p>

        <p>3. 内容免责声明<br>
          &nbsp;&nbsp;&nbsp;&nbsp;本平台提供的内容仅供成年人<strong style="color: red;">合法使用</strong>。<br>
          &nbsp;&nbsp;&nbsp;&nbsp;用户需自行判断内容的适用性和合法性，并对使用内容的行为<strong style="color: red;">负责</strong>。</p>

        <p>4. 隐私保护<br>
          &nbsp;&nbsp;&nbsp;&nbsp;本平台承诺保护用户的隐私和个人信息安全，不会非法收集、使用或泄露用户的个人信息。<br>
          &nbsp;&nbsp;&nbsp;&nbsp;用户应<strong style="color: red;">妥善保管</strong>自己的登录信息，避免他人未经授权使用。
        </p>

        <p>5. 违规处理<br>
          &nbsp;&nbsp;&nbsp;&nbsp;如果发现用户未达到法定年龄或存在其他违规行为，本平台有权<strong style="color: red;">立即终止</strong>其访问权限并采取必要的法律措施。
        </p>

        <p>6. 法律适用与争议解决<br>
          &nbsp;&nbsp;&nbsp;&nbsp;本协议受<strong style="color: red;">中华人民共和国法律管辖</strong>。<br>
          &nbsp;&nbsp;&nbsp;&nbsp;因本协议引起的任何争议，双方应友好协商解决；协商不成时，可向本平台所在地人民法院提起诉讼。
        </p>

        <p>7. 内容更新与变更通知<br>
          &nbsp;&nbsp;&nbsp;&nbsp;本平台保留随时修改、更新或删除部分内容的权利，无需事先通知用户。<br>
          &nbsp;&nbsp;&nbsp;&nbsp;用户有责任<strong style="color: red;">定期查看</strong>本协议的最新版本。</p>

        <p>8. 用户行为准则<br>
          &nbsp;&nbsp;&nbsp;&nbsp;用户不得利用本平台进行任何非法活动，包括但不限于传播色情内容、侵犯他人隐私权、版权侵权等。<br>
          &nbsp;&nbsp;&nbsp;&nbsp;用户需<strong style="color: red;">遵守</strong>本平台制定的行为准则。</p>

        <p>9. 知识产权声明<br>
          &nbsp;&nbsp;&nbsp;&nbsp;本平台上所有内容，包括但不限于文字、图片、音频、视频等，均受相关知识产权法律保护。<br>
          &nbsp;&nbsp;&nbsp;&nbsp;未经本平台书面许可，用户<strong style="color: red;">不得复制、转载、传播</strong>等内容。
        </p>

        <p>10. 服务中断与不可抗力<br>
          &nbsp;&nbsp;&nbsp;&nbsp;本平台不保证服务不会中断或没有错误。<br>
          &nbsp;&nbsp;&nbsp;&nbsp;对于因不可抗力因素（如自然灾害、政府行为等）导致的服务中断，本平台<strong style="color: red;">不承担责任</strong>。</p>

        <p>11. 第三方链接免责声明<br>
          &nbsp;&nbsp;&nbsp;&nbsp;本平台可能包含指向第三方网站的链接，这些链接仅为方便用户而提供。<br>
          &nbsp;&nbsp;&nbsp;&nbsp;本平台<strong style="color: red;">不对第三方网站的内容、安全性或隐私政策负责</strong>。
        </p>

        <p>12. 数据来源与版权说明<br>
          &nbsp;&nbsp;&nbsp;&nbsp;本应用的数据收集自互联网，本应用<strong style="color: red;">不参与任何影视资源的制作与存储</strong>。<br>
          &nbsp;&nbsp;&nbsp;&nbsp;如若侵犯了您的权益，请书面告知我们，我们会<strong style="color: red;">及时处理</strong>相关内容。
        </p>

      </n-scrollbar>
      <template #footer>
        <n-space justify="end">
          <n-button type="error" @click="setProtocol18DB(true)">
            同意
          </n-button>
          <n-button type="primary" @click="setProtocol18DB(false)">
            不同意
          </n-button>
        </n-space>

      </template>
    </n-card>
  </n-modal>
  <!-- 详情 -->
  <n-modal v-model:show="showModel">

    <n-card class="space-card" style="width: 650px" title="详情" :bordered="false" size="huge" role="dialog"
      aria-modal="true">
      <template #header-extra>

        <n-popover trigger="hover" placement="bottom">
          <template #trigger>
            <div @click="setBook({})">
              <svg t="1725671379195" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="6765" width="45" height="45">
                <path
                  d="M741.86 830.89c-8.21 0-16.45-1.49-24.33-4.53l-155.17-59.81c-30.64-11.81-64.4-11.81-95.04 0l-155.17 59.81c-20.81 8.02-44.21 5.28-62.6-7.34s-29.37-33.47-29.37-55.77V284.51c0-45.22 36.79-82.01 82.01-82.01h425.28c45.22 0 82.01 36.79 82.01 82.01v478.74a67.62 67.62 0 0 1-29.37 55.77 67.646 67.646 0 0 1-38.27 11.87z m-11.74-37.19c10.19 3.93 21.2 2.64 30.21-3.54 9.01-6.18 14.17-15.99 14.17-26.91V284.51c0-25.92-21.09-47.01-47.01-47.01H302.21c-25.92 0-47.01 21.09-47.01 47.01v478.74c0 10.92 5.16 20.73 14.17 26.91s20.02 7.47 30.21 3.54l155.17-59.81c38.76-14.94 81.46-14.94 120.22 0l155.17 59.81z"
                  fill="#654115" p-id="6766"></path>
                <path
                  d="M653.83 688.52l-103.19-39.77a99.495 99.495 0 0 0-71.58 0l-103.19 39.77c-21.84 8.42-45.34-7.7-45.34-31.11V359.2c0-23.69 19.21-42.9 42.9-42.9h282.83c23.69 0 42.9 19.21 42.9 42.9v298.21c0 23.41-23.49 39.53-45.34 31.11z"
                  fill="#FCCA25" p-id="6767"></path>
                <path
                  d="M603 505H426.7c-9.67 0-17.5-7.83-17.5-17.5s7.83-17.5 17.5-17.5H603c9.67 0 17.5 7.83 17.5 17.5S612.67 505 603 505z"
                  fill="#654115" p-id="6768"></path>
                <path
                  d="M514.85 593.15c-9.67 0-17.5-7.83-17.5-17.5v-176.3c0-9.67 7.83-17.5 17.5-17.5s17.5 7.83 17.5 17.5v176.3c0 9.67-7.83 17.5-17.5 17.5z"
                  fill="#654115" p-id="6769"></path>
              </svg>
            </div>
          </template>
          <span>订阅书籍</span>
        </n-popover>


      </template>
      <!--内容-->
      <div style="width: 100%;height: 260px;display: flex;justify-content: space-between;">
        <div style="width: 40%;height: 100%;">
          <img style="border-radius: 3px;width: 100%;height: 100%;" :src="dramaDetails.imgUrl" />
        </div>
        <div style="width: 50%;height: 100%;">
          <n-space>
            <div style=" display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        font-size: 24px;
                        font-family: 黑体;
                        ">
              {{ dramaDetails.title }}
            </div>
            <n-space>
              <n-scrollbar style="max-height: 100px">
                <n-tag v-for="(item, index) in dramaDetails.tags" :key="index" round :type="item.color">
                  {{ item.name }}
                </n-tag>
              </n-scrollbar>

            </n-space>
            <n-scrollbar style="max-height: 100px">
              {{ dramaDetails.Scenario }}
            </n-scrollbar>
          </n-space>
        </div>
      </div>
      <div style="width: 100%;height: 300px;">
        <n-tabs type="line" animated>
          <n-tab-pane name="正文" tab="正文">
            <n-scrollbar style="max-height: 250px">
              <n-space>
                <n-button strong secondary v-for="(itenm, index) in dramaDetails.streamingSources" :key="index">
                  {{ itenm.title }}
                </n-button>
              </n-space>
            </n-scrollbar>
          </n-tab-pane>
          <n-tab-pane name="广告" tab="广告">
            <p>个人维护，免费，不侵权，如有问题，请及时反馈</p>
          </n-tab-pane>
        </n-tabs>

      </div>


      <template #footer>
        <n-space justify="end">
          <n-button type="primary" @click="expandReading(dramaDetails.streamingSources)">
            阅读
          </n-button>
        </n-space>

      </template>
    </n-card>
  </n-modal>


</template>

<style scoped>
/* 对于宽度在600px到900px之间的屏幕 */
@media screen and (max-width: 1300px) {
  .right_layout {
    width: 100% !important;
    float: none !important;
    display: none;
  }

  .center_layout {
    width: 100% !important;
    float: none !important;
  }
}

.layout {}

.center_layout {
  width: 80%;
  height: 100%;
  float: right;
}

.right_layout {
  width: 20%;
  height: 100%;
  float: right;
}
</style>
