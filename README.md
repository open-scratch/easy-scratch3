# 项目介绍

使用本项目，不需要关注Scratch3.0功能的具体实现，只需要简单的js基础即可调用Scratch的相关功能，助力项目快速开发。

- 以最小的改动量实现功能，方便合并官方最新scratch

- 功能封装并对外提供调用接口， 不需要改动scratch本身代码

## 可以实现的功能
- 加载项目
- 上传项目
- 修改Logo等外观
- 移动端虚拟键盘
- 使用自己的素材库
- And more……

## 使用方法

### 直接使用

demo见编译后的build/index.html文件

### 参考系统

开源Teaching在线教学系统便是使用的本项目，可以参考具体示例

官网：http://teaching.vip

开源地址：http://github.com/open-scratch/teaching-open

### 二次开发

- 安装依赖
npm install

- 调试
npm start

- 编译
npm run build

- 编译正式版
npm run build:prod

建议在Linux环境下编译开发，若windows下编译遇到问题可参见：

https://www.213.name/archives/1739


### 参与本项目
如果大佬有更好的实现方法和更好的创意，欢迎提交PR！


# Scratch项目分析

## 各个模块

## scratch-vm  虚拟机

解析加载序列化项目文件、扩展功能实现、根据相应事件渲染舞台

###  scratch-audio 声音引擎

解析、播放声音

### scratch-blocks 代码积木块

创建积木操作块区域和每个积木对应的代码

### scratch-l10n 国际化

多语言支持

### scratch-paint 画图引擎

图片编辑器

### scratch-render：

舞台渲染

### scratch-storage 存储引擎

项目和对应素材的存储加载

### scratch-svg-renderer

svg文件处理


## 项目结构

```
├── build                    # 编译后的文件夹
│   ├── static               # 静态资源
│   ├── chunks               # scratch核心加载器
│   ├── index.html           # scratch编辑器
│   ├── player.html          # scratch播放器
│   ├── lib.min.js           # scratch核心
├── src
│   ├── components           # UI组件
│   ├── containers           # 容器组件，承载容器组件业务逻辑
│   ├── css                  # 全局通用css
│   ├── examples             # 集成测试用例
│       ├── extensions       # 拓展案例
│   ├── lib                  # 插件及高阶组件
│       ├── audio            # 声音插件
│       ├── backpack         # 背包插件
│       ├── default-project  # 默认项目
│       ├── libraries        # 素材库相关
│       ├── video            # 视频模块
│   ├── playground           # 编译后页面的模版
│   ├── reducers             # 全局状态控制
├── test                     # 测试用例
├── translations             # 翻译库
├── README.md
├── README-RAW.md            #
└── package.json
└── webpack.config.js
└── webpack.prod.js
```

# 快速使用

## 直接使用本DEMO

编译后直接修改index.html和player.html中的配置即可使用

## 引入到自己的页面

页面引入lib.min.js和chunks/gui.js后，scratch将自动渲染至`<div id="scratch"></div>`内。


