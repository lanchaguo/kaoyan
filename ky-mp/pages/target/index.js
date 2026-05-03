const { getSchools, getInstitutes, getMajors, getDirections, getDirectionSubjects, saveTarget } = require('../../utils/request')

Page({
  data: {
    step: 1,
    loading: false,
    searchKeyword: '',
    
    // 选择的数据
    selectedSchool: null,
    selectedInstitute: null,
    selectedMajor: null,
    selectedDirection: null,
    subjects: [],
    
    // 列表数据
    schoolList: [],
    instituteList: [],
    majorList: [],
    directionList: [],
    
    // 筛选
    degreeType: '学术型'
  },

  onLoad: function() {
    var self = this
    // 检查是否已有目标
    var target = wx.getStorageSync('userTarget')
    if (target && target.school) {
      // 已有目标，询问是否重新选择
      wx.showModal({
        title: '已有考研目标',
        content: '是否重新选择目标院校？',
        confirmText: '重新选择',
        cancelText: '保持不变',
        success: function(res) {
          if (res.confirm) {
            // 用户选择重新选择，清空已选数据
            self.setData({
              step: 1,
              selectedSchool: null,
              selectedInstitute: null,
              selectedMajor: null,
              selectedDirection: null,
              subjects: [],
              instituteList: [],
              majorList: [],
              directionList: []
            })
            self.loadSchools()
          } else {
            // 用户取消，返回首页
            wx.switchTab({ url: '/pages/home/index' })
          }
        }
      })
      return
    }
    // 没有目标，加载学校列表
    self.loadSchools()
  },

  // 搜索学校
  onSearchSchool: function(e) {
    var self = this
    var keyword = e.detail.value || ''
    self.setData({ searchKeyword: keyword })
    // 防抖处理
    if (self.searchTimer) {
      clearTimeout(self.searchTimer)
    }
    self.searchTimer = setTimeout(function() {
      self.loadSchools(keyword)
    }, 300)
  },

  // 加载学校列表
  loadSchools: function(keyword) {
    var self = this
    self.setData({ loading: true })
    
    getSchools({ keyword: keyword || '', pageSize: 50 })
      .then(function(res) {
        var list = res.data && res.data.list ? res.data.list : []
        self.setData({ schoolList: list })
      })
      .catch(function(err) {
        console.error('加载学校失败', err)
        wx.showToast({ title: '加载失败', icon: 'none' })
      })
      .finally(function() {
        self.setData({ loading: false })
      })
  },

  // 选择学校
  selectSchool: function(e) {
    var school = e.currentTarget.dataset.school
    this.setData({ selectedSchool: school })
  },

  // 下一步
  nextStep: function() {
    var self = this
    var step = self.data.step
    
    if (step === 1 && !self.data.selectedSchool) {
      wx.showToast({ title: '请选择学校', icon: 'none' })
      return
    }
    
    if (step === 2 && !self.data.selectedInstitute) {
      wx.showToast({ title: '请选择学院', icon: 'none' })
      return
    }
    
    if (step === 3 && !self.data.selectedMajor) {
      wx.showToast({ title: '请选择专业', icon: 'none' })
      return
    }
    
    if (step === 1) {
      self.setData({ step: 2, loading: true })
      self.loadInstitutes()
    } else if (step === 2) {
      self.setData({ step: 3, loading: true })
      self.loadMajors()
    } else if (step === 3) {
      // 选择专业后加载方向列表
      self.setData({ step: 4, loading: true })
      self.loadDirections()
    } else if (step === 4) {
      // 选择方向后加载考试科目
      // 如果有多个方向但未选择，提示用户
      if (self.data.directionList.length > 0 && !self.data.selectedDirection) {
        wx.showToast({ title: '请选择研究方向', icon: 'none' })
        return
      }
      self.setData({ step: 5, loading: true })
      self.loadDirectionSubjects()
    }
  },

  // 上一步
  prevStep: function() {
    var self = this
    var step = self.data.step
    if (step > 1) {
      self.setData({ step: step - 1 })
    }
  },

  // 加载学院列表
  loadInstitutes: function() {
    var self = this
    var schoolId = self.data.selectedSchool.id
    
    getInstitutes({ school_id: schoolId })
      .then(function(res) {
        var list = res.data || []
        self.setData({ instituteList: list })
      })
      .catch(function(err) {
        console.error('加载学院失败', err)
        wx.showToast({ title: '加载失败', icon: 'none' })
      })
      .finally(function() {
        self.setData({ loading: false })
      })
  },

  // 选择学院
  selectInstitute: function(e) {
    var institute = e.currentTarget.dataset.institute
    this.setData({ selectedInstitute: institute })
  },

  // 切换学位类型
  switchDegree: function(e) {
    var degree = e.currentTarget.dataset.type
    this.setData({ degreeType: degree })
    this.loadMajors()
  },

  // 加载专业列表
  loadMajors: function() {
    var self = this
    var instituteId = self.data.selectedInstitute.id
    var degree = self.data.degreeType
    
    self.setData({ loading: true })
    
    getMajors({ institute_id: instituteId, degree: degree })
      .then(function(res) {
        var list = res.data && res.data.list ? res.data.list : []
        self.setData({ majorList: list })
      })
      .catch(function(err) {
        console.error('加载专业失败', err)
        wx.showToast({ title: '加载失败', icon: 'none' })
      })
      .finally(function() {
        self.setData({ loading: false })
      })
  },

  // 选择专业
  selectMajor: function(e) {
    var major = e.currentTarget.dataset.major
    this.setData({ selectedMajor: major })
  },

  // 加载方向列表
  loadDirections: function() {
    var self = this
    
    getDirections({ major_id: self.data.selectedMajor.id })
      .then(function(res) {
        var list = res.data || []
        self.setData({ directionList: list })
        
        // 只有一个方向时自动选中（不区分研究方向）
        if (list.length === 1) {
          self.setData({ selectedDirection: list[0] })
        }
      })
      .catch(function(err) {
        console.error('加载研究方向失败', err)
        self.setData({ directionList: [] })
      })
      .finally(function() {
        self.setData({ loading: false })
      })
  },

  // 选择方向
  selectDirection: function(e) {
    var direction = e.currentTarget.dataset.direction
    this.setData({ selectedDirection: direction })
  },

  // 加载方向的考试科目
  loadDirectionSubjects: function() {
    var self = this
    var directionId = self.data.selectedDirection ? self.data.selectedDirection.id : null
    
    // 如果有方向ID，调用方向科目接口
    if (directionId) {
      getDirectionSubjects({ direction_id: directionId })
        .then(function(res) {
          var data = res.data || {}
          var subjects = data.subjects || []
          self.setData({ 
            subjects: subjects,
            selectedMajor: data.major ? Object.assign({}, self.data.selectedMajor, {
              name: data.major.name,
              code: data.major.code,
              degree: data.major.degree
            }) : self.data.selectedMajor,
            selectedSchool: data.school ? Object.assign({}, self.data.selectedSchool, {
              name: data.school.name,
              rank: data.school.rank
            }) : self.data.selectedSchool,
            selectedInstitute: data.institute ? Object.assign({}, self.data.selectedInstitute, {
              name: data.institute.name
            }) : self.data.selectedInstitute
          })
        })
        .catch(function(err) {
          console.error('加载考试科目失败', err)
          // 使用默认科目
          self.setData({ subjects: [] })
        })
        .finally(function() {
          self.setData({ loading: false })
        })
    } else {
      // 没有方向时，清空科目
      self.setData({ subjects: [], loading: false })
    }
  },

  // 确认目标
  confirmTarget: function() {
    var self = this
    var data = {
      school_id: self.data.selectedSchool.id,
      institute_id: self.data.selectedInstitute.id,
      major_id: self.data.selectedMajor.id,
      direction_id: self.data.selectedDirection ? self.data.selectedDirection.id : null
    }
    
    wx.showLoading({ title: '保存中...' })
    
    saveTarget(data)
      .then(function(res) {
        var targetData = res.data || {}
        
        // 保存到本地存储
        var target = {
          school: targetData.school || self.data.selectedSchool,
          institute: targetData.institute || self.data.selectedInstitute,
          major: targetData.major || self.data.selectedMajor,
          direction: targetData.direction || self.data.selectedDirection,
          subjects: targetData.subjects || self.data.subjects,
          savedData: targetData
        }
        wx.setStorageSync('userTarget', target)
        
        wx.showToast({ title: '目标已确认', icon: 'success' })
        
        // 跳转到首页
        setTimeout(function() {
          wx.switchTab({ url: '/pages/home/index' })
        }, 1500)
      })
      .catch(function(err) {
        console.error('保存失败', err)
        wx.showToast({ title: '保存失败', icon: 'none' })
      })
      .finally(function() {
        wx.hideLoading()
      })
  }
})
