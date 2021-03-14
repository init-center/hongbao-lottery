<template>
  <default-layout>
    <main class="login-box">
      <van-form @submit="onLogin">
        <van-field
          v-model="loginInfo.phone"
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
        <van-field
          v-model="loginInfo.password"
          name="password"
          type="password"
          label="密码"
          placeholder="密码"
          :rules="[
            { required: true, message: '请填写密码' },
            {
              validator: val => val.length >= 8 && val.length <= 16,
              message: '密码长度必须在8 - 16 位！'
            }
          ]"
        />
        <div style="margin: 16px;">
          <van-button
            round
            block
            type="danger"
            native-type="submit"
            :loading="isLogin"
            >登录</van-button
          >
        </div>
      </van-form>
    </main>
  </default-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import DefaultLayout from "../layout/DefaultLayout.vue";
import { Form, Field, Button, Notify } from "vant";
import http from "../utils/http";

interface FormType {
  phone: string;
  password: string;
}

interface LoginResult {
  statusCode: number;
  data: {
    token: string;
  };
  message: string;
}

export default defineComponent({
  name: "Login",
  components: {
    DefaultLayout,
    [Form.name]: Form,
    [Field.name]: Field,
    [Button.name]: Button
  },
  setup: () => {
    const router = useRouter();

    const loginInfo = ref({
      phone: "",
      password: ""
    });

    const isLogin = ref(false);

    const onLogin = async (values: FormType) => {
      if (isLogin.value) return;
      isLogin.value = true;
      try {
        const result = await http.post<LoginResult>(`/sessions`, values);
        if (result?.status === 200) {
          const data = result.data.data;
          const token = data.token;
          localStorage.setItem("token", `Bearer ${token}`);

          Notify({
            type: "success",
            message: `登录成功！`
          });

          router.back();
        }
      } catch (error) {
        const msg = error?.response?.data?.message;
        if (msg) {
          Notify(msg);
        } else {
          Notify("登录失败！");
        }
      } finally {
        isLogin.value = false;
      }
    };

    return {
      loginInfo,
      onLogin,
      isLogin
    };
  }
});
</script>

<style lang="scss" scoped>
.login-box {
  width: 95%;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-sizing: border-box;
}
</style>
