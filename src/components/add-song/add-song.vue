<template>
    <transition name="slide">
      <div class="add-song" v-show="showflag" @click.stop>
        <div class="header">
          <h1 class="title">添加歌曲</h1>
          <div class="close"  @click="hidden">
            <i class="icon-close"></i>
          </div>
        </div>
        <div class="search-box-wrapper">
          <search-box ref="searchBox" placeholder="搜索歌曲" @query="ContentChange"></search-box>
        </div>
        <div class="shortcut" v-show="!query">
          <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
          <div class="list-wrapper">
            <scroll ref="scrollplay" class="list-scroll" v-if="currentIndex===0" :data="playHistory">
              <div class="list-inner">
                <song-list :songs="playHistory" @select="selectItem"></song-list>
              </div>
            </scroll>
            <scroll :refreshDelay="refreshDelay" ref="scrollsearch" class="list-scroll"  v-if="currentIndex===1" :data="searchHistory">
              <div class="list-inner">
                <search-list :searches="searchHistory" @selet="seletItem" @delete="deleteSearchHistory"></search-list>
              </div>
            </scroll>
          </div>
        </div>
        <div class="search-result" v-show="query">
          <suggest @history="selectSuggest" @listScoll="blurInput" :query="query" ref="suggest" :showSinger="showSinger"></suggest>
        </div>
        <top-list ref="toplist">
          <div class=tip-title>
            <i class="icon-ok"></i>
            <span class="text">一首歌曲已添加成功</span>
          </div>
        </top-list>
      </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import {searchMixin} from 'common/js/mixin'
import Switches from 'base/switch/switch'
import {mapGetters, mapActions} from 'vuex'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Song from 'common/js/song'
import SearchList from 'base/search-list/search-list'
import TopList from 'base/top-list/top-list'
export default {
  mixins: [searchMixin],
  data () {
    return {
      showflag: false,
      showSinger: false,
      currentIndex: 0,
      switches: [
        {name: '最近播放'},
        {name: '历史播放'}
      ]
    }
  },
  computed: {
    ...mapGetters([
      'playHistory'
    ])
  },
  mounted () {
    console.log(this.playHistory)
  },
  methods: {
    show () {
      this.showflag = true
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.scrollplay.refresh()
        } else {
          this.$refs.scrollsearch.refresh()
        }
      }, 20)
    },
    hidden () {
      this.showflag = false
    },
    switchItem (index) {
      this.currentIndex = index
    },
    selectSuggest () {
      console.log('1')
      this.saveSearch()
      this.$refs.toplist.show()
    },
    selectItem (song, index) {
      if (index !== 0) {
        this.interSong(new Song(song))
      }
      this.$refs.toplist.show()
    },
    ...mapActions([
      'interSong'
    ])
  },
  components: {
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    TopList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 20px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
