<template>
  <admin-layout title="管理员管理">
    <CellGroup title="增加管理员">
      <Form @submit="addAdminClick">
        <Cell>
          <Field
            v-model="addAdminInfo.name"
            name="name"
            label="姓名"
            placeholder="要设置为管理员的用户姓名"
            :rules="[
              { required: true, message: '请填写姓名' },
              {
                pattern: /^[\u4E00-\u9FA5]{2,6}$/,
                message: '姓名必须是2 - 6 位的汉字！'
              }
            ]"
          />
        </Cell>
        <Cell>
          <Field
            v-model="addAdminInfo.phone"
            type="number"
            name="phone"
            label="手机"
            placeholder="要设置为管理员的用户手机"
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
    <CellGroup title="管理员列表">
      <Empty v-if="adminsList.length === 0" description="暂无管理员" />
      <template v-else>
        <SwipeCell v-for="admin in adminsList" :key="admin.id">
          <Cell
            :title="`${admin.name} (${admin.phone})`"
            :value="
              admin.role === 1
                ? '超级管理员'
                : admin.role === 2
                ? '管理员'
                : '普通用户'
            "
          ></Cell>
          <template #right>
            <Button
              square
              type="danger"
              text="删除"
              @click="
                () => {
                  deleteAdminClick({ phone: admin.phone, name: admin.name });
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

interface AdministratorsItem {
  uid: string;
  name: string;
  role: number;
  phone: string;
  count: number;
}

interface AddOrDelAdminInfo {
  name: string;
  phone: string;
}

interface AdminsListResult {
  statusCode: number;
  data: AdministratorsItem[];
  message: string;
}

interface AddOrDelAdminResult {
  statusCode: number;
  message: string;
}

export default defineComponent({
  name: "Administrators",
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
    const adminsList = ref<AdministratorsItem[]>([]);

    const addAdminInfo = ref<AddOrDelAdminInfo>({
      name: "",
      phone: ""
    });

    const isSubmitLoading = ref(false);

    const fetchAdminsList = async () => {
      try {
        const result = await http.get<AdminsListResult>("/admins");

        if (result?.status === 200) {
          const data = result.data.data;
          adminsList.value = data;
        }
      } catch (error) {
        const msg = error?.response?.data?.message;
        if (msg) {
          Notify(msg);
        } else {
          Notify("请求管理员列表错误！");
        }
        return;
      }
    };

    onMounted(() => {
      fetchAdminsList();
    });

    const addAdminClick = async (values: AddOrDelAdminInfo) => {
      if (isSubmitLoading.value) return;
      isSubmitLoading.value = true;
      try {
        const result = await http.put<AddOrDelAdminResult>(`/admins`, values);
        if (result.status === 201) {
          addAdminInfo.value = {
            name: "",
            phone: ""
          };
          Notify({
            type: "success",
            message: result.data.message
          });
          fetchAdminsList();
        } else {
          Notify({
            type: "danger",
            message: "新增管理员失败！"
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

    const deleteAdminClick = async (adminInfo: AddOrDelAdminInfo) => {
      try {
        const result = await http.delete<AddOrDelAdminResult>(`/admins`, {
          data: adminInfo
        });
        if (result.status === 200) {
          Notify({
            type: "success",
            message: result.data.message
          });
          fetchAdminsList();
        } else {
          Notify({
            type: "danger",
            message: "撤销管理员失败！"
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
      adminsList,
      addAdminInfo,
      addAdminClick,
      deleteAdminClick,
      isSubmitLoading
    };
  }
});
</script>
