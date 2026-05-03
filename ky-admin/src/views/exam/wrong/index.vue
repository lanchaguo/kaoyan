<template>
  <div class="page-container">
    <el-form inline class="search-form">
      <el-form-item>
        <el-button type="primary" @click="load">刷新</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading="loading" stripe class="auto-height-table">
      <el-table-column prop="id" label="ID" width="80" show-overflow-tooltip />
      <el-table-column prop="question" label="题目" min-width="300" show-overflow-tooltip>
        <template #default="{ row }">
          <div v-html="row.question?.stem" class="stem-cell" />
        </template>
      </el-table-column>
      <el-table-column label="学科" width="120" show-overflow-tooltip>
        <template #default="{ row }">{{ row.question?.subject?.name }}</template>
      </el-table-column>
      <el-table-column label="题型" width="100" show-overflow-tooltip>
        <template #default="{ row }">{{ row.question?.type?.name }}</template>
      </el-table-column>
      <el-table-column prop="review_count" label="复习次数" width="100" />
      <el-table-column prop="created_at" label="加入时间" width="160">
        <template #default="{ row }">{{ row.created_at?.substring(0, 16) }}</template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="query.page"
      v-model:page-size="query.pageSize"
      :total="total"
      layout="total, prev, pager, next"
      @change="load"
      style="margin-top:16px"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { getWrongs } from '@/api/exam'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({ page: 1, pageSize: 10 })

async function load() {
  loading.value = true
  try {
    const res = await getWrongs(query)
    list.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

load()
</script>

<style scoped>
.stem-cell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-height: 60px;
}
</style>
