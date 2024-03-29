<!-- eslint-disable no-undef -->
<script setup>
import { computed, ref, watch } from 'vue'
import { useRequest } from 'alova'
import restful from '@/api'
import ImageView from './ImageView.vue'

const toolbar = {
  gallery: {
    icon: 'v-md-icon-img',
    title: '打开图库',
    action() {
      imageDialogVisible.value = true
    }
  }
}

// 分类
const { loading: catalogLoading, data: catalogs } = useRequest(restful.getCatalogs, {
  initialData: []
})
const catalogTreeData = computed(() => {
  const tree = catalogs.value.filter((t) => !t.pid)
  const children = catalogs.value.filter((t) => t.pid)

  tree.forEach((t) => {
    t.children = children.filter((tt) => tt.pid == t._id)
  })
  return tree
})
const defaultEpxandedKeys = computed(() => {
  return catalogTreeData.value[0] ? [catalogTreeData.value[0]._id] : []
})
const catalogVisible = ref(false)
const theCatalog = ref({})
const curCatalog = ref({})
const { send: addCatalog } = useRequest(restful.addCatalog, {
  immediate: false
})
const { send: updateCatalog } = useRequest(restful.updateCatalog, {
  immediate: false
})
function addOrUpdateCatalog() {
  theCatalog.value.level = theCatalog.value.pid ? 2 : 1
  const loadingInstance = ElLoading.service({ fullscreen: true })
  theCatalog.value._id &&
    updateCatalog(theCatalog.value)
      .then(() => {
        const index = catalogs.value.findIndex((t) => t._id == theCatalog.value._id)
        Object.assign(catalogs.value[index], theCatalog.value)
        catalogVisible.value = false
        ElMessage.success('更新成功')
        loadingInstance.close()
      })
      .catch((err) => {
        ElMessage.error(err.message)
        loadingInstance.close()
      })
  theCatalog.value._id ||
    addCatalog(theCatalog.value)
      .then((data) => {
        catalogs.value.push(data)
        catalogVisible.value = false
        ElMessage.success('新增成功')
        loadingInstance.close()
      })
      .catch((err) => {
        ElMessage.error(err.message)
        loadingInstance.close()
      })
}

const { send: delCatalog } = useRequest(restful.delCatalog, {
  immediate: false
})
function handleDelCatalog(_id) {
  if (catalogs.value.some((t) => t.pid == _id)) {
    return ElMessage.error('一级分类下存在二级分类，不能删除')
  }
  const loadingInstance = ElLoading.service({ fullscreen: true })
  delCatalog(_id)
    .then(() => {
      catalogs.value.splice(
        catalogs.value.findIndex((t) => t._id == _id),
        1
      )
      catalogVisible.value = false
      ElMessage.success('删除成功')
      loadingInstance.close()
    })
    .catch((err) => {
      ElMessage.error(err.message)
      loadingInstance.close()
    })
}

// 博文
const {
  loading: postListLoading,
  data: posts,
  send: getPosts
} = useRequest(restful.getPosts, {
  initialData: [],
  immediate: false
})

const {
  loading: postLoading,
  data: essay,
  send: getEssay
} = useRequest(restful.getEssay, {
  initialData: {},
  immediate: false
})

const postVisible = ref(false)
const thePost = ref({})
const curPost = ref({})
watch(curPost, (nv) => {
  tagTreeRef.value.setCheckedNodes(nv.tags)
})
const { send: addPost } = useRequest(restful.addPost, {
  immediate: false
})
const { send: updatePost } = useRequest(restful.updatePost, {
  immediate: false
})
function handleAddBtnEvent() {
  if (!curCatalog.value._id) {
    return ElMessage.error('请选择要添加的分类')
  }
  thePost.value = {
    catalog: '',
    title: '',
    desc: '',
    cover: '',
    author: 'jimmy',
    publish: false,
    license: '',
    tags: [],
    essay: ''
  }
  postVisible.value = true
}
function handleNodeClick(data) {
  curPost.value = { ...data }
  if (!data.essay) {
    essay.value = {}
  } else if (essay.value._id != data.essay) {
    getEssay(data.essay)
  }
}
function addOrUpdatePost() {
  thePost.value.catalog = curCatalog.value._id
  thePost.value.tags = tagTreeRef.value.getCheckedNodes()
  thePost.value.cover = thePost.value.cover || '/file/img/default.jpg'
  const loadingInstance = ElLoading.service({ fullscreen: true })
  thePost.value._id &&
    updatePost(thePost.value)
      .then(() => {
        const index = posts.value.findIndex((t) => t._id == thePost.value._id)
        Object.assign(posts.value[index], thePost.value)
        postVisible.value = false
        ElMessage.success('更新成功')
        loadingInstance.close()
      })
      .catch((err) => {
        ElMessage.error(err.message)
        loadingInstance.close()
      })
  thePost.value._id ||
    addPost(thePost.value)
      .then((data) => {
        posts.value.push(data)
        postVisible.value = false
        ElMessage.success('新增成功')
        loadingInstance.close()
      })
      .catch((err) => {
        ElMessage.error(err.message)
        loadingInstance.close()
      })
}

