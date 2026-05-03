const { getSubjects, getQuestions } = require('../../utils/request')

// 前端数学公式渲染模块（katex-min.js 就位后自动启用）
// 用 getApp() 全局缓存，避免每次页面加载都 require
let _towxmlMath = null
let _towxmlMathLoaded = false

function getTowxmlMath() {
  if (_towxmlMathLoaded) return _towxmlMath
  _towxmlMathLoaded = true
  try {
    var mod = require('../../utils/towxml-math/main.js')
    if (typeof mod === 'function') {
      _towxmlMath = mod
      console.log('[公式渲染] towxml-math 加载成功')
    } else {
      console.warn('[公式渲染] towxml-math 导出异常', typeof mod)
    }
  } catch (e) {
    console.warn('[公式渲染] towxml-math 未加载，使用后端SVG方案', e.message)
  }
  return _towxmlMath
}

// 科目名称到学科ID的映射（兼容旧数据）
const getSubjectId = (name) => {
  if (!name) return null
  if (name.includes('政治') || name.includes('马克思') || name.includes('思政')) return 17
  if (name.includes('英语（一）') || name.includes('英语一') || name.includes('201')) return 14
  if (name.includes('英语（二）') || name.includes('英语二') || name.includes('204')) return 15
  if (name.includes('数学三') || name.includes('数学（三）') || name.includes('303')) return 16
  if (name.includes('数学一') || name.includes('数学（一）') || name.includes('301')) return 18
  if (name.includes('数学二') || name.includes('数学（二）') || name.includes('302')) return 19
  if (name.includes('数学')) return 18
  if (name.includes('教育学')) return 5
  if (name.includes('计算机') || name.includes('专业课')) return 6
  return null
}

Page({
  data: {
    banners: [
      { id: 1, image: 'https://picsum.photos/750/300?random=1', title: '考研全程规划' },
      { id: 2, image: 'https://picsum.photos/750/300?random=2', title: '高分学长经验' }
    ],
    userTarget: null,
    subjects: [],
    currentSubject: null,
    questions: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false
  },

  onLoad: function() {
    // 页面首次加载时检查目标
    this.checkTarget()
  },

  onShow: function() {
    // 每次显示时重新检查目标（处理从目标页返回的场景）
    this.checkTarget()
  },

  checkTarget: function() {
    var self = this
    var target = wx.getStorageSync('userTarget')
    
    // 更健壮的判断：有 school 字段即认为已选目标
    if (target && target.school) {
      var needRefresh = !self.data.userTarget || 
                       self.data.userTarget.school.id !== target.school.id
      
      self.setData({ 
        userTarget: target,
        subjects: target.subjects || []
      })
      
      // 自动选择第一个科目（仅在未选或目标变化时）
      if (!self.data.currentSubject && target.subjects && target.subjects.length > 0) {
        self.setData({ currentSubject: target.subjects[0] })
        self.loadQuestions()
      } else if (needRefresh && target.subjects && target.subjects.length > 0) {
        // 目标发生变化，重新加载
        self.setData({ currentSubject: target.subjects[0] })
        self.setData({ page: 1, questions: [], hasMore: true })
        self.loadQuestions()
      }
    } else {
      // 没有目标，跳转到目标设置页面（仅在非目标页触发时才跳转，避免循环）
      if (!self._navigatingToTarget) {
        self._navigatingToTarget = true
        wx.redirectTo({ url: '/pages/target/index' })
      }
    }
  },

  onPullDownRefresh: function() {
    var self = this
    self.setData({ page: 1, questions: [], hasMore: true })
    self.loadQuestions().then(function() {
      wx.stopPullDownRefresh()
    }).catch(function() {
      wx.stopPullDownRefresh()
    })
  },

  onReachBottom: function() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 })
      this.loadQuestions()
    }
  },

  loadQuestions: function() {
    var self = this
    if (!self.data.currentSubject || self.data.loading) {
      return Promise.resolve()
    }
    
    self.setData({ loading: true })
    
    // 获取正确的 subject_id
    var subjectId = self.data.currentSubject.subject_id || 
                   getSubjectId(self.data.currentSubject.name)
    
    if (!subjectId) {
      console.error('无法获取有效的 subject_id', self.data.currentSubject)
      self.setData({ loading: false, questions: [], hasMore: false })
      return Promise.resolve()
    }
    
    // 使用 subject_id（学科ID）查询题目
    return getQuestions({
      subject_id: subjectId,
      page: self.data.page,
      pageSize: self.data.pageSize
    }).then(function(res) {
      var list = (res.data && res.data.list) ? res.data.list : []
      
      // 前端公式渲染：使用 towxml-math 处理 LaTeX 公式
      var mathRenderer = getTowxmlMath()
      if (mathRenderer) {
        list = list.map(function(q) {
          try {
            var item = Object.assign({}, q)
            if (item.stem) item.stem_rendered = mathRenderer(item.stem, { math: true })
            if (item.analysis) item.analysis_rendered = mathRenderer(item.analysis, { math: true })
            return item
          } catch (e) {
            console.warn('[公式渲染] 单题渲染失败，降级为原始文本', e.message)
            return q
          }
        })
      } else {
        // 降级：使用后端预渲染的 stem_svg
        list = list.map(function(q) {
          var item = Object.assign({}, q)
          if (item.stem_svg) item.stem_rendered = item.stem_svg
          return item
        })
      }
      
      var newQuestions = self.data.page === 1 ? list : self.data.questions.concat(list)
      self.setData({
        questions: newQuestions,
        hasMore: list.length >= self.data.pageSize
      })
    }).catch(function(err) {
      console.error('加载题目失败', err)
    }).finally(function() {
      self.setData({ loading: false })
    })
  },

  switchSubject: function(e) {
    var self = this
    var subject = e.currentTarget.dataset.subject
    var currentId = self.data.currentSubject ? self.data.currentSubject.id : null
    if (subject.id === currentId) return
    
    self.setData({ 
      currentSubject: subject,
      page: 1,
      questions: [],
      hasMore: true
    })
    self.loadQuestions()
  },

  goToTarget: function() {
    wx.navigateTo({ url: '/pages/target/index' })
  }
})
