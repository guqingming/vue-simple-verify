<template>
  <div id="app">
    <div class="box">
      <vue-simple-verify ref="verify" @success="success" />
      <p>验证状态：{{ isPass }}</p>
      <button class="button" @click="reset">重置状态</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import VueSimpleVerify from '@components/VueSimpleVerify.vue'

// import VueSimpleVerify from 'vue-simple-verify'
// import 'vue-simple-verify/dist/vue-simple-verify.css'

@Component({
  name: 'Dev',
  components: {
    VueSimpleVerify
  }
})

export default class extends Vue {
  /**
   * 初始数据
   */
  private isPass = false

  /**
   * 验证通过
   */
  private success() {
    this.isPass = true
  }

  /**
   * 重置
   */
  private reset() {
    const $verify = this.$refs.verify as VueSimpleVerify.SimpleVerify
    $verify.reset()
    this.isPass = false
  }
}
</script>

<style lang="scss">
  html,
  body {
    margin: 0;
    height: 100%;
    font-family: -apple-system, sans-serif;
  }

  #app {
    height: 100%;
  }

  .box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .button {
    margin-top: 20px;
  }
</style>
