<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="ContentChange"></search-box>
    </div>
    <div class="shortcut-wrapper" ref="shortcutwrapper" v-show="!query">
      <scroll class="shortcut" ref="shortcut" :data="shortcut" :refreshDelay="refreshDelay">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="item in hotkey" :key="item.n" @click="seletItem(item.k)">
                <span >{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showComfirm">
          <i class="icon-clear"></i>
        </span>
            </h1>
            <search-list @selet="seletItem"  @delete="deleteSearchHistory" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" ref="searchresult" v-show="query">
      <suggest @history="saveSearch" @listScoll="blurInput" :query="query" ref="suggest"></suggest>
    </div>
    <comfirm ref="comfirm" text="是否清空所有历史记录" @confirm="clearAllHistory"
             conceltext="取消" confirmtext="清空"></comfirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import {getHot} from 'api/search'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import Suggest from 'components/suggest/suggest'
import NoResult from 'base/no-result/no-result'
import SearchList from 'base/search-list/search-list'
import Comfirm from 'base/comfirm/comfirm'
import {mapActions} from 'vuex'
import {playlistMixin, searchMixin} from 'common/js/mixin'

export default {
  mixins: [playlistMixin, searchMixin],
  data () {
    return {
      hotkey: []
    }
  },
  created () {
    this._getHot()
  },
  computed: {
    shortcut () {
      return this.hotkey.concat(this.searchHistory)
    }
  },
  methods: {
    _getHot () {
      getHot().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data.hotkey)
          this.hotkey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : '0'
      this.$refs.shortcutwrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
      this.$refs.searchresult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    showComfirm () {
      this.$refs.comfirm.show()
    },
    ...mapActions([
      'clearAllHistory'
    ])
  },
  watch: {
    query (newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  components: {
    Suggest,
    SearchBox,
    NoResult,
    SearchList,
    Comfirm,
    Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0

</style>
