<template>
  <default-layout winRecordShow>
    <div class="warning" v-show="userInfo.name && userInfo.phone">
      {{ `欢迎你 ${userInfo.name} 你有 ${drawCount} 次抽取机会` }}
    </div>
    <div class="warning">请点击下方任意红包进行抽取</div>
    <lottery-box />
  </default-layout>
</template>

<script>
import { defineComponent, toRefs } from "vue";
import { useStore } from "vuex";
import { Notify } from "vant";
import DefaultLayout from "../layout/DefaultLayout";
import LotteryBox from "../components/LotteryBox";
import { key } from "../store";

export default defineComponent({
  name: "Home",
  components: {
    DefaultLayout,
    LotteryBox
  },
  beforeRouteEnter(_to, _from, next) {
    next(vm => {
      const { name, phone } = vm.$store.state.userInfo;
      if (!name || !phone) {
        Notify("未登记你的信息！");
        vm.$router.push("/guide");
      }
    });
  },
  setup() {
    const store = useStore(key);

    const { userInfo, drawCount } = toRefs(store.state);

    return { userInfo, drawCount };
  }
});
</script>

<style lang="scss" scoped>
.warning {
  color: #fff;
  padding-bottom: 10px;
}
</style>
