<template>
  <div v-if="visiable" class="fixed_dialog">
    <div v-if="position == 'center'" class="position_wrapper position_center">
      <div class="cover" @click="cancelDialog"></div>
      <div class="container" :style="{ width: realWidth }">
        <div class="cover" @click="cancelDialog"></div>
        <div v-if="header" class="header">
          <i class="close_btn el-icon-close" @click="cancelDialog"></i>
          <div v-if="$slots.header">
            <slot name="header"></slot>
          </div>
          <div v-if="!$slots.header">
            <div class="title">{{ title }}</div>
          </div>
        </div>

        <div class="body">
          <slot name="default"></slot>
        </div>

        <div v-if="footer" class="footer">
          <div v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
          <div v-if="!$slots.footer" class="btn_wrapper">
            <el-button
              v-if="confirmText"
              type="primary"
              class="confirm_btn"
              size="small"
              @click="confirmDialog"
            >
              {{ confirmText }}
            </el-button>
            <el-button
              v-if="cancelText"
              type="default"
              class="cancel_btn"
              size="small"
              @click="cancelDialog"
            >
              {{ cancelText }}
            </el-button>
          </div>
        </div>
        <div class="cover" @click="cancelDialog"></div>
      </div>
      <div class="cover" @click="cancelDialog"></div>
    </div>

    <div v-if="position == 'right'" class="position_wrapper  position_right">
      <div class="cover" @click="cancelDialog"></div>
      <div class="container" :style="{ width: realWidth }">
        <div v-if="header" class="header">
          <i class="close_btn el-icon-close" @click="cancelDialog"></i>

          <div v-if="$slots.header">
            <slot name="header"></slot>
          </div>
          <div v-if="!$slots.header">
            <div class="title">{{ title }}</div>
          </div>
        </div>

        <div class="body">
          <slot name="default"></slot>
        </div>

        <div v-if="footer" class="footer">
          <div v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
          <div v-if="!$slots.footer" class="btn_wrapper">
            <el-button
              v-if="confirmText"
              size="small"
              type="primary"
              class="confirm_btn"
              @click="confirmDialog"
            >
              {{ confirmText }}
            </el-button>
            <el-button
              v-if="cancelText"
              size="small"
              type="default"
              class="cancel_btn"
              @click="cancelDialog"
            >
              {{ cancelText }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * width Number/String 弹出框内容宽度，·10·或者·10px·的会被处理做·10px·，·10%·会被处理做10%
 * title String 弹窗标题
 * visiable Boolean 控制弹窗是否显示
 * footer Boolean   控制是否显示底部按钮面板
 * confirmText String 确定按钮的文字，如果为空字符串，不显示确认按钮
 * cancelText  String 取消按钮的文字，如果未空字符串，不显示取消按钮
 * @confirm Fn    确定按钮的事件
 * @cancel Fn      取消按钮的事件
 *
 * slot:
 * <template #header="">  </template>    自定义弹窗部分内容
 * <template #body="">  </template>    自定义弹窗部分内容
 * <template #footer="">  </template>   自定义弹窗底部内容
 */
export default {
  name: 'FixedDialog',
  props: {
    width: {
      type: [Number, String],
      default: '600px',
    },
    title: {
      type: String,
      default: 'dialog标题',
    },
    visiable: {
      type: Boolean,
      default: false,
    },
    header: {
      type: Boolean,
      default: true,
    },
    footer: {
      type: Boolean,
      default: true,
    },
    confirmText: {
      type: String,
      default: '确定',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    position: {
      type: String,
      default: 'right',
    },
  },
  data() {
    return {};
  },
  computed: {
    realWidth() {
      let w;
      if (/\d+%/.test(this.width)) {
        w = this.width;
      } else if (/\d+(px)?/.test(this.width)) {
        w = this.width.includes('px') ? this.width : this.width + 'px';
      }
      return w;
    },
  },
  methods: {
    confirmDialog() {
      this.$emit('confirm');
    },
    cancelDialog() {
      this.$emit('update:visiable', false);
      this.$emit('cancel');
    },
  },
};
</script>
<style lang="scss" scoped>
.fixed_dialog {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1010;
  animation: dialogshow 0.1s linear;
  @keyframes dialogshow {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .position_wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: stretch;
  }

  .cover {
    // position: absolute;
    // top: 0;
    // bottom: 0;
    // left: 0;
    // right: 0;
    flex-grow: 1;
    background-color: rgba(2, 2, 2, 0.493);
  }
  .container {
    flex-shrink: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    background-color: rgba(2, 2, 2, 0.493);
    .close_btn {
      position: absolute;
      top: 22px;
      right: 20px;
      cursor: pointer;
      font-size: 16px;
      color: rgb(187, 187, 187);
      &:hover {
        color: rgb(94, 202, 245);
      }
    }
    .header {
      flex-grow: 0;
      flex-shrink: 0;
      position: relative;
      background-color: white;
      border-bottom: 1px solid rgb(214, 214, 214);
      box-shadow: 0 0 4px rgba(17, 17, 17, 0.26);
      height: 61px;
      .title {
        padding: 20px 40px;
        font-weight: bold;
      }
    }

    .body {
      flex-grow: 1;
      overflow-y: auto;
      padding: 20px 40px;
      background-color: white;
      ::v-deep .el-input {
        width: 100%;
      }
      ::v-deep .el-select {
        width: 100%;
      }
      ::v-deep .el-data-picker {
        width: 100%;
      }
    }
    .footer {
      flex-grow: 0;
      flex-shrink: 0;
      background-color: white;
      .btn_wrapper {
        display: flex;
        justify-content: center;
        padding: 10px 0;
        border-top: 1px solid rgb(214, 214, 214);
        .confirm_btn {
          margin-right: 20px;
        }
      }
    }
  }
  .position_center {
    .container {
      // border-radius: 4px;
      .header {
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
      }
      .footer {
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
      }
      .cover {
        flex-shrink: 0;
        height: 20px;
        background-color: transparent;
      }
    }
  }
}
</style>