const { send: delPost } = useRequest(restful.delPost, {
  immediate: false
})
function handleDelPost(_id) {
  const loadingInstance = ElLoading.service({ fullscreen: true })
  delPost(_id)
    .then(() => {
      posts.value.splice(
        posts.value.findIndex((t) => t._id == _id),
        1
      )
      postVisible.value = false
      ElMessage.success('删除成功')
      loadingInstance.close()
    })
    .catch((err) => {
      ElMessage.error(err.message)
      loadingInstance.close()
    })
}

// 标签
const tagTreeRef = ref(null)
const { loading: tagListLoading, data: tags } = useRequest(restful.getTags, {
  initialData: []
})

const tagVisible = ref(false)
const theTag = ref({})
const { send: addTag } = useRequest(restful.addTag, {
  immediate: false
})
const { send: updateTag } = useRequest(restful.updateTag, {
  immediate: false
})

function addOrUpdateTag() {
  const loadingInstance = ElLoading.service({ fullscreen: true })
  theTag.value._id &&
    updateTag(theTag.value)
      .then(() => {
        const index = tags.value.findIndex((t) => t._id == theTag.value._id)
        Object.assign(tags.value[index], theTag.value)
        tagVisible.value = false
        ElMessage.success('更新成功')
        loadingInstance.close()
      })
      .catch((err) => {
        ElMessage.error(err.message)
        loadingInstance.close()
      })
  theTag.value._id ||
    addTag(theTag.value)
      .then((data) => {
        tags.value.push(data)
        tagVisible.value = false
        ElMessage.success('新增成功')
        loadingInstance.close()
      })
      .catch((err) => {
        ElMessage.error(err.message)
        loadingInstance.close()
      })
}

const { send: delTag } = useRequest(restful.delTag, {
  immediate: false
})
function handleDelTag(_id) {
  const loadingInstance = ElLoading.service({ fullscreen: true })
  delTag(_id)
    .then(() => {
      tags.value.splice(
        tags.value.findIndex((t) => t._id == _id),
        1
      )
      tagVisible.value = false
      ElMessage.success('删除成功')
      loadingInstance.close()
    })
    .catch((err) => {
      ElMessage.error(err.message)
      loadingInstance.close()
    })
}
function updatePostTag() {
  if (!curPost.value._id) {
    return ElMessage.error('failed')
  }
  const loadingInstance = ElLoading.service({ fullscreen: true })
  const tags = tagTreeRef.value.getCheckedNodes()
  updatePost({ _id: curPost.value._id, tags })
    .then(() => {
      const index = posts.value.findIndex((t) => t._id == curPost.value._id)
      posts.value[index].tags = tags
      ElMessage.success('更新成功')
      loadingInstance.close()
    })
    .catch((err) => {
      ElMessage.error(err.message)
      loadingInstance.close()
    })
}
const coverUploadRef = ref(null)
function handleCoverSuccess(res) {
  thePost.value.cover = res.data.url
}
function handleCoverRemove() {
  thePost.value.cover = ''
  coverUploadRef.value.clearFiles()
}
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
function handlePictureCardPreview(file) {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}
const imageDialogVisible = ref(false)

// md-editor
const { send: addImage } = useRequest(restful.addImage, {
  immediate: false
})
function handleUploadImage(event, insertImage, files) {
  // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })
  addImage(formData).then((img) => {
    // 此处只做示例
    insertImage({
      url: img.url,
      desc: img.desc
      // width: 'auto',
      // height: 'auto',
    })
  })
}

const { send: saveEssay } = useRequest(restful.addEssay, {
  immediate: false
})
const { send: updateEssay } = useRequest(restful.updateEssay, {
  immediate: false
})
function addOrUpdateEssay(text, html) {
  const loadingInstance = ElLoading.service({ fullscreen: true })
  essay.value.html = html
  essay.value._id &&
    updateEssay(essay.value)
      .then(() => {
        ElMessage.success('更新成功')
        loadingInstance.close()
      })
      .catch((err) => {
        ElMessage.error(err.message)
        loadingInstance.close()
      })
  essay.value._id ||
    saveEssay(essay.value)
      .then((data) => {
        curPost.value.essay = data._id
        ElMessage.success('保存成功')
        updatePost(curPost.value)
          .then(() => {
            const index = posts.value.findIndex((t) => t._id == curPost.value._id)
            Object.assign(posts.value[index], curPost.value)
            postVisible.value = false
            loadingInstance.close()
          })
          .catch((err) => {
            ElMessage.error(err.message)
            loadingInstance.close()
          })
      })
      .catch((err) => {
        ElMessage.error(err.message)
        loadingInstance.close()
      })
}
</script>

