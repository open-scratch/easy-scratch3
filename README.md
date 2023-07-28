[English](./README-EN.md) | 简体中文

# 项目介绍

使用本项目，不需要关注Scratch3.0功能的具体实现，只需要简单的js基础即可调用Scratch的相关功能，助力项目快速开发。

## 可以实现的功能
- 加载项目
- 上传项目
- 修改外观
- 移动端播放器
- 修改积木大小
- 显示隐藏积木
- 自定义素材库
- 对接背包API
- And more……

### 使用案例

开源Teaching在线教学系统便是使用的本项目，可以参考具体示例

官网：http://teaching.vip

开源地址：http://github.com/open-scratch/teaching-open

### 二次开发

- 安装依赖
npm install

- 调试
npm start

- 编译正式版
npm run build:prod

建议在Linux环境下编译开发，若windows下编译遇到问题可参见：

https://www.213.name/archives/1739


### 参与本项目
欢迎提交Issues和PR！


# 快速使用

## 直接使用本DEMO

编译后直接修改index.html和player.html中的配置即可使用

## 引入到自己的页面

不使用DEMO，引入到自己的页面

页面引入`lib.min.js`和`chunks/gui.js`后，scratch将自动渲染至`<div id="scratch"></div>`内。

别忘了配置 `window.scratchConfig`


# 项目文档

## 初始化配置

初始化配置均通过`window.scratchConfig`对象完成

需要注意的是，需要在引入lib.min.js之前就加入该代码，即Scratch主程序加载前就需要定义该配置

以下是完整示例：

