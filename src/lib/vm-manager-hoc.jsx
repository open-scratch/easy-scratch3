import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import VM from 'scratch-vm';
import AudioEngine from 'scratch-audio';

import {
    openLoadingProject,
    closeLoadingProject
} from '../reducers/modals';
import {setProjectUnchanged} from '../reducers/project-changed';
import {
    LoadingStates,
    getIsLoadingWithId,
    onLoadedProject,
    projectError
} from '../reducers/project-state';

/*
 * Higher Order Component to manage events emitted by the VM
 * @param {React.Component} WrappedComponent component to manage VM events for
 * @returns {React.Component} connected component with vm events bound to redux
 */
const vmManagerHOC = function (WrappedComponent) {
    class VMManager extends React.Component {
        constructor (props) {
            super(props);
            bindAll(this, [
                'loadProject'
            ]);
        }
        componentDidMount () {
            var that = this
            document.addEventListener("loadProject",function(e){
                setTimeout(()=>{
                    that.loadProjectByURL(e.detail.url, e.detail.projectName, e.detail.callback)
                }, 800)
            })
            document.addEventListener("getProjectFile",function(e){
                that.getProjectFile(e.detail.callback)
            })
            document.addEventListener("getProjectCover",function(e){    
                that.getProjectCover(e.detail.callback)
            })
            window.scratch = window.scratch || {}

            window.scratch.getProjectCover = (callback)=>{
                var event = new CustomEvent('getProjectCover', {"detail": {callback: callback}});
                document.dispatchEvent(event);
            }
            
            window.scratch.getProjectFile = (callback)=>{
                var event = new CustomEvent('getProjectFile', {"detail": {callback: callback}});
                document.dispatchEvent(event);
            }

            window.scratch.loadProject = (url, projectName, callback)=>{
                var event = new CustomEvent('loadProject', {"detail": {url: url,projectName:projectName,callback:callback }});
                 document.dispatchEvent(event);
            }

            

            if (!this.props.vm.initialized) {
                this.audioEngine = new AudioEngine();
                this.props.vm.attachAudioEngine(this.audioEngine);
                this.props.vm.setCompatibilityMode(true);
                this.props.vm.initialized = true;
                this.props.vm.setLocale(this.props.locale, this.props.messages);
            }
            if (!this.props.isPlayerOnly && !this.props.isStarted) {
                this.props.vm.start();
            }
            if(window.scratchConfig && 'handleVmInitialized' in window.scratchConfig){
                window.scratchConfig.handleVmInitialized(this.props.vm)
            }

        }
        componentDidUpdate (prevProps) {
            // if project is in loading state, AND fonts are loaded,
            // and they weren't both that way until now... load project!
            if (this.props.isLoadingWithId && this.props.fontsLoaded &&
                (!prevProps.isLoadingWithId || !prevProps.fontsLoaded)) {
                this.loadProject();
            }
            // Start the VM if entering editor mode with an unstarted vm
            if (!this.props.isPlayerOnly && !this.props.isStarted) {
                this.props.vm.start();
            }
        }
        getProjectFile(callback){
            this.props.vm.saveProjectSb3().then(res=>{
                callback(res)
            })          
        }
        getProjectCover (callback) {
            this.props.vm.postIOData('video', {forceTransparentPreview: true});
            this.props.vm.renderer.requestSnapshot(dataURI => {
                this.props.vm.postIOData('video', {forceTransparentPreview: false});
                callback(dataURI);
            });
            this.props.vm.renderer.draw();
        }
        loadProjectByURL(url, projectName, callback){
            console.log("从URL加载项目" + url)
            // this.props.onLoadingStarted()
            // this.props.vm.clear()
            return fetch(url).then(r => r.blob()).then(blob => {
                  const reader = new FileReader();
                  reader.onload = () => {
                      this.props.vm.loadProject(reader.result).then(()=>{
                        // this.props.onUpdateProjectTitle(projectName)
                        //   this.props.onLoadedProject(this.props.loadingState, this.props.canSave);
                          setTimeout(() => this.props.onSetProjectUnchanged());
                          if (!this.props.isStarted) {
                            setTimeout(() => this.props.vm.renderer.draw());    
                          }
                          callback()
                      })
                      .catch(e => {
                        this.props.onError(e);
                      });
                  };
                  reader.readAsArrayBuffer(blob);
            });
        }
        loadProjectByData(data, projectName, callback){
            console.log("从文件加载项目:" + projectName)
            console.log(this.props)
            this.props.onLoadingStarted()
            return this.props.vm.loadProject(data).then(()=>{
                setProjectTitle(projectName)
                setTimeout(() => this.props.onSetProjectUnchanged());
                if (!this.props.isStarted) {
                  setTimeout(() => this.props.vm.renderer.draw());    
                }
                this.props.closeLoadingProject();
                this.props.onLoadedProject(this.props.loadingState, this.props.canSave);
                callback()
            }).catch(e => {
                this.props.onError(e);
            });
        }
        loadProject () {
            return this.props.vm.loadProject(this.props.projectData)
                .then(() => {
                    this.props.onLoadedProject(this.props.loadingState, this.props.canSave);
                    // Wrap in a setTimeout because skin loading in
                    // the renderer can be async.
                    setTimeout(() => this.props.onSetProjectUnchanged());

                    // If the vm is not running, call draw on the renderer manually
                    // This draws the state of the loaded project with no blocks running
                    // which closely matches the 2.0 behavior, except for monitors–
                    // 2.0 runs monitors and shows updates (e.g. timer monitor)
                    // before the VM starts running other hat blocks.
                    if (!this.props.isStarted) {
                        // Wrap in a setTimeout because skin loading in
                        // the renderer can be async.
                        setTimeout(() => this.props.vm.renderer.draw());
                    }
                })
                .catch(e => {
                    this.props.onError(e);
                });
        }
        render () {
            const {
                /* eslint-disable no-unused-vars */
                fontsLoaded,
                loadingState,
                locale,
                messages,
                isStarted,
                onError: onErrorProp,
                onLoadedProject: onLoadedProjectProp,
                onLoadingStarted,
                onSetProjectUnchanged,
                projectData,
                /* eslint-enable no-unused-vars */
                isLoadingWithId: isLoadingWithIdProp,
                vm,
                ...componentProps
            } = this.props;
            return (
                <WrappedComponent
                    isLoading={isLoadingWithIdProp}
                    vm={vm}
                    {...componentProps}
                />
            );
        }
    }

    VMManager.propTypes = {
        canSave: PropTypes.bool,
        cloudHost: PropTypes.string,
        fontsLoaded: PropTypes.bool,
        isLoadingWithId: PropTypes.bool,
        isPlayerOnly: PropTypes.bool,
        isStarted: PropTypes.bool,
        loadingState: PropTypes.oneOf(LoadingStates),
        locale: PropTypes.string,
        messages: PropTypes.objectOf(PropTypes.string),
        onError: PropTypes.func,
        onLoadedProject: PropTypes.func,
        onSetProjectUnchanged: PropTypes.func,
        projectData: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
        projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        username: PropTypes.string,
        vm: PropTypes.instanceOf(VM).isRequired,
        onLoadingStarted: PropTypes.func,

    };

    const mapStateToProps = state => {
        const loadingState = state.scratchGui.projectState.loadingState;
        return {
            fontsLoaded: state.scratchGui.fontsLoaded,
            isLoadingWithId: getIsLoadingWithId(loadingState),
            locale: state.locales.locale,
            messages: state.locales.messages,
            projectData: state.scratchGui.projectState.projectData,
            projectId: state.scratchGui.projectState.projectId,
            loadingState: loadingState,
            isPlayerOnly: state.scratchGui.mode.isPlayerOnly,
            isStarted: state.scratchGui.vmStatus.started
        };
    };

    const mapDispatchToProps = dispatch => ({
        onError: error => dispatch(projectError(error)),
        onLoadedProject: (loadingState, canSave) =>{
            try{
                dispatch(closeLoadingProject());
                dispatch(onLoadedProject(loadingState, canSave, true))
            }catch(e){

            }
        },
        onSetProjectUnchanged: () => dispatch(setProjectUnchanged()),
        onLoadingStarted: () => dispatch(openLoadingProject()),
    });

    // Allow incoming props to override redux-provided props. Used to mock in tests.
    const mergeProps = (stateProps, dispatchProps, ownProps) => Object.assign(
        {}, stateProps, dispatchProps, ownProps
    );

    return connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps
    )(VMManager);
};

export default vmManagerHOC;
