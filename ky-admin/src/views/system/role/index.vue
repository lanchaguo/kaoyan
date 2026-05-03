<template>
  <div class="page-container">
    <el-card shadow="never" class="search-card">
      <el-form :model="query" inline>
        <el-form-item label="角色名称">
          <el-input v-model="query.roleName" placeholder="请输入角色名称" clearable style="width:180px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="query.status" placeholder="全部" clearable style="width:120px">
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="loadData">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" style="margin-top: 12px">
      <template #header>
        <div class="card-header">
          <span>角色列表</span>
          <el-button type="primary" icon="Plus" @click="openDialog()">新增角色</el-button>
        </div>
      </template>

      <el-table :data="list" v-loading="loading" stripe border class="auto-height-table">
        <el-table-column prop="id" label="ID" width="70" show-overflow-tooltip />
        <el-table-column prop="role_name" label="角色名称" width="130" show-overflow-tooltip />
        <el-table-column prop="role_key" label="角色标识" width="130" show-overflow-tooltip />
        <el-table-column prop="sort" label="排序" width="70" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '正常' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip />
        <el-table-column prop="created_at" label="创建时间" width="160" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" icon="Edit" @click="openDialog(row)">编辑</el-button>
            <el-button size="small" type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="query.page"
        v-model:page-size="query.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        style="margin-top: 16px; justify-content: flex-end"
        @change="loadData"
      />
    </el-card>

    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑角色' : '新增角色'" width="600px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="form.role_name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色标识" prop="role_key">
          <el-input v-model="form.role_key" placeholder="如：admin, editor" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            ref="menuTreeRef"
            :data="menuTree"
            :props="{ label: 'menu_name', children: 'children' }"
            show-checkbox
            node-key="id"
            default-expand-all
            style="border: 1px solid #dcdfe6; border-radius: 4px; padding: 8px; width: 100%; max-height: 260px; overflow-y: auto;"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getRoleList, createRole, updateRole, deleteRole, getRoleMenuIds, getMenuTree } from '@/api/system'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({ page: 1, pageSize: 10, roleName: '', status: '' })
const menuTree = ref([])

const loadData = async () => {
  loading.value = true
  try {
    const res = await getRoleList(query)
    list.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  query.roleName = ''; query.status = ''; query.page = 1
  loadData()
}

const dialogVisible = ref(false)
const saving = ref(false)
const formRef = ref()
const menuTreeRef = ref()
const form = reactive({ id: null, role_name: '', role_key: '', sort: 0, status: 1, remark: '' })
const rules = {
  role_name: [{ required: true, message: '请输入角色名称' }],
  role_key: [{ required: true, message: '请输入角色标识' }]
}

const openDialog = async (row = null) => {
  Object.assign(form, { id: null, role_name: '', role_key: '', sort: 0, status: 1, remark: '' })
  dialogVisible.value = true
  await loadMenuTree()
  if (row) {
    Object.assign(form, row)
    const res = await getRoleMenuIds(row.id)
    menuTreeRef.value?.setCheckedKeys(res.data)
  }
}

const loadMenuTree = async () => {
  const res = await getMenuTree()
  menuTree.value = res.data
}

const handleSave = async () => {
  await formRef.value.validate()
  const checkedKeys = menuTreeRef.value?.getCheckedKeys() || []
  const halfCheckedKeys = menuTreeRef.value?.getHalfCheckedKeys() || []
  const menuIds = [...checkedKeys, ...halfCheckedKeys]
  saving.value = true
  try {
    if (form.id) {
      await updateRole(form.id, { ...form, menuIds })
    } else {
      await createRole({ ...form, menuIds })
    }
    ElMessage.success('操作成功')
    dialogVisible.value = false
    loadData()
  } finally {
    saving.value = false
  }
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm(`确定删除角色 "${row.role_name}" 吗？`, '警告', { type: 'warning' })
  await deleteRole(row.id)
  ElMessage.success('删除成功')
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
