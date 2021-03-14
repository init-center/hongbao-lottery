<template>
  <main class="lottery-box">
    <div class="hongbao-item" v-for="item in hongbaoList" :key="item.id">
      <hong-bao :info="item" :clickHandle="openClick" />
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import HongBao from "./HongBao.vue";
import { Dialog, Notify } from "vant";
import http from "../utils/http";
import { useStore } from "vuex";
import { key } from "../store";
import { useRouter } from "vue-router";
import { SET_DRAW_COUNT } from "@/store/mutationType";

interface DrawResult {
  statusCode: number;
  data: {
    prize: {
      id: number;
      name: string;
    };
    count: number;
  };
  message: string;
}

export default defineComponent({
  name: "Home",
  components: {
    HongBao
  },
  setup() {
    const store = useStore(key);
    const router = useRouter();
    const hongbaoList = ref([
      {
        id: 1,
        cover: require("../../public/img/cover/cover1.png"),
        open: false
      },
      {
        id: 2,
        cover: require("../../public/img/cover/cover2.png"),
        open: false
      },
      {
        id: 3,
        cover: require("../../public/img/cover/cover3.png"),
        open: false
      },
      {
        id: 4,
        cover: require("../../public/img/cover/cover4.png"),
        open: false
      },
      {
        id: 5,
        cover: require("../../public/img/cover/cover5.png"),
        open: false
      },
      {
        id: 6,
        cover: require("../../public/img/cover/cover6.png"),
        open: false
      }
    ]);

    const openClick = async (id: number) => {
      const clickedHongbao = hongbaoList.value.find(item => item.id === id);

      if (clickedHongbao && clickedHongbao.open) {
        Notify("该红包已被开启，试试其它红包吧！");
        return;
      }
      clickedHongbao && (clickedHongbao.open = true);

      const userInfo = store.state.userInfo;

      if (!userInfo.name || !userInfo.phone) {
        Notify("未登记用户信息！");
        router.push("/guide");
      }

      try {
        const result = await http.get<DrawResult>(
          `/lotteries?name=${userInfo.name}&phone=${userInfo.phone}`
        );

        if (result.status === 200) {
          const data = result.data.data;

          setTimeout(() => {
            Dialog({
              title: "恭喜",
              message: `你在活动中抽中了 ${data.prize.name} ！`
            });
            store.commit(SET_DRAW_COUNT, data.count);
          }, 1600);
        } else {
          clickedHongbao && (clickedHongbao.open = false);
          Notify("抽取失败！");
        }
      } catch (error) {
        const msg = error?.response?.data?.message;
        clickedHongbao && (clickedHongbao.open = false);
        if (msg) {
          Notify(msg);
        } else {
          Notify("抽取失败！");
        }
        return;
      }
    };

    return {
      hongbaoList,
      openClick
    };
  }
});
</script>

<style lang="scss" scoped>
.lottery-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 95%;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  padding: 4px;
  box-sizing: border-box;

  .hongbao-item {
    width: calc(100% / 3);
    padding: 10px;
    box-sizing: border-box;
  }
}
</style>
