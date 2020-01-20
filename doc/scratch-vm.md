
[scratch-vm](https://github.com/LLK/scratch-vm)

[官方文档搬运](./scratch-vm/index.html)

## 主要功能

+ 侦听scratch-blocks发出的事件来构造和维护[抽象语法树](https://en.wikipedia.org/wiki/Abstract_syntax_tree)的状态。
+ 加载解析项目：解析sb2和sb3项目文件，生成积木和角色等
+ 导出项目：将当前项目资源打包压缩成 .sb3 文件或者生成json格式
+ 运行项目并将结果渲染至舞台
+ 扩展管理

## 编译

yarn install

yarn run build

在国内可能会因网络问题编译失败，如果有条件可以开全局代理，或者干脆在国外的服务器上编译

## 项目解析

```
├── dist                     # 编译后的文件夹
│   ├── node                 # 用在node.js
│   ├── web                  # 用在web
├── playground               # 几个vm使用案例和文档
├── docs                     # 拓展帮助文档
├── src
│   ├── blocks               # 对几种积木功能的定义
│   ├── extension-support    # 拓展支持
│   ├── extensions           # 内置拓展
│   ├── utils                # 常用工具类
│   ├── dispatch             # 消息调度
│   ├── playground           # 几个vm使用案例
│   ├── engine               # vm核心引擎
│   ├── import               # 载入素材
│   ├── io                   # 处理IO事件
│   ├── serialization        # 解析sb2和sb3文件
│   ├── sprites              # 角色操作
├── test                     # 测试用例
├── README.md
└── package.json
└── webpack.consig.js
```



## 常用方法



#### toJSON 获取JSON格式的项目

返回：{String} JSON格式的项目

#### saveProjectSb3 获取SB3格式项目

返回：{Promise} zip格式的项目

#### loadProject 加载SB3项目

参数：{string | object}

返回：{Promise}

##### greenFlag

点击小绿旗

#### stopAll 停止项目运行

#### setTurboMode 设置为加速模式

参数：{Boolean}

#### clear 清除当前项目数据

#### addSprite 添加角色

参数：{String|Object}

返回：{Promise}

#### postIODate 向vm发送I/O数据

类型：Clock、Cloud、Keyboard、Mouse、MouseWheel、UserData、Video

相关定义在src/io包下

例：

```js
//按下按键
vm.postIOData("keyboard", {
    keyCode: keyCode,
    key: key,
    isDown: true,
});
//松开按键
vm.postIOData("keyboard", {
    keyCode: keyCode,
    key: key,
    isDown: false,
});
//鼠标移动
vm.postIOData('mouseWheel', {
    deltaX: e.deltaX,
    deltaY: e.deltaY
})
//向vm发送用户信息，向vm推送云变量
vm.postIOData('userData', {username: this.props.username});
```

#### addListener

监听事件，如:

- workspaceUpdate
- EXTENSION_ADDED

#### removeListener

解绑事件
