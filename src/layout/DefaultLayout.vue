<template>
  <div class="default-layout">
    <header class="title-box">
      <h1 class="title">罗锦雅迪</h1>
      <h1 class="title">分享抽红包</h1>
    </header>
    <div v-if="backBtnShow" class="nav back" @click="() => $router.push('/')">
      返回
    </div>
    <div
      v-if="winRecordShow"
      class="nav"
      @click="() => $router.push('/records')"
    >
      中奖记录
    </div>
    <slot></slot>
    <footer>
      <p style="font-size:14px">
        地址： 罗锦邮政对面，雅迪电动车专卖店
      </p>
    </footer>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "DefaultLayout",
  props: {
    winRecordShow: {
      type: Boolean,
      default: () => false
    },
    backBtnShow: {
      type: Boolean,
      default: () => false
    }
  }
});
</script>

<style scoped lang="scss">
.default-layout {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 100%;
  background-color: #fe5858;
  background: url("../../public/img/background/background.png");
  background-size: cover;

  .title-box {
    width: 60%;
    color: white;
    padding-top: 52px;
    padding-bottom: 20px;
    .title {
      text-align: center;
      margin: 0 auto;
      word-break: keep-all;
      white-space: nowrap;
      letter-spacing: 10px;
    }
  }

  .nav {
    position: absolute;
    left: 0;
    top: 5vh;
    color: #a32318;
    font-size: 12px;
    line-height: 12px;
    background-color: #fae09f;
    text-align: center;
    width: 58px;
    padding: 6px;
    border-radius: 0 20px 20px 0;
  }

  .back {
    left: 0;
    top: 1vh;
  }

  footer {
    font-size: 12px;
    text-align: center;
    color: white;
  }
}
</style>
