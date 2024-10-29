import { createStore } from 'vuex'

interface pageStatus {
    name: string
}

//https://www.s-book.org/
export default createStore({
    state() {
        return {
            protocol18: false,
            skin: 'darkTheme',
            source: 'https://www.quanben.so/',
            RecommendedBookList: '',
            PageStatus: [{ name: 'home' }] as pageStatus[],
            SearchContent: '',
            BookDetailsLoading: ''
        }
    },
    getters: {
        getProtocol18: (state) => {
            return state.protocol18
        },
        getBookDetailsLoading: (state) => {
            return state.BookDetailsLoading
        },
        getPageStatus: (state) => {
            return state.PageStatus
        },
        getSearchContent: (state) => {
            return state.SearchContent
        },

        getSkin: (state) => {
            return state.skin
        },
        getSource: (state) => {
            return state.source
        },
        getRecommendedBookList: (state) => {
            return state.RecommendedBookList
        }
    },
    mutations: {
        SET_PROTOCOL18: (state, payload) => {
            state.protocol18 = payload
        },
        SET_BOOKDETAILSLOADING: (state, payload) => {
            state.BookDetailsLoading = payload
        },
        SET_PAGESTATUS: (state, payload) => {
            state.PageStatus = payload
        },
        SET_SEARCHCONTENT: (state, payload) => {
            state.SearchContent = payload
        },

        SET_VIEW: (state, payload) => {
            state.skin = payload
        },
        SET_SOURCE: (state, payload) => {
            state.source = payload
        },
        SET_RECOMMENDEDBOOKLIST: (state, payload) => {
            state.RecommendedBookList = payload
        }
    }
})