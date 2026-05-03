<template>
  <div class="page-container">
    <!-- 搜索 -->
    <el-form inline class="search-form">
      <el-form-item label="年份">
        <el-input-number v-model="query.year" :min="2000" :max="2099" style="width:120px" />
      </el-form-item>
      <el-form-item label="省市">
        <el-select v-model="query.province_code" placeholder="全部" clearable style="width:160px">
          <el-option v-for="p in provinces" :key="p.code" :label="p.name" :value="p.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="关键词">
        <el-input v-model="query.keyword" placeholder="院校名称/代码" clearable @keyup.enter="load" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="load">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="toolbar">
      <el-button type="primary" @click="openForm()">新增院校</el-button>
      <span style="margin-left:16px;color:#999;font-size:13px">
        共 {{ total }} 所院校
      </span>
    </div>

    <el-table :data="list" v-loading="loading" stripe
      @expand-change="onExpand" class="auto-height-table">
      <el-table-column type="expand" width="50">
        <template #default="{ row }">
          <div class="hierarchy-container" v-if="expandedData[row.id]">
            <div v-for="college in expandedData[row.id].institutes" :key="college.id" class="college-block">
              <div class="college-header">
                <strong>【学院】</strong>{{ college.name }}
                <span class="code-tag">代码: {{ college.code }}</span>
              </div>
              <div v-for="major in college.majors" :key="major.id" class="major-block">
                <div class="major-header">
                  <strong>【专业】</strong>{{ major.name }}
                  <span class="code-tag">代码: {{ major.code }}</span>
                </div>
                <div v-for="dir in major.directions" :key="dir.id" class="direction-block">
                  <div class="direction-header">
                    <strong>【方向】</strong>{{ dir.name }}
                    <span class="code-tag">代码: {{ dir.code }}</span>
                  </div>
                  <div class="subject-list">
                    <span v-for="subj in dir.examSubjects" :key="subj.id" class="subject-tag">
                      {{ subj.subject_order }}. {{ subj.subject_name }} ({{ subj.subject_code }})
                    </span>
                    <span v-if="!dir.examSubjects || dir.examSubjects.length === 0" class="no-data">无科目信息</span>
                  </div>
                </div>
                <div v-if="!major.directions || major.directions.length === 0" class="no-data" style="padding-left:20px">
                  无方向信息
                </div>
              </div>
              <div v-if="!college.majors || college.majors.length === 0" class="no-data" style="padding-left:20px">
                无专业信息
              </div>
            </div>
            <div v-if="!expandedData[row.id].institutes || expandedData[row.id].institutes.length === 0" class="no-data">
              无学院信息
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="院校名称" min-width="180" show-overflow-tooltip />
      <el-table-column prop="code" label="院校代码" width="120" />
      <el-table-column label="省市" width="120">
        <template #default="{ row }">{{ row.provinceInfo?.name || '—' }}</template>
      </el-table-column>
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
          <el-button type="danger" link @click="handleDelete(row.id, row.name)">删除</el-button>
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

    <!-- 院校表单弹窗 -->
    <el-dialog v-model="visible" :title="form.id ? '编辑院校' : '新增院校'" width="550px">
      <el-form :model="form" label-width="90px" ref="formRef">
        <el-form-item label="院校名称" prop="name" :rules="[{ required: true }]">
          <el-input v-model="form.name" placeholder="如：北京大学" />
        </el-form-item>
        <el-form-item label="院校代码" prop="code" :rules="[{ required: true }]">
          <el-input v-model="form.code" placeholder="如：10001" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="省市">
              <el-select v-model="form.province_code" placeholder="请选择" style="width:100%">
                <el-option v-for="p in provinces" :key="p.code" :label="p.name + ' (' + p.code + ')'" :value="p.code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年份">
              <el-input-number v-model="form.year" :min="2000" :max="2099" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input-number v-model="form.sort" :min="0" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
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
import { ref, reactive, onMounted } from 'vue'
import { getSchools, getSchoolDetail, createSchool, updateSchool, deleteSchool, getProvincesAll } from '@/api/school'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const list = ref([])
const total = ref(0)
const provinces = ref([])
const visible = ref(false)
const submitting = ref(false)
const formRef = ref()
const expandedData = ref({})

const query = reactive({ page: 1, pageSize: 20, year: new Date().getFullYear(), province_code: '', keyword: '' })
const form = reactive({ id: '', name: '', code: '', province_code: '', year: new Date().getFullYear(), sort: 0, status: 1 })

async function load() {
  loading.value = true
  try {
    const res = await getSchools(query)
    list.value = res.data.list
    total.value = res.data.total
  } finally {
    loading.value = false
  }
}

function reset() {
  query.page = 1
  query.province_code = ''
  query.keyword = ''
  load()
}

async function onExpand(row, expanded) {
  if (expanded && !expandedData.value[row.id]) {
    const res = await getSchoolDetail(row.id)
    expandedData.value[row.id] = res.data
  }
}

function openForm(row) {
  if (row) {
    Object.assign(form, {
      id: row.id, name: row.name, code: row.code,
      province_code: row.province_code || '', year: row.year,
      sort: row.sort || 0, status: row.status ?? 1
    })
  } else {
    Object.assign(form, {
      id: '', name: '', code: '', province_code: '',
      year: query.year || new Date().getFullYear(), sort: 0, status: 1
    })
  }
  visible.value = true
}

async function handleSubmit() {
  await formRef.value.validate()
  submitting.value = true
  try {
    if (form.id) {
      await updateSchool(form.id, form)
    } else {
      await createSchool(form)
    }
    visible.value = false
    ElMessage.success('操作成功')
    load()
  } finally {
    submitting.value = false
  }
}

async function handleDelete(id, name) {
  await ElMessageBox.confirm(`确定删除院校「${name}」吗？该操作将级联删除所有学院、专业、方向和科目数据！`, '警告', { type: 'warning' })
  await deleteSchool(id)
  ElMessage.success('删除成功')
  load()
}

async function loadProvinces() {
  const res = await getProvincesAll({ year: query.year })
  provinces.value = res.data
}

onMounted(() => {
  load()
  loadProvinces()
})
</script>

<style scoped>
.hierarchy-container { padding: 8px 20px; line-height: 1.8; }
.college-block { margin-bottom: 12px; padding: 8px; background: #f5f7fa; border-radius: 6px; }
.college-header { font-size: 14px; color: #303133; margin-bottom: 6px; }
.major-block { padding-left: 16px; margin-top: 6px; }
.major-header { font-size: 13px; color: #606266; }
.direction-block { padding-left: 16px; margin-top: 4px; }
.direction-header { font-size: 13px; color: #909399; }
.subject-list { padding-left: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.subject-tag {
  background: #e8f4ff; color: #409eff; padding: 2px 8px; border-radius: 4px;
  font-size: 12px; display: inline-block;
}
.code-tag {
  background: #f0f0f0; color: #909399; padding: 1px 6px; border-radius: 3px;
  font-size: 12px; margin-left: 8px;
}
.no-data { color: #c0c4cc; font-size: 13px; }
</style>
