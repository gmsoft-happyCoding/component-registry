# component-registry

##组件注册中心, 提供组件预览和查询api

##### 如果服务器没有安装node, 请先安装node

```
# 安装 nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash

# 通过 nvm 安装 node
# "node" is an alias for the latest version
nvm install node 

# 如果提示 nvm 命令找不到
# 执行
command -v nvm
# 重启 终端再试


2. 如果 yarn 未安装, 请先安装 yarn
# 先执行
curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo

# 再执行
sudo yum install yarn
## 或 ##
sudo dnf install yarn
```


--------------

##### 下载 component-registry 源码 
   
```
# 在 /opt 目录中执行以下代码
git clone https://github.com/gmsoft-happyCoding/component-registry.git

# 更新代码, 在 /opt/component-registry 目录中执行一下代码
git pull
```


##### 下载 component-registry 源码 
```
cd component-registry
```

##### 安装依赖
```
yarn
```


##### 安装AliNode Runtime
```
# 如果 nodeinstall 已经全局安装过, 可跳过
npm i nodeinstall -g

# 在项目中安装 alinode
# 注意:不支持windows, alinode没有windows版本
nodeinstall --install-alinode ^3
```


##### 注册阿里云性能平台(免费), 用于应用的监控报警
```
https://www.aliyun.com/product/nodejs

# component-registry\config\config.default.js
config.alinode = {
   // 从 `Node.js 性能平台` 获取对应的接入参数
   appid: '@appid@',
   secret: '@secret@',
};
```

##### 修改参数 componentsRoot, 设置为 components 发布的根目录, 例如: /opt/components
```
# component-registry\config\config.default.js
const userConfig = {
   componentsRoot: '@componentsRoot@'
};
```


##### 启动服务器
```
# 在项目根目录执行
# 默认启动端口为7001, 如需修改请修改 package.json 中的 start 命令
yarn start


# 关闭服务器
yarn stop
```

##### nginx 配置
```
server {
   listen 80;
   listen 443 ssl http2;
   server_name  registry.demo.com;

   proxy_set_header X-Forwarded-For   $remote_addr;
   proxy_set_header X-Forwarded-Proto $scheme;
   proxy_set_header X-Forwarded-Host  $host:$server_port;
 
   root /opt/components;
   index index.html;
   access_log    /var/log/nginx/registry.gmsofttest.log main;
    
   location / {
       proxy_pass http://localhost:7001;
       expires -1;
   }

   location ~ /public/ {
      proxy_pass http://localhost:7001;
   }

   location /favicon.ico {
       proxy_pass http://localhost:7001;
   }

   location ~ /(.*)/doc {
      index  index.html index.htm;
      try_files $uri /$1/doc/index.html =404;
   }
  
   location ~ /swagger-(.*) {
      proxy_pass http://localhost:7001;
   }
   
   location ~* \.(ico|jpg|jpeg|gif|png|swf|js|js\.map|css|css\.map|tpl|bmp|avi|mp4|eot|woff|ttf|svg)$ {
      include ./hosts/include/cors_all.conf.part;
      expires            max;#静态资源让浏览器缓存
   }
}
```
