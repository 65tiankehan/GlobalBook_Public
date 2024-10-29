<script setup lang="ts">
// 导入Vue核心功能
import { ref, computed, onBeforeMount } from 'vue'
// 导入Vuex的store工具
import { useStore } from 'vuex'
// 导入Axios库用于发起HTTP请求
import axios from 'axios'
// 导入Cheerio库用于解析HTML
import * as cheerio from 'cheerio'
// 导入Naive UI的消息提示组件
import { useMessage } from 'naive-ui'

import IndexedDBManager from '../indexedDB.js'



// 定义面板接口
interface panel {
  name: string,
  conent: string
}

// 定义切换面板接口
interface switchPanel {
  value: string | number,
  label: string | number
}

// 定义书籍接口
interface book {
  name?: string,
  chapter?: string,
  LatestChapterUrl?: string,
  author?: string,
  url?: string,
  LastUpdateTime?: string,
  typesOf?: string
}

const dbManager = new IndexedDBManager()
// 初始化Vuex store实例
const store = useStore()
// 初始化消息提示组件
const message = useMessage()

// 计算属性，获取皮肤设置
const skin = computed(() => store.getters.getSkin)
// 计算属性，获取数据源
const source = computed(() => store.getters.getSource)

// 设置推荐书籍列表
const setRecommendedBookList = (url: string) => {
  store.commit('SET_RECOMMENDEDBOOKLIST', url)
}

// 设置推荐书籍列表
// 使用store.commit来调用mutation
const setBookDetailsLoading = (url: string) => {
  store.commit('SET_BOOKDETAILSLOADING', url)
}

// 面板数组
// 玄幻小说至我的书架的面板定义
const tabPanes: panel[] = [
  {
    name: "玄幻小说",
    conent: '简介'
  },
  {
    name: "修真小说",
    conent: '简介'
  },
  {
    name: "都市小说",
    conent: ""
  },
  {
    name: "历史小说",
    conent: ""
  },
  {
    name: "网游小说",
    conent: ""
  },
  {
    name: "科幻小说",
    conent: ""
  },
  {
    name: "排行榜单",
    conent: ""
  },
  {
    name: "我的书架",
    conent: ""
  }
]
// 切换搜索面板数组
// 各类小说标签及其值
const tabSwitchSearchPane: switchPanel[] = [
  {
    label: "玄幻小说",
    value: "xuanhuan"
  },
  {
    label: "修真小说",
    value: "xiuzhen"
  },
  {
    label: "都市小说",
    value: "dushi"
  },
  {
    label: "历史小说",
    value: "lishi"
  },
  {
    label: "网游小说",
    value: "wangyou"
  },
  {
    label: "科幻小说",
    value: "kehuan"
  },
  {
    label: "排行榜单",
    value: "top/allvisit"
  },
  {
    label: "我的书架",
    value: "my_bookshelf"
  }

]
// 引用元素用于滚动到顶部
const NeworldscroE2 = ref<HTMLElement | null>(null)
// 书籍数组引用
const books = ref<book[]>([])

