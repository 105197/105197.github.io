<template>
  <transition name="slide">
    <div class="user-center" @click.stop>
      <div class="back" @click.stop="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :currentIndex="currentIndex" :switches="switches" @switch="switchItem"></switches>
      </div>
      <div class="play-btn" @click.stop="random">
        <i class="icon-play"></i>
        <span class="text">随机播放歌曲</span>
      </div>
      <div class="list-wrapper" ref="listwrapper">
        <scroll ref="favoriteplay" class="list-scroll" v-if="currentIndex===0" :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectItem"></song-list>
          </div>
        </scroll>
        <scroll  ref="historyplay" class="list-scroll"  v-if="currentIndex===1" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectItem"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResulttitle"></no-result>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Switches from 'base/switch/switch'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import {mapGetters, mapActions} from 'vuex'
import Song from 'common/js/song'
import {playlistMixin} from 'common/js/mixin'
import NoResult from 'base/no-result/no-result'
export default {
  mixins: [playlistMixin],
  data () {
    return {
      currentIndex: 0,
      switches: [
        {name: '我喜欢的'},
        {name: '最近播放的'}
      ]
    }
  },
  computed: {
    noResult () {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length
      } else {
        return !this.playHistory.length
      }
    },
    noResulttitle () {
      if (this.currentIndex === 0) {
        return '暂无喜欢歌曲'
      } else {
        return '暂无听过歌曲'
      }
    },
    ...mapGetters([
      'favoriteList',
      'playHistory'
    ])
  },
  methods: {
    switchItem (index) {
      this.currentIndex = index
    },
    back () {
      this.$router.back()
    },
    selectItem (song) {
      this.interSong(new Song(song))
    },
    random () {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
      if (list.length === 0) {
        return
      }
      list = list.map((song) => {
        return new Song(song)
      })
      this.randomPlay({
        list
      })
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : '0'
      this.$refs.listwrapper.style.bottom = bottom
      if (this.currentIndex === 0) {
        this.$refs.favoriteplay.refresh()
      } else {
        this.$refs.historyplay.refresh()
      }
    },
    ...mapActions([
      'interSong',
      'randomPlay'
    ])
  },
  components: {
    Switches,
    Scroll,
    SongList,
    NoResult
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
