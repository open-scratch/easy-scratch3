English | [简体中文](./README.md)

# Introduction

 You don't need to focus on implementation of Scratch3.0 functionality. Only use simple JavaScript language to call Scratch functions. 

- Implement API with minimal modify. It's can be easy to merge official latest version Scratch

- The functionality encapsulates and provides the calling interface to the outside world without changing the Scratch code itself

## Functions that can be implemented

- load project
- upload project
- change logo and style
- mobile scratch player
- virtual keyboard 
- custom media library
- change block size
- hidden block category or specific block
- and more……

### Case

The Teaching system is embed this project.

website：https://teaching.vip

source：http://github.com/open-scratch/teaching-open

### Devolopment

- install dependencies
npm install

- debug
npm start

- build for productioin
npm run build:prod


# Quickly to use

## use DEMO

After build, see `index.html` and `player.html`.

## Inject to page


import `lib.min.js` and `chunks/gui.js`, scratch will render into`<div id="scratch"></div>`。

Do not forget to edit `window.scratchConfig`


# API

## Global object

### window.vm

It's scratch-vm instance object, You can call scratch virtual machine API from outside.

#### scratch-vm APIs：

- vm.saveProjectSb3()
- vm.loadProject(file)
- vm.greenFlag()
- vm.stopAll()
- vm.emitWorkspaceUpdate()
- ……

[Scratch-vm document](./doc/scratch-vm/index.html)


## scratch initial config

Notice: This object need created before import `lib.min.js`

### About menu bar

#### LOGO

`window.scratchConfig.logo`

|paramenter|description|
|----|----|
|show|is show log|
|url|logo url|
|handleClickShare|handle logo click event|

The support base64

#### menu bar style

`window.scratchConfig.menuBar`

|paramenter|description|
|----|----|
|style|menu bar style|

#### Original menu config


|button|description|
|----|----|
|newButton|new project button|
|loadFileButton|load project from computer button|
|saveFileButton|save project to computer button|
|turboModeButton|turbo mode button|
|helpButton|help button|
|myStuff|my stuff button|

Button properties

|paramenter|description|
|----|----|
|show|is show button|
|handleBefore|handle before click button event, return 'true' to continue|

#### User name and avatar

`window.scratchConfig.menuBar.userAvatar`

|button|description|
|----|----|
|show|is show avatar|
|username| user name|
|avatar| user avatar|
|handleClick|handle click event|

#### Custom buttons

`window.scratchConfig.menuBar.customButtons`

Allow unlimit add button

Button properties:

|paramenter|description|
|----|----|
|show|is show button|
|buttonName|button label name|
|style|button style|
|handleClick|button click event|

### Stage area

 Notict: Is recommended to configure in player mode

`window.scratchConfig.stageArea`

|paramenter|description|
|----|----|
|scale|stage scale|
|width|stage width|
|height|stage height|
|showControl|show stage area control bar|
|fullscreenButton|fullscreen button config|
|startButton|greenflag button config|
|stopButton|stop button config|

### Block config

`window.scratchConfig.blocks`
|paramenter|description|
|----|----|
|scale|block scale|
|hideCatagorys|hide block catagory (catagory codesee appendix)|
|hideBlocks|hide block (block code see appendix)|

### Default project

`defaultProjectURL: "./static/project.sb3"`

If you want to load default cat please remove this config

### asset library

`window.scratchConfig.assetCDN`


