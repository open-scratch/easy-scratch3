import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import Button from '../button/button.jsx';

import styles from './profile-button.css';

const ProfileButton = ({
    className,
    style,
    onClick,
    buttonName
}) => (
    <Button
        className={classNames(
            className,
            styles.profileButton
        )}
        style={style}
        onClick={onClick}
    >
        {buttonName ? buttonName: "个人中心"}
    </Button>
);

ProfileButton.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    buttonName: PropTypes.string
};

ProfileButton.defaultProps = {
    onClick: () => {}
};

export default ProfileButton;
