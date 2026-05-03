-- ============================================
-- 院校专业管理模块
-- ============================================

-- 1. 学校表
CREATE TABLE IF NOT EXISTS ky_school (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '学校ID',
  name VARCHAR(100) NOT NULL COMMENT '学校名称',
  code VARCHAR(20) NOT NULL COMMENT '学校代码',
  logo VARCHAR(255) DEFAULT '' COMMENT '校徽URL',
  province VARCHAR(50) DEFAULT '' COMMENT '所在省份',
  city VARCHAR(50) DEFAULT '' COMMENT '所在城市',
  `rank` VARCHAR(20) DEFAULT '' COMMENT '院校层次 985/211/双一流/普通',
  is_top TINYINT DEFAULT 0 COMMENT '是否热门',
  sort INT DEFAULT 0 COMMENT '排序',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_code (code),
  KEY idx_rank (`rank`),
  KEY idx_province (province)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学校表';

-- 2. 学院表
CREATE TABLE IF NOT EXISTS ky_institute (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '学院ID',
  school_id INT UNSIGNED NOT NULL COMMENT '学校ID',
  name VARCHAR(100) NOT NULL COMMENT '学院名称',
  code VARCHAR(20) NOT NULL COMMENT '学院代码',
  sort INT DEFAULT 0 COMMENT '排序',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_school (school_id),
  UNIQUE KEY uk_sc_code (school_id, code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学院表';

-- 3. 专业表
CREATE TABLE IF NOT EXISTS ky_major (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '专业ID',
  institute_id INT UNSIGNED NOT NULL COMMENT '学院ID',
  code VARCHAR(20) NOT NULL COMMENT '专业代码',
  name VARCHAR(100) NOT NULL COMMENT '专业名称',
  degree VARCHAR(10) DEFAULT '学术型' COMMENT '学位类型 学术型/专业型',
  study_mode VARCHAR(20) DEFAULT '全日制' COMMENT '学习方式 全日制/非全日制',
  is_allow_cross TINYINT DEFAULT 1 COMMENT '是否允许跨考',
  enrollment_count INT DEFAULT 0 COMMENT '招生人数',
  exam_subject_codes VARCHAR(200) DEFAULT '' COMMENT '考试科目代码(逗号分隔)',
  sort INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_institute (institute_id),
  KEY idx_degree (degree),
  KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='专业表';

-- 4. 专业-科目关联表
CREATE TABLE IF NOT EXISTS ky_major_subject (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
  major_id INT UNSIGNED NOT NULL COMMENT '专业ID',
  subject_id INT UNSIGNED NOT NULL COMMENT '学科ID',
  exam_order INT DEFAULT 1 COMMENT '考试顺序(1/2/3/4)',
  is_mandatory TINYINT DEFAULT 1 COMMENT '是否必考 1是 0否',
  score_range VARCHAR(50) DEFAULT '' COMMENT '分值范围',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_ms (major_id, subject_id),
  KEY idx_major (major_id),
  KEY idx_subject (subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='专业科目关联表';

-- 5. 用户目标表
CREATE TABLE IF NOT EXISTS ky_user_target (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID',
  user_id INT UNSIGNED NOT NULL COMMENT '用户ID',
  school_id INT UNSIGNED NOT NULL COMMENT '目标学校ID',
  institute_id INT UNSIGNED NOT NULL COMMENT '目标学院ID',
  major_id INT UNSIGNED NOT NULL COMMENT '目标专业ID',
  status TINYINT DEFAULT 1 COMMENT '状态 1当前 0历史',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user (user_id, status),
  KEY idx_user_status (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户目标表';
