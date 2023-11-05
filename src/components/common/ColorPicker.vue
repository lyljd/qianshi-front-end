<template>
  <div id="cp-container">
    <el-color-picker :popper-class="clear ? '' : 'no-clear'" :append-to="appendTo ? appendTo : cpContainerEle" v-model="color"
      :predefine="predefineColors" />
  </div>
</template>

<script setup lang="ts">
const predefineColors = ref([
  '#FFFFFF',
  '#909399',
  '#000000',
  '#F56C6C',
  '#E6A23C',
  '#FFFF00',
  '#67C23A',
  '#409EFF',
  '#800080',
  '#FFC0CB',
])

const props = withDefaults(defineProps<{
  modelValue: any
  clear: boolean
  appendTo: HTMLElement
}>(), {
  clear: false,
  appendTo: undefined
})
const emit = defineEmits(['update:modelValue'])

const color = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const cpContainerEle = document.getElementById("cp-container") as HTMLElement
</script>

<style>
.el-color-dropdown {
  background-color: rgb(240, 240, 240) !important;
}

.el-color-dropdown__value {
  margin-top: -3px;
}

.el-color-dropdown__link-btn {
  background-color: white !important;
  border: 1px solid #dedfe0 !important;
}

.no-clear .el-color-dropdown__link-btn {
  display: none;
}

.el-color-dropdown__link-btn:hover {
  color: #409EFF;
  border-color: #409EFF !important;
}
</style>