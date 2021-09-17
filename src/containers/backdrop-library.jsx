import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import VM from 'scratch-vm';

import backdropTags from '../lib/libraries/backdrop-tags';
import LibraryComponent from '../components/library/library.jsx';
import {getBackdropLibrary} from '../lib/assets-api';

const messages = defineMessages({
    libraryTitle: {
        defaultMessage: 'Choose a Backdrop',
        description: 'Heading for the backdrop library',
        id: 'gui.costumeLibrary.chooseABackdrop'
    }
});


class BackdropLibrary extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleItemSelect'
        ]);
        this.state = {
            data: [],
            haveData:false
        };
    }
    componentWillMount (){
        let that = this
        document.addEventListener("pushBackdropsLibrary",function(e){
            console.log("pushBackdropsLibrary");
            let data = e.detail.data.concat(that.state.data)
            that.setState({
                data:data,
                haveData:true
            })
        })
        window.scratch.pushBackdropsLibrary = (data)=>{
            var event = new CustomEvent('pushBackdropsLibrary', {"detail": {data: data}});
            document.dispatchEvent(event);
        };

        if(window.scratchConfig && window.scratchConfig.assets && window.scratchConfig.assets.handleBeforeBackdropsLibraryOpen){
           if(!window.scratchConfig.assets.handleBeforeBackdropsLibraryOpen()){
                return;
           }
        }
        getBackdropLibrary().then(data=>{
            data = data.concat(this.state.data)
            this.setState({
                data:data,
                haveData:true
            })
        })
    }
    handleItemSelect (item) {
        const vmBackdrop = {
            name: item.name,
            rotationCenterX: item.rotationCenterX,
            rotationCenterY: item.rotationCenterY,
            bitmapResolution: item.bitmapResolution,
            skinId: null
        };
        // Do not switch to stage, just add the backdrop
        this.props.vm.addBackdrop(item.md5ext, vmBackdrop);
    }
    render () {
        return !this.state.haveData?"": (
            <LibraryComponent
                data={this.state.data}
                id="backdropLibrary"
                tags={backdropTags}
                title={this.props.intl.formatMessage(messages.libraryTitle)}
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

BackdropLibrary.propTypes = {
    intl: intlShape.isRequired,
    onRequestClose: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default injectIntl(BackdropLibrary);
