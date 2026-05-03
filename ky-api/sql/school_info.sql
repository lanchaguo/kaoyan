-- ============================================
-- 院校信息模块数据库表
-- 执行方式: mysql -h 101.43.125.38 -P 3306 -u xyl -p xyl < sql/school_info.sql
-- ============================================

-- 1. 省市表
CREATE TABLE IF NOT EXISTS ky_province (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '省市ID',
  name VARCHAR(50) NOT NULL COMMENT '省市名称',
  code VARCHAR(10) NOT NULL COMMENT '省市代码(GB/T 2260)',
  year INT NOT NULL DEFAULT 2026 COMMENT '数据年份',
  sort INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_code_year (code, year),
  KEY idx_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='省市表';

-- 2. 学校表(v2)
CREATE TABLE IF NOT EXISTS ky_school (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '学校ID',
  province_code VARCHAR(10) NOT NULL COMMENT '省市代码',
  name VARCHAR(100) NOT NULL COMMENT '学校名称',
  code VARCHAR(20) NOT NULL COMMENT '学校代码',
  year INT NOT NULL DEFAULT 2026 COMMENT '数据年份',
  sort INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_code_year (code, year),
  KEY idx_province_code (province_code),
  KEY idx_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学校表';

-- 3. 学院表
CREATE TABLE IF NOT EXISTS ky_college (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '学院ID',
  school_id INT UNSIGNED NOT NULL COMMENT '学校ID',
  name VARCHAR(100) NOT NULL COMMENT '学院名称',
  code VARCHAR(20) NOT NULL COMMENT '学院代码',
  year INT NOT NULL DEFAULT 2026 COMMENT '数据年份',
  sort INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_school_code_year (school_id, code, year),
  KEY idx_school (school_id),
  KEY idx_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学院表';

-- 4. 专业表
CREATE TABLE IF NOT EXISTS ky_major (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '专业ID',
  college_id INT UNSIGNED NOT NULL COMMENT '学院ID',
  name VARCHAR(100) NOT NULL COMMENT '专业名称',
  code VARCHAR(20) NOT NULL COMMENT '专业代码',
  year INT NOT NULL DEFAULT 2026 COMMENT '数据年份',
  sort INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_college_code_year (college_id, code, year),
  KEY idx_college (college_id),
  KEY idx_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='专业表';

-- 5. 研究方向表
CREATE TABLE IF NOT EXISTS ky_direction (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '方向ID',
  major_id INT UNSIGNED NOT NULL COMMENT '专业ID',
  name VARCHAR(200) NOT NULL COMMENT '研究方向名称',
  code VARCHAR(20) NOT NULL COMMENT '方向代码',
  year INT NOT NULL DEFAULT 2026 COMMENT '数据年份',
  sort INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态 1启用 0禁用',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_major_code_year (major_id, code, year),
  KEY idx_major (major_id),
  KEY idx_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='研究方向表';

-- 6. 考试科目表
CREATE TABLE IF NOT EXISTS ky_exam_subject (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '科目ID',
  direction_id INT UNSIGNED NOT NULL COMMENT '方向ID',
  subject_order TINYINT NOT NULL COMMENT '科目序号(1-4)',
  subject_name VARCHAR(100) NOT NULL COMMENT '科目名称',
  subject_code VARCHAR(20) NOT NULL COMMENT '科目代码',
  year INT NOT NULL DEFAULT 2026 COMMENT '数据年份',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_direction_order_year (direction_id, subject_order, year),
  KEY idx_direction (direction_id),
  KEY idx_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='考试科目表';

SELECT 'School Info tables created successfully!' AS result;
