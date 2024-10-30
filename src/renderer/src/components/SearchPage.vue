<script setup lang="ts">
import { ref, watch } from 'vue';//computed
import axios from 'axios';
import * as cheerio from 'cheerio';
// import { useStore } from 'vuex';
import { useMessage } from 'naive-ui';
import IndexedDBManager from '../indexedDB.js'

interface book {
  name?: string;
  chapter?: string;
  LatestChapterUrl?: string;
  author?: string;
  url?: string;
  LastUpdateTime?: string;
  typesOf?: string;
  favorites?: boolean;
}

const dbManager = new IndexedDBManager()
const message = useMessage();
// const store = useStore();
const booksTs = ref<book[]>([]);
const FavoritesList = ref<book[]>([])
const NeworldscroE3 = ref<HTMLElement | null>(null);

// const source = computed(() => store.getters.getSource);

//往收藏，插入一个值
async function setFavorite(index: number) {
  let history = await dbManager.get('favorites')
  const arrx: book[] = history?.inventory || []

  // 如果`favorites`不存在，则创建一个新的`favorites`对象
  if (!history) {
    history = { id: 'favorites', inventory: arrx }
    await dbManager.add(history)
  } else {
    // 如果`favorites`已存在，则直接修改`inventory`
    const itemToAdd = booksTs.value[index]
    const exists = arrx.some(item => item.name === itemToAdd.name)

    if (!exists) {
      booksTs.value[index].favorites = true
      arrx.unshift(itemToAdd)
      history.inventory = arrx
    }
  }
  // 更新`favorites`对象
  await dbManager.update(history.id, history)

}

//从收藏中删除一个值
async function removeFavorite(index: number) {
  const history = await dbManager.get('favorites')
  const arrx: book[] = history?.inventory || []
  const itemToAdd = booksTs.value[index]
  const exists = arrx.some(item => item.name === itemToAdd.name)
  if (exists) {
    const indexToRemove = arrx.findIndex(item => item.name === itemToAdd.name)
    arrx.splice(indexToRemove, 1)
    // 更新 `journalismList` 中的收藏状态
    booksTs.value[index].favorites = false
  }
  // 更新`favorites`对象
  await dbManager.update(history.id, history)
}

//设置收藏列表（）
async function setFavoritesList() {
  const history = await dbManager.get('favorites')

  FavoritesList.value = history?.inventory || []
}


const isFavorites = (name: string) => {
  return FavoritesList.value.some(item => item.name === name)
}


const props = defineProps({
  searchUrl: String,
});
// 每10秒检查一次(收藏)
setInterval(setFavoritesList, 10000)


watch(() => props.searchUrl, (newVal, oldVal) => {
  console.log('searchUrl changed from', oldVal, 'to', newVal);
  if (NeworldscroE3.value) {
    NeworldscroE3.value.scrollTop = 0;
  }

  if (newVal) {
    axios.get(newVal)
      .then(res => {
        booksTs.value = [];
        const $ = cheerio.load(res.data);
        const TemporaryBookshelf: book[] = [];
        message.loading('正在加载...', { duration: 1500 });

        $('div.novelslistss').children('li').each((_, item) => {
          console.log()
          const book: book = {
            name: $(item).children("span.s2").text(),
            chapter: $($(item).children("span.s3")).children('a').text(),
            LatestChapterUrl: $($(item).children("span.s3")).children('a').attr("href"),
            url: $($(item).children("span.s2")).children('a').attr("href"),
            author: $(item).children("span.s4").text(),
            LastUpdateTime: $(item).children("span.s5").text(),
            typesOf: $(item).children("span.s1").text().replace(/\[|\]/g, ''),
          };
          TemporaryBookshelf.push(book);
        });

        booksTs.value = [...TemporaryBookshelf, ...booksTs.value];
        message.success('加载完成', { duration: 1500 });
        console.log('加载内容', booksTs.value);
      })
      .catch(err => {
        console.error('请求失败:', err);
        message.error('请求失败，请稍后再试', { duration: 1500 });
      });
  }
}, { immediate: true });
</script>

<template>
  <div class="searchPage">
    <div ref="NeworldscroE3" class="NeworldscroE" style="height: 98%; width: 100%; padding: 10px;">
      <n-space vertical>

        <div class="searchOption" v-for="(item, index) in booksTs" :key="index">
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
            <n-button v-if="isFavorites(item.name ?? '') || item.favorites" type="info" @click=" removeFavorite(index)">
              - 移除书架
            </n-button>
            <n-button v-else type="primary" @click="setFavorite(index)">
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
  overflow-y: auto;
}

.NeworldscroE::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

.NeworldscroE::-webkit-scrollbar-thumb {
  border-radius: 0px;
  -webkit-box-shadow: inset 0 0 5px rgba(235, 238, 240, 0.2);
  background: #ebeef0;
}

.NeworldscroE::-webkit-scrollbar-track {
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
  transition: transform 0.3s, box-shadow 0.3s !important;
}

.searchOption:hover {
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