```js
    window.scratchConfig = {
      session: {
        token: "", // 用户Token
        username: "Username" //用户名
      },
      backpack:{
        enable: true, // 是否启用背包
        api: "/api/teaching/scratch/backpack", //背包API接口
      },
      logo: {
        show: true, //是否显示
        url: "./static/logo.png", //logo地址，支持base64图片
        handleClickLogo: () => { //处理LOGO点击事件
        }
      },
      menuBar: {
        //菜单栏样式
        style: {
          background: 'hsla(215, 100%, 65%, 1)',
        },
        //切换语言按钮
        languageButton:{
          show: true, //是否显示
          defaultLanguage: 'zh-cn' //默认语言 en zh-cn zh-tw
        },
        //新建按钮
        newButton:{
          show: true, //是否显示
          handleBefore(){
            //拦截点击事件，返回true继续执行
            return true
          }
        },
        //从计算机加载按钮
        loadFileButton:{
          show: true, //是否显示
          handleBefore(){
            //拦截点击事件，返回true继续执行
            return true
          }
        },
        //保存到计算机按钮
        saveFileButton:{
          show: true, //是否显示
          handleBefore(){
            //拦截点击事件，返回true继续执行
            return true
          }
        },
        //加速模式按钮
        turboModeButton:{
          show: true //是否显示
        },
        //教程按钮
        helpButton:{
          show: true, //是否显示
          handleBefore:()=>{
            //拦截点击事件，返回true继续执行
            return true
          }
        },
        //我的物品按钮
        myStuff:{
          show: true, //是否显示
          url: '/myProject' //跳转的连接
        },
        //用户头像按钮
        userAvatar:{
          show: true, //是否显示
          username: '未登录', //用户名
          avatar: './static/avatar.png', //用户头像
          handleClick(){
            //点击头像，可以弹出登录框等操作
          }
        },
        //自定义按钮
        customButtons: [
          {
            show: true, //是否显示
            buttonName: '分享', //按钮名
            style:{ //按钮样式
              color: 'white',
              background: 'hsla(30, 100%, 55%, 1)',
            },
            handleClick:()=>{ //按钮事件
              console.log("自定义按钮1");
              console.log('分享按钮')
              window.scratch.getProjectCover(cover => {
                //TODO 获取到作品截图
              })
              window.scratch.getProjectFile(file => {
                //TODO 获取到项目文件
              })
              // 获取到项目名
              var projectName = window.scratch.getProjectName()
              console.log(projectName);
            }
          },
          //可继续新增按钮
        ]
      }, 
      blocks:{
         // 积木缩放比例
        scale: 0.8,
        // 隐藏分类 费雷见README附录：
        // 如需动态隐藏显示分类或积木，修改此配置后需手动执行 window.vm.emitWorkspaceUpdate()
        hideCatagorys:[], 
        //隐藏积木 积木代码见README附录：
        hideBlocks:[],
      },
      stageArea:{ //舞台设置
        fullscreenButton:{ //全屏按钮
          show: true,
          handleBeforeSetStageUnFull(){ //拦截退出全屏，返回true继续执行
            return true
          },
          handleBeforeSetStageFull(){ //拦截全屏，返回true继续执行
            return true
          }
        },
        startButton:{ //开始按钮
          show: true,
          handleBeforeStart(){ //拦截开始按钮，返回true继续执行
            return true
          }
        },
        stopButton:{ // 停止按钮
          show: true,
          handleBeforeStop(){ //拦截停止按钮，，返回true继续执行
            return true
          }
        }
      },
      //scratch vm初始化完毕
      handleVmInitialized: (vm) => {
        window.vm = vm
      },
      //作品加载完毕
      handleProjectLoaded:() => {
      },
      //默认作品加载完毕
      handleDefaultProjectLoaded:() => {
      },
      //默认项目地址,不需要修请删除本配置项
      defaultProjectURL: "./static/project.sb3",
      //素材库配置
      assets:{
        //附：Scratch素材库采集和处理工具 https://github.com/open-scratch/scratch-asset-utils
        //素材库地址，默认为/static下的素材库
        assetHost: './static',
        //素材库索引地址
        defaultIndex:{
          sprites: "./static/json_index/sprites.json",
          costumes: "./static/json_index/costumes.json",
          backdrops: "./static/json_index/backdrops.json",
          sounds: "./static/json_index/sounds.json"
        },
        //拦截角色库打开
        handleBeforeSpriteLibraryOpen(){
          console.log("角色库打开")
          //追加素材库
          // window.scratch.pushSpriteLibrary(Arrays)
          return true;
        },
        //拦截造型库打开
        handleBeforeCostumesLibraryOpen(){
          return true;
        },
        //拦截背景库打开
        handleBeforeBackdropsLibraryOpen(){
          return true;
        },
        //拦截声音库打开
        handleBeforeSoundLibraryOpen(){
          return true;
        }
      },
    }

```

## API

### ScratchVm对象

scratch-vm实例化的对象，可以从外部直接操作部分scratch-vm虚拟机功能，

该对象常用API列表：

- vm.saveProjectSb3() //获取SB3格式项目
- vm.loadProject(file) //加载SB3项目
- vm.greenFlag() //点击小绿旗
- vm.stopAll() //停止运行项目
- vm.emitWorkspaceUpdate() //刷新工作区
- ……

[Scratch-vm介绍](./doc/scratch-vm.md)

[Scratch-vm官方文档](./doc/scratch-vm/index.html)

### 加载项目

`window.scratch.loadProject(url, callback)`

也可以使用vm对象的loadProject方法载入scratch项目

示例
```
window.scratch.loadProject(url, ()=>{
    //加载文件完成后的操作
})

```

### 获取项目文件

`window.scratch.getProjectFile(callback)`

也可以使用vm对象的saveProjectSb3方法

示例
```
window.scratch.getProjectFile((file)=>{
    console.log(file)
    //上传file文件
})
```

### 获取项目截图

`window.scratch.getProjectCover(callback)`

示例
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

### 设置为仅播放模式

示例
```js
window.scratch.setPlayerOnly(true)
```

### 设置为全屏

示例
```js
window.scratch.setFullScreen(true)
```

### 追加素材库

可以动态新增素材库索引，需要等待用户打开素材库后再调用本方法，否则无法追加成功。
增加索引后还需要assetHost中增加对应的素材文件。

参数为素材索引的数组，具体格式参见json_index下文件的内容。

