<template>
  <div class="admin-wrapper">
    <div class="header">
      <Icon class="back" name="arrow-left" @click="backHandle" />{{ title }}
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent, onBeforeMount } from "vue";
import { Icon, Notify } from "vant";
import { useRouter } from "vue-router";
import http from "@/utils/http";

export default defineComponent({
  name: "AdminLayout",
  components: {
    Icon
  },
  props: {
    title: {
      type: String,
      default: () => "后台管理"
    }
  },
  setup() {
    const router = useRouter();

    onBeforeMount(async () => {
      try {
        const result = await http.get("/admins/auth");
        if (result.status !== 200) {
          Notify("用户权限不足！");
          router.push("/login");
        }
      } catch (error) {
        const msg = error?.response?.data?.message;
        if (msg) {
          Notify(msg);
        } else {
          Notify("用户权限不足！");
        }
        router.push("/login");
      }
    });

    const backHandle = () => {
      router.back();
    };

    return {
      backHandle
    };
  }
});
</script>

<style scoped lang="scss">
.admin-wrapper {
  .header {
    width: 100%;
    height: 40px;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    line-height: 40px;
    text-align: center;
    background-color: #4e5fe3;
    margin-bottom: 10px;

    .back {
      display: flex;
      align-items: center;
      float: left;
      height: 100%;
      width: 32px;
    }
  }
}
</style>