> [Scratch asset library util](https://github.com/open-scratch/scratch-asset-utils)



### VM initialized callback
window.scratchConfig.handleVmInitialized

|paramenter|description|
|----|----|
|vm|scratch virtual machine|

example
```
window.scratchConfig.handleVmInitialized = (vm)=>{
    window.vm = vm // export vm to window
}
```

### project loaded callback

`window.scratchConfig.handleProjectLoaded`

when create project or loaded project will call this function

### default project loaded

`window.scratchConfig.handleDefaultProjectLoaded`

when default project loaded will call this function

## Project API

### load project

`window.scratch.loadPorject(url, callback)`

You can also use vm.loadProject

#### example
```
window.scratch.loadPorject(url, ()=>{
  console.log("load project finished")
})

```

### get project file

`window.scratch.getProjectFile(callback)`

You can also use vm.saveProjectSb3

#### example
```
window.scratch.getProjectFile((file)=>{
    console.log(file)
    //upload this file to server
})
```

### get project cover

`window.scratch.getProjectCover(callback)`

#### example
```
window.scratch.getProjectCover((file)=>{
    console.log(file)
    //upload this file to server
})
```

### get project name

`window.scratch.getProjectName()`

### set project name

`window.scratch.setProjectName(projectName)`

## UI API

### set player only mode

window.scratch.setPlayerOnly(isPlayerOnly)

#### parameter

|paramenter|description|
|----|----|
|isPlayerOnly|is player mode|

#### example
```
window.scratch.setPlayerOnly(true)
```

### fullscreen mode
window.scratch.setFullScreen(isFullScreen)

|paramenter|description|
|----|----|
|isFullScreen|is fullscreen mode|

#### example
```
window.scratch.setFullScreen(true)
```

# Appendix

## full configuration example
```
window.scratchConfig = {
      logo: {
        show: true
        , url: "./static/logo.png"
        , handleClickLogo: () => {
        }
      }, 
      menuBar: {
        //menu bar style
        style: {
          background: 'hsla(215, 100%, 65%, 1)',
        },
        newButton:{
          show: true,
          handleBefore(){ //handle before click button event, return 'true' to continue
            return true
          }
        },
        //load project from computer button
        loadFileButton:{
          show: true,
          handleBefore(){
            return false
          }
        },
        //save project to computer button
        saveFileButton:{
          show: true,
          handleBefore(){
            return true
          }
        },
        //turbo mode button
        turboModeButton:{
          show: true
        },
        //help button
        helpButton:{
          show: true
        },
        //my stuff button
        myStuff:{
          show: true,
          url: '/myProject'
        },
        //user avatar button
        userAvatar:{
          show: true,
          username: 'Login',
          avatar: './static/avatar.png',
          handleClick(){
          }
        },
        customButtons: [
          {
            show: true,
            buttonName: 'Share',
            style:{
              color: 'white',
              background: 'hsla(30, 100%, 55%, 1)',
            },
            handleClick:()=>{
              console.log("custom button1 click");
              window.scratch.getProjectCover(cover => {
                //TODO upload
                console.log(cover)
              })
              window.scratch.getProjectFile(file => {
                //TODO upload
                console.log(file)
              })
              var projectName = window.scratch.getProjectName()
              console.log(projectName);
            }
          },
          {
            show: true,
            buttonName: 'Button1',
            style: {
              color: 'white',
              background: 'hsl(271deg 89% 70%)',
            },
            handleClick:()=>{
              console.log("custom button click");
            }
          },
          //You can add more button
        ]
      }, 
      blocks:{
        scale: 0.8, // block scale
        // to update workspace you need call window.vm.emitWorkspaceUpdate()
        // hide block catagory (catagory codesee appendix)
        hideCatagorys:[], 
        //hide block (block code see appendix)
        hideBlocks:[],
      },
      stageArea:{ // Notict: Is recommended to configure in player mode
        scale: 1, // stage scale
        width: 480, // stage width
        height: 360, // stage height
        showControl: true, //show stage area control bar
        fullscreenButton:{ //fullscreen button
          show: true,
          handleBeforeSetStageUnFull(){
            return true
          },
          handleBeforeSetStageFull(){
            return true
          }
        },
        startButton:{ // greenflag button
          show: true,
          handleBeforeStart(){
            return true
          }
        },
        stopButton:{ // stop button
          show: true,
          handleBeforeStop(){
            return true
          }
        }
      },
      handleVmInitialized: (vm) => {
        window.vm = vm
        console.log("VM initialized")
        
      },
      handleProjectLoaded:() => {
        console.log("Project Loaded")

      },
      handleDefaultProjectLoaded:() => {
        //  window.scratch.loadProject("/project.sb3", () => { 
        //     window.scratch.setProjectName("untitle")
        //  })
      },
      // If you want to load default cat please remove this config
      defaultProjectURL: "./static/project.sb3",
      assetCDN: './static' 
    }
```

## block catagory code

motion  looks  sound  events  control  sensing  operators  variables  myBlocks

## block code

### motion

motion_movesteps  motion_turnright  motion_turnleft  motion_goto  motion_gotoxy  motion_glideto
motion_glidesecstoxy  motion_pointindirection  motion_pointtowards  motion_changexby  motion_setx
motion_changeyby  motion_sety  motion_ifonedgebounce  motion_setrotationstyle  motion_xposition  motion_yposition  motion_direction

### looks

looks_sayforsecs  looks_say  looks_thinkforsecs  looks_think  looks_switchbackdropto  looks_switchbackdroptoandwait  looks_nextbackdrop
looks_switchcostumeto  looks_nextcostume  looks_switchbackdropto  looks_nextbackdrop  looks_changesizeby  looks_setsizeto  looks_changeeffectby
looks_seteffectto  looks_cleargraphiceffects  looks_show  looks_hide  looks_gotofrontback  looks_goforwardbackwardlayers  looks_backdropnumbername
looks_costumenumbername  looks_backdropnumbername  looks_size

### sound

sound_playuntildone  sound_play  sound_stopallsounds  sound_changeeffectby  sound_seteffectto  sound_cleareffects
sound_changevolumeby  sound_setvolumeto  sound_volume

### event

event_whenflagclicked  event_whenkeypressed  event_whenstageclicked  event_whenthisspriteclicked  event_whenbackdropswitchesto
event_whengreaterthan  event_whenbroadcastreceived  event_broadcast  event_broadcastandwait

### control

control_wait  control_repeat  control_forever  control_if  control_if_else  control_wait_until  control_repeat_until  control_stop
control_create_clone_of  control_start_as_clone  control_create_clone_of  control_delete_this_clone  

### sensing

sensing_touchingobject  sensing_touchingcolor  sensing_coloristouchingcolor  sensing_distanceto  sensing_askandwait  sensing_answer
sensing_keypressed  sensing_mousedown  sensing_mousex  sensing_mousey  sensing_setdragmode  sensing_loudness  sensing_timer  sensing_resettimer
sensing_of  sensing_current  sensing_dayssince2000  sensing_username

### operator

operator_add  operator_subtract  operator_multiply  operator_divide  operator_random  operator_gt  operator_lt  operator_equals  operator_and
operator_or   operator_not  operator_join  operator_letter_of  operator_length  operator_contains  operator_mod  operator_round  operator_mathop


## player virtual keyboard example

first import jQuery

```js
function regKeyEvent(selector, key, keyCode) {
    console.log("reg key event:" + key)
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

  regKeyEvent(".button_space", " ", 32)
  regKeyEvent(".button_down", "ArrowDown", 40)
  regKeyEvent(".button_up", "ArrowUp", 38)
  regKeyEvent(".button_left", "ArrowLeft", 37)
  regKeyEvent(".button_right", "ArrowRight", 39)

```