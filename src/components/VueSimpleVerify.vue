<template>
  <div ref="verify" :style="style" class="simple-verify">
    <div class="verify-tips">{{ tips }}</div>
    <div :style="slideBoxStyle" class="verify-box">
      <div ref="slide" class="veriry-slide" :style="slideStyle" />
    </div>
    <div ref="bar" class="verify-bar">
      <div :style="barStyle" class="icon" />
    </div>
    <div ref="text" class="verify-success-tips">
      <span :style="iconStyle" />{{ successTips }}
    </div>
  </div>
</template>

<script>
import barImage from './images/bar'
import successImage from './images/success'

export default {
  name: 'Verify',
  props: {
    /** 长度 */
    width: {
      type: Number,
      default: 340
    },
    /** 宽度 */
    height: {
      type: Number,
      default: 36
    },
    /** 边框颜色 */
    borderColor: {
      type: String,
      default: '#E4E4E4'
    },
    /** 背景颜色 */
    bgColor: {
      type: String,
      default: '#F2F3F5'
    },
    /** 圆角大小 */
    borderRadius: {
      type: Number,
      default: 4
    },
    /** 提示文案 */
    tips: {
      type: String,
      default: '请按住滑块，拖动到最右边'
    },
    /** 滑块的背景颜色，可以是图片 */
    barBackground: {
      type: String,
      default: `url(${ barImage })`
    },
    /** 滑过颜色 */
    movedColor: {
      type: String,
      default: 'linear-gradient(313deg, rgba(65, 209, 102, 1) 0%, rgba(90, 232, 118, 1) 100%)'
    },
    /** 成功文案 */
    successTips: {
      type: String,
      default: '完成验证'
    },
    /** 成功后的图标 */
    successIcon: {
      type: String,
      default: successImage
    }
  },
  computed: {
    /** 最大滑动距离 */
    max() {
      return this.width - 50
    },
    /** 盒子样式 */
    style() {
      return `width: ${ this.width }px; height: ${ this.height }px; border: ${ this.borderColor } 1px solid; background-color: ${ this.bgColor }; border-radius: ${ this.borderRadius }px`
    },
    /** 滑块样式 */
    barStyle() {
      return `background: ${ this.barBackground };`
    },
    /** 滑条盒子样式 */
    slideBoxStyle() {
      return `border-radius: ${ this.borderRadius }px;`
    },
    /** 滑条样式 */
    slideStyle() {
      return `border-radius: ${ this.borderRadius }px; background: ${ this.movedColor }; left: ${ 50 - this.width }px`
    },
    /** 成功图标 */
    iconStyle() {
      return `background: url(${ successImage }) no-repeat;`
    },
    /** 按钮 */
    $bar() {
      return this.$refs.bar
    },
    /** 成功文案 */
    $text() {
      return this.$refs.text
    },
    /** 滑块 */
    $slide() {
      return this.$refs.slide
    },
    /** 整体 */
    $verify() {
      return this.$refs.verify
    }
  },
  data() {
    return {
      x1: 0,
      x2: 0,
      /** 鼠标是否按下 */
      isMousedown: false,
      /** 是否已经成功 */
      isSuccess: false
    }
  },
  mounted() {
    /**
     * 绑定事件
     */
    this.$bar.addEventListener('mouseenter', this.mouseenter)
    this.$bar.addEventListener('mouseleave', this.mouseleave)
    this.$bar.addEventListener('mousedown', this.mousedown)
    document.body.addEventListener('mousemove', this.mousemove)
    document.body.addEventListener('mouseup', this.mouseup)
    this.$verify.addEventListener('reset', this.reset)
  },
  destroyed() {
    document.body.removeEventListener('mousemove', this.mousemove)
    document.body.removeEventListener('mouseup', this.mouseup)
  },
  methods: {
    /**
     * 鼠标移入
     */
    mouseenter(e) {
      if (this.isSuccess) {
        return
      }
      this.$slide.style.opacity = '1'
    },

    /**
     * 鼠标离开
     */
    mouseleave(e) {
      if (this.isSuccess || this.isMousedown) {
        return
      }
      this.$slide.style.opacity = '0'
      const transitionDuration = '.3s'
      const transform = `translateX(0)`
      this.setStyle(transitionDuration, transform)
    },

    /**
     * 鼠标按下
     */
    mousedown(e) {
      if (this.isSuccess) {
        return
      }
      this.x1 = e.x
      this.isMousedown = true
    },

    /**
     * 鼠标移动
     */
    mousemove(e) {
      if (!this.isMousedown || this.isSuccess) {
        return
      }
      e.preventDefault()
      e.stopPropagation()
      this.x2 = e.x
      let diff = this.x2 - this.x1
      if (diff < 0) {
        diff = 0
      }
      if (diff >= this.max) {
        diff = this.max
        this.isSuccess = true
        this.$text.style.opacity = '1'
        this.$emit('success')
      }
      const transitionDuration = '0s'
      const transform = `translateX(${ diff }px)`
      this.setStyle(transitionDuration, transform)
    },

    /**
     * 鼠标松开
     */
    mouseup() {
      if (this.isSuccess) {
        return
      }
      this.isMousedown = false
      const transitionDuration = '.3s'
      const transform = `translateX(0)`
      this.setStyle(transitionDuration, transform)
    },

    /**
     * 设置样式
     */
    setStyle(transitionDuration, transform) {
      // 滑块
      this.$slide.style.transitionDuration = transitionDuration
      this.$slide.style.webkitTransitionDuration = transitionDuration
      this.$slide.style.transform = transform
      this.$slide.style.webkitTransform = transform
      // 按钮
      this.$bar.style.transitionDuration = transitionDuration
      this.$bar.style.webkitTransitionDuration = transitionDuration
      this.$bar.style.transform = transform
      this.$bar.style.webkitTransform = transform
    },

    /**
     * 重置
     */
    reset() {
      this.isSuccess = false
      this.isMousedown = false
      const transitionDuration = '0s'
      const transform = `translateX(0)`
      this.setStyle(transitionDuration, transform)
      this.$text.style.opacity = '0'
      this.$slide.style.opacity = '0'
    }
  }
}

</script>

<style lang="scss" scoped>
@import '../scss/VueSimpleVerify.scss';
</style>
