<script setup>
import { useDark, useToggle } from '@vueuse/core'
import { Sunny, Moon } from '@element-plus/icons-vue'
import PostView from '@/views/PostView.vue'
import ImageView from '@/views/ImageView.vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const nowHour = new Date().getHours()
isDark.value = nowHour < 6 || nowHour > 18
</script>

<template>
  <el-container class="page-wrap">
    <el-header>
      <p>jimi1126的后台管理</p>
      <el-space>
        <el-switch v-model="isDark"
                   inline-prompt
                   :active-icon="Sunny"
                   :inactive-icon="Moon"
                   @change="toggleDark" />
      </el-space>
    </el-header>
    <el-container>
      <el-tabs type="border-card">
        <el-tab-pane label="图库">
          <ImageView />
        </el-tab-pane>
        <el-tab-pane label="博文管理"
                     lazy>
          <PostView />
        </el-tab-pane>
      </el-tabs>
    </el-container>
    <el-footer>
      @Auther by Jimmy
    </el-footer>
  </el-container>
</template>

<style>
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0.3rem; /*高宽分别对应横竖滚动条的尺寸*/
  height: 0.3rem;
  margin: 10px 0;
}
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  /* border-radius: 10px; */
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background-color: #409eff;
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #ededed;
  /* border-radius: 10px; */
}
</style>

<style scoped>
.page-wrap {
  min-height: 100vh;
}

.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--el-font-size-large);
  color: var(--el-text-color-primary);
  background-color: var(--el-bg-color);
  border-bottom: var(--el-border);
  box-shadow: var(--el-box-shadow);
}

.el-header a {
  cursor: pointer;
  text-decoration: none;
}

.el-tabs {
  width: 100%;
}

.el-tab-pane {
  display: flex;
  flex-direction: row;
  flex: 1;
  flex-basis: auto;
  box-sizing: border-box;
  min-width: 0;
}

.el-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--el-font-size-base);
  color: var(--el-text-color-primary);
  background-color: var(--el-bg-color);
  border-top: var(--el-border);
  box-shadow: var(--el-box-shadow);
}
</style>
