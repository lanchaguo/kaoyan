Page({
  data: {
    userInfo: {
      avatar: 'https://picsum.photos/200/200?random=10',
      nickname: '考研学子',
      school: '北京大学',
      major: '计算机科学与技术'
    },
    menuList: [
      { id: 1, icon: '📝', title: '我的订单', arrow: true },
      { id: 2, icon: '⭐', title: '我的收藏', arrow: true },
      { id: 3, icon: '📚', title: '学习记录', arrow: true },
      { id: 4, icon: '⚙️', title: '设置', arrow: true },
      { id: 5, icon: '❓', title: '帮助反馈', arrow: true }
    ],
    stats: [
      { label: '学习天数', value: '126' },
      { label: '累计学习', value: '89h' },
      { label: '完成课程', value: '42' },
      { label: '获得积分', value: '2680' }
    ]
  },

  onLoad() {
    console.log('个人中心加载')
  }
})