## 完整配置示例
```
window.scratchConfig = {
      logo: {
        show: true
        , url: "https://scratch.mit.edu/images/logo_sm.png"
        , handleClickLogo: () => {
          console.log('点击LOGO')
        }
      }, 
      menuBar: {
        color: 'hsla(215, 100%, 65%, 1)', //菜单栏颜色
        //新建按钮
        newButton:{
          show: true,
          handleBefore(){ //执行新建前的操作，返回true则继续执行
            return true
          }
        },
        //从计算机加载按钮
        loadFileButton:{
          show: true,
          handleBefore(){
            return false
          }
        },
        //保存到计算机按钮
        saveFileButton:{
          show: true,
          handleBefore(){
            return true
          }
        },
        //加速模式按钮
        turboModeButton:{
          show: true
        },
        //教程按钮
        helpButton:{
          show: true
        },
        //我的物品按钮
        myStuff:{
          show: true,
          url: '/myProject'
        },
        //用户头像按钮
        userAvatar:{
          show: true,
          username: '未登录',
          avatar: './static/avatar.png',
          handleClick(){
            //弹出登录框等操作
            console.log("点击头像")
          }
        }
      }, 
      shareButton: {
        show: true,
        buttonName: "分享",
        handleClick: () => {
          //点击分享按钮
          console.log('分享按钮')
          window.scratch.getProjectCover(cover => {
            //TODO 获取到作品截图
            console.log(cover)
          })
          window.scratch.getProjectFile(file => {
            //TODO 获取到项目文件
            console.log(file)
          })
          // 获取到项目名
          var projectName = window.scratch.getProjectName()
          console.log(projectName);
        }
      }, 
      profileButton: {
        show: true,
        buttonName: "我的作品",
        handleClick:()=>{
          //点击profile按钮
        }
      }, 
      stageArea:{ //舞台区配置，仅推荐在player下配置
        scale: 1, //舞台区比例
        width: 480, // 舞台宽
        height: 360, //舞台高
        showControl: true, //是否显示舞台区控制按钮
        showLoading: false, //是否显示Loading
        fullscreenButton:{ //全屏按钮
          show: true,
          handleBeforeSetStageUnFull(){ //退出全屏前的操作
            return true
          },
          handleBeforeSetStageFull(){ //全屏前的操作
            return true
          }
        },
        startButton:{ //开始按钮
          show: true,
          handleBeforeStart(){ //开始前的操作
            return true
          }
        },
        stopButton:{ // 停止按钮
          show: true,
          handleBeforeStop(){ //停止前的操作
            return true
          }
        }
      },
      handleVmInitialized: (vm) => {
        window.vm = vm
        console.log("VM初始化完毕")
        
      },
      handleProjectLoaded:() => {
        console.log("作品载入完毕")

      },
      handleDefaultProjectLoaded:() => {
        //默认作品加载完毕，一般在这里控制项目加载
        // window.scratch.setProjectName("默认项目")
        //  window.scratch.loadProject("/project.sb3", () => { 
        //     console.log("项目加载完毕")
        //     window.scratch.setProjectName("默认项目")
        //  })
      },
      //默认项目地址,不需要修请删除本配置项
      // defaultProjectURL: "./static/project.sb3",
      //若使用官方素材库请删除本配置项, 默认为/static下的素材库
      assetCDN: './static' 
    }
```

# API参考

## 全局对象

### window.vm对象
scratch-vm实例化的对象，可以从外部直接操作部分scratch-vm虚拟机功能

#### scratch-vm对象常用API列表：

- vm.saveProjectSb3() 获取SB3格式项目
- vm.loadProject(file) 加载SB3项目
- vm.greenFlag() 点击小绿旗
- vm.stopAll() 停止运行项目
- ……

[Scratch-vm介绍](./doc/scratch-vm.md)

[Scratch-vm官方文档](./doc/scratch-vm/index.html)


## scratch初始化配置



初始化配置均通过`window.scratchConfig`对象完成

需要注意的是，需要在引入lib.min.js之前就加入该代码


### 菜单栏相关

#### LOGO

属性：
`window.scratchConfig.logo`

|参数名|描述|
|----|----|
|show|是否显示|
|url|logo地址|
|handleClickShare|处理LOGO点击事件|

支持图片URL和base64，建议使用PNG半透明图片

#### 菜单栏样式

`window.scratchConfig.menuBar`

|参数名|描述|
|----|----|
|color|菜单栏颜色|

#### 原始菜单控制

控制原始菜单的显示隐藏，是否可以执行。
见完整配置示例


#### 分享按钮

`window.scratchConfig.shareButton`

|参数名|描述|
|----|----|
|show|是否显示|
|handleClick|处理按钮点击事件|

#### 个人中心按钮

`window.scratchConfig.profileButton`

|参数名|描述|
|----|----|
|show|是否显示|
|handleClick|处理按钮点击事件|

#### 用户名和头像

`window.scratchConfig.menuBar.userAvatar`

