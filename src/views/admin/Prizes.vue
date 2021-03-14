<template>
  <admin-layout title="奖品管理">
    <CellGroup title="增加奖品">
      <Form @submit="addPrizeClick">
        <Cell>
          <Field
            v-model="addPrizeInfo.name"
            name="name"
            label="名称"
            placeholder="奖品名称"
            :rules="[
              { required: true, message: '请填写奖品名称' },
              {
                validator: val => val.length > 0 && val.length <= 64,
                message: '名称长度必须在1 - 64位之间！'
              }
            ]"
          />
        </Cell>
        <Cell>
          <Field
            v-model="addPrizeInfo.probability"
            name="probability"
            label="概率"
            placeholder="抽中概率"
            :rules="[
              { required: true, message: '请填写概率' },
              {
                validator: val => val >= 0 && val <= 100,
                message: '概率必须在 0 - 100 之间！'
              }
            ]"
          />
        </Cell>
        <div style="margin: 16px;">
          <Button
            round
            block
            type="danger"
            native-type="submit"
            :loading="isSubmitLoading"
            >增加</Button
          >
        </div>
      </Form>
    </CellGroup>
    <CellGroup title="奖品列表">
      <Empty v-if="prizesList.length === 0" description="暂无奖品" />
      <template v-else>
        <SwipeCell v-for="prize in prizesList" :key="prize.id">
          <Cell
            :title="prize.name"
            :value="`概率： ${prize.probability}`"
          ></Cell>
          <template #right>
            <Button
              square
              type="danger"
              text="删除"
              @click="
                () => {
                  deletePrizeClick(prize.id);
                }
              "
            />
          </template>
        </SwipeCell>
      </template>
    </CellGroup>
  </admin-layout>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import {
  List,
  Form,
  Cell,
  CellGroup,
  Field,
  Button,
  SwipeCell,
  Notify,
  Empty
} from "vant";
import http from "../../utils/http";
import AdminLayout from "@/layout/AdminLayout.vue";

interface PrizeItem {
  id: number;
  name: string;
  probability: number;
}

interface AddPrizeInfo {
  name: string;
  probability: number;
}

interface PrizeListResult {
  statusCode: number;
  data: PrizeItem[];
  message: string;
}

interface AddOrDelPrizeResult {
  statusCode: number;
  message: string;
}

export default defineComponent({
  name: "Prizes",
  components: {
    [List.name]: List,
    AdminLayout,
    CellGroup,
    Cell,
    Field,
    Button,
    Form,
    SwipeCell,
    Empty
  },
  setup: () => {
    const prizesList = ref<PrizeItem[]>([]);

    const addPrizeInfo = ref<AddPrizeInfo>({
      name: "",
      probability: 0
    });

    const isSubmitLoading = ref(false);

    const fetchPrizesList = async () => {
      try {
        const result = await http.get<PrizeListResult>("/lotteries/prizes");

        if (result?.status === 200) {
          const data = result.data.data;
          prizesList.value = data;
        }
      } catch (error) {
        const msg = error?.response?.data?.message;
        if (msg) {
          Notify(msg);
        } else {
          Notify("请求奖品列表错误！");
        }

        return;
      }
    };

    onMounted(() => {
      fetchPrizesList();
    });

    const addPrizeClick = async (values: AddPrizeInfo) => {
      if (isSubmitLoading.value) return;
      isSubmitLoading.value = true;
      values.probability = Number(values.probability);
      try {
        const result = await http.post<AddOrDelPrizeResult>(
          `/lotteries`,
          values
        );
        if (result.status === 201) {
          Notify({
            type: "success",
            message: result.data.message
          });
          fetchPrizesList();
        } else {
          Notify({
            type: "danger",
            message: "新增奖品失败！"
          });
        }
      } catch (error) {
        const msg = error?.response?.data?.message;
        if (msg) {
          Notify(msg);
        } else {
          Notify("请求错误！");
        }
      } finally {
        isSubmitLoading.value = false;
      }
    };

    const deletePrizeClick = async (id: number) => {
      try {
        const result = await http.delete<AddOrDelPrizeResult>(`/lotteries`, {
          data: { id }
        });
        if (result.status === 200) {
          Notify({
            type: "success",
            message: result.data.message
          });
          fetchPrizesList();
        } else {
          Notify({
            type: "danger",
            message: "删除奖品失败！"
          });
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
    };

    return {
      prizesList,
      addPrizeInfo,
      addPrizeClick,
      deletePrizeClick,
      isSubmitLoading
    };
  }
});
</script>
