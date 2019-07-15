import React, { useCallback } from 'react';
import { Row, Col, Form, Input, Button, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { changPassword } from '@/services/user';
import { connect } from 'dva';

const FormItem = Form.Item;

const ChnagePwd: React.FC<FormComponentProps> = (props: any) => {
  const { getFieldDecorator, getFieldsValue, validateFields } = props.form
  // TODO:: 菜单上面的logo
  // TODO:: 登录不同用户逻辑修改
  const submit = useCallback(() => {
    validateFields((err?: any) => {
      const data = getFieldsValue()
      if (data.resetPassword !== data.rePassword) {
        message.error('两次密码输入不一致')
        return;
      }
      changPassword(data).then(res => {
        if (res.responseCode === 200) {
          message.success('修改密码成功, 请重新登录')
          const { dispatch } = props;
          if (dispatch) {
            dispatch({
              type: 'login/logout',
            });
          }
        } else {
          message.error(res.message || '修改密码失败, 请重试')
        }
        console.log(res, 'res')
      })
    })
  }, [getFieldsValue()])

  const InputStyle = {
    width: 180
  }

  return (
    <Row type="flex" justify="start">
      <Col span={6}>
        <Form layout="vertical">
          <FormItem label="原密码">
            {getFieldDecorator('password', {
              rule: [
                { required: true, message: '请输入原密码' },
              ]
            })(
              <Input type="password" style={InputStyle} placeholder="请输入原密码" />
            )}
          </FormItem>
          <FormItem label="新密码">
            {getFieldDecorator('resetPassword', {
              rule: [
                { required: true, message: '请输入新密码' },
              ]
            })(
              <Input type="password" style={InputStyle} placeholder="请输入新密码" />
            )}
          </FormItem>
          <FormItem label="重复密码">
            {getFieldDecorator('rePassword', {
              rule: [
                { required: true, message: '请再次输入密码' },
              ]
            })(
              <Input type="password" style={InputStyle} placeholder="请再次输入密码" />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={submit}>修改密码</Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
  )
}

export default connect(
  ({
    login,
    loading,
  }: {
    login: any,
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    login,
    loading: loading.models.rule,
  }),
)(
  Form.create()(ChnagePwd)
);
