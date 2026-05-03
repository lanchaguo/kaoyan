-- ============================================
-- 考研刷题模块数据库设计
-- 设计原则：题目与题型分离、知识点树形、可扩展
-- ============================================

-- 1. 学科表
CREATE TABLE IF NOT EXISTS ky_subject (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '学科ID',
  name VARCHAR(50) NOT NULL COMMENT '学科名称',
  code VARCHAR(30) NOT NULL COMMENT '学科代码',
  icon VARCHAR(100) DEFAULT '' COMMENT '图标',
  color VARCHAR(20) DEFAULT '#409EFF' COMMENT '主题色',
  sort INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学科表';

-- 2. 题型表
CREATE TABLE IF NOT EXISTS ky_question_type (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '题型ID',
  name VARCHAR(30) NOT NULL COMMENT '题型名称',
  code VARCHAR(20) NOT NULL COMMENT '题型代码',
  has_option TINYINT DEFAULT 0 COMMENT '是否有选项（选择题有）',
  has_multi_answer TINYINT DEFAULT 0 COMMENT '是否多答案',
  default_score DECIMAL(5,2) DEFAULT 2.00 COMMENT '默认分值',
  sort INT DEFAULT 0 COMMENT '排序',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题型表';

-- 3. 难度等级表
CREATE TABLE IF NOT EXISTS ky_difficulty (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '难度ID',
  name VARCHAR(20) NOT NULL COMMENT '难度名称',
  code VARCHAR(20) NOT NULL COMMENT '难度代码',
  score_ratio DECIMAL(3,2) DEFAULT 1.00 COMMENT '分值系数',
  color VARCHAR(20) DEFAULT '#67c23a' COMMENT '颜色标识',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='难度等级表';

-- 4. 知识点表（树形）
CREATE TABLE IF NOT EXISTS ky_knowledge_point (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '知识点ID',
  subject_id INT UNSIGNED NOT NULL COMMENT '学科ID',
  parent_id INT UNSIGNED DEFAULT 0 COMMENT '父级ID',
  name VARCHAR(100) NOT NULL COMMENT '知识点名称',
  sort INT DEFAULT 0 COMMENT '排序',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_subject (subject_id),
  KEY idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='知识点表';

-- 5. 题目表（核心）
CREATE TABLE IF NOT EXISTS ky_question (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '题目ID',
  subject_id INT UNSIGNED NOT NULL COMMENT '学科ID',
  type_id INT UNSIGNED NOT NULL COMMENT '题型ID',
  difficulty_id INT UNSIGNED DEFAULT 1 COMMENT '难度ID',
  stem TEXT NOT NULL COMMENT '题干',
  analysis TEXT COMMENT '解析',
  answer TEXT COMMENT '参考答案（简答/填空/分析/作文等）',
  score DECIMAL(5,2) DEFAULT 2.00 COMMENT '分值',
  year INT DEFAULT 0 COMMENT '年份',
  source VARCHAR(100) DEFAULT '' COMMENT '来源/出处',
  is_official TINYINT DEFAULT 1 COMMENT '是否真题 1是 0否',
  exam_session VARCHAR(10) DEFAULT '初试' COMMENT '考试阶段 初试/复试',
  frequency INT DEFAULT 0 COMMENT '出现频次',
  correct_rate DECIMAL(5,2) DEFAULT 0 COMMENT '正确率',
  status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_subject (subject_id),
  KEY idx_type (type_id),
  KEY idx_difficulty (difficulty_id),
  KEY idx_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题目表';

-- 6. 题目选项表（仅选择题用）
CREATE TABLE IF NOT EXISTS ky_question_option (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '选项ID',
  question_id INT UNSIGNED NOT NULL COMMENT '题目ID',
  option_key VARCHAR(5) NOT NULL COMMENT '选项标识 A/B/C/D',
  option_value TEXT NOT NULL COMMENT '选项内容',
  is_correct TINYINT DEFAULT 0 COMMENT '是否正确答案',
  sort INT DEFAULT 0 COMMENT '排序',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_question (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题目选项表';

-- 7. 题目-知识点关联表
CREATE TABLE IF NOT EXISTS ky_question_knowledge (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
  question_id INT UNSIGNED NOT NULL COMMENT '题目ID',
  knowledge_id INT UNSIGNED NOT NULL COMMENT '知识点ID',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_question (question_id),
  KEY idx_knowledge (knowledge_id),
  UNIQUE KEY uk_qk (question_id, knowledge_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题目知识点关联表';

-- 8. 试卷表
CREATE TABLE IF NOT EXISTS ky_paper (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '试卷ID',
  subject_id INT UNSIGNED NOT NULL COMMENT '学科ID',
  name VARCHAR(200) NOT NULL COMMENT '试卷名称',
  year INT DEFAULT 0 COMMENT '年份',
  session VARCHAR(10) DEFAULT '初试' COMMENT '初试/复试',
  total_score DECIMAL(5,2) DEFAULT 100.00 COMMENT '总分',
  total_time INT DEFAULT 180 COMMENT '时长(分钟)',
  difficulty_id INT UNSIGNED DEFAULT 1 COMMENT '难度ID',
  description TEXT COMMENT '说明',
  status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_subject (subject_id),
  KEY idx_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='试卷表';

-- 9. 试卷题目关联表
CREATE TABLE IF NOT EXISTS ky_paper_question (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
  paper_id INT UNSIGNED NOT NULL COMMENT '试卷ID',
  question_id INT UNSIGNED NOT NULL COMMENT '题目ID',
  sort_num INT DEFAULT 0 COMMENT '题号',
  score DECIMAL(5,2) DEFAULT 2.00 COMMENT '本题分值',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_paper (paper_id),
  KEY idx_question (question_id),
  UNIQUE KEY uk_pq (paper_id, question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='试卷题目关联表';

-- 10. 题目收藏表
CREATE TABLE IF NOT EXISTS ky_collection (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
  question_id INT UNSIGNED NOT NULL COMMENT '题目ID',
  note TEXT COMMENT '笔记',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_uc (user_id, question_id),
  KEY idx_user (user_id),
  KEY idx_question (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题目收藏表';

-- 11. 用户答题记录表
CREATE TABLE IF NOT EXISTS ky_user_answer (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
  question_id INT UNSIGNED NOT NULL COMMENT '题目ID',
  answer TEXT COMMENT '用户答案',
  is_correct TINYINT DEFAULT 0 COMMENT '是否正确 1是 0否',
  score DECIMAL(5,2) DEFAULT 0 COMMENT '得分',
  time_spent INT DEFAULT 0 COMMENT '用时(秒)',
  answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY idx_user (user_id),
  KEY idx_question (question_id),
  KEY idx_answered (answered_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户答题记录表';

-- 12. 错题本表
CREATE TABLE IF NOT EXISTS ky_wrong_question (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
  question_id INT UNSIGNED NOT NULL COMMENT '题目ID',
  wrong_reason TEXT COMMENT '错误原因',
  review_count INT DEFAULT 0 COMMENT '复习次数',
  last_review_at DATETIME DEFAULT NULL COMMENT '上次复习时间',
  next_review_at DATETIME DEFAULT NULL COMMENT '下次复习时间',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_uq (user_id, question_id),
  KEY idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='错题本表';

-- 13. 做题进度表
CREATE TABLE IF NOT EXISTS ky_practice_progress (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
  subject_id INT UNSIGNED NOT NULL COMMENT '学科ID',
  type_id INT UNSIGNED DEFAULT 0 COMMENT '题型ID',
  total_count INT DEFAULT 0 COMMENT '总题数',
  done_count INT DEFAULT 0 COMMENT '已做数',
  correct_count INT DEFAULT 0 COMMENT '正确数',
  accuracy_rate DECIMAL(5,2) DEFAULT 0 COMMENT '正确率',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_us (user_id, subject_id),
  KEY idx_user (user_id),
  KEY idx_subject (subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='做题进度表';