//查询DB，书架列表
const getbookshelf = async () => {
  const bookshelfs = await dbManager.get('bookshelf')
   books.value = [];
   books.value = bookshelfs?.bookshelf || [];
}
// 更新面板内容
async function updateTabPane(value: string | number) {
  if (NeworldscroE2.value) {//将页面滚动到顶部
    NeworldscroE2.value.scrollTop = 0
  }
  // 根据不同的面板值执行不同逻辑
  if (value == "我的书架") {
    message.loading('正在加载...书架', { duration: 1500 });
    getbookshelf();
    // TODO: 待实现 我的书架
  } else if (value == '排行榜单') {
    message.loading('正在加载排行榜单...', { duration: 1500 });
  } else {
    message.loading('正在加载...', { duration: 1500 });

    const item = tabSwitchSearchPane.find((panel) => panel.label === value);
    if (!item) {
      console.error('未找到匹配的面板');
      return;
    }
    books.value = [];
    // 发起HTTP GET请求
    axios.get(source.value + item.value)
      .then((resp) => {
        const TemporaryBookshelf: book[] = [];

        const $ = cheerio.load(resp.data);

        // 解析HTML并填充书籍信息
        $($($("#newscontent").children('div.l')).children("ul")).children("li").each(function (_index, item) {
          const book: book = {
            name: $($(item).children("span.s2")).children('a').attr("title"),
            chapter: $($(item).children("span.s3")).children('a').attr("title"),
            LatestChapterUrl: $($(item).children("span.s3")).children('a').attr("href"),
            url:  $($(item).children("span.s2")).children('a').attr("href"),
            author: $(item).children("span.s4").text(),
            LastUpdateTime: $(item).children("span.s5").text(),
            typesOf: $(item).children("span.s1").text().replace(/\[|\]/g, '')
          };
          TemporaryBookshelf.push(book);
        });

        books.value = TemporaryBookshelf;

        // 触发Vuex更新推荐列表
        const timestamp = Date.now()
        setRecommendedBookList(source.value + item.value + '${' + `${timestamp}`)

        message.success('加载完成', { duration: 1500 });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

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
// 在组件挂载前调用
onBeforeMount(() => {
  updateTabPane(tabPanes[0].name)
})

</script>

<template>
  <div class="ArticlePage">
    <div class="categoryTag">
      <n-tabs :default-value="tabPanes[0].name" @update:value="updateTabPane" type="segment" animated>
        <n-tab-pane v-for="(item, index) in tabPanes" :key="index" :name="item.name" :tab="item.name">

        </n-tab-pane>

      </n-tabs>
    </div>
    <div style="margin-top: 1%;"></div>
    <div class="categoryText">

      <div ref="NeworldscroE2" class="NeworldscroE" style="
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-items: center;
            margin: 0 5px;
            height: 98.7%;">

        <n-skeleton style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;"
          v-if="books.length <= 0" :width="189" :height="250" :sharp="false" size="medium" />
        <n-skeleton style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;"
          v-if="books.length <= 0" :width="189" :height="250" :sharp="false" size="medium" />
        <n-skeleton style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;"
          v-if="books.length <= 0" :width="189" :height="250" :sharp="false" size="medium" />
        <n-skeleton style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;"
          v-if="books.length <= 0" :width="189" :height="250" :sharp="false" size="medium" />
        <n-skeleton style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;"
          v-if="books.length <= 0" :width="189" :height="250" :sharp="false" size="medium" />
        <n-skeleton style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;"
          v-if="books.length <= 0" :width="189" :height="250" :sharp="false" size="medium" />
        <n-skeleton style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;"
          v-if="books.length <= 0" :width="189" :height="250" :sharp="false" size="medium" />
        <n-skeleton style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;"
          v-if="books.length <= 0" :width="189" :height="250" :sharp="false" size="medium" />
        <n-skeleton style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;"
          v-if="books.length <= 0" :width="189" :height="250" :sharp="false" size="medium" />
        <n-skeleton style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;"
          v-if="books.length <= 0" :width="189" :height="250" :sharp="false" size="medium" />
        <n-skeleton style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;"
          v-if="books.length <= 0" :width="189" :height="250" :sharp="false" size="medium" />
        <n-skeleton style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;"
          v-if="books.length <= 0" :width="189" :height="250" :sharp="false" size="medium" />
        <n-skeleton style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;"
          v-if="books.length <= 0" :width="189" :height="250" :sharp="false" size="medium" />
        <n-skeleton style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;"
          v-if="books.length <= 0" :width="189" :height="250" :sharp="false" size="medium" />
        <n-skeleton style=" margin: 5px;margin-bottom: 10px; cursor: pointer; padding: 10px; flex: 1 1 auto;"
          v-if="books.length <= 0" :width="189" :height="250" :sharp="false" size="medium" />

        <div class="animate__animated animate__flipInX homeCardDeep" v-for="(item, index) in books" :key="index">
          <div class="homeTitleCarImg" style="position: relative">

            <img class="homeTitleCarImgI" src="../assets/paper-1074131_1280.jpg" />
            <div style="position: absolute; z-index: 3; top: 5px; right: 8px">
              <!--      每个的右上角           -->
            </div>
            <div class="play_video" style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              z-index: 3;
            ">
              <n-button text style="font-size: 24px"  @click="showDetails(item.url)">
                <svg t="1723897577159" class="icon" viewBox="0 0 1024 1024" version="1.1"
                  xmlns="http://www.w3.org/2000/svg" p-id="1676" width="24" height="24">
                  <path
                    d="M512.173 795c171.39 0 318.422-118.888 356.196-283.157C830.477 347.727 683.517 229 512.245 229c-171.39 0-318.422 118.888-356.197 283.157C193.941 676.273 340.9 795 512.173 795zM75.93 504.096C118.297 298.658 299.91 149 512.245 149c212.19 0 393.717 149.458 436.234 354.712a40 40 0 0 1 0.007 16.192C906.121 725.342 724.507 875 512.173 875c-212.191 0-393.718-149.458-436.235-354.712a40 40 0 0 1-0.007-16.192zM512 704c-106.039 0-192-85.961-192-192s85.961-192 192-192 192 85.961 192 192-85.961 192-192 192z m0-80c61.856 0 112-50.144 112-112s-50.144-112-112-112-112 50.144-112 112 50.144 112 112 112z"
                    fill="#333333" p-id="1677"></path>
                </svg>
              </n-button>
            </div>
          </div>
          <div class="homeTitleCarText">
            <div class="homeTitleCarTextNex">
              <div class="homeTitleCarTextNexTup">
                <div style="  display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        text-overflow: ellipsis;">{{ item.name }}
                </div>
              </div>
              <div class="homeTitleCarTextNexKup">
                <div style="  display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        text-overflow: ellipsis;"> {{ item.chapter }}
                </div>

              </div>
              <div class="homeTitleCarTextNexUnp">

                <div class="homeTitleCarTextNexUnpCard">


                  <n-popover trigger="hover">
                    <template #trigger>
                      <n-tag :bordered="false" type="warning">
                        <div
                          :class="skin == 'lightTheme' ? 'homeTitleCardTextNexUnpCardText_X' : 'homeTitleCardTextNexUnpCardText'"
                          style="  max-width: 20px; /* 可以根据需要调整 */
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                          ">
                          {{ item.typesOf }}
                        </div>
                        <template #icon>
                          <svg t="1724806808953" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="8489" width="24" height="24">
                            <path
                              d="M705.197 853.411h-384.39c-13.728 0-24.835-11.119-24.835-24.835 0-13.715 11.107-24.837 24.835-24.837h384.391c13.728 0 24.835 11.122 24.835 24.837-0.001 13.716-11.108 24.835-24.836 24.835z"
                              fill="#213847" p-id="8490"></path>
                            <path
                              d="M513.014 832.904c-13.727 0-24.835-11.119-24.835-24.834v-66.43c0-13.714 11.108-24.836 24.835-24.836 13.728 0 24.836 11.122 24.836 24.836v66.431c0 13.714-11.109 24.833-24.836 24.833z"
                              fill="#213847" p-id="8491"></path>
                            <path
                              d="M382.191 228.998h-63.737c-54.861 0-99.341 44.481-99.341 99.342v314.601c0 54.861 44.48 99.343 99.341 99.343H774.61c54.859 0 99.341-44.481 99.341-99.343V328.34c0-54.861-44.481-99.342-99.341-99.342H612.55l-228.272-0.193"
                              fill="#FC607B" p-id="8492"></path>
                            <path
                              d="M157.024 485.222c-13.727 0-24.835-11.12-24.835-24.835v-65.193c0-13.715 11.108-24.836 24.835-24.836 13.728 0 24.835 11.121 24.835 24.836v65.193c0 13.715-11.108 24.835-24.835 24.835z"
                              fill="#213847" p-id="8493"></path>
                            <path
                              d="M769.638 201.702l-447.424-0.231h-0.024c-1.103 0-2.186 0.08-3.25 0.219h-62.573c-68.467 0-124.177 55.71-124.177 124.177 0 13.715 11.108 24.835 24.835 24.835 13.728 0 24.835-11.12 24.835-24.835 0-41.086 33.421-74.506 74.506-74.506h63.738c1.102 0 2.185-0.079 3.249-0.218l446.285 0.23c41.085 0 74.507 33.421 74.507 74.506v314.552c0 41.085-33.422 74.507-74.507 74.507H256.366c-41.085 0-74.506-33.422-74.506-74.507V537.985c0-13.715-11.108-24.836-24.835-24.836s-24.835 11.121-24.835 24.836V640.43c0 68.468 55.71 124.178 124.177 124.178h513.272c68.468 0 124.177-55.71 124.177-124.178V325.878c-0.002-68.467-55.711-124.176-124.178-124.176z"
                              fill="#213847" p-id="8494"></path>
                            <path
                              d="M438.75 598.691a24.75 24.75 0 0 1-11.981-3.081 24.835 24.835 0 0 1-12.854-21.755V386.099a24.839 24.839 0 0 1 12.854-21.755c7.907-4.366 17.56-4.087 25.248 0.764l148.526 93.885a24.832 24.832 0 0 1 11.569 20.991 24.816 24.816 0 0 1-11.569 20.991l-148.526 93.873a24.835 24.835 0 0 1-13.267 3.843z m24.835-167.517v97.607l77.199-48.798-77.199-48.809z"
                              fill="#213847" p-id="8495"></path>
                          </svg>
                        </template>
                      </n-tag>
                    </template>
                    <span> {{ item.typesOf }}</span>
                  </n-popover>
                </div>
                <div class="homeTitleCarTextNexUnpCard">

                  <n-popover trigger="hover">
                    <template #trigger>
                      <n-tag :bordered="false" type="success">
                        <div
                          :class="skin == 'lightTheme' ? 'homeTitleCardTextNexUnpCardText_X' : 'homeTitleCardTextNexUnpCardText'"
                          style="  max-width: 20px; /* 可以根据需要调整 */
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                          ">
                          {{ item.author }}
                        </div>
                        <template #icon>
                          <svg t="1724806961601" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="10401" width="15" height="15">
                            <path
                              d="M891.054194 141.084444c-72.817778-11.377778-147.911111 9.102222-200.248889 59.164445 0 0-40.96-152.462222-161.564445-200.248889-91.022222 31.857778-159.288889 106.951111-182.044444 200.248889 0 0-38.684444-79.644444-200.248889-59.164445 0 0-200.248889 532.48 341.333333 639.431112V1024h40.96V780.515556c97.848889-13.653333 521.102222-102.4 361.813334-639.431112z"
                              fill="#02DDBF" p-id="10402"></path>
                            <path
                              d="M954.769749 780.515556c-227.555556-15.928889-391.395556 141.084444-400.497777 147.911111-9.102222 9.102222-9.102222 22.755556 0 31.857777 4.551111 4.551111 11.377778 6.826667 15.928888 6.826667 6.826667 0 11.377778-2.275556 15.928889-6.826667 2.275556-2.275556 157.013333-147.911111 364.088889-134.257777 11.377778 0 22.755556-9.102222 25.031111-20.48s-6.826667-25.031111-20.48-25.031111zM67.303083 800.995556c-13.653333 0-22.755556 11.377778-20.48 25.031111 0 13.653333 11.377778 22.755556 25.031111 20.48 207.075556-15.928889 361.813333 141.084444 364.088889 141.084444 4.551111 4.551111 11.377778 6.826667 15.928889 6.826667 6.826667 0 11.377778-2.275556 15.928888-6.826667 9.102222-9.102222 9.102222-22.755556 0-31.857778-6.826667-4.551111-172.942222-170.666667-400.497777-154.737777z"
                              fill="#02DDBF" p-id="10403"></path>
                          </svg>
                        </template>
                      </n-tag>
                    </template>
                    <span> {{ item.author }}</span>
                  </n-popover>

                </div>
                <div class="homeTitleCarTextNexUnpCard">

                  <n-popover trigger="hover">
                    <template #trigger>
                      <n-tag :bordered="false" type="info">
                        <div
                          :class="skin == 'lightTheme' ? 'homeTitleCardTextNexUnpCardText_X' : 'homeTitleCardTextNexUnpCardText'"
                          style="  max-width: 20px; /* 可以根据需要调整 */
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                          ">
                          {{ item.LastUpdateTime }}
                        </div>
                        <template #icon>
                          <svg t="1724807253717" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="11678" width="22" height="22">
                            <path
                              d="M520.533333 866.133333c-17.066667 0-29.866667-4.266667-38.4-17.066666l-38.4-38.4H166.4c-38.4 0-68.266667-29.866667-68.266667-68.266667V243.2c0-38.4 29.866667-68.266667 68.266667-68.266667h712.533333c38.4 0 68.266667 29.866667 68.266667 68.266667v494.933333c0 38.4-29.866667 68.266667-68.266667 68.266667h-277.333333l-38.4 38.4c-12.8 17.066667-25.6 21.333333-42.666667 21.333333zM166.4 234.666667c-4.266667 0-12.8 4.266667-12.8 12.8v494.933333c0 4.266667 4.266667 12.8 12.8 12.8H469.333333l55.466667 55.466667 51.2-55.466667h302.933333c4.266667 0 12.8-4.266667 12.8-12.8V243.2c0-4.266667-4.266667-12.8-12.8-12.8H166.4z"
                              fill="#6A3906" p-id="11679"></path>
                            <path
                              d="M797.866667 682.666667h-554.666667c-21.333333 0-34.133333-17.066667-34.133333-34.133334V337.066667c0-21.333333 17.066667-38.4 34.133333-38.4h554.666667c21.333333 0 34.133333 17.066667 34.133333 34.133333v311.466667c4.266667 21.333333-12.8 38.4-34.133333 38.4z"
                              fill="#F5CB2B" p-id="11680"></path>
                            <path
                              d="M708.266667 443.733333H337.066667c-17.066667 0-29.866667-12.8-29.866667-29.866666 0-17.066667 12.8-29.866667 29.866667-29.866667h371.2c17.066667 0 29.866667 12.8 29.866666 29.866667 0 17.066667-12.8 29.866667-29.866666 29.866666zM512 622.933333H337.066667c-17.066667 0-29.866667-12.8-29.866667-29.866666 0-17.066667 12.8-29.866667 29.866667-29.866667H512c17.066667 0 29.866667 12.8 29.866667 29.866667 0 17.066667-12.8 29.866667-29.866667 29.866666z"
                              fill="#6A3906" p-id="11681"></path>
                          </svg>
                        </template>
                      </n-tag>
                    </template>
                    <span> {{ item.LastUpdateTime }}</span>
                  </n-popover>

                </div>
              </div>

            </div>
          </div>

        </div>



      </div>
    </div>

  </div>
</template>

<style scoped>
.element {
  transition: transform 0.3s,
    box-shadow 0.3s;
}

.element:hover {
  transform: translateY(-10px) scale(1.1);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  /* animation: sparkle 0.5s infinite; */
}

@keyframes sparkle {
  0% {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  }

  50% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  }

  100% {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  }
}

.moviesTemplateMinTitle-right {
  float: right;
  /* width: 50%; */
}

.TextSerengThen {
  padding-left: 5px;
}

.homeTitleCardTextNexUnpCardImgGuidBum {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.homeTitleCardTextNexUnpCardText {
  float: left;
  font-size: 10px;
  padding-top: 3px;
  color: rgb(221, 214, 214);
}

.homeTitleCardTextNexUnpCardText_X {
  float: left;
  font-size: 10px;
  color: rgb(43 40 40);
}

.homeTitleCardTextNexUnpCardImgGuid {
  width: 30%;
  height: 70%;
  border-radius: 50%;
  background-color: #2f2e2e;
  float: left;
  margin-right: 3px;
  margin-left: 3px;
  padding-top: 2px;
}

.homeTitleCarTextNexUnpCard {
  height: 100%;
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
}


.homeTitleCarTextNexUnp {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: space-evenly;
  position: absolute;
  bottom: 10px;
}

.homeTitleCarTextNexKup {
  font-size: 12px;
  color: rgb(221, 214, 214);
  letter-spacing: 0;
  line-height: 22px;

  padding-left: 5px;
  padding-right: 5px;

}

.homeTitleCarTextNexTup {
  font-size: 14px;
  width: 100%;
  padding: 5px;
  padding-bottom: 0px;
  padding-top: 2px;
}

.homeTitleCarTextNex {
  width: 100%;
  height: 100%;
  background-color: #333131;
  border-radius: 5px;
  position: relative;
}

.homeTitleCarText {
  padding-top: 5%;
  width: 100%;
  height: 40%;
  border-radius: 3.5px;
}

.homeTitleCarImgI {
  width: 100%;
  height: 100%;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  object-fit: cover;
  object-position: top;
}

.homeTitleCarImg {
  width: 100%;
  height: 60%;
}

.homeCard {
  width: 180px;
  height: 280px;
  background-color: #f9f9f9;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  margin: 5px;
  margin-bottom: 10px;
  cursor: pointer;
  flex: 1 0 auto;
  padding: 10px;
  transition: transform 0.3s,
    box-shadow 0.3s !important;
}

.homeCard:hover {
  /* box-shadow: 0 16px 32px 0 rgba(48, 55, 66, 0.15); */

  /* transition-delay: 0s !important; */
  /* border: 1px solid #78a4fa; */

  /* transform: translateY(-10px)  !important; */
  box-shadow: 0 0 10px rgba(163, 161, 161, 0.8);
  /* animation: sparkle 0.5s infinite; */
}

.homeCardDeep {
  width: 189px;
  height: 250px;
  background-color: rgb(39, 39, 39);
  border: 1px solid rgb(28, 28, 28);
  border-radius: 5px;
  margin: 5px;
  margin-bottom: 10px;
  cursor: pointer;
  /* flex: 0 0 200px; */
  flex: 1 1 auto;
  padding: 10px;

  transition: transform 0.3s,
    box-shadow 0.3s !important;
}

.homeCardDeep:hover {
  /* box-shadow: 0 16px 32px 0 rgba(48, 55, 66, 0.15); */

  /* transition-delay: 0s !important; */
  /* border: 1px solid #78a4fa; */

  /* transform: translateY(-10px)  !important; */
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  /* animation: sparkle 0.5s infinite; */
}

.play_video {
  display: none;
}

.homeCardDeep:hover .play_video {
  display: block;
}

@keyframes sparkle {
  0% {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  }

  50% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  }

  100% {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  }
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

.categoryTag {
  width: 100%;
  height: 5%;
  background-color: #1d1d20;
  border-radius: 5px;
  padding: 5px;
}

.categoryText {
  width: 100%;
  height: 94%;
  background-color: #1d1d20;
  border-radius: 5px;
  padding: 5px;
}


.ArticlePage {
  width: 100%;
  height: 100%;
  padding: 5px;
}
</style>
