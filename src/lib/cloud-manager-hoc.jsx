import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';

import VM from 'scratch-vm';
import CloudProvider from '../lib/cloud-provider';

import {
    getIsShowingWithId
} from '../reducers/project-state';

import {
    showAlertWithTimeout
} from '../reducers/alerts';

/*
 * Higher Order Component to manage the connection to the cloud server.
 * @param {React.Component} WrappedComponent component to manage VM events for
 * @returns {React.Component} connected component with vm events bound to redux
 */
const cloudManagerHOC = function (WrappedComponent) {
    class CloudManager extends React.Component {
        constructor (props) {
            super(props);
            this.cloudProvider = null;
            bindAll(this, [
                'handleCloudDataUpdate'
            ]);

            this.enable = window.scratchConfig && window.scratchConfig.cloudData && window.scratchConfig.cloudData.enable || false
            this.token = window.scratchConfig && window.scratchConfig.session && window.scratchConfig.session.token,
            this.username = window.scratchConfig && window.scratchConfig.session && window.scratchConfig.session.username || '';
            this.authorUsername = window.scratchConfig && window.scratchConfig.projectInfo && window.scratchConfig.projectInfo.authorUsername,
            this.cloudId = window.scratchConfig && window.scratchConfig.cloudData && window.scratchConfig.cloudData.id
            this.cloudHost = window.scratchConfig && window.scratchConfig.cloudData && window.scratchConfig.cloudData.api


            //动态设置是否开启云变量
            let that = this
            document.addEventListener("setEnableCouldData",function(e){
                that.enable = e.detail.enable;
                window.scratchConfig.cloudData.enable = e.detail.enable;
                that.handleCloudDataUpdate(that.enable)
            })

            window.scratch.setEnableCouldData = function(enable){
                var event = new CustomEvent('setEnableCouldData', {"detail": {enable: enable}});
                document.dispatchEvent(event);
            }

            //动态设置cloudId
            document.addEventListener("setCloudId",function(e){
                if(that.cloudId != e.detail.id){
                    window.scratchConfig.cloudData.id = e.detail.id;
                    that.cloudId = e.detail.id;
                    that.handleCloudDataUpdate(that.enable)
                }
            })

            window.scratch.setCloudId = function(id){
                var event = new CustomEvent('setCloudId', {"detail": {id: id}});
                document.dispatchEvent(event);
            }

            //设置authorUsername
            document.addEventListener("setAuthorUsername",function(e){
                if(that.authorUsername != e.detail.authorUsername){
                    window.scratchConfig.projectInfo.authorUsername = e.detail.authorUsername;
                    that.authorUsername = e.detail.authorUsername;
                    that.handleCloudDataUpdate(that.enable)
                }
            })

            window.scratch.setAuthorUsername = function(authorUsername){
                var event = new CustomEvent('setAuthorUsername', {"detail": {authorUsername: authorUsername}});
                document.dispatchEvent(event);
            }

            this.props.vm.on('HAS_CLOUD_DATA_UPDATE', this.handleCloudDataUpdate);
        }
        componentDidMount () {
            if (this.shouldConnect(this.props)) {
                this.connectToCloud();
            }
        }
        componentDidUpdate (prevProps) {
            // TODO need to add cloud provider disconnection logic and cloud data clearing logic
            // when loading a new project e.g. via file upload
            // (and eventually move it out of the vm.clear function)

            if (this.shouldConnect(this.props) && !this.shouldConnect(prevProps)) {
                this.connectToCloud();
            }

            if (this.shouldDisconnect(this.props, prevProps)) {
                this.disconnectFromCloud();
            }
        }
        componentWillUnmount () {
            this.disconnectFromCloud();
        }
        canUseCloud (props) {
            // return !!(props.cloudHost && props.username && props.vm && props.projectId && props.hasCloudPermission);
            // console.log(props.vm);
            // console.log(props.projectId);
            // console.log(props.hasCloudPermission);
            return this.enable;
        }
        shouldConnect (props) { 
            console.log("should connnet");
            console.log(this.enable);
            console.log(props.vm.runtime.hasCloudData());
            // return !this.isConnected() && this.canUseCloud(props) &&
            //     props.isShowingWithId && props.vm.runtime.hasCloudData() &&
            //     props.canModifyCloudData;
            //如果开启了云变量，且项目包含云变量
            return this.enable && props.vm.runtime.hasCloudData();
        }
        shouldDisconnect (props, prevProps) {
            //如果关闭了云变量，且项目不包含云变量
            return !this.canUseCloud(props)||!props.vm.runtime.hasCloudData();
            return this.isConnected() &&
                ( // Can no longer use cloud or cloud provider info is now stale
                    !this.canUseCloud(props) ||
                    !props.vm.runtime.hasCloudData() ||
                    (props.projectId !== prevProps.projectId) ||
                    (props.username !== prevProps.username) ||
                    // Editing someone else's project
                    !props.canModifyCloudData
                );
        }
        isConnected () {
            return this.cloudProvider && !!this.cloudProvider.connection;
        }
        connectToCloud () {
            this.cloudProvider = new CloudProvider(
                this.cloudHost,
                this.props.vm,
                this.authorUsername,
                this.token,
                this.cloudId);
            this.props.vm.setCloudProvider(this.cloudProvider);
        }
        disconnectFromCloud () {
            if (this.cloudProvider) {
                this.cloudProvider.requestCloseConnection();
                this.cloudProvider = null;
                this.props.vm.setCloudProvider(null);
            }
        }
        handleCloudDataUpdate (projectHasCloudData) {
            if (this.isConnected() && !projectHasCloudData) {
                this.disconnectFromCloud();
            } else if (this.shouldConnect(this.props)) {
                this.props.onShowCloudInfo();
                this.connectToCloud();
            }
        }
        render () {
            const {
                /* eslint-disable no-unused-vars */
                canModifyCloudData,
                projectId,
                // username,
                hasCloudPermission,
                isShowingWithId,
                onShowCloudInfo,
                /* eslint-enable no-unused-vars */
                vm,
                ...componentProps
            } = this.props;
            return (
                <WrappedComponent
                    vm={vm}
                    {...componentProps}
                />
            );
        }
    }

    CloudManager.propTypes = {
        canModifyCloudData: PropTypes.bool.isRequired,
        hasCloudPermission: PropTypes.bool,
        isShowingWithId: PropTypes.bool.isRequired,
        onShowCloudInfo: PropTypes.func,
        projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        vm: PropTypes.instanceOf(VM).isRequired
    };

    CloudManager.defaultProps = {
        hasCloudPermission: false,
        onShowCloudInfo: () => {},
    };

    const mapStateToProps = (state, ownProps) => {
        const loadingState = state.scratchGui.projectState.loadingState;
        return {
            isShowingWithId: getIsShowingWithId(loadingState),
            projectId: state.scratchGui.projectState.projectId,
            // if you're editing someone else's project, you can't modify cloud data
            canModifyCloudData: (!state.scratchGui.mode.hasEverEnteredEditor || ownProps.canSave),
        };
    };

    const mapDispatchToProps = dispatch => ({
        onShowCloudInfo: () => showAlertWithTimeout(dispatch, 'cloudInfo')
    });

    // Allow incoming props to override redux-provided props. Used to mock in tests.
    const mergeProps = (stateProps, dispatchProps, ownProps) => Object.assign(
        {}, stateProps, dispatchProps, ownProps
    );

    return connect(
        mapStateToProps,
        mapDispatchToProps,
        mergeProps
    )(CloudManager);
};

export default cloudManagerHOC;
