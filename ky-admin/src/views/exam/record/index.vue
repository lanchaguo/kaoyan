<template>
  <div class="page-container">
    <el-form inline class="search-form">
      <el-form-item label="正确性">
        <el-select v-model="query.is_correct" placeholder="全部" clearable style="width:120px" @change="load">
          <el-option label="正确" :value="1" />
          <el-option label="错误" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="load">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading="loading" stripe class="auto-height-table">
      <el-table-column prop="id" label="ID" width="80" show-overflow-tooltip />
      <el-table-column prop="question" label="题目" min-width="250" show-overflow-tooltip>
        <template #default="{ row }">
          <div v-html="row.question?.stem" class="stem-cell" />
        </template>
      </el-table-column>
      <el-table-column label="学科" width="100" show-overflow-tooltip>
        <template #default="{ row }">{{ row.question?.subject?.name }}</template>
      </el-table-column>
      <el-table-column label="题型" width="100" show-overflow-tooltip>
        <template #default="{ row }">{{ row.question?.type?.name }}</template>
      </el-table-column>
      <el-table-column prop="answer" label="用户答案" width="100" show-overflow-tooltip />
      <el-table-column label="正确性" width="80">
        <template #default="{ row }">
          <el-tag :type="row.is_correct ? 'success' : 'danger'" size="small">
            {{ row.is_correct ? '正确' : '错误' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="得分" width="70" />
      <el-table-column prop="time_spent" label="用时(秒)" width="90" />
      <el-table-column prop="answered_at" label="答题时间" width="160">
        <template #default="{ row }">{{ row.answered_at?.substring(0, 16) }}</template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="query.page"
      v-model:page-size="query.pageSize"
      :total="total"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      @change="load"
      style="margin-top:16px"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { getRecords } from '@/api/exam'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({ page: 1, pageSize: 10, is_correct: '' })

async function load() {
  loading.value = true
  try {
    const res = await getRecords(query)
    list.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

function reset() {
  query.is_correct = ''
  query.page = 1
  load()
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
