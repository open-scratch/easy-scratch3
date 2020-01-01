# 项目介绍

使用本项目，不需要关注Scratch3.0功能的具体实现，只需要简单的js基础即可调用Scratch的相关功能，助力项目快速开发。

- 以最小的改动量实现功能，方便合并官方最新scratch

- 功能封装并对外提供调用接口， 不需要改动scratch本身代码


## 使用方法
### 直接使用
demo见index.html

### 二次开发
建议在Linux环境下编译开发，windows下编译可参见：
https://www.213.name/archives/1739


### 参与本项目
本项目接受PR，如果大佬有更好的实现方法和更好的创意，欢迎提交PR！

同时也欢迎提出Issue，BUG建议均可

# API参考

## 全局对象

### winodws.vm对象
scratch-vm实例化的对象，可以从外部操作部分vm功能

#### vm对象常用API列表：

- vm.toJSON() 获取JSON格式的项目
- vm.saveProjectSb3() 获取SB3格式项目
- vm.loadProject(file) 加载SB3项目
- vm.greenFlag() 点击小绿旗
- vm.stopAll() 停止运行项目
- ……
- 其他请自行在控制台查看

### window.props对象

- props.onUpdateProjectTitle 修改作品名称
- 其他自行探索

## scratch配置


`window.scratchConfig`

注意，需要在引入lib.min.js之前就加入改代码

### LOGO

属性：
`window.scratchConfig.logo`

|参数名|描述|
|----|----|
|show|是否显示|
|url|logo地址|
|handleClickShare|处理LOGO点击事件|

支持图片URL和base64，建议使用PNG半透明图片


### 菜单栏

`window.scratchConfig.menuBar`

|参数名|描述|
|----|----|
|color|菜单栏颜色|


### 分享按钮

`window.scratchConfig.shareButton`

|参数名|描述|
|----|----|
|show|是否显示|
|handleClickShare|处理按钮点击事件|

### VM初始换完毕
window.scratchConfig.handleVmInitialized

示例
```
window.scratchConfig.handleVmInitialized = ()=>{
    //scratch vm初始换完毕后的代码
}
```


### 完整配置示例：
```
window.scratchConfig = {
    logo: {
        show: true,
        url: '/images/logo.png',
        handleClickLogo: ()=>{
            console.log('点击LOGO')
            //跳转
        }
    },
    menuBar:{
        color: '#000',
    },
    shareButton:{
        show: true,
        handleClickShare: ()=>{
            console.log('分享按钮')
            //获取项目
            //活动截图
            //上传
        }
    }
    
}
```

## 项目相关API

### 加载项目

`window.scratch.loadPorject(url, projectName, callback)`

也可以使用vm对象的loadProject方法

#### 示例
```
window.scratch.loadPorject(url, projectName, ()=>{
    //加载文件完成后的操作
})

```

### 获取项目

`window.scratch.getProjectFile(callback)`

也可以使用vm对象的saveProjectSb3方法

例
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

## 适用于移动端的API

### 向Scratch发送按键等事件

```
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
```