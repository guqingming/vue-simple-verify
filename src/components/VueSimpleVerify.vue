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

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import barImage from './images/bar'
import successImage from './images/success'

@Component({
  name: 'Verify'
})

export default class extends Vue {
  /**
   * 外部参数
   */
  /** 长度 */
  @Prop({ type: Number, default: 340 }) private width!: number
  /** 宽度 */
  @Prop({ type: Number, default: 36 }) private height!: number
  /** 边框颜色 */
  @Prop({ type: String, default: '#E4E4E4' }) private borderColor!: string
  /** 背景颜色 */
  @Prop({ type: String, default: '#F2F3F5' }) private bgColor!: string
  /** 圆角大小 */
  @Prop({ type: Number, default: 4 }) private borderRadius!: number
  /** 提示文案 */
  @Prop({ type: String, default: '请按住滑块，拖动到最右边' }) private tips!: string
  /** 滑块的背景颜色，可以是图片 */
  @Prop({ type: String, default: `url(${ barImage })` }) private barBackground!: string
  /** 滑过颜色 */
  @Prop({ type: String, default: 'linear-gradient(313deg, rgba(65, 209, 102, 1) 0%, rgba(90, 232, 118, 1) 100%)' }) private movedColor!: string
  /** 成功文案 */
  @Prop({ type: String, default: '完成验证' }) private successTips!: string
  /** 成功后的图标 */
  @Prop({ type: String, default: successImage }) private successIcon!: string

  /**
   * 计算属性
   */
  /** 最大滑动距离 */
  get max() {
    return this.width - 50
  }
  /** 盒子样式 */
  get style() {
    return `width: ${ this.width }px; height: ${ this.height }px; border: ${ this.borderColor } 1px solid; background-color: ${ this.bgColor }; border-radius: ${ this.borderRadius }px`
  }
  /** 滑块样式 */
  get barStyle() {
    return `background: ${ this.barBackground };`
  }
  /** 滑条盒子样式 */
  get slideBoxStyle() {
    return `border-radius: ${ this.borderRadius }px;`
  }
  /** 滑条样式 */
  get slideStyle() {
    return `border-radius: ${ this.borderRadius }px; background: ${ this.movedColor }; left: ${ 50 - this.width }px`
  }
  /** 成功图标 */
  get iconStyle() {
    return `background: url(${ successImage }) no-repeat;`
  }
  /** 按钮 */
  get $bar() {
    return this.$refs.bar as HTMLElement
  }
  /** 成功文案 */
  get $text() {
    return this.$refs.text as HTMLElement
  }
  /** 滑块 */
  get $slide() {
    return this.$refs.slide as HTMLElement
  }
  /** 整体 */
  get $verify() {
    return this.$refs.verify as HTMLElement
  }

  /**
   * 数据数据
   */
  /** x */
  private x1 = 0
  private x2 = 0
  /** 鼠标是否按下 */
  private isMousedown = false
  /** 是否已经成功 */
  private isSuccess = false

  /**
   * 生命周期
   */
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
  }
  destroyed() {
    document.body.removeEventListener('mousemove', this.mousemove)
    document.body.removeEventListener('mouseup', this.mouseup)
  }

  /**
   * 鼠标移入
   */
  private mouseenter(e: any) {
    if (this.isSuccess) {
      return
    }
    this.$slide.style.opacity = '1'
  }

  /**
   * 鼠标离开
   */
  private mouseleave(e: any) {
    if (this.isSuccess || this.isMousedown) {
      return
    }
    this.$slide.style.opacity = '0'
    const transitionDuration = '.3s'
    const transform = `translateX(0)`
    this.setStyle(transitionDuration, transform)
  }

  /**
   * 鼠标按下
   */
  private mousedown(e: any) {
    if (this.isSuccess) {
      return
    }
    this.x1 = e.x
    this.isMousedown = true
  }

  /**
   * 鼠标移动
   */
  private mousemove(e: any) {
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
  }

  /**
   * 鼠标松开
   */
  private mouseup() {
    if (this.isSuccess) {
      return
    }
    this.isMousedown = false
    const transitionDuration = '.3s'
    const transform = `translateX(0)`
    this.setStyle(transitionDuration, transform)
  }

  /**
   * 设置样式
   */
  private setStyle(transitionDuration: string, transform: string) {
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
  }

  /**
   * 重置
   */
  private reset() {
    this.isSuccess = false
    this.isMousedown = false
    const transitionDuration = '0s'
    const transform = `translateX(0)`
    this.setStyle(transitionDuration, transform)
    this.$text.style.opacity = '0'
    this.$slide.style.opacity = '0'
  }
}

</script>

<style lang="scss">
@import '../scss/VueSimpleVerify.scss';
</style>