<template>
  <el-aside>
    <el-card v-loading="catalogLoading">
      <template #header>
        <div class="card-header">
          <span>分类</span>
          <el-button type="primary"
                     size="small"
                     text
                     @click="(theCatalog = {}) && (catalogVisible = true)"><el-icon>
              <Plus />
            </el-icon></el-button>
        </div>
      </template>
      <el-tree :data="catalogTreeData"
               node-key="_id"
               :props="{label: 'name'}"
               :default-expanded-keys="defaultEpxandedKeys">
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-button type="primary"
                         size="small"
                         text
                         @click.stop="()=> (curCatalog._id != data._id) && (curCatalog = {...data})  && getPosts({catalog: data._id})"><el-icon>
                  <View />
                </el-icon></el-button>
              <el-button type="warning"
                         size="small"
                         text
                         @click.stop="(theCatalog = {...data}) && (catalogVisible = true)"><el-icon>
                  <Edit />
                </el-icon></el-button>
              <el-popconfirm title="请确认是否删除？"
                             width="200px"
                             @confirm.stop="handleDelCatalog(data._id)">
                <template #reference>
                  <el-button type="danger"
                             size="small"
                             text><el-icon>
                      <Delete />
                    </el-icon></el-button>
                </template>
              </el-popconfirm>
            </span>
          </span>
        </template>
      </el-tree>
    </el-card>
    <el-card v-loading="postListLoading">
      <template #header>
        <div class="card-header">
          <span>博文{{ curCatalog.name ? '：' + curCatalog.name : '' }}</span>
          <el-button type="primary"
                     size="small"
                     text
                     @click="handleAddBtnEvent"><el-icon>
              <Plus />
            </el-icon></el-button>
        </div>
      </template>
      <el-tree :data="posts"
               node-key="_id"
               :props="{label: 'title'}"
               @node-click="handleNodeClick">
        <template #default="{ node, data }">
          <span class="custom-tree-node post-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-popconfirm v-if="!data.publish"
                             title="请确认是否发布？"
                             width="200px"
                             @confirm.stop="data.publish = !data.publish; updatePost({_id: data._id, publish: data.publish})">
                <template #reference>
                  <el-button type="warning"
                             size="small"
                             text><el-icon>
                      <Document />
                    </el-icon></el-button>
                </template>
              </el-popconfirm>
              <el-popconfirm v-else
                             title="请确认是否取消发布？"
                             width="200px"
                             @confirm.stop="data.publish = !data.publish; updatePost({_id: data._id, publish: data.publish})">
                <template #reference>
                  <el-button type="warning"
                             size="small"
                             text><el-icon>
                      <SuccessFilled color="green" />
                    </el-icon></el-button>
                </template>
              </el-popconfirm>
              <el-button type="warning"
                         size="small"
                         text
                         @click.stop="(thePost = {...data}) && (postVisible = true)"><el-icon>
                  <Edit />
                </el-icon></el-button>
              <span></span>
              <el-popconfirm title="请确认是否删除？"
                             width="200px"
                             @confirm.stop="handleDelPost(data._id)">
                <template #reference>
                  <el-button type="danger"
                             size="small"
                             text><el-icon>
                      <Delete />
                    </el-icon></el-button>
                </template>
              </el-popconfirm>
            </span>
          </span>
        </template>
      </el-tree>
    </el-card>
    <el-card v-loading="tagListLoading">
      <template #header>
        <div class="card-header">
          <span>标签</span>
          <el-button type="primary"
                     size="small"
                     text
                     @click="(theTag = {}) && (tagVisible = true)"><el-icon>
              <Plus />
            </el-icon></el-button>
        </div>
      </template>
      <el-tree ref="tagTreeRef"
               :data="tags"
               node-key="_id"
               show-checkbox
               @check="updatePostTag">
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <el-tag :key="data._id"
                    :color="data.color">{{data.name}}</el-tag>
            <span>
              <el-button type="warning"
                         size="small"
                         text
                         @click="(theTag = {...data}) && (tagVisible = true)"><el-icon>
                  <Edit />
                </el-icon></el-button>
              <span></span>
              <el-popconfirm title="请确认是否删除？"
                             width="200px"
                             @confirm="handleDelTag(data._id)">
                <template #reference>
                  <el-button type="danger"
                             size="small"
                             text><el-icon>
                      <Delete />
                    </el-icon></el-button>
                </template>
              </el-popconfirm>
            </span>
          </span>
        </template>
      </el-tree>
    </el-card>
  </el-aside>
  <el-main>
    <v-md-editor v-show="curPost._id"
                 v-model="essay.text"
                 v-loading="postLoading"
                 :disabled-menus="[]"
                 left-toolbar="undo redo clear |tip emoji h bold italic strikethrough quote | ul ol table hr | link image gallery code | save"
                 :toolbar="toolbar"
                 @upload-image="handleUploadImage"
                 @save="addOrUpdateEssay">
    </v-md-editor>
  </el-main>
  <el-dialog v-model="catalogVisible"
             :title="theCatalog._id ? '修改分类' : '新增分类'"
             width="30%"
             center>
    <el-form :model="theCatalog">
      <el-form-item label="名称">
        <el-input v-model="theCatalog.name"
                  placeholder="请输入" />
      </el-form-item>
      <el-form-item label="父级">
        <el-select v-model="theCatalog.pid"
                   style="width: 100%;"
                   placeholder="请选择">
          <el-option v-for="catalog in catalogTreeData"
                     :key="catalog._id"
                     :label="catalog.name"
                     :value="catalog._id" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="catalogVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="addOrUpdateCatalog">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="postVisible"
             :title="thePost._id ? '修改博文' : '新增博文'"
             width="50%"
             center>
    <el-form :model="thePost">
      <el-form-item label="标题">
        <el-input v-model="thePost.title"
                  placeholder="请输入" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="thePost.desc"
                  placeholder="请输入" />
      </el-form-item>
      <el-form-item label="封面">
        <el-input v-model="thePost.cover"
                  placeholder="请输入">
          <template #append>
            <el-button @click="imageDialogVisible = true">选择图库</el-button>
          </template></el-input>
        <ul v-if="thePost.cover"
            class="el-upload-list el-upload-list--picture-card">
          <div class="el-upload el-upload--picture-card"
               tabindex="0">
            <img class="el-upload-list__item-thumbnail"
                 :src="thePost.cover"
                 alt="加载失败" />
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview({url: thePost.cover})">
                <el-icon><zoom-in /></el-icon>
              </span>
              <span class="el-upload-list__item-delete"
                    @click="handleCoverRemove">
                <el-icon>
                  <Delete />
                </el-icon>
              </span>
            </span>
          </div>
        </ul>
        <el-upload v-else
                   ref="coverUploadRef"
                   action="/rest/image"
                   list-type="picture-card"
                   :limit="1"
                   :on-success="handleCoverSuccess">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="thePost.author"
                  placeholder="请输入" />
      </el-form-item>
      <el-form-item label="协议">
        <el-input v-model="thePost.license"
                  placeholder="请输入" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="postVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="addOrUpdatePost">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="tagVisible"
             :title="theTag._id ? '修改标签' : '新增标签'"
             width="30%"
             center>
    <el-form :model="theTag">
      <el-form-item label="名称">
        <el-input v-model="theTag.name"
                  placeholder="请输入" />
      </el-form-item>
      <el-form-item label="颜色">
        <el-color-picker v-model="theTag.color"
                         show-alpha
                         :predefine="['#ff4500','#ff8c00','#ffd700','#90ee90','#00ced1','#1e90ff','#c71585','rgba(255, 69, 0, 0.68)','rgb(255, 120, 0)','hsv(51, 100, 98)','hsva(120, 40, 94, 0.5)','hsl(181, 100%, 37%)','hsla(209, 100%, 56%, 0.73)','#c7158577',]" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="tagVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="addOrUpdateTag">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogVisible">
    <img w-full
         :src="dialogImageUrl"
         alt="Preview Image" />
  </el-dialog>
  <el-dialog v-model="imageDialogVisible">
    <ImageView disabled="disabled" />
  </el-dialog>
</template>

<style scoped>
.el-aside {
  display: grid;
  row-gap: var(--el-font-line-height-primary);
  height: fit-content;
}
.el-main {
  display: flex;
  padding: unset;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.el-tree-node .el-button + .el-button {
  margin-left: unset;
}

.post-tree-node > span:first-child {
  white-space: break-spaces;
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.v-md-editor {
  height: 80vh;
  margin-left: 20px;
}

:deep(.v-md-textarea-editor pre),
:deep(.v-md-textarea-editor textarea) {
  color: unset;
}
</style>