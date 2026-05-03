<template>
  <div class="page-container">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="query" inline>
        <el-form-item label="用户名">
          <el-input v-model="query.username" placeholder="请输入用户名" clearable style="width:180px" />
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

    <!-- 表格 -->
    <el-card shadow="never" style="margin-top: 12px">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <el-button type="primary" icon="Plus" @click="openDialog()">新增用户</el-button>
        </div>
      </template>

      <el-table :data="list" v-loading="loading" stripe border class="auto-height-table">
        <el-table-column prop="id" label="ID" width="70" show-overflow-tooltip />
        <el-table-column prop="username" label="用户名" width="120" show-overflow-tooltip />
        <el-table-column prop="nickname" label="昵称" width="120" show-overflow-tooltip />
        <el-table-column prop="email" label="邮箱" min-width="150" show-overflow-tooltip />
        <el-table-column prop="phone" label="手机号" width="130" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '正常' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" icon="Edit" @click="openDialog(row)">编辑</el-button>
            <el-button size="small" type="warning" icon="Key" @click="openResetPwd(row)">重置密码</el-button>
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑用户' : '新增用户'" width="520px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="!!form.id" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item v-if="!form.id" label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.roleIds" multiple placeholder="请选择角色" style="width:100%">
            <el-option v-for="r in allRoles" :key="r.id" :label="r.role_name" :value="r.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
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

    <!-- 重置密码弹窗 -->
    <el-dialog v-model="resetPwdVisible" title="重置密码" width="400px" destroy-on-close>
      <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="80px">
        <el-form-item label="新密码" prop="password">
          <el-input v-model="pwdForm.password" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resetPwdVisible = false">取消</el-button>
        <el-button type="primary" :loading="pwdSaving" @click="handleResetPwd">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, createUser, updateUser, deleteUser, resetPassword, getUserRoles, getRoleList } from '@/api/system'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const query = reactive({ page: 1, pageSize: 10, username: '', status: '' })
const allRoles = ref([])

const loadData = async () => {
  loading.value = true
  try {
    const res = await getUserList(query)
    list.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  query.username = ''; query.status = ''; query.page = 1
  loadData()
}

// 弹窗
const dialogVisible = ref(false)
const saving = ref(false)
const formRef = ref()
const form = reactive({ id: null, username: '', password: '', nickname: '', email: '', phone: '', status: 1, remark: '', roleIds: [] })
const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }]
}

const openDialog = async (row = null) => {
  Object.assign(form, { id: null, username: '', password: '', nickname: '', email: '', phone: '', status: 1, remark: '', roleIds: [] })
  if (row) {
    Object.assign(form, row)
    const res = await getUserRoles(row.id)
    form.roleIds = res.data
  }
  dialogVisible.value = true
}

const handleSave = async () => {
  await formRef.value.validate()
  saving.value = true
  try {
    if (form.id) {
      await updateUser(form.id, form)
    } else {
      await createUser(form)
    }
    ElMessage.success('操作成功')
    dialogVisible.value = false
    loadData()
  } finally {
    saving.value = false
  }
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm(`确定删除用户 "${row.username}" 吗？`, '警告', { type: 'warning' })
  await deleteUser(row.id)
  ElMessage.success('删除成功')
  loadData()
}

// 重置密码
const resetPwdVisible = ref(false)
const pwdSaving = ref(false)
const pwdFormRef = ref()
const pwdForm = reactive({ id: null, password: '' })
const pwdRules = { password: [{ required: true, message: '请输入新密码' }, { min: 6, message: '密码至少6位' }] }

const openResetPwd = (row) => {
  pwdForm.id = row.id; pwdForm.password = ''
  resetPwdVisible.value = true
}

const handleResetPwd = async () => {
  await pwdFormRef.value.validate()
  pwdSaving.value = true
  try {
    await resetPassword(pwdForm.id, { password: pwdForm.password })
    ElMessage.success('密码重置成功')
    resetPwdVisible.value = false
  } finally {
    pwdSaving.value = false
  }
}

onMounted(async () => {
  const res = await getRoleList({ page: 1, pageSize: 100 })
  allRoles.value = res.data.list
  loadData()
})
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
