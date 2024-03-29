import { Icon, Menu, Spin } from 'antd';
import { ClickParam } from 'antd/es/menu';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';

import { ConnectProps, ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface GlobalHeaderRightProps extends ConnectProps {
  currentUser?: CurrentUser;
  menu?: boolean;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
        dispatch({
          type: 'user/logout'
        })
      }

      return;
    }
    if (key === 'change_pwd') {
      router.push('/account/change_pwd');
      return
    }
    router.push(`/user/${key}`);
  };

  render(): React.ReactNode {
    const { currentUser = {}, menu = false } = this.props;
    // if (!menu) {
    //   return (
    //     <span className={`${styles.action} ${styles.account}`}>
    //       <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
    //       <span className={styles.name}>{currentUser.name}</span>
    //     </span>
    //   );
    // }
    const menuHeaderDropdown = (menu: boolean) => {
      if (menu) {
        return (
          <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
          <Menu.Item key="center">
            <Icon type="user" />
            <FormattedMessage id="menu.account.center" defaultMessage="account center" />
          </Menu.Item>
          <Menu.Item key="settings">
            <Icon type="setting" />
            <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="change_pwd">
            <Icon type="logout" />
            <FormattedMessage id="menu.account.change_pwd" defaultMessage="change_pwd" />
          </Menu.Item>
          <Menu.Item key="logout">
            <Icon type="logout" />
            <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
          </Menu.Item>
        </Menu>
        )
      } else {
        return (
          <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
            <Menu.Item key="change_pwd">
              <Icon type="logout" />
              <FormattedMessage id="menu.account.change_pwd" defaultMessage="change_pwd" />
            </Menu.Item>
            <Menu.Item key="logout">
              <Icon type="logout" />
              <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
            </Menu.Item>
          </Menu>
        )
      }
    }

    return currentUser && currentUser.username ? (
      <HeaderDropdown overlay={menuHeaderDropdown(menu)}>
        <span className={`${styles.action} ${styles.account}`}>
          {/* <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" /> */}
          <span className={styles.name}>欢迎您：{currentUser.username}</span>
        </span>
      </HeaderDropdown>
    ) : (
        <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
      );
  }
}
export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
