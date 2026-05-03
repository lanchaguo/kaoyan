<template>
  <div class="page-container">
    <!-- 搜索 -->
    <el-form inline class="search-form">
      <el-form-item label="年份">
        <el-input-number v-model="query.year" :min="2000" :max="2099" style="width:120px" />
      </el-form-item>
      <el-form-item label="关键词">
        <el-input v-model="query.keyword" placeholder="省市名称" clearable @keyup.enter="load" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="load">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="toolbar">
      <el-button type="primary" @click="openForm()">新增省市</el-button>
    </div>

    <el-table :data="list" v-loading="loading" stripe class="auto-height-table">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="省市名称" min-width="150" />
      <el-table-column prop="code" label="省市代码" width="120" />
      <el-table-column prop="year" label="年份" width="80" />
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
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

    <el-pagination
      v-model:current-page="query.page"
      v-model:page-size="query.pageSize"
      :total="total"
      :page-sizes="[20, 50, 100]"
      layout="total, sizes, prev, pager, next"
      @change="load"
      style="margin-top:16px"
    />

    <!-- 表单弹窗 -->
    <el-dialog v-model="visible" :title="form.id ? '编辑省市' : '新增省市'" width="500px">
      <el-form :model="form" label-width="90px" ref="formRef">
        <el-form-item label="省市名称" prop="name" :rules="[{ required: true }]">
          <el-input v-model="form.name" placeholder="如：北京市" />
        </el-form-item>
        <el-form-item label="省市代码" prop="code" :rules="[{ required: true }]">
          <el-input v-model="form.code" placeholder="如：110000" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="年份">
              <el-input-number v-model="form.year" :min="2000" :max="2099" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input-number v-model="form.sort" :min="0" style="width:100%" />
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
import { ref, reactive } from 'vue'
import { getProvinces, createProvince, updateProvince, deleteProvince } from '@/api/school'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const visible = ref(false)
const submitting = ref(false)
const formRef = ref()

const query = reactive({ page: 1, pageSize: 50, year: new Date().getFullYear(), keyword: '' })
const form = reactive({ id: '', name: '', code: '', year: new Date().getFullYear(), sort: 0 })

async function load() {
  loading.value = true
  try {
    const res = await getProvinces(query)
    list.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

function reset() {
  query.page = 1
  query.keyword = ''
  load()
}

function openForm(row) {
  if (row) {
    Object.assign(form, { id: row.id, name: row.name, code: row.code, year: row.year, sort: row.sort || 0 })
  } else {
    Object.assign(form, { id: '', name: '', code: '', year: query.year || new Date().getFullYear(), sort: 0 })
  }
  visible.value = true
}

async function handleSubmit() {
  await formRef.value.validate()
  submitting.value = true
  try {
    if (form.id) {
      await updateProvince(form.id, form)
    } else {
      await createProvince(form)
    }
    visible.value = false
    ElMessage.success('操作成功')
    load()
  } finally {
    submitting.value = false
  }
}

async function handleDelete(id) {
  await ElMessageBox.confirm('确定删除该省市吗？', '提示')
  await deleteProvince(id)
  ElMessage.success('删除成功')
  load()
}

// 初始加载
;(async () => { load() })()
</script>
