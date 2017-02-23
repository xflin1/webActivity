# webActivity项目部署
### 环境
* ubuntu
* mysql
* redis
* nodejs

## mysql安装
```
sudo apt-get update
sudo apt-get install mysql-server mysql-client
```

## redis 安装
```
sudo apt-get install redis-server
```

## nodejs安装
```
sudo apt-get install curl
sudo curl -sL https://deb.nodesource.com/setup_4.x | sudo bash -
sudo apt-get install nodejs
```
* 安装cnpm
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

## 获取项目
生成ssh-key(已经有可以跳过),获取~/.ssh/id_rsa.pub中的公钥,添加到gitlab中
```
ssh-keygen -C "xxxxx@xxx.com"
cd ~/.ssh
vi id_rsa.pub
```
进入一个目录clone项目
```
(git安装:sudo apt-get install git)
git clone git@gitlab.com:zhidazhang/webActivity.git
cd webActivity
git checkout dev
```
切换到dev分支,以后会合并到master分支
## 初始化配置
* 根据config.template.js初始化配置
```
cp ./config/config-template.js ./config/config.js
vi ./config/config.js
```
根据你的设置,配置mysql的用户名密码,以及其它项.

* 安装依赖包
在项目根目录
```
cnpm install
sudo cnpm install gulp -g
sudo cnpm install webpack -g
mkdir log
mkdir -p uploads/thumbnail
mkdir -p uploads/tmp
mkdir -p uploads/user
```
* 导入数据表
将config/ServiceDB.sql导入mysql.

* 编译代码
gulp 运行显示 "编译完成---------可以点击两次Ctrl+c停止" 可以停止程序
webpack 等候到完成
```
gulp
webpack -p
```
运行项目
```
node app.js
```





