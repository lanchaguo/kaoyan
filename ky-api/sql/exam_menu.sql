-- ============================================
-- 刷题管理菜单数据
-- ============================================

-- 刷题管理一级菜单
INSERT IGNORE INTO sys_menu (id, parent_id, menu_name, menu_type, path, component, perms, icon, sort, visible, status) VALUES
(50, 0, '刷题管理', 'M', '/exam', NULL, NULL, 'Document', 2, 1, 1);

-- 学科管理
INSERT IGNORE INTO sys_menu (id, parent_id, menu_name, menu_type, path, component, perms, icon, sort, visible, status) VALUES
(51, 50, '学科管理', 'C', 'subject', 'exam/subject/index', 'exam:subject:list', 'Collection', 1, 1, 1);

-- 题型管理
INSERT IGNORE INTO sys_menu (id, parent_id, menu_name, menu_type, path, component, perms, icon, sort, visible, status) VALUES
(52, 50, '题型管理', 'C', 'type', 'exam/type/index', 'exam:type:list', 'Grid', 2, 1, 1);

-- 知识点管理
INSERT IGNORE INTO sys_menu (id, parent_id, menu_name, menu_type, path, component, perms, icon, sort, visible, status) VALUES
(53, 50, '知识点管理', 'C', 'knowledge', 'exam/knowledge/index', 'exam:knowledge:list', 'Tickets', 3, 1, 1);

-- 题目管理
INSERT IGNORE INTO sys_menu (id, parent_id, menu_name, menu_type, path, component, perms, icon, sort, visible, status) VALUES
(54, 50, '题目管理', 'C', 'question', 'exam/question/index', 'exam:question:list', 'Reading', 4, 1, 1);

-- 试卷管理
INSERT IGNORE INTO sys_menu (id, parent_id, menu_name, menu_type, path, component, perms, icon, sort, visible, status) VALUES
(55, 50, '试卷管理', 'C', 'paper', 'exam/paper/index', 'exam:paper:list', 'Collection', 5, 1, 1);

-- 错题本
INSERT IGNORE INTO sys_menu (id, parent_id, menu_name, menu_type, path, component, perms, icon, sort, visible, status) VALUES
(56, 50, '错题本', 'C', 'wrong', 'exam/wrong/index', 'exam:wrong:list', 'WarningFilled', 6, 1, 1);

-- 做题记录
INSERT IGNORE INTO sys_menu (id, parent_id, menu_name, menu_type, path, component, perms, icon, sort, visible, status) VALUES
(57, 50, '做题记录', 'C', 'record', 'exam/record/index', 'exam:record:list', 'Clock', 7, 1, 1);

-- 给超级管理员角色分配刷题菜单权限
INSERT IGNORE INTO sys_role_menu (role_id, menu_id) VALUES
(1, 50), (1, 51), (1, 52), (1, 53), (1, 54), (1, 55), (1, 56), (1, 57);
