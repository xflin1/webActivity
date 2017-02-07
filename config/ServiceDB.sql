DROP DATABASE IF EXISTS `service`;
CREATE DATABASE `service`;

use `service`;

-- ----------------------------
-- Table structure for `User`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL COMMENT 'xxx@server.ip',
  `nickname` varchar(48) DEFAULT NULL,
  `pass` varchar(128) NOT NULL COMMENT 'MD5',
  `online` smallint(6) NOT NULL DEFAULT '0' COMMENT 'ws是否在线 0--不在线，其他值--在线，默认不在线',
  `sex` smallint NOT NULL default 0 COMMENT '0---男 1---女',
  `role` varchar(32) NOT NULL DEFAULT 'ROLE_USER' COMMENT 'ROLE_ADMIN|ROLE_USER',
  `weixin` varchar(64) NULL,
  `qq` varchar(32) NULL COMMENT 'QQ号码',
  `email` varchar(64) NULL COMMENT '邮箱地址',
  `phone` varchar(20) NULL COMMENT '电话号码',
  `photoId` int(10) NULL COMMENT '照片id = uploadFile.id',
  `tslogin` int(10) NULL DEFAULT 0 COMMENT '上次登录时间',
  `tslogout` int(10) NULL DEFAULT 0 COMMENT '登出时间',
  `extattrs` text NULL COMMENT '其他信息{"attrs":[{"name":"华工信元","value":"测试样例"},{"name":"华奥科技","value":"广州"},{"name":"msg","value":"1234567234"},...]}',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
INSERT INTO `user` VALUES (1,'admin', 'admin', 'admin1234', 0,0, 'ROLE_ADMIN', '', '', '', '', 0, 0, 0, '');
INSERT INTO `user` VALUES (2,'cellcom', 'cellcom', 'cellcom1234',0, 0, 'ROLE_ADMIN','', '', '', '', 0, 0, 0, '');
INSERT INTO `user` VALUES (3,'huao', 'huao', 'huao1234',0, 0, 'ROLE_ADMIN','', '', '', '', 0, 0, 0, '');

-- ----------------------------
-- Table structure for `group`
-- ----------------------------
DROP TABLE IF EXISTS `group`;
CREATE TABLE `group` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `parentId` int(10) NOT NULL DEFAULT 1,
  `name` varchar(64) NULL,
  `limits` int(10) NOT NULL DEFAULT 1000,
  `sequence` int(4) NOT NULL DEFAULT 1 COMMENT '排列顺序 1 \\2 \\3\\...',
  `depth` int(4) NOT NULL DEFAULT 2 COMMENT '层级深度1 \\2 \\3\\...',
  `uid` int NULL COMMENT '创建者或群管理者',
  `type` int(4) NOT NULL DEFAULT 0 COMMENT '群类型，0:public 1:private',
  `tsStart` int(10) NOT NULL DEFAULT 0 COMMENT '有效开始时间，0表示无限制',
  `tsEnd` int(10) NOT NULL DEFAULT 0 COMMENT '有效结束时间，0表示无限制',
  `ts` int(10) NULL DEFAULT 0 COMMENT '创建时间',
  `msgAttrs` text DEFAULT NULL COMMENT '具体信息{"attrs":[{name:'',value:''},...]}',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
INSERT INTO `group` VALUES (1,0,'root', 100000,1,1,1,0,0,0,unix_timestamp(now()),null);
INSERT INTO `group` VALUES (2,1,'cellcom',10000,1,2,2,1,0,0,unix_timestamp(now()),null);
INSERT INTO `group` VALUES (3,1,'huao',10000,1,2,3,1,0,0,unix_timestamp(now()),null);