|参数名|描述|
|----|----|
|show|是否显示|
|username|用户名|
|avatar|用户头像|
|handleClick|点击事件|


### 舞台区域

 注意：建议仅在播放器模式下配置

`window.scratchConfig.stageArea`

|参数名|描述|
|----|----|
|scale|舞台区比例|
|width|舞台宽度|
|height|舞台高度|
|showControl|是否显示舞台区控制按钮|
|showLoading|是否显示Loading|
|fullscreenButton|全屏按钮设置|
|startButton|小绿旗按钮设置|
|stopButton|停止按钮设置|

### 默认加载的项目

`defaultProjectURL: "./static/project.sb3"`

如果要加载默认小猫则删除此配置

### 素材库CDN

`window.scratchConfig.assetCDN`

配置此项将官方素材库换成自己的地址，加快国内用户访问速度。建议将素材文件上传至七牛、阿里云OSS等云存储上。

若使用官方素材库请删除本配置项。默认为/static下的素材库，如不需要可删除/static/internalapi文件夹

> 附：[Scratch素材库采集和处理工具](https://github.com/open-scratch/scratch-asset-utils)



### VM初始换完毕回调
window.scratchConfig.handleVmInitialized

|参数名|描述|
|----|----|
|vm|scratch virtual machine|

示例
```
window.scratchConfig.handleVmInitialized = (vm)=>{
    //scratch vm初始换完毕后的代码
}
```

### 作品加载完毕的回调
window.scratchConfig.handleProjectLoaded

每当新建项目或载入项目完毕后调用此方法。

### 默认项目加载完毕的回调
window.scratchConfig.handleDefaultProjectLoaded

默认小猫项目加载完毕后调用此方法。

### 完整配置示例：

见编译后的index.html和player.html

## 项目相关API

### 加载项目

`window.scratch.loadPorject(url, callback)`

也可以使用vm对象的loadProject方法载入scratch项目

#### 示例
```
window.scratch.loadPorject(url, ()=>{
    //加载文件完成后的操作
})

```

### 获取项目文件

`window.scratch.getProjectFile(callback)`

也可以使用vm对象的saveProjectSb3方法

#### 示例
```
window.scratch.getProjectFile((file)=>{
    console.log(file)
    //上传file文件
})
```

### 获取项目截图

`window.scratch.getProjectCover(callback)`

#### 示例
```
window.scratch.getProjectCover((file)=>{
    console.log(file)
    //上传截图文件
})
```

### 获取项目名称

`window.scratch.getProjectName()`

### 设置项目名称

`window.scratch.setProjectName(projectName)`

## UI相关API

### 设置为播放模式

window.scratch.setPlayerOnly(isPlayerOnly)

#### 参数

|参数名|描述|
|----|----|
|isPlayerOnly|是否播放模式|

#### 示例
```
window.scratch.setPlayerOnly(true)
```

### 设置为全屏
window.scratch.setFullScreen(isFullScreen)

#### 参数
|参数名|描述|
|----|----|
|isFullScreen|是否全屏|

#### 示例
```
window.scratch.setFullScreen(true)
```

## 手机端虚拟按键

示例：绑定某个dom为移动端的虚拟键盘，先引入jQuery

```js
function regKeyEvent(selector, key, keyCode) {
    console.log("注册按键事件:" + key)
    $(selector).on("touchstart", function(event) {
        vm.postIOData("keyboard", {
          keyCode: keyCode,
          key: key,
          isDown: true,
        });
        event.preventDefault();
      });
      $(selector).on("touchend", function() {
        vm.postIOData("keyboard", {
          keyCode: keyCode,
          key: key,
          isDown: false,
        });
        event.preventDefault();
      });
  }

  // 配置上下左右空格键
  regKeyEvent(".button_space", " ", 32)
  regKeyEvent(".button_down", "ArrowDown", 40)
  regKeyEvent(".button_up", "ArrowUp", 38)
  regKeyEvent(".button_left", "ArrowLeft", 37)
  regKeyEvent(".button_right", "ArrowRight", 39)

```
