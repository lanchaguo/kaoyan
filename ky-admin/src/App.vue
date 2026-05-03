<template>
  <router-view />
</template>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #app { height: 100%; }

/* 全局表格样式 */
.auto-height-table {
  height: calc(100vh - 280px);
  overflow-y: auto;
}

/* 表格单元格文字单行显示省略号 */
.el-table .cell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 题目题干单元格 */
.stem-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  max-width: 300px;
}

/* 分页组件底部对齐 */
.el-pagination {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0 0;
}

/* 页面容器撑满高度 */
.page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
