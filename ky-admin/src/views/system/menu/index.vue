<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>菜单管理</span>
          <el-button type="primary" icon="Plus" @click="openDialog()">新增菜单</el-button>
        </div>
      </template>

      <el-table
        :data="menuTree"
        v-loading="loading"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children' }"
        class="auto-height-table"
      >
        <el-table-column prop="menu_name" label="菜单名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="icon" label="图标" width="80">
          <template #default="{ row }">
            <el-icon v-if="row.icon"><component :is="row.icon" /></el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="menu_type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag v-if="row.menu_type === 'M'" type="primary">目录</el-tag>
            <el-tag v-else-if="row.menu_type === 'C'" type="success">菜单</el-tag>
            <el-tag v-else type="warning">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由地址" width="140" show-overflow-tooltip />
        <el-table-column prop="component" label="组件路径" width="150" show-overflow-tooltip />
        <el-table-column prop="perms" label="权限标识" width="160" show-overflow-tooltip />
        <el-table-column prop="sort" label="排序" width="70" />
        <el-table-column prop="visible" label="显示" width="70">
          <template #default="{ row }">
            <el-tag :type="row.visible === 1 ? 'success' : 'info'">{{ row.visible === 1 ? '显示' : '隐藏' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="70">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '正常' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" icon="Edit" @click="openDialog(row)">编辑</el-button>
            <el-button size="small" type="danger" icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑菜单' : '新增菜单'" width="560px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="上级菜单">
          <el-tree-select
            v-model="form.parent_id"
            :data="parentMenuOptions"
            :props="{ label: 'menu_name', value: 'id', children: 'children' }"
            placeholder="请选择上级菜单（不选为顶级）"
            clearable
            check-strictly
            style="width:100%"
          />
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio-group v-model="form.menu_type">
            <el-radio value="M">目录</el-radio>
            <el-radio value="C">菜单</el-radio>
            <el-radio value="F">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input v-model="form.menu_name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="图标" v-if="form.menu_type !== 'F'">
          <el-input v-model="form.icon" placeholder="如：Setting, User" />
        </el-form-item>
        <el-form-item label="路由地址" v-if="form.menu_type !== 'F'">
          <el-input v-model="form.path" placeholder="如：/system 或 user" />
        </el-form-item>
        <el-form-item label="组件路径" v-if="form.menu_type === 'C'">
          <el-input v-model="form.component" placeholder="如：system/user" />
        </el-form-item>
        <el-form-item label="权限标识" v-if="form.menu_type === 'F'">
          <el-input v-model="form.perms" placeholder="如：system:user:add" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        <el-form-item label="显示" v-if="form.menu_type !== 'F'">
          <el-radio-group v-model="form.visible">
            <el-radio :value="1">显示</el-radio>
            <el-radio :value="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
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
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMenuTree, createMenu, updateMenu, deleteMenu } from '@/api/system'

const loading = ref(false)
const menuTree = ref([])

const parentMenuOptions = computed(() => [
  { id: 0, menu_name: '顶级菜单', children: menuTree.value }
])

const loadData = async () => {
  loading.value = true
  try {
    const res = await getMenuTree()
    menuTree.value = res.data
  } finally {
    loading.value = false
  }
}

const dialogVisible = ref(false)
const saving = ref(false)
const formRef = ref()
const form = reactive({
  id: null, parent_id: 0, menu_name: '', menu_type: 'C',
  path: '', component: '', perms: '', icon: '', sort: 0, visible: 1, status: 1
})
const rules = {
  menu_name: [{ required: true, message: '请输入菜单名称' }]
}

const openDialog = (row = null) => {
  Object.assign(form, { id: null, parent_id: 0, menu_name: '', menu_type: 'C', path: '', component: '', perms: '', icon: '', sort: 0, visible: 1, status: 1 })
  if (row) Object.assign(form, row)
  dialogVisible.value = true
}

const handleSave = async () => {
  await formRef.value.validate()
  saving.value = true
  try {
    if (form.id) {
      await updateMenu(form.id, form)
    } else {
      await createMenu(form)
    }
    ElMessage.success('操作成功')
    dialogVisible.value = false
    loadData()
  } finally {
    saving.value = false
  }
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm(`确定删除菜单 "${row.menu_name}" 吗？`, '警告', { type: 'warning' })
  await deleteMenu(row.id)
  ElMessage.success('删除成功')
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
