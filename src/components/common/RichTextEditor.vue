<template>
  <div>
    <div style="border: 1px solid #ccc">
      <Toolbar class="toolbar" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
      <Editor class="editor" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
        @onCreated="handleCreated" />
    </div>

    <el-dialog v-model="richTextEditorPreview" @open="Prism.highlightAll()" class="pvcw" align-center center width="75%"
      title="预览正文">
      <div class="editor-content-view preview" v-html="getHtml()"></div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IDomEditor, IButtonMenu, Boot } from '@wangeditor/editor'
import Prism from 'prismjs'
import { useStore } from '@/store'
import { storeToRefs } from "pinia"
import { AxiosProgressEvent } from "axios"
import * as AuthAPI from '@/api/auth'
import * as UploadAPI from '@/api/upload'
import cmjs from '@/cmjs'

type UploadPara = {
  url: string
  filename: string
  contentType: string
  xOssCallback: string
}

defineProps<{
  modelValue: any
}>()
const emit = defineEmits(['update:modelValue'])

const valueHtml = computed({
  get() {
    return getHtml()
  },
  set(value) {
    if (value?.slice(-11) === '<p><br></p>') {
      return
    }
    emit('update:modelValue', value)
  }
})

let imageUploading = ref(false)

const store = useStore()
let { richTextEditorPreview } = storeToRefs(store)

const editorRef = shallowRef<IDomEditor>()

// 注册预览按钮
class PreviewButtonMenu implements IButtonMenu {
  title: string;
  iconSvg?: string | undefined;
  tag: string;

  constructor() {
    this.title = '预览'
    this.tag = 'button'
  }

  // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
  getValue(editor: IDomEditor): string | boolean {
    return false
  }

  // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
  isActive(editor: IDomEditor): boolean {
    return false
  }

  // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
  isDisabled(editor: IDomEditor): boolean {
    return false
  }

  // 点击菜单时触发的函数
  exec(editor: IDomEditor, value: string | boolean) {
    if (this.isDisabled(editor)) return
    richTextEditorPreview.value = true
  }
}

// 配置
const toolbarConfig = {
  insertKeys: { index: 0, keys: ['preview'] },
  excludeKeys: ["group-image", "group-video", "fullScreen"],
}
const editorConfig = {
  placeholder: '请输入正文',
  autoFocus: false,
  MENU_CONF: { uploadImage: {} },
}
editorConfig.MENU_CONF['uploadImage'] = {
  allowedFileTypes: ['image/*'],
  maxFileSize: 5 * 1024 * 1024, // 5M
  maxNumberOfFiles: 1,
  async customUpload(file: File, insertFn: Function) {
    if (imageUploading.value) {
      cmjs.prompt.info('有图片正在上传中，请耐心等待')
      return
    }

    imageUploading.value = true

    let up: UploadPara = { url: "", filename: "", contentType: "", xOssCallback: "" }

    await AuthAPI.getUploadUrl("read", cmjs.util.getFileSuffix(file.name))
      .then((res) => {
        if (res.code !== 0) {
          cmjs.prompt.error(res.msg)
          return
        }

        up = res.data
      })
      .catch((err) => {
        cmjs.prompt.error(err)
      })

    if (up === undefined) {
      return
    }

    UploadAPI.upload({
      uploadUrl: up.url,
      file: file,
      contentType: up.contentType,
      xOssCallback: up.xOssCallback,
      onUploadProgress: (progressEvent: AxiosProgressEvent) => { },
    })
      .then((res) => {
        if (res.code !== 0) {
          cmjs.prompt.error(res.msg)
          return
        }

        insertFn(res.data.url)
      })
      .catch((err) => {
        cmjs.prompt.error(err)
      })
      .finally(() => {
        imageUploading.value = false
      })
  },
}

if (!store.richTextEditorHasRegist) {
  store.richTextEditorHasRegist = true

  const PreviewButtonMenuConf = {
    key: 'preview',
    factory() {
      return new PreviewButtonMenu()
    },
  }
  Boot.registerMenu(PreviewButtonMenuConf)
}

const mode = 'default'

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

function handleCreated(editor: IDomEditor) {
  editorRef.value = editor
}

function getHtml(): string | undefined {
  let h = editorRef.value?.getHtml()
  while (h?.slice(-11) === '<p><br></p>') {
    h = h.slice(0, -11)
  }
  console.log(h) // TODO
  return h
}
</script>

<style lang="less" scoped>
.toolbar {
  border-bottom: 1px solid #ccc;
}

.editor {
  height: 500px !important;
}

.preview {
  border: 3px solid #ccc;
  border-radius: 5px;
}
</style>

<style>
.toolbar {
  .toolbar-item {
    margin-right: 5px;
  }

  .toolbar-item:first-child {
    cursor: default;
  }

  .copy-to-clipboard-button {
    cursor: pointer;
  }
}

.pvcw .el-dialog__body {
  padding-bottom: 20px;
}
</style>