<template>
  <div class="page-container">
    <!-- 搜索 -->
    <el-form inline class="search-form">
      <el-form-item label="学科名称">
        <el-input v-model="query.name" placeholder="请输入" clearable @keyup.enter="load" />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="query.status" placeholder="全部" clearable style="width:120px">
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="load">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button type="primary" @click="openForm()">新增学科</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="list" v-loading="loading" stripe class="auto-height-table">
      <el-table-column prop="id" label="ID" width="80" show-overflow-tooltip />
      <el-table-column prop="name" label="学科名称" show-overflow-tooltip />
      <el-table-column prop="code" label="学科代码" show-overflow-tooltip />
      <el-table-column label="主题色" width="100">
        <template #default="{ row }">
          <span :style="{ color: row.color, fontWeight: 'bold' }">{{ row.color }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="openForm(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="query.page"
      v-model:page-size="query.pageSize"
      :total="total"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      @change="load"
      style="margin-top:16px"
    />

    <!-- 表单弹窗 -->
    <el-dialog v-model="visible" :title="form.id ? '编辑学科' : '新增学科'" width="500px">
      <el-form :model="form" label-width="100px" ref="formRef">
        <el-form-item label="学科名称" prop="name" :rules="[{ required: true, message: '请输入学科名称' }]">
          <el-input v-model="form.name" placeholder="如：思想政治" />
        </el-form-item>
        <el-form-item label="学科代码" prop="code" :rules="[{ required: true, message: '请输入学科代码' }]">
          <el-input v-model="form.code" placeholder="如：政治" :disabled="!!form.id" />
        </el-form-item>
        <el-form-item label="主题色" prop="color">
          <el-color-picker v-model="form.color" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
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
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { getSubjects, createSubject, updateSubject, deleteSubject } from '@/api/exam'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const visible = ref(false)
const submitting = ref(false)
const formRef = ref()
const form = reactive({ id: '', name: '', code: '', icon: '', color: '#409EFF', sort: 0, status: 1 })
const query = reactive({ page: 1, pageSize: 10, name: '', status: '' })

async function load() {
  loading.value = true
  try {
    const res = await getSubjects(query)
    list.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

function reset() {
  query.name = ''
  query.status = ''
  query.page = 1
  load()
}

function openForm(row) {
  Object.assign(form, { id: '', name: '', code: '', icon: '', color: '#409EFF', sort: 0, status: 1 })
  if (row) Object.assign(form, row)
  visible.value = true
}

async function handleSubmit() {
  await formRef.value.validate()
  submitting.value = true
  try {
    if (form.id) {
      await updateSubject(form.id, form)
    } else {
      await createSubject(form)
    }
    visible.value = false
    ElMessage.success('操作成功')
    load()
  } finally {
    submitting.value = false
  }
}

async function handleDelete(id) {
  await ElMessageBox.confirm('确定删除该学科吗？', '提示')
  await deleteSubject(id)
  ElMessage.success('删除成功')
  load()
}

load()
</script>
