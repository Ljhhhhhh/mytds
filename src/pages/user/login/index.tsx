import React, { useCallback, useEffect, useState } from 'react';
import { Form, Input, Button, Icon } from 'antd';
import { FormComponentProps } from 'antd/es/form';
// import { Dispatch } from 'redux';
import { StateType } from './model';
import { connect } from 'dva';
import styles from './style.less';
import loginBg from '@/assets/login_bg.png';
import logoRed from '@/assets/logo_red.png';

const FormItem = Form.Item;

const Login: React.FC<FormComponentProps> = (props: any) => {
  const { getFieldDecorator, getFieldsValue, validateFields } = props.form;
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight(window.innerHeight)
  }, [])

  const submit = useCallback(() => {
    validateFields((err?: any) => {
      const { dispatch } = props;
      const data = getFieldsValue();
      dispatch({
        type: 'userLogin/login',
        payload: data
      });
    })
  }, [getFieldsValue()])

  return (
    <div className={styles.container} style={{ height }}>
      <div className={styles.loginBg}>
        <img src={loginBg} />
      </div>
      <div className={styles.content}>
        <div className={styles.formWrap}>
          <div className={styles.formTitle}>
            <img src={logoRed} alt="logo"/>
            <span>美一天电商</span>
          </div>
          <Form layout="horizontal" >
            <FormItem>
              {
                getFieldDecorator('username', {
                  rule: [
                    { required: true, message: '请输入姓名' },
                  ]
                })(
                  <Input
                    prefix={<Icon type="user" />}
                    style={{width: 300}}
                    placeholder="请输入姓名" />
                )
              }
            </FormItem>
            <FormItem>
              {
                getFieldDecorator('password', {
                  rule: [
                    { required: true, message: '请输入密码' },
                  ]
                })(
                  <Input
                    prefix={<Icon type="lock" />}
                    style={{width: 300}}
                    type="password"
                    placeholder="请输入密码" />
                )
              }
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={submit}>登录</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
    // <div className={styles.main}>

    // </div>
  )
}

export default connect(
  ({
    userLogin,
    loading,
  }: {
    userLogin: StateType;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    userLogin,
    submitting: loading.effects['userLogin/login'],
  }),
)(Form.create()(Login));
