<template>
    <div class="sina-emotion-panel">
        <header class="sina-emotion-panel__header">
            <div class="tabs">
                <template v-for="cate in categories.data">
                    <a :class="{'tabs__item':true, 'tabs__item--action': currentCate===cate}" href="#" @click.prevent.stop="currentCate=cate;emotions.currentPage=1">{{ cate }}</a>
                </template>
            </div>
            <div class="tabsTools">
                <a href="#" class="btn tabsToolsButton" @click.prevent.stop="prevCate" :disabled="categories.prevPage <= 1">&lt;</a>
                <a href="#" class="btn tabsToolsButton" @click.prevent.stop="nextCate" :disabled="categories.prevPage >= categories.maxPage">&gt;</a>
            </div>
        </header>
        <div class="sina-emotion-panel__content">
            <template v-for="emotion in emotions.data">
                <a href="#" @click.prevent.stop="$emit('changeEmotion', emotion)">
                    <img :src="emotion.icon" :alt="emotion.phrase" :title="emotion.phrase.split('[')[1].split(']')[0]">
                </a>
            </template>
        </div>
        <footer class="sina-emotion-panel__footer">
            <a href="#" class="btn" @click.prevent.stop="prev" :disabled="emotions.prevPage <= 1">上一页</a>
            <a href="#" class="btn" @click.prevent.stop="next" :disabled="emotions.prevPage >= emotions.maxPage">下一页</a>
        </footer>
    </div>
</template>
<style lang="scss" scoped>
    .sina-emotion-panel{
        &__header{
            display: flex;
            margin-bottom: 10px;
        }
        &__content{
            margin-bottom: 10px;
            img{
                display: block;
                width: 22px;
                height: 22px;
                background-color: #fff;
                transition: background-image .3s ease-in-out;
                padding: 1px;
            }
            a{
                background-color: #f5f5f5;
                display: inline-block;
                padding: 1px;
                float: left;
            }
            &:after{
                content: '';
                display: table;
                clear: both;
            }
        }
        &__footer{
            text-align: right;
        }
        .btn{
            display: inline-block;
            padding: .25em .5em .3em;
            &[disabled]{
                opacity: .65;
            }
        }
        .tabs{
            flex: 1;
            &__item{
                display: inline-block;
                padding: .25em .5em .3em;
            }
            &__item--action{
                border-radius: 5px;
                background-color: #eee;
            }
        }
        .tabsTools{
        }
        .tabsToolsButton{
            display: inline-block;
            padding: .25em .5em .3em;
        }
    }
</style>
<script>
import { hashEmotions, paginator } from '../plugins/emotion/handle.js';
export default {
    name: 'sina-emotion',
    props: {
        source: Array,
        pageRows: {
            type: Number,
            default: 0
        },
    },
    watch: {
        source(val){
            this.storage = hashEmotions(val);
            this.categories = paginator(this.categories.currentPage, this.storage.categories, {pageRow: 5});
            this.emotions = paginator(this.emotions.currentPage, this.storage.groups[this.currentCate] || []);
        },
        currentCate(val){
            this.emotions = paginator(this.emotions.currentPage, this.storage.groups[val] || []);
        },
        'emotions.currentPage': function(val){
            this.emotions = paginator(val, this.storage.groups[this.currentCate] || []);
        },
        'categories.currentPage': function(val){
            this.categories = paginator(val, this.storage.categories, {pageRow: 5});
        }
    },
    data(){
        const data = {
            storage: {},
            emotions: {
                pageRow: 0,
                maxPage: 0,
                nextPage: 0,
                prevPage: 0, 
                currentPage: 1,
                data: []
            },
            categories: {
                pageRow: 0,
                maxPage: 0,
                nextPage: 0,
                prevPage: 0, 
                currentPage: 1,
                data: []
            },
            currentCate: '默认'
        };

        data.storage = hashEmotions(this.source);
        data.categories = paginator(data.categories.currentPage, data.storage.categories, {pageRow: 5});
        data.emotions = paginator(data.emotions.currentPage, data.storage.groups[data.currentCate] || []);
        return data;
    },
    methods:{
        next(){
            this.emotions.currentPage = Math.min(this.emotions.currentPage+1, this.emotions.maxPage);
        },
        prev(){
            this.emotions.currentPage = Math.max(this.emotions.currentPage-1, 1);
        },
        nextCate(){
            this.categories.currentPage = Math.min(this.categories.currentPage+1, this.categories.maxPage);
        },
        prevCate(){
            this.categories.currentPage = Math.max(this.categories.currentPage-1, 1);
        }
    }
}
</script>