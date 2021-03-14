<template>
  <default-layout>
    <main class="guide-box">
      <van-form @submit="onSubmit">
        <van-field
          v-model="userInfo.name"
          name="name"
          label="姓名"
          placeholder="姓名"
          :rules="[
            { required: true, message: '请填写姓名' },
            {
              pattern: /^[\u4E00-\u9FA5]{2,6}$/,
              message: '姓名必须是2 - 6 位的汉字！'
            }
          ]"
        />
        <van-field
          v-model="userInfo.phone"
          type="number"
          name="phone"
          label="手机"
          placeholder="手机"
          :rules="[
            { required: true, message: '请填写手机号码' },
            {
              pattern: /^1[3-9]\d{9}$/,
              message: '请输入符合规范的11位手机号码！'
            }
          ]"
        />
        <div style="margin: 16px;">
          <van-button
            round
            block
            type="danger"
            native-type="submit"
            :loading="isSubmitLoading"
            >提交</van-button
          >
        </div>
      </van-form>
    </main>
  </default-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import DefaultLayout from "../layout/DefaultLayout.vue";
import { Form, Field, Button, Notify } from "vant";
import { STORE_USER_INFO, SET_DRAW_COUNT } from "@/store/mutationType";
import http from "../utils/http";
import { key } from "../store";

interface FormType {
  name: string;
  phone: string;
}

interface GetCountResult {
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
  name: "Guide",
  components: {
    DefaultLayout,
    [Form.name]: Form,
    [Field.name]: Field,
    [Button.name]: Button
  },
  setup: () => {
    const store = useStore(key);
    const router = useRouter();

    const userInfo = ref({
      name: "",
      phone: ""
    });

    const isSubmitLoading = ref(false);

    const onSubmit = async (values: FormType) => {
      if (isSubmitLoading.value) return;
      isSubmitLoading.value = true;
      try {
        const result = await http.get<GetCountResult>(
          `/lotteries/count?phone=${values.phone}`
        );
        if (result?.status === 200) {
          const data = result.data.data;
          const count = data.count;
          store.commit(SET_DRAW_COUNT, count);
          if (count < 1) {
            Notify("你没有抽奖次数！");
            return;
          }

          Notify({
            type: "success",
            message: `欢迎你，${data.name}， 你有${count}次抽奖次数！`
          });
          store.commit(STORE_USER_INFO, values);
          router.push("/");
        } else {
          const msg = result.data.message;
          if (msg) {
            Notify(msg);
          } else {
            Notify("请求错误！");
          }
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

    return {
      userInfo,
      onSubmit,
      isSubmitLoading
    };
  }
});
</script>

<style lang="scss" scoped>
.guide-box {
  width: 95%;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-sizing: border-box;
}
</style>
