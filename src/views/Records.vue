<template>
  <default-layout backBtnShow>
    <main class="records-box">
      <Empty v-if="recordsList.length === 0" description="暂无中奖记录" />
      <List v-else>
        <cell-group title="中奖记录">
          <Cell
            v-for="item in recordsList"
            :key="item.id"
            :title="item.prize_name"
            :value="
              `${item.user_name} |
          ${item.user_phone}`
            "
            :label="formatTime(item.created_at)"
          />
        </cell-group>
      </List>
    </main>
  </default-layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import DefaultLayout from "../layout/DefaultLayout.vue";
import { List, Notify, Cell, CellGroup, Empty } from "vant";
import dayjs from "dayjs";
import http from "../utils/http";
import { key } from "../store";

interface Record {
  id: number;
  prize_id: number;
  prize_name: string;
  user_id: number;
  user_phone: string;
  user_name: string;
  created_at: string;
}

interface GetRecordsResult {
  statusCode: number;
  data: Record[];
  message: string;
}

export default defineComponent({
  name: "Records",
  components: {
    DefaultLayout,
    [List.name]: List,
    Cell,
    CellGroup,
    Empty
  },
  setup: () => {
    const store = useStore(key);
    const router = useRouter();

    const recordsList = ref<Record[]>([]);

    onMounted(async () => {
      const { phone } = store.state.userInfo;
      if (!phone) {
        router.push("/guide");
      }
      try {
        const result = await http.get<GetRecordsResult>(
          `/lotteries/records?phone=${phone}`
        );
        if (result?.status === 200) {
          const data = result.data.data;
          recordsList.value = data;
        }
      } catch (error) {
        const msg = error?.response?.data?.message;
        if (msg) {
          Notify(msg);
        } else {
          Notify("请求错误！");
        }
        return;
      }
    });

    const formatTime = (time: string) => dayjs(time).format("YYYY-MM-DD H:m:s");

    const returnClick = () => {
      router.push("/");
    };

    return {
      recordsList,
      returnClick,
      formatTime
    };
  }
});
</script>

<style lang="scss" scoped>
.records-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 95%;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  padding: 4px;
  height: 400px;
  overflow-y: scroll;
  box-sizing: border-box;
  user-select: none;
}
</style>
