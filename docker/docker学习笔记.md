## 启动vagrant
vagrant up

## 进入vagrant虚拟机
vagrant ssh

## 退出vagrant虚拟机
vagrant halt

## vagrant添添加的镜像root密码默认未设定，使用如下命令设置
sudo passwd root

## 开启docker服务
su root # 先切换到root用户, 再执行以下命令
systemctl enable docker # 开机自动启动docker

systemctl start docker # 启动docker
systemctl restart docker # 重启dokcer

## 不使用sudo去执行docker命令
sudo groupadd docker # 新增docker组（一般已经存在了）
sudo gpasswd -a vagrant docker # 将vagrant用户加到docker组中
systemctl restart docker # 重启dokcer
exit # 退出终端

## 查看docker镜像
docker image ls

## 从远端库拉取docker镜像（hello-wrold）
docker pull hello-wrold

## 构建镜像
docker build -t lijian/hello-world . # 构建tag名为lijian/hello-world的镜像，从当前目录 . 找到Dockerfile

## 查看docker容器
docker container ls # 当前正在运行的容器
docker container ls -a # 所有的容器

## 执行docker镜像，生成容器
docker run hello-world

## 交互式运行容器
docker run -it centos

## 一些docker命令
docker #查看文档
docker ps -a #查看容器的简写
docker container rm ${id} #删除容器
docker rm ${id} #删除容器的简写
docker images #查看镜像简写
docker image rm ${id}  #删除镜像
docker rmi ${id}  #删除镜像简写
docker container ls -aq #列出所有的docker容器id

## 批量删除容器
docker rm $(docker container ls -aq)

