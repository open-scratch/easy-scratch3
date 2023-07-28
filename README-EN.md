English | [简体中文](./README.md)

# Introduction

 You don't need to focus on implementation of Scratch3.0 functionality. Only use simple JavaScript language to call Scratch functions. 


## That can be implemented

- load project
- upload project
- change style
- mobile scratch player
- virtual keyboard 
- change block size
- hidden block category or specific block
- custom assets library
- backpack API
- and more……

### The case

The Teaching system is embed this project.

website：https://teaching.vip

source：http://github.com/open-scratch/teaching-open

### Secondary development

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


# Document

## initial config

Notice: The window.scratchConfig object need created before import `lib.min.js`

This is a complete configuration example

```js
window.scratchConfig = {
      session: {
        token: "", // user token
        username: "Username" // user name
      },
      backpack:{
        enable: true, // enable backpack
        api: "/api/teaching/scratch/backpack", //backpack API
      },
      logo: {
        show: true, //is visible
        url: "./static/logo.png", //logo url, support base64 images
        handleClickLogo: () => { //handle logo click event
        }
      },
      menuBar: {
        //menu bar style
        style: {
          background: 'hsla(215, 100%, 65%, 1)',
        },
        //new project button
        newButton:{
          show: true, //is visible
          handleBefore(){
            //handle before click button event, return 'true' to continue
            return true
          }
        },
        //load project from computer button
        loadFileButton:{
          show: true, //is visible
          handleBefore(){
            //handle before click button event, return 'true' to continue
            return true
          }
        },
        //save project to computer button
        saveFileButton:{
          show: true, //is visible
          handleBefore(){
            //handle before click button event, return 'true' to continue
            return true
          }
        },
        //turbo mode button
        turboModeButton:{
          show: true //is visible
        },
        //help button
        helpButton:{
          show: true, //is visible
          handleBefore:()=>{
            //handle before click button event, return 'true' to continue
            return true
          }
        },
        //my stuff button
        myStuff:{
          show: true, //is visible
          url: '/myProject' //my project href
        },
        //user avatar button
        userAvatar:{
          show: true, //is visible
          username: '未登录', //user name
          avatar: './static/avatar.png', //avatar image url
          handleClick(){
            //handle click avatar button
          }
        },
        //custom buttons
        customButtons: [
          {
            show: true, //is visible
            buttonName: 'Share', //button label name
            style:{ //button style
              color: 'white',
              background: 'hsla(30, 100%, 55%, 1)',
            },
            handleClick:()=>{ //button click event
              window.scratch.getProjectCover(cover => {
                //TODO got project cover
              })
              window.scratch.getProjectFile(file => {
                //TODO got project file
              })
              // got project name
              var projectName = window.scratch.getProjectName()
              console.log(projectName);
            }
          },
          //You can add more buttons
        ]
      }, 
      blocks:{
         // block scale
        scale: 0.8,
        // hide block catagorys (catagory code see appendix)
        // window.vm.emitWorkspaceUpdate()
        hideCatagorys:[], 
        //hide some blocks (block code see appendix)
        hideBlocks:[],
      },
      stageArea:{ //stage setting
        fullscreenButton:{ //fullscreen button
          show: true,
          handleBeforeSetStageUnFull(){ //拦截退出全屏，返回true继续执行
            return true
          },
          handleBeforeSetStageFull(){ //拦截全屏，返回true继续执行
            return true
          }
        },
        startButton:{ //stat button
          show: true,
          handleBeforeStart(){ 
            //handle before click button event, return 'true' to continue
            return true
          }
        },
        stopButton:{ // stop button
          show: true,
          handleBeforeStop(){
            //handle before click button event, return 'true' to continue
            return true
          }
        }
      },
      //scratch vm initialized
      handleVmInitialized: (vm) => {
        window.vm = vm
      },
      //when create project or loaded project will call this function
      handleProjectLoaded:() => {
      },
      //when default project loaded will call this function
      handleDefaultProjectLoaded:() => {
      },
      //default project url
      defaultProjectURL: "./static/project.sb3",
      //assets library setting
      assets:{
        //asset host
        assetHost: './static',
        //asset index url
        defaultIndex:{
          sprites: "./static/json_index/sprites.json",
          costumes: "./static/json_index/costumes.json",
          backdrops: "./static/json_index/backdrops.json",
          sounds: "./static/json_index/sounds.json"
        },
        //handle before sprites library open
        handleBeforeSpriteLibraryOpen(){
          // append assets
          // window.scratch.pushSpriteLibrary(Arrays)
          return true;
        },
        //handle before costumes library open
        handleBeforeCostumesLibraryOpen(){
          return true;
        },
        //handle before backdrops library open
        handleBeforeBackdropsLibraryOpen(){
          return true;
        },
        //handle before sounds library open
        handleBeforeSoundLibraryOpen(){
          return true;
        }
      },
    }
```

## API

### ScratchVm Object

It's scratch-vm instance object, You can call scratch virtual machine API from outside.

scratch-vm APIs：

- vm.saveProjectSb3()
- vm.loadProject(file)
- vm.greenFlag()
- vm.stopAll()
- vm.emitWorkspaceUpdate()
- ……

[Scratch-vm document](./doc/scratch-vm/index.html)

### load project

`window.scratch.loadProject(url, callback)`

You can also use vm.loadProject

example
```
window.scratch.loadProject(url, ()=>{
  console.log("load project finished")
})

```

### get project file

`window.scratch.getProjectFile(callback)`

You can also use vm.saveProjectSb3

example
```
window.scratch.getProjectFile((file)=>{
    console.log(file)
    //upload this file to server
})
```

### get project cover

`window.scratch.getProjectCover(callback)`

example
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

### set player only mode

example
```js
window.scratch.setPlayerOnly(true)
```

### fullscreen mode

example
```js
window.scratch.setFullScreen(true)
```

### append assets library

You can dynamically add the asset index to the library. You need to await user to open the asset library and then call this method.

The parameter is an array of assets indexes. See the files in 'josn_index' folder.


#### append sprite assets
`window.scratch.pushSpritesLibrary(Arrays)`

#### append costumes assets
`window.scratch.pushCostumesLibrary(Arrays)`

#### append backdrops assets
`window.scratch.pushBackdropsLibrary(Arrays)`

#### append sounds assets
`window.scratch.pushSoundLibrary(Arrays)`

example
```js
window.scratch.pushSoundLibrary(
  [{
        "name": "My Custom Sound",
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

# Appendix

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