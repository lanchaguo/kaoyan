-- ky-api 数据库初始化脚本
-- 数据库：xyl  字符集：utf8mb4  MySQL 8.0.36

USE xyl;

-- 菜单表
CREATE TABLE IF NOT EXISTS `sys_menu` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int unsigned NOT NULL DEFAULT '0' COMMENT '父菜单ID，0为顶级',
  `menu_name` varchar(50) NOT NULL COMMENT '菜单名称',
  `menu_type` char(1) NOT NULL DEFAULT 'M' COMMENT 'M目录 C菜单 F按钮',
  `path` varchar(200) DEFAULT NULL COMMENT '路由地址',
  `component` varchar(255) DEFAULT NULL COMMENT '组件路径',
  `perms` varchar(100) DEFAULT NULL COMMENT '权限标识',
  `icon` varchar(100) DEFAULT NULL COMMENT '菜单图标',
  `sort` int NOT NULL DEFAULT '0' COMMENT '显示顺序',
  `visible` tinyint NOT NULL DEFAULT '1' COMMENT '1显示 0隐藏',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '1正常 0禁用',
  `remark` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统菜单表';

-- 角色表
CREATE TABLE IF NOT EXISTS `sys_role` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL COMMENT '角色名称',
  `role_key` varchar(50) NOT NULL COMMENT '角色标识',
  `sort` int NOT NULL DEFAULT '0',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '1正常 0禁用',
  `remark` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_key` (`role_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统角色表';

-- 用户表
CREATE TABLE IF NOT EXISTS `sys_user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码(bcrypt)',
  `nickname` varchar(50) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '1正常 0禁用',
  `remark` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统用户表';

-- 用户角色关联表
CREATE TABLE IF NOT EXISTS `sys_user_role` (
  `user_id` int unsigned NOT NULL,
  `role_id` int unsigned NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- 角色菜单关联表
CREATE TABLE IF NOT EXISTS `sys_role_menu` (
  `role_id` int unsigned NOT NULL,
  `menu_id` int unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色菜单关联表';

-- ============================================================
-- 初始化数据
-- ============================================================

-- 初始菜单
INSERT IGNORE INTO `sys_menu` (`id`,`parent_id`,`menu_name`,`menu_type`,`path`,`component`,`perms`,`icon`,`sort`) VALUES
(1,  0, '系统管理', 'M', '/system', NULL,        NULL,               'Setting',   1),
(2,  1, '用户管理', 'C', 'user',    'system/user','system:user:list', 'User',      1),
(3,  1, '角色管理', 'C', 'role',    'system/role','system:role:list', 'UserFilled',2),
(4,  1, '菜单管理', 'C', 'menu',    'system/menu','system:menu:list', 'Menu',      3),
-- 用户管理按钮
(10, 2, '新增用户', 'F', NULL, NULL, 'system:user:add',    NULL, 1),
(11, 2, '编辑用户', 'F', NULL, NULL, 'system:user:edit',   NULL, 2),
(12, 2, '删除用户', 'F', NULL, NULL, 'system:user:delete', NULL, 3),
(13, 2, '重置密码', 'F', NULL, NULL, 'system:user:reset',  NULL, 4),
-- 角色管理按钮
(20, 3, '新增角色', 'F', NULL, NULL, 'system:role:add',    NULL, 1),
(21, 3, '编辑角色', 'F', NULL, NULL, 'system:role:edit',   NULL, 2),
(22, 3, '删除角色', 'F', NULL, NULL, 'system:role:delete', NULL, 3),
-- 菜单管理按钮
(30, 4, '新增菜单', 'F', NULL, NULL, 'system:menu:add',    NULL, 1),
(31, 4, '编辑菜单', 'F', NULL, NULL, 'system:menu:edit',   NULL, 2),
(32, 4, '删除菜单', 'F', NULL, NULL, 'system:menu:delete', NULL, 3);

-- 初始角色：超级管理员
INSERT IGNORE INTO `sys_role` (`id`,`role_name`,`role_key`,`sort`,`status`) VALUES
(1, '超级管理员', 'admin', 1, 1),
(2, '普通用户',   'user',  2, 1);

-- 超级管理员拥有全部菜单
INSERT IGNORE INTO `sys_role_menu` (`role_id`,`menu_id`) VALUES
(1,1),(1,2),(1,3),(1,4),
(1,10),(1,11),(1,12),(1,13),
(1,20),(1,21),(1,22),
(1,30),(1,31),(1,32);

-- 初始用户：admin / admin123
-- bcrypt hash of "admin123"
INSERT IGNORE INTO `sys_user` (`id`,`username`,`password`,`nickname`,`status`) VALUES
(1, 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '超级管理员', 1);

-- admin 绑定超级管理员角色
INSERT IGNORE INTO `sys_user_role` (`user_id`,`role_id`) VALUES (1,1);
