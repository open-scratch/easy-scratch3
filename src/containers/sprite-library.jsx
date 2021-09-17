import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl, intlShape, defineMessages} from 'react-intl';
import VM from 'scratch-vm';

import randomizeSpritePosition from '../lib/randomize-sprite-position';
import spriteTags from '../lib/libraries/sprite-tags';

import LibraryComponent from '../components/library/library.jsx';

import {getSpriteLibrary} from '../lib/assets-api';

const messages = defineMessages({
    libraryTitle: {
        defaultMessage: 'Choose a Sprite',
        description: 'Heading for the sprite library',
        id: 'gui.spriteLibrary.chooseASprite'
    }
});

class SpriteLibrary extends React.PureComponent {
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
        document.addEventListener("pushSpriteLibrary",function(e){
            console.log("pushSpriteLibrary");
            let data = e.detail.data.concat(that.state.data)
            that.setState({
                data:data,
                haveData:true
            })
        })
        window.scratch.pushSpriteLibrary = (data)=>{
            var event = new CustomEvent('pushSpriteLibrary', {"detail": {data: data}});
            document.dispatchEvent(event);
        };

        if(window.scratchConfig && window.scratchConfig.assets && window.scratchConfig.assets.handleBeforeSpriteLibraryOpen){
           if(!window.scratchConfig.assets.handleBeforeSpriteLibraryOpen()){
                return;
           }
        }
        getSpriteLibrary().then(data=>{
            data = data.concat(this.state.data)
            this.setState({
                data:data,
                haveData:true
            })
        })
    }
    handleItemSelect (item) {
        // Randomize position of library sprite
        randomizeSpritePosition(item);
        this.props.vm.addSprite(JSON.stringify(item)).then(() => {
            this.props.onActivateBlocksTab();
        });
    }
    render () {
        return !this.state.haveData?"": (
            <LibraryComponent
                data={this.state.data}
                id="spriteLibrary"
                tags={spriteTags}
                title={this.props.intl.formatMessage(messages.libraryTitle)}
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

SpriteLibrary.propTypes = {
    intl: intlShape.isRequired,
    onActivateBlocksTab: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default injectIntl(SpriteLibrary);
