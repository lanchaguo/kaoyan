<template>
  <div class="page-container">
    <!-- 搜索 -->
    <el-form inline class="search-form">
      <el-form-item label="学科">
        <el-select v-model="query.subject_id" placeholder="全部" clearable style="width:140px" @change="load">
          <el-option v-for="s in subjects" :key="s.id" :label="s.name" :value="s.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="题型">
        <el-select v-model="query.type_id" placeholder="全部" clearable style="width:140px" @change="load">
          <el-option v-for="t in types" :key="t.id" :label="t.name" :value="t.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="关键词">
        <el-input v-model="query.keyword" placeholder="题干关键字" clearable @keyup.enter="load" />
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
      <el-button type="primary" @click="openForm()">新增题目</el-button>
    </div>

    <el-table :data="list" v-loading="loading" stripe @expand-change="onExpand" class="auto-height-table">
      <el-table-column type="expand" width="50">
        <template #default="{ row }">
          <div class="question-expand">
            <p><strong>题干：</strong><span v-html="row.stem" /></p>
            <p v-if="row.type && row.type.has_option"><strong>选项：</strong></p>
            <div v-if="row.type && row.type.has_option && expandedOptions[row.id]" class="option-list">
              <div v-for="opt in expandedOptions[row.id]" :key="opt.id" class="option-item" :class="{ correct: opt.is_correct }">
                {{ opt.option_key }}. {{ opt.option_value }}
              </div>
            </div>
            <p><strong>正确答案：</strong>{{ row.answer || '—' }}</p>
            <p v-if="row.analysis"><strong>解析：</strong>{{ row.analysis }}</p>
            <p><strong>来源：</strong>{{ row.source || '—' }}&nbsp;&nbsp;<strong>年份：</strong>{{ row.year || '—' }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="80" show-overflow-tooltip />
      <el-table-column prop="subject" label="学科" width="100" show-overflow-tooltip>
        <template #default="{ row }">{{ row.subject?.name }}</template>
      </el-table-column>
      <el-table-column prop="type" label="题型" width="100" show-overflow-tooltip>
        <template #default="{ row }">{{ row.type?.name }}</template>
      </el-table-column>
      <el-table-column prop="difficulty" label="难度" width="80">
        <template #default="{ row }">
          <el-tag :style="{ color: row.difficulty?.color }" size="small">
            {{ row.difficulty?.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="题干" min-width="250" show-overflow-tooltip>
        <template #default="{ row }">
          <span v-html="row.stem" class="stem-text" />
        </template>
      </el-table-column>
      <el-table-column prop="year" label="年份" width="70" />
      <el-table-column prop="correct_rate" label="正确率" width="80">
        <template #default="{ row }">{{ row.correct_rate ? row.correct_rate + '%' : '—' }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="openForm(row)">编辑</el-button>
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

    <!-- 题目表单弹窗 -->
    <el-dialog v-model="visible" :title="form.id ? '编辑题目' : '新增题目'" width="750px" @closed="resetForm">
      <el-form :model="form" label-width="90px" ref="formRef">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="学科" prop="subject_id" :rules="[{ required: true }]">
              <el-select v-model="form.subject_id" placeholder="请选择" style="width:100%">
                <el-option v-for="s in subjects" :key="s.id" :label="s.name" :value="s.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="题型" prop="type_id" :rules="[{ required: true }]">
              <el-select v-model="form.type_id" placeholder="请选择" style="width:100%">
                <el-option v-for="t in types" :key="t.id" :label="t.name" :value="t.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="难度">
              <el-select v-model="form.difficulty_id" style="width:100%">
                <el-option v-for="d in difficulties" :key="d.id" :label="d.name" :value="d.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年份">
              <el-input-number v-model="form.year" :min="2000" :max="2099" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="题干" prop="stem" :rules="[{ required: true }]">
          <el-input v-model="form.stem" type="textarea" :rows="3" placeholder="请输入题干" />
        </el-form-item>
        <el-form-item label="选项" v-if="selectedType && selectedType.has_option">
          <div v-for="(opt, idx) in form.option_list" :key="idx" class="option-row">
            <el-checkbox v-model="opt.is_correct" />
            <span class="option-key">{{ opt.option_key }}.</span>
            <el-input v-model="opt.option_value" style="flex:1" />
            <el-button link type="danger" @click="removeOption(idx)">删除</el-button>
          </div>
          <el-button type="primary" link @click="addOption">+ 添加选项</el-button>
        </el-form-item>
        <el-form-item label="答案" v-if="selectedType && !selectedType.has_option">
          <el-input v-model="form.answer" type="textarea" :rows="2" placeholder="简答/论述/计算题请填写完整答案" />
        </el-form-item>
        <el-form-item label="解析">
          <el-input v-model="form.analysis" type="textarea" :rows="2" placeholder="可选" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="分值">
              <el-input-number v-model="form.score" :min="0" :precision="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源">
              <el-input v-model="form.source" placeholder="如：2024年全国硕士研究生招生考试" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { getQuestions, getSubjectsAll, getTypes, getQuestionDetail, createQuestion, updateQuestion, deleteQuestion } from '@/api/exam'
import { ElMessage, ElMessageBox } from 'element-plus'

const difficulties = [
  { id: 1, name: '容易' },
  { id: 2, name: '中等' },
  { id: 3, name: '困难' },
  { id: 4, name: '极难' }
]

const loading = ref(false)
const list = ref([])
const total = ref(0)
const subjects = ref([])
const types = ref([])
const visible = ref(false)
const submitting = ref(false)
const formRef = ref()
const expandedOptions = ref({})

const query = reactive({ page: 1, pageSize: 10, subject_id: '', type_id: '', keyword: '', year: '' })
const form = reactive({ id: '', subject_id: '', type_id: '', difficulty_id: 2, stem: '', analysis: '', answer: '', score: 2, year: 2024, source: '', is_official: 1, exam_session: '初试', option_list: [], knowledge_ids: [] })

const selectedType = computed(() => types.value.find(t => t.id === form.type_id))

watch(() => form.type_id, () => {
  if (selectedType.value && selectedType.value.has_option && form.option_list.length === 0) {
    const keys = ['A', 'B', 'C', 'D', 'E', 'F']
    form.option_list = keys.slice(0, 4).map(k => ({ option_key: k, option_value: '', is_correct: false }))
  }
})

async function load() {
  loading.value = true
  try {
    const res = await getQuestions(query)
    list.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

async function onExpand(row, expanded) {
  if (expanded && !expandedOptions.value[row.id]) {
    const res = await getQuestionDetail(row.id)
    expandedOptions.value[row.id] = res.data.options || []
  }
}

function reset() {
  Object.assign(query, { page: 1, subject_id: '', type_id: '', keyword: '', year: '' })
  load()
}

function addOption() {
  const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  form.option_list.push({ option_key: keys[form.option_list.length] || String(form.option_list.length + 1), option_value: '', is_correct: false })
}

function removeOption(idx) {
  form.option_list.splice(idx, 1)
  const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  form.option_list.forEach((o, i) => { o.option_key = keys[i] })
}

async function openForm(row) {
  subjects.value = (await getSubjectsAll()).data
  types.value = (await getTypes()).data
  if (row) {
    const res = await getQuestionDetail(row.id)
    const q = res.data
    Object.assign(form, {
      id: q.id, subject_id: q.subject_id, type_id: q.type_id, difficulty_id: q.difficulty_id,
      stem: q.stem, analysis: q.analysis || '', answer: q.answer || '',
      score: q.score, year: q.year, source: q.source || '',
      option_list: (q.options || []).map(o => ({ option_key: o.option_key, option_value: o.option_value, is_correct: !!o.is_correct })),
      knowledge_ids: (q.questionKnowledges || []).map(k => k.knowledge_id)
    })
  } else {
    Object.assign(form, { id: '', subject_id: '', type_id: '', difficulty_id: 2, stem: '', analysis: '', answer: '', score: 2, year: 2024, source: '', is_official: 1, exam_session: '初试', option_list: [], knowledge_ids: [] })
  }
  visible.value = true
}

function resetForm() {
  formRef.value?.resetFields()
  form.option_list = []
}

async function handleSubmit() {
  await formRef.value.validate()
  submitting.value = true
  try {
    if (form.id) {
      await updateQuestion(form.id, form)
    } else {
      await createQuestion(form)
    }
    visible.value = false
    ElMessage.success('操作成功')
    load()
  } finally {
    submitting.value = false
  }
}

async function handleDelete(id) {
  await ElMessageBox.confirm('确定删除该题目吗？', '提示')
  await deleteQuestion(id)
  ElMessage.success('删除成功')
  load()
}

// 初始化学科和题型下拉
;(async () => {
  subjects.value = (await getSubjectsAll()).data
  types.value = (await getTypes()).data
  load()
})()
</script>

<style scoped>
.question-expand {
  padding: 10px 20px;
  line-height: 1.8;
  color: #666;
}
.option-list { padding: 8px 0; }
.option-item {
  padding: 4px 10px;
  border-radius: 4px;
  margin-bottom: 4px;
}
.option-item.correct {
  background: #e8f8e8;
  color: #67c23a;
  font-weight: bold;
}
.option-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.option-key { width: 20px; font-weight: bold; }
</style>
