<template>
  <div class="page-container">
    <div class="toolbar">
      <el-button type="primary" @click="openForm()">新增题型</el-button>
    </div>

    <el-table :data="list" v-loading="loading" stripe class="auto-height-table">
      <el-table-column prop="id" label="ID" width="80" show-overflow-tooltip />
      <el-table-column prop="name" label="题型名称" show-overflow-tooltip />
      <el-table-column prop="code" label="题型代码" show-overflow-tooltip />
      <el-table-column label="有选项" width="100">
        <template #default="{ row }">
          <el-tag :type="row.has_option ? 'success' : 'info'" size="small">
            {{ row.has_option ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="多答案" width="100">
        <template #default="{ row }">
          <el-tag :type="row.has_multi_answer ? 'warning' : 'info'" size="small">
            {{ row.has_multi_answer ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="default_score" label="默认分值" width="100" />
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="openForm(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="visible" :title="form.id ? '编辑题型' : '新增题型'" width="500px">
      <el-form :model="form" label-width="100px" ref="formRef">
        <el-form-item label="题型名称" prop="name" :rules="[{ required: true, message: '请输入题型名称' }]">
          <el-input v-model="form.name" placeholder="如：单项选择题" />
        </el-form-item>
        <el-form-item label="题型代码" prop="code" :rules="[{ required: true, message: '请输入题型代码' }]">
          <el-input v-model="form.code" placeholder="如：choice_single" :disabled="!!form.id" />
        </el-form-item>
        <el-form-item label="有选项">
          <el-switch v-model="form.has_option" />
        </el-form-item>
        <el-form-item label="多答案">
          <el-switch v-model="form.has_multi_answer" />
        </el-form-item>
        <el-form-item label="默认分值">
          <el-input-number v-model="form.default_score" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { getTypes, createType, updateType, deleteType } from '@/api/exam'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const list = ref([])
const visible = ref(false)
const submitting = ref(false)
const formRef = ref()
const form = reactive({ id: '', name: '', code: '', has_option: false, has_multi_answer: false, default_score: 2, sort: 0 })

async function load() {
  loading.value = true
  try {
    const res = await getTypes()
    list.value = res.data
  } finally {
    loading.value = false
  }
}

function openForm(row) {
  Object.assign(form, { id: '', name: '', code: '', has_option: false, has_multi_answer: false, default_score: 2, sort: 0 })
  if (row) Object.assign(form, row)
  visible.value = true
}

async function handleSubmit() {
  await formRef.value.validate()
  submitting.value = true
  try {
    if (form.id) {
      await updateType(form.id, form)
    } else {
      await createType(form)
    }
    visible.value = false
    ElMessage.success('操作成功')
    load()
  } finally {
    submitting.value = false
  }
}

async function handleDelete(id) {
  await ElMessageBox.confirm('确定删除该题型吗？', '提示')
  await deleteType(id)
  ElMessage.success('删除成功')
  load()
}

load()
</script>