#### 追加角色库
`window.scratch.pushSpritesLibrary(Arrays)`

#### 追加造型库
`window.scratch.pushCostumesLibrary(Arrays)`

#### 追加背景库
`window.scratch.pushBackdropsLibrary(Arrays)`

#### 追加声音库
`window.scratch.pushSoundsLibrary(Arrays)`

示例
```js
window.scratch.pushSoundsLibrary(
  [{
        "name": "自定义声音",
        "tags": [
            "music",
        ],
        "assetId": "5cb46ddd903fc2c9976ff881df9273c9",
        "dataFormat": "",
        "md5ext": "5cb46ddd903fc2c9976ff881df9273c9.wav",
        "sampleCount": 11840,
        "rate": 44100
    }]
)
```

# 附录

## Scratch项目结构

### 各个模块

#### scratch-vm  虚拟机

解析加载序列化项目文件、扩展功能实现、根据相应事件渲染舞台

####  scratch-audio 声音引擎

解析、播放声音

#### scratch-blocks 代码积木块

创建积木操作块区域和每个积木对应的代码

#### scratch-l10n 国际化

多语言支持

#### scratch-paint 画图引擎

图片编辑器

#### scratch-render：

舞台渲染

#### scratch-storage 存储引擎

项目和对应素材的存储加载

#### scratch-svg-renderer

svg文件处理


### 项目结构

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

## 积木分类代码

motion  looks  sound  events  control  sensing  operators  variables  myBlocks

## 积木代码

### 运动分类

motion_movesteps  motion_turnright  motion_turnleft  motion_goto  motion_gotoxy  motion_glideto
motion_glidesecstoxy  motion_pointindirection  motion_pointtowards  motion_changexby  motion_setx
motion_changeyby  motion_sety  motion_ifonedgebounce  motion_setrotationstyle  motion_xposition  motion_yposition  motion_direction

### 外观分类

looks_sayforsecs  looks_say  looks_thinkforsecs  looks_think  looks_switchbackdropto  looks_switchbackdroptoandwait  looks_nextbackdrop
looks_switchcostumeto  looks_nextcostume  looks_switchbackdropto  looks_nextbackdrop  looks_changesizeby  looks_setsizeto  looks_changeeffectby
looks_seteffectto  looks_cleargraphiceffects  looks_show  looks_hide  looks_gotofrontback  looks_goforwardbackwardlayers  looks_backdropnumbername
looks_costumenumbername  looks_backdropnumbername  looks_size

### 声音分类

sound_playuntildone  sound_play  sound_stopallsounds  sound_changeeffectby  sound_seteffectto  sound_cleareffects
sound_changevolumeby  sound_setvolumeto  sound_volume

### 事件分类

event_whenflagclicked  event_whenkeypressed  event_whenstageclicked  event_whenthisspriteclicked  event_whenbackdropswitchesto
event_whengreaterthan  event_whenbroadcastreceived  event_broadcast  event_broadcastandwait

### 控制分类

control_wait  control_repeat  control_forever  control_if  control_if_else  control_wait_until  control_repeat_until  control_stop
control_create_clone_of  control_start_as_clone  control_create_clone_of  control_delete_this_clone  

### 侦测分类

sensing_touchingobject  sensing_touchingcolor  sensing_coloristouchingcolor  sensing_distanceto  sensing_askandwait  sensing_answer
sensing_keypressed  sensing_mousedown  sensing_mousex  sensing_mousey  sensing_setdragmode  sensing_loudness  sensing_timer  sensing_resettimer
sensing_of  sensing_current  sensing_dayssince2000  sensing_username

### 运算分类

operator_add  operator_subtract  operator_multiply  operator_divide  operator_random  operator_gt  operator_lt  operator_equals  operator_and
operator_or   operator_not  operator_join  operator_letter_of  operator_length  operator_contains  operator_mod  operator_round  operator_mathop


## 手机端虚拟按键实现案例

绑定某个dom为移动端的虚拟键盘，需要先引入jQuery

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