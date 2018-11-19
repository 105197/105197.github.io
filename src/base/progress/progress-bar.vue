<template>
    <div class="progress-bar" ref="progressbar" @click="clickprogress">
      <div class="bar-inner">
        <div class="progress" ref="progress"></div>
        <div class="progress-btn-wrapper" ref="progressBtn"
          @touchstart="progressTouchStart"
          @touchmove="progressTouchMove"
          @touchend="progressTouchEnd">
          <div class="progress-btn"></div>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
import {prefixStyle} from 'common/js/dom'
const progressBtnWidth = 16
const transform = prefixStyle('transform')
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    progressTouchStart (e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      const delte = e.touches[0].pageX - this.touch.startX
      const offsetwidth = Math.min(this.$refs.progressbar.clientWidth - progressBtnWidth, Math.max(0, delte + this.touch.left))
      this._offset(offsetwidth)
    },
    progressTouchEnd (e) {
      this.touch.initiated = false
      this.touchchange()
    },
    _offset (offsetwidth) {
      this.$refs.progress.style.width = `${offsetwidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetwidth}px, 0, 0)`
    },
    touchchange () {
      const barwidth = this.$refs.progressbar.clientWidth - progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barwidth
      this.$emit('percentchangge', percent)
    },
    clickprogress (e) {
      const rect = this.$refs.progressbar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      this.touchchange()
    }
  },
  watch: {
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barwidth = this.$refs.progressbar.clientWidth - progressBtnWidth
        const offsetwidth = newPercent * barwidth
        this._offset(offsetwidth)
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
.progress-bar
  height: 30px
  .bar-inner
    position: relative
    top: 13px
    height: 4px
    background: rgba(0, 0, 0, 0.3)
    .progress
      position: absolute
      height: 100%
      background: $color-theme
    .progress-btn-wrapper
      position: absolute
      left: -8px
      top: -13px
      width: 30px
      height: 30px
      .progress-btn
        position: relative
        top: 7px
        left: 7px
        width: 16px
        height: 16px
        box-sizing: border-box
        border: 3px solid $color-text
        border-radius: 50%
        background: $color-theme

</style>
