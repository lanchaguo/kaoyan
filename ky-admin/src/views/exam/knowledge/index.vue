<template>
  <div class="page-container">
    <el-form inline class="search-form">
      <el-form-item label="学科">
        <el-select v-model="query.subject_id" placeholder="全部" clearable style="width:160px" @change="loadTree">
          <el-option v-for="s in subjects" :key="s.id" :label="s.name" :value="s.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loadTree">查询</el-button>
        <el-button type="primary" @click="openForm()">新增知识点</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="treeData" row-key="id" default-expand-all :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" class="auto-height-table">
      <el-table-column prop="name" label="知识点名称" show-overflow-tooltip />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="openForm(null, row.id)">新增子节点</el-button>
          <el-button type="primary" link @click="openForm(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="visible" :title="form.id ? '编辑知识点' : '新增知识点'" width="500px">
      <el-form :model="form" label-width="100px" ref="formRef">
        <el-form-item label="学科" prop="subject_id" :rules="[{ required: true, message: '请选择学科' }]">
          <el-select v-model="form.subject_id" placeholder="请选择" style="width:100%">
            <el-option v-for="s in subjects" :key="s.id" :label="s.name" :value="s.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="父级">
          <el-input v-model="parentName" disabled placeholder="根节点（顶级）" />
        </el-form-item>
        <el-form-item label="知识点名称" prop="name" :rules="[{ required: true, message: '请输入知识点名称' }]">
          <el-input v-model="form.name" placeholder="如：唯物论" />
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
import { ref, reactive, computed } from 'vue'
import { getKnowledgesTree, getSubjectsAll, createKnowledge, updateKnowledge, deleteKnowledge } from '@/api/exam'
import { ElMessage, ElMessageBox } from 'element-plus'

const treeData = ref([])
const subjects = ref([])
const visible = ref(false)
const submitting = ref(false)
const formRef = ref()
const parentName = ref('')
const form = reactive({ id: '', subject_id: '', parent_id: '', name: '', sort: 0 })
const query = reactive({ subject_id: '' })

async function loadTree() {
  const res = await getKnowledgesTree(query)
  treeData.value = res.data
}

async function loadSubjects() {
  const res = await getSubjectsAll()
  subjects.value = res.data
}

function openForm(row, parentId) {
  parentName.value = row ? row.name : ''
  Object.assign(form, { id: '', subject_id: query.subject_id || '', parent_id: parentId || 0, name: '', sort: 0 })
  if (row) Object.assign(form, { id: row.id, subject_id: row.subject_id, name: row.name, sort: row.sort })
  visible.value = true
}

async function handleSubmit() {
  await formRef.value.validate()
  submitting.value = true
  try {
    if (form.id) {
      await updateKnowledge(form.id, { name: form.name, sort: form.sort })
    } else {
      await createKnowledge(form)
    }
    visible.value = false
    ElMessage.success('操作成功')
    loadTree()
  } finally {
    submitting.value = false
  }
}

async function handleDelete(id) {
  await ElMessageBox.confirm('确定删除该知识点（含所有子节点）吗？', '提示')
  await deleteKnowledge(id)
  ElMessage.success('删除成功')
  loadTree()
}

loadSubjects()
loadTree()
</script>