-- ----------------------------
-- Table structure for vendor`
-- ----------------------------
DROP TABLE IF EXISTS `vendor`;
CREATE TABLE `vendor` (
  `parentId` int(10) NOT NULL DEFAULT 1,
  `id` int(10) NOT NULL COMMENT '记录id',
  `name` varchar(64) NOT NULL COMMENT '厂商/公司/快餐店名称',
  `st` int(10) NOT NULL COMMENT '=serviceType.id',
  `vc` int(10) NOT NULL COMMENT '审核流程工单id,若=0表明公司数据合法,否则=vendorCheck.id，表明审核工单id值',
  `logo` int(10) NULL COMMENT 'LOGO图像 =uploadFile.id',
  `mobile` varchar(24) NULL COMMENT '厂商/公司/快餐店联系手机号码',
  `phone` varchar(24) NULL COMMENT '厂商/公司/快餐店联系固定号码',
  `address` varchar(255) NULL COMMENT '厂商/公司/快餐店地址',
  `remark` varchar(255) NULL COMMENT '厂商/公司/快餐店简单说明',
  `uid` int(10) DEFAULT 0 COMMENT '厂商/公司/快餐店管理账号uid = user.id，创建者',
  `ts` int(10) DEFAULT 0 COMMENT '录入时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO `vendor` VALUES (0,1,'root', 1,0,1,'','02087111933','五山华工朱江西路综合楼二楼','广州华工信元通信技术有限公司',1,unix_timestamp(now()));
INSERT INTO `vendor` VALUES (1,2,'华南理工大学', 1,0,1,'','02087111933','五山路','学校',1,unix_timestamp(now()));

-- ----------------------------
-- Table structure for vendor`
-- 公司信息审核流程工单记录
-- ----------------------------
DROP TABLE IF EXISTS `vendorCheck`;
CREATE TABLE `vendorCheck` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '检查流程工单id',
  `vid` int(10) NOT NULL COMMENT 'vendor.id',
  `bl` int(10) NULL COMMENT 'Business License工商执照文件id =uploadFile.id',
  `extattrs` text NULL COMMENT '其他信息{"attrs":[{"name":"卫生许可证","value":fid},{"name":"健康证","value":fid},...]}',
  `uid` int(10) NULL COMMENT '审核者id = user.id',
  `result` varchar(255) NOT NULL DEFAULT 'checking' COMMENT '后台审核结果，取值：checking审核中|passed审核通过|审核失败及原因',
  `updatetime` int(10) DEFAULT 0 COMMENT '更新时间',
  `ts` int(10) DEFAULT 0 COMMENT '录入时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `usergroup` 群组用户
-- default every user in 'root' group
-- ----------------------------
DROP TABLE IF EXISTS `usergroup`;
CREATE TABLE `usergroup` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `gid` int(10) NOT NULL COMMENT '=group.id',
  `uid` int(10) NOT NULL COMMENT '=user.id',
  `role` varchar(32) NOT NULL DEFAULT 'ROLE_USER' COMMENT 'ROLE_ADMIN|ROLE_USER group数据管理员|vendor用户',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_usergroup` (`gid`,`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for `uservendor` 公司用户
