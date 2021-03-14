<template>
  <admin-layout title="抽奖次数管理">
    <CellGroup title="增加抽奖次数">
      <Form @submit="addCountClick">
        <Cell>
          <Field
            v-model="addCountInfo.name"
            name="name"
            label="姓名"
            placeholder="姓名"
            :rules="[
              { required: true, message: '要增加抽奖次数的用户姓名' },
              {
                pattern: /^[\u4E00-\u9FA5]{2,6}$/,
                message: '姓名必须是2 - 6 位的汉字！'
              }
            ]"
          />
        </Cell>
        <Cell>
          <Field
            v-model="addCountInfo.phone"
            type="number"
            name="phone"
            label="手机"
            placeholder="要增加抽奖次数的用户手机号"
            :rules="[
              { required: true, message: '请填写手机号码' },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入符合规范的11位手机号码！'
              }
            ]"
          />
        </Cell>
        <Cell>
          <Field
            v-model="addCountInfo.count"
            name="count"
            type="number"
            label="次数"
            placeholder="要增加的抽奖次数"
            :rules="[
              { required: true, message: '请填写增加的抽奖次数' },
              {
                validator: val => Number(val) > 0,
                message: '增加次数必须大于0！'
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
    <CellGroup title="查询抽奖次数">
      <Form @submit="searchCountClick">
        <Cell>
          <Field
            v-model="searchCountInfo.phone"
            type="number"
            name="phone"
            label="手机"
            placeholder="要查询抽奖次数的用户手机号"
            :rules="[
              { required: true, message: '请填写手机号码' },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入符合规范的11位手机号码！'
              }
            ]"
          />
        </Cell>
        <div style="margin: 16px;">
          <Button round block type="danger" native-type="submit">查询</Button>
        </div>
      </Form>
    </CellGroup>
  </admin-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import { List, Form, Cell, CellGroup, Field, Button, Notify } from "vant";
import http from "../../utils/http";
import AdminLayout from "@/layout/AdminLayout.vue";

interface SearchCountInfo {
  phone: string;
}

interface AddCountInfo {
  name: string;
  phone: string;
  count: number;
}

interface AddCountResult {
  statusCode: number;
  message: string;
}

interface SearchCountResult {
  statusCode: number;
  data: {
    uid: string;
    name: string;
    phone: string;
    count: number;
  };
  message: string;
}

export default defineComponent({
  name: "DrawCount",
  components: {
    [List.name]: List,
    AdminLayout,
    CellGroup,
    Cell,
    Field,
    Button,
    Form
  },
  setup: () => {
    const addCountInfo = ref<AddCountInfo>({
      name: "",
      phone: "",
      count: 1
    });

    const searchCountInfo = ref<SearchCountInfo>({
      phone: ""
    });

    const isSubmitLoading = ref(false);

    const addCountClick = async (values: AddCountInfo) => {
      if (isSubmitLoading.value) return;
      isSubmitLoading.value = true;
      try {
        const result = await http.put<AddCountResult>(
          `/lotteries/count`,
          values
        );
        if (result.status === 200) {
          addCountInfo.value = {
            name: "",
            phone: "",
            count: 1
          };
          Notify({
            type: "success",
            message: result.data.message
          });
        } else {
          Notify({
            type: "danger",
            message: "增加抽奖次数失败！"
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

    const searchCountClick = async (values: SearchCountInfo) => {
      try {
        const result = await http.get<SearchCountResult>(
          `/lotteries/count?phone=${values.phone}`
        );
        if (result.status === 200) {
          const { name, count } = result?.data?.data;
          count &&
            Notify({
              type: "success",
              message: `用户 ${name} 拥有 ${count} 次抽奖机会！`
            });
        } else {
          Notify({
            type: "danger",
            message: "查询抽奖次数失败！"
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
      addCountInfo,
      searchCountInfo,
      addCountClick,
      searchCountClick,
      isSubmitLoading
    };
  }
});
</script>
