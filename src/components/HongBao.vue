<template>
  <div :class="{ hongbao: true, active: active }">
    <div
      :class="{ cap: true, open: hongbaoInfo.open }"
      @click="() => clickHandle(hongbaoInfo.id)"
    >
      <div class="cap-inner"></div>
      <div class="cap-outer"></div>
    </div>
    <div
      :class="{ 'open-btn': true, open: hongbaoInfo.open }"
      @click="() => clickHandle(hongbaoInfo.id)"
    ></div>
    <div class="body" @click="() => clickHandle(hongbaoInfo.id)">
      <div class="shadow"></div>
      <img :src="hongbaoInfo.cover" class="cover" alt="cover" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs, onMounted } from "vue";

interface HongBaoType {
  id: number;
  cover: string;
  open: boolean;
}

export default defineComponent({
  name: "HongBao",
  props: {
    info: {
      type: Object as PropType<HongBaoType>,
      required: true
    },
    clickHandle: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const data = reactive({
      active: false,
      hongbaoInfo: props.info
    });

    onMounted(() => {
      setTimeout(() => {
        data.active = true;
      });
    });

    return {
      ...toRefs(data)
    };
  }
});
</script>

<style scoped lang="scss">
.hongbao {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 0;
  transform: translateY(-50px);
  transition: all 1s;
  opacity: 0;
  padding-bottom: 178%;
  perspective: 1000px;

  &.active {
    transform: translateY(0px);
    opacity: 1;
  }

  & * {
    user-select: none;
  }

  .cap {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 36%;
    z-index: 2;
    transform: rotateX(-180deg);
    transform-origin: bottom;
    transform-style: preserve-3d;
    transition: transform 1s 1s ease;

    .cap-inner,
    .cap-outer {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      border-radius: 50% 50% 10px 10px;
      margin: 0;
      padding: 0;
    }

    .cap-inner {
      background: tomato;
      border-color: tomato;
    }

    .cap-outer {
      background: #fe585e;
      z-index: -1;
      transform: rotateY(180deg);
    }

    &.open {
      transform: rotateX(0deg);
    }
  }

  .open-btn {
    position: absolute;
    top: 30%;
    z-index: 3;
    width: 30%;
    height: 0;
    padding-bottom: 30%;
    background-color: #ffaa3b;
    box-shadow: 0 0 8px #e6c791 inset;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 2s ease, opacity 1s 1s ease;

    &.open {
      transform: rotateY(-720deg);
      opacity: 0;
    }
  }

  .body {
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 80%;
    background-color: #db4c46;
    border-radius: 10px;

    .shadow {
      width: 100%;
      height: 24%;
      background-color: tomato;
      border-radius: 10px 10px 50% 50%;
      box-shadow: 0px -3px 0px -1px #cf3c36 inset;
    }

    .cover {
      position: absolute;
      bottom: 10%;
      max-width: 90%;
    }
  }
}
</style>
