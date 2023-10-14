import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import Button from '../button/button.jsx';

import styles from './custom-button.css';

const CustomButton = ({
    className,
    style,
    onClick,
    buttonName
}) => (
    <Button
        className={classNames(
            className,
            styles.customButton
        )}
        style={style}
        onClick={onClick}
    >
        {buttonName}
    </Button>
);

CustomButton.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    buttonName: PropTypes.string
};

CustomButton.defaultProps = {
    onClick: () => {}
};

export default CustomButton;
