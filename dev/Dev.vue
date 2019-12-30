<template>
  <div id="app">
    <div class="box">
      <vue-simple-verify ref="verify" @success="success" />
      <p>验证状态：{{ isPass }}</p>
      <button class="button" @click="reset">重置状态</button>
    </div>
  </div>
</template>

<script>
import VueSimpleVerify from '../src/components/VueSimpleVerify'

export default {
  components: {
    VueSimpleVerify
  },
  data() {
    return {
      isPass: false
    }
  },
  methods: {
    success() {
      this.isPass = true
    },
    reset() {
      this.$refs.verify.reset()
      this.isPass = false
    }
  }
}
</script>

<style>
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
