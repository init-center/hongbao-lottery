<template>
  <default-layout>
    <main class="form-box">
      <van-form @submit="onChangePassword">
        <van-field
          v-model="changePasswordInfo.oldPassword"
          name="oldPassword"
          type="password"
          label="旧密码"
          placeholder="旧密码"
          :rules="[
            { required: true, message: '请填写旧密码' },
            {
              validator: val => val.length >= 8 && val.length <= 16,
              message: '密码长度必须在8 - 16 位！'
            }
          ]"
        />
        <van-field
          v-model="changePasswordInfo.newPassword"
          name="newPassword"
          type="password"
          label="新密码"
          placeholder="新密码"
          :rules="[
            { required: true, message: '请填写新密码' },
            {
              validator: val => val.length >= 8 && val.length <= 16,
              message: '密码长度必须在8 - 16 位！'
            }
          ]"
        />
        <van-field
          v-model="changePasswordInfo.reNewPassword"
          name="reNewPassword"
          type="password"
          label="重复新密码"
          placeholder="重复新密码"
          :rules="[
            { required: true, message: '请填写新密码' },
            {
              validator: val =>
                val.length >= 8 &&
                val.length <= 16 &&
                val === changePasswordInfo.newPassword,
              message: '两次输入的新密码不一致！'
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
            >修改</van-button
          >
        </div>
      </van-form>
    </main>
  </default-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import DefaultLayout from "../layout/DefaultLayout.vue";
import { Form, Field, Button, Notify } from "vant";
import http from "../utils/http";

interface FormType {
  oldPassword: string;
  newPassword: string;
  reNewPassword: string;
}

interface Result {
  statusCode: number;
  message: string;
}

export default defineComponent({
  name: "ChangePassword",
  components: {
    DefaultLayout,
    [Form.name]: Form,
    [Field.name]: Field,
    [Button.name]: Button
  },
  beforeRouteEnter(_to, _from, next) {
    next(async vm => {
      try {
        const result = await http.get<Result>(`/users/auth`);
        if (result.status !== 200) {
          Notify("未登录或登录状态失效！");
          vm.$router.push("/login");
        }
      } catch (error) {
        const msg = error?.response?.data?.message;
        if (msg) {
          Notify(msg);
        } else {
          Notify("未登录或登录状态失效！");
        }
        vm.$router.push("/login");
        return;
      }
    });
  },
  setup: () => {
    const changePasswordInfo = ref({
      oldPassword: "",
      newPassword: "",
      reNewPassword: ""
    });

    const isSubmitLoading = ref(false);

    const onChangePassword = async (values: FormType) => {
      if (isSubmitLoading.value) return;
      isSubmitLoading.value = true;
      try {
        const result = await http.put<Result>(`/users/password`, {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword
        });
        if (result?.status === 200) {
          Notify({
            type: "success",
            message: `修改密码成功！`
          });
          changePasswordInfo.value = {
            oldPassword: "",
            newPassword: "",
            reNewPassword: ""
          };
        }
      } catch (error) {
        const msg = error?.response?.data?.message;
        if (msg) {
          Notify(msg);
        } else {
          Notify("修改密码失败！");
        }
        return;
      } finally {
        isSubmitLoading.value = false;
      }
    };

    return {
      changePasswordInfo,
      onChangePassword,
      isSubmitLoading
    };
  }
});
</script>

<style lang="scss" scoped>
.form-box {
  width: 95%;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-sizing: border-box;
}
</style>
