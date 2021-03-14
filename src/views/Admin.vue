<template>
  <admin-layout>
    <List class="admin-list">
      <Cell
        v-for="item of adminsList"
        class="admin-item"
        size="large"
        clickable
        is-link
        :key="item.id"
        :title="item.name"
        :to="item.to"
      />
    </List>
  </admin-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { List, Cell } from "vant";
import AdminLayout from "@/layout/AdminLayout.vue";

interface AdminItem {
  id: number;
  name: string;
  to: string;
}

export default defineComponent({
  name: "Admin",
  components: {
    [List.name]: List,
    Cell,
    AdminLayout
  },
  setup: () => {
    const adminsList = ref<AdminItem[]>([
      {
        id: 1,
        name: "奖品管理",
        to: "/admin/prizes"
      },
      {
        id: 2,
        name: "抽奖次数管理",
        to: "/admin/draw_count"
      },
      {
        id: 3,
        name: "管理员管理",
        to: "/admin/administrators"
      },
      { id: 4, name: "修改密码", to: "/change_password" }
    ]);

    return {
      adminsList
    };
  }
});
</script>

<style lang="scss" scoped>
.admin-list {
  .admin-item {
    color: #323233;
    font-weight: 600;
    background: #f7f8fa;
    border-radius: 99px;
    margin: 0 0 12px;
    transition: background 0.3s;

    &:hover {
      background-color: #eef0f4;
    }
  }
}
</style>