-- default every user in 'root' group
-- ----------------------------
DROP TABLE IF EXISTS `uservendor`;
CREATE TABLE `uservendor` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `vid` int(10) NOT NULL COMMENT '=vendor.id',
  `uid` int(10) NOT NULL COMMENT '=user.id',
  `role` varchar(32) NOT NULL DEFAULT 'ROLE_USER' COMMENT 'ROLE_ADMIN|ROLE_USER vendor数据管理员|vendor用户',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_uservendor` (`vid`,`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for serviceAction`
-- ----------------------------
DROP TABLE IF EXISTS `serviceAction`;
CREATE TABLE `serviceAction` (
  `name` varchar(48) NOT NULL COMMENT 'action名称 Register|Deliver|Pay',
  `remark` varchar(255) NULL COMMENT 'action说明',
  `uid` int(10) DEFAULT 0 COMMENT '录入者= user.id，必须管理员身份才可操作',
  `ts` int(10) DEFAULT 0 COMMENT '录入时间',
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO `serviceAction` VALUES ('Register','申请登记',1,unix_timestamp(now()));

-- ----------------------------
-- Table structure for serviceType`
-- ----------------------------
DROP TABLE IF EXISTS `serviceType`;
CREATE TABLE `serviceType` (
  `id` int(10) NOT NULL AUTO_INCREMENT  COMMENT '记录id',
  `name` varchar(48) NOT NULL COMMENT '类型名称 food|job',
  `actions` varchar(255) NULL COMMENT '功能操作 如[register,deliver,pay,bill]表示登记/支付/账单功能 serviceAction.name',
  `remark` varchar(255) NULL COMMENT '类型说明',
  `uid` int(10) DEFAULT 0 COMMENT '录入者uid = user.id，必须管理员身份才可操作',
  `ts` int(10) DEFAULT 0 COMMENT '录入时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for serviceData`
-- 数据录入后，需发送微信通知消息给企业号所有用户，有新业务数据通知
-- ----------------------------
DROP TABLE IF EXISTS `serviceData`;
CREATE TABLE `serviceData` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `st` int(10) NOT NULL COMMENT '=serviceType.id',
  `name` varchar(64) NULL COMMENT '记录显示标题',
  `description` varchar(255) DEFAULT NULL COMMENT '简介',
  `content` text NOT NULL COMMENT '内容',
  `image` int(10) NULL COMMENT '图片 =uploadFile.id',
  `msgAttrs` text DEFAULT NULL COMMENT '具体信息{"attrs":[{name:'',value:''},...],limits:100}',
  `uid` int NOT NULL COMMENT '数据录入者=user.id',
  `vid` int NOT NULL DEFAULT 0 COMMENT '=vendor.id uid所属公司vendor',
  `ts` int(10) NULL DEFAULT 0 COMMENT '数据录入时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for `serviceResult`
-- 业务登记操作结果表
--  PRIMARY KEY (`id`),
-- ----------------------------
DROP TABLE IF EXISTS `serviceResult`;
CREATE TABLE `serviceResult` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `sd` int NOT NULL COMMENT '=serviceData.id服务id',
  `uid` int NOT NULL COMMENT '服务订购者=user.id',
  `errcode` int NOT NULL DEFAULT 0 COMMENT '业务执行结果 0--成功 其他值---失败',
  `status` int NOT NULL DEFAULT 0 COMMENT '业务状态,-1--完成,其他为执行actions状态',
  `msgAttrs` text DEFAULT NULL COMMENT '具体信息{"message":失败原因,...}',
  `ts` int(10) NULL DEFAULT 0 COMMENT '订购时间',
  PRIMARY KEY (`id`),
  KEY `idx_serviceResult` (`sd`,`uid`,`ts`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `uploadFile`
-- ----------------------------
DROP TABLE IF EXISTS `uploadFile`;
CREATE TABLE `uploadFile` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '记录id',
  `fid` varchar(64) NOT NULL COMMENT '文件名',
  `path` varchar(64) NULL COMMENT '存储路径',
  `type` varchar(48) NULL COMMENT '文件类型，如image/jpeg',
  `name` varchar(48) NULL COMMENT '文件原名，如test.jpg',
  `fsize` int(10) NULL COMMENT '文件大小bytes',
  `fspace` int(10) NULL COMMENT '文件剩余大小bytes，初始值=size',
  `uid` int(10) DEFAULT 0 COMMENT '上传者id = user.id',
  `hits` int(8) unsigned DEFAULT '0' COMMENT '下载次数',
  `ts` int(10) DEFAULT '0' COMMENT '上传时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_fid` (`fid`(32))
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table structure for group offline chat message`
-- ----------------------------
DROP TABLE IF EXISTS `gOfflineMsg`;
CREATE TABLE `gOfflineMsg` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '记录id',
  `_group` int(4) DEFAULT '0' COMMENT '是否是群消息：0 -- 否 1--是',
  `_packType` int(4) DEFAULT '0' COMMENT '消息类型 0 -- route 1--text 2--file',
  `_from` int(10) DEFAULT 0 COMMENT '发送者sid或uid',
  `_to` int(10) DEFAULT 0 COMMENT '若group=1,则为gid=userGroup.id;否则为接收者uid,uid上线后需将uid的sid赋值到to',
  `_seq` int(10) DEFAULT 0 COMMENT '序列号',
  `_payload` text DEFAULT NULL COMMENT '消息体{}',
  `_ts` int(10) DEFAULT 0 COMMENT '消息时间',
  PRIMARY KEY (`id`),
  KEY `idx_ts_to` (`_ts`,`_to`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user offline chat message`
-- ----------------------------
DROP TABLE IF EXISTS `uOfflineMsg`;
CREATE TABLE `uOfflineMsg` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '记录id',
  `_group` int(4) DEFAULT '0' COMMENT '是否是群消息：0 -- 否 1--是',
  `_packType` int(4) DEFAULT '0' COMMENT '消息类型 0 -- route 1--text 2--file',
  `_from` int(10) DEFAULT 0 COMMENT '发送者sid或uid',
  `_to` int(10) DEFAULT 0 COMMENT '若group=1,则为gid=userGroup.id;否则为接收者uid,uid上线后需将uid的sid赋值到to',
  `_seq` int(10) DEFAULT 0 COMMENT '序列号',
  `_payload` text DEFAULT NULL COMMENT '消息体{}',
  `_ts` int(10) DEFAULT '0' COMMENT '消息时间',
  PRIMARY KEY (`id`),
  KEY `idx_ts_to_from` (`_ts`,`_to`,`_from`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Procedure structure for `sp_stat_gOfflineMsg`
-- ----------------------------
DROP PROCEDURE IF EXISTS `sp_stat_gOfflineMsg`;
DELIMITER ;;
CREATE PROCEDURE `sp_stat_gOfflineMsg`(
IN `gids` varchar(255),
IN `s` int(10),
IN `e` int(10)
)
BEGIN
set @sql1 = 'select t._to,count(t.id) as count from gOfflineMsg t where t._ts>=';
set @s = `s`;
set @sql2 = ' and t._ts<';
set @e = `e`;
set @sql3 = ' and t._to in (';
set @gids = `gids`;
set @sql4 = ') group by t._to';
set @sql = concat(@sql1,@s,@sql2,@e,@sql3,@gids,@sql4);

prepare stmt from @sql; -- 预编释一下。 “stmt”预编释变量的名称，
execute stmt; -- 执行SQL语句
deallocate prepare stmt; -- 释放资源

END
;;
DELIMITER ;


-- ----------------------------
-- Procedure structure for `sp_stat_uOfflineMsg`
-- ----------------------------
DROP PROCEDURE IF EXISTS `sp_stat_uOfflineMsg`;
DELIMITER ;;
CREATE PROCEDURE `sp_stat_uOfflineMsg`(
IN `uid` int(10),
IN `s` int(10),
IN `e` int(10)
)
BEGIN
set @sql1 = 'select t._from,count(t.id) as count from uOfflineMsg t where t._ts>=';
set @s = `s`;
set @sql2 = ' and t._ts<';
set @e = `e`;
set @sql3 = ' and t._to=';
set @uid = `uid`;
set @sql4 = ' group by t._from';
set @sql = concat(@sql1,@s,@sql2,@e,@sql3,@uid,@sql4);

prepare stmt from @sql; -- 预编释一下。 “stmt”预编释变量的名称，
execute stmt; -- 执行SQL语句
deallocate prepare stmt; -- 释放资源

END
;;
DELIMITER ;

-- ----------------------------
-- Procedure structure for `sp_stat_offlinemsg`
-- ----------------------------
DROP PROCEDURE IF EXISTS `sp_stat_offlineMsg`;
DELIMITER ;;
CREATE PROCEDURE `sp_stat_offlineMsg`(IN `uid` int(10),
IN `groupid` varchar(640),
IN `s` int(10),
IN `e` int(10)
)
BEGIN
CALL `sp_stat_gOfflineMsg`(`groupid`,`s`,`e`);
CALL `sp_stat_uOfflineMsg`(`uid`,`s`,`e`);

END
;;
DELIMITER ;
