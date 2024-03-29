<template>
  <el-upload v-model:file-list="images"
             action="/"
             list-type="picture-card"
             :multiple="true"
             :disabled="props.disabled"
             :before-remove="handleRemove"
             :on-preview="handlePictureCardPreview"
             :http-request="customUploadFun">
    <el-icon v-if="!props.disabled">
      <Plus />
    </el-icon>
    <template v-if="props.disabled"
              #file="modelData">
      <img class="el-upload-list__item-thumbnail"
           :src="modelData.file.url"
           alt="">
      <span class="el-upload-list__item-actions">
        <ZoomIn class="el-upload-list__item-btn"
                @click="handlePictureCardPreview(modelData.file)" />
        <CopyDocument class="el-upload-list__item-btn"
                      @click="copyToClipboard(modelData.file)" />
      </span>
    </template>
  </el-upload>
  <el-dialog v-model="dialogVisible">
    <img w-full
         :src="dialogImageUrl"
         alt="Preview Image" />
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useRequest } from 'alova'
import restful from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps(['disabled'])

// 图片
const { data: images } = useRequest(restful.getImages, {
  initialData: []
})

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const { send: delImg } = useRequest(restful.delImage, {
  immediate: false
})
const handleRemove = async (file) => {
  return await ElMessageBox.confirm('请确认是否删除？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    file._id &&
      delImg(file._id)
        .then(() => {
          ElMessage.success('删除成功')
        })
        .catch(() => {
          ElMessage.error('删除失败')
        })
  })
}

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

async function copyToClipboard(uploadFile) {
  try {
    await navigator.clipboard.writeText(uploadFile.url)
    ElMessage.success('成功复制链接到剪贴板')
  } catch (error) {
    ElMessage.error(error)
  }
}

const { send: addImage } = useRequest(restful.addImage, {
  immediate: false
})

function customUploadFun(param) {
  // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
  const formData = new FormData()
  const uploadFiles = param.file ? [param.file] : param.files
  uploadFiles.forEach((file) => {
    formData.append('files', file)
  })
  addImage(formData)
    .then(() => {
      ElMessage.success('添加图片成功')
    })
    .catch((err) => {
      ElMessage.error(err.message)
    })
}
</script>

<style scoped>
:deep(.el-upload-list__item) {
  order: 2;
  flex-grow: 1;
  width: fit-content;
  height: fit-content;
}
:deep(.el-upload-list__item-thumbnail) {
  min-width: 112px;
  height: 200px;
  object-fit: cover;
}
:deep(.el-upload-list__item-status-label) {
  display: none !important;
}
:deep(.el-upload--picture-card) {
  order: 1;
  width: 200px;
  height: 200px;
  margin-right: 8px;
}
.el-upload-list__item-btn {
  display: inline-block;
  width: 26px;
  height: 26px;
  margin-right: 8px;
  cursor: pointer;
}
:deep(.is-disabled > .el-upload--picture-card) {
  display: none;
}
</style>