<script setup lang="ts">
import { ref, watch, computed } from 'vue'
// 导入Axios库用于发起HTTP请求
import axios from 'axios'
// 导入Cheerio库用于解析HTML
import * as cheerio from 'cheerio'
// 导入Vuex的store工具
import { useStore } from 'vuex'
// 导入Naive UI的消息提示组件
import { useMessage } from 'naive-ui'
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
// 初始化消息提示组件
const message = useMessage()
// 初始化Vuex store实例
const store = useStore()
// 书籍数组引用
const books = ref<book[]>([])

const props = defineProps({
  searchUrl: String
})
const NeworldscroE3 = ref<HTMLElement | null>(null)

const source = computed(() => store.getters.getSource)
async function AsynchronousPageFlipping(params: string) {
  axios.get(source.value.slice(0, source.value.length - 1) + params)
    .then(res => {
      ParseHTMLAndFill(cheerio.load(res.data))
    })
    .catch(err => {
      console.log(err)
    })
}

const ParseHTMLAndFill = ($: cheerio.CheerioAPI) => {
  const TemporaryBookshelf: book[] = [];
  $('div.novelslistss').children('li').each(function (_index, item) {
    const book: book = {
      name: $($(item).children("span.s2")).children('a').attr("title"),
      chapter: $($(item).children("span.s3")).children('a').attr("title"),
      LatestChapterUrl: $($(item).children("span.s3")).children('a').attr("href"),
      url: source.value + $($(item).children("span.s2")).children('a').attr("href"),
      author: $(item).children("span.s4").text(),
      LastUpdateTime: $(item).children("span.s5").text(),
      typesOf: $(item).children("span.s1").text().replace(/\[|\]/g, '')
    };
    TemporaryBookshelf.push(book);
    books.value = [...TemporaryBookshelf, ...books.value]
  })
}

watch(props, (newVal, oldVal) => {
  console.log('Favorite changed from', oldVal, 'to', newVal)
  if (NeworldscroE3.value) {//将页面滚动到顶部
    NeworldscroE3.value.scrollTop = 0
  }

  console.log(props.searchUrl)
  //搜索
  axios.get(props.searchUrl ?? '')
    .then(res => {
      books.value = [];
      const $ = cheerio.load(res.data)
      message.loading('正在加载...', { duration: 1500 });
      //得到第一页，主要部分内容
      ParseHTMLAndFill($);

      //查看是否有分页如果有，封装好地址，调用AsynchronousPageFlipping来处理
      const lastPage: number = Number($($('div.novelslistss').children('div.pages')).children('a.last').text());
      const firstPageUrl: string = $($('div.novelslistss').children('div.pages')).children('a.last').attr('href') ?? '';
      for (let i = 0; i <= lastPage; i++) {
        AsynchronousPageFlipping(firstPageUrl.slice(0, firstPageUrl.lastIndexOf('page=') + 5) + `${i}`)
      }

    }).catch(err => {
      //请求失败
      console.log(err)
    })

})

</script>

<template>
  <div class="searchPage">
    <div ref="NeworldscroE3" class="NeworldscroE" style="height: 98%;width: 100%;  padding: 10px;">
      <n-space vertical>
        <div class="searchOption" v-for="(item, index) in books" :key="index">
          <div class="searchOption_1">
            <n-breadcrumb>
              <n-breadcrumb-item>
                {{ item.typesOf }}
              </n-breadcrumb-item>
              <n-breadcrumb-item>
                {{ item.name }}
              </n-breadcrumb-item>
              <n-breadcrumb-item>
                {{ item.chapter }}
              </n-breadcrumb-item>
            </n-breadcrumb>
            <n-breadcrumb>
              <n-breadcrumb-item>
                {{ item.author }}
              </n-breadcrumb-item>
              <n-breadcrumb-item>
                {{ item.LastUpdateTime }}
              </n-breadcrumb-item>

            </n-breadcrumb>
          </div>
          <div class="searchOption_2">
            <n-button type="info">
              + 加入书架
            </n-button>
          </div>
        </div>


      </n-space>
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

.searchOption_2 {
  padding-right: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.searchOption_1 {
  padding-left: 10px;
}

.searchOption {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  background-color: #25252a;
  border-radius: 5px;
  color: #eaeaea;
  transition: transform 0.3s,
    box-shadow 0.3s !important;
}

.searchOption:hover {
  /* box-shadow: 0 16px 32px 0 rgba(48, 55, 66, 0.15); */

  /* transition-delay: 0s !important; */
  /* border: 1px solid #78a4fa; */

  transform: translateY(-3px) !important;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  animation: sparkle 0.5s infinite;
}

.searchPage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;

}
</style>
