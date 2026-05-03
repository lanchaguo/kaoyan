<template>
  <div class="page-container">
    <el-form inline class="search-form">
      <el-form-item label="学科">
        <el-select v-model="query.subject_id" placeholder="全部" clearable style="width:140px" @change="load">
          <el-option v-for="s in subjects" :key="s.id" :label="s.name" :value="s.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="年份">
        <el-input v-model="query.year" placeholder="如：2024" clearable style="width:100px" @keyup.enter="load" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="load">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="toolbar">
      <el-button type="primary" @click="openForm()">新增试卷</el-button>
    </div>

    <el-table :data="list" v-loading="loading" stripe class="auto-height-table">
      <el-table-column prop="id" label="ID" width="80" show-overflow-tooltip />
      <el-table-column prop="subject" label="学科" width="100" show-overflow-tooltip>
        <template #default="{ row }">{{ row.subject?.name }}</template>
      </el-table-column>
      <el-table-column prop="name" label="试卷名称" min-width="200" show-overflow-tooltip />
      <el-table-column prop="year" label="年份" width="70" />
      <el-table-column prop="session" label="考试阶段" width="90" show-overflow-tooltip />
      <el-table-column prop="total_score" label="总分" width="70" />
      <el-table-column prop="total_time" label="时长(分钟)" width="100" />
      <el-table-column label="状态" width="70">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="openForm(row)">编辑</el-button>
          <el-button type="info" link @click="handleDetail(row)">查看</el-button>
          <el-button type="danger" link @click="handleDelete(row.id)">删除</el-button>
        </template>
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

    <el-dialog v-model="visible" :title="form.id ? '编辑试卷' : '新增试卷'" width="600px">
      <el-form :model="form" label-width="100px" ref="formRef">
        <el-form-item label="学科" prop="subject_id" :rules="[{ required: true }]">
          <el-select v-model="form.subject_id" placeholder="请选择" style="width:100%">
            <el-option v-for="s in subjects" :key="s.id" :label="s.name" :value="s.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="试卷名称" prop="name" :rules="[{ required: true }]">
          <el-input v-model="form.name" placeholder="如：2024年考研数学一真题" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="年份">
              <el-input-number v-model="form.year" :min="2000" :max="2099" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考试阶段">
              <el-select v-model="form.session" style="width:100%">
                <el-option label="初试" value="初试" />
                <el-option label="复试" value="复试" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="总分">
              <el-input-number v-model="form.total_score" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="时长(分钟)">
              <el-input-number v-model="form.total_time" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="说明">
          <el-input v-model="form.description" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看试卷详情 -->
    <el-dialog v-model="detailVisible" title="试卷详情" width="700px">
      <el-descriptions :column="2" border v-if="detail">
        <el-descriptions-item label="试卷名称">{{ detail.name }}</el-descriptions-item>
        <el-descriptions-item label="学科">{{ detail.subject?.name }}</el-descriptions-item>
        <el-descriptions-item label="年份">{{ detail.year }}</el-descriptions-item>
        <el-descriptions-item label="考试阶段">{{ detail.session }}</el-descriptions-item>
        <el-descriptions-item label="总分">{{ detail.total_score }}</el-descriptions-item>
        <el-descriptions-item label="时长">{{ detail.total_time }}分钟</el-descriptions-item>
        <el-descriptions-item label="说明" :span="2">{{ detail.description || '—' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer><el-button @click="detailVisible = false">关闭</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { getPapers, getPaperDetail, getSubjectsAll, createPaper, updatePaper, deletePaper } from '@/api/exam'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const subjects = ref([])
const visible = ref(false)
const detailVisible = ref(false)
const submitting = ref(false)
const formRef = ref()
const detail = ref(null)
const query = reactive({ page: 1, pageSize: 10, subject_id: '', year: '' })
const form = reactive({ id: '', subject_id: '', name: '', year: 2024, session: '初试', total_score: 100, total_time: 180, difficulty_id: 2, description: '', status: 1 })

async function load() {
  loading.value = true
  try {
    const res = await getPapers(query)
    list.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

function reset() {
  Object.assign(query, { page: 1, subject_id: '', year: '' })
  load()
}

async function openForm(row) {
  if (!subjects.value.length) subjects.value = (await getSubjectsAll()).data
  if (row) {
    const res = await getPaperDetail(row.id)
    const p = res.data
    Object.assign(form, { id: p.id, subject_id: p.subject_id, name: p.name, year: p.year, session: p.session, total_score: p.total_score, total_time: p.total_time, difficulty_id: p.difficulty_id, description: p.description || '', status: p.status })
  } else {
    Object.assign(form, { id: '', subject_id: '', name: '', year: 2024, session: '初试', total_score: 100, total_time: 180, difficulty_id: 2, description: '', status: 1 })
  }
  visible.value = true
}

async function handleDetail(row) {
  const res = await getPaperDetail(row.id)
  detail.value = res.data
  detailVisible.value = true
}

async function handleSubmit() {
  await formRef.value.validate()
  submitting.value = true
  try {
    if (form.id) {
      await updatePaper(form.id, form)
    } else {
      await createPaper(form)
    }
    visible.value = false
    ElMessage.success('操作成功')
    load()
  } finally {
    submitting.value = false
  }
}

async function handleDelete(id) {
  await ElMessageBox.confirm('确定删除该试卷吗？', '提示')
  await deletePaper(id)
  ElMessage.success('删除成功')
  load()
}

;(async () => {
  subjects.value = (await getSubjectsAll()).data
  load()
})()
</script>
