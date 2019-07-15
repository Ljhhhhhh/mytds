import React, { useCallback } from 'react';
import { Row, Col, Form, Input, Button, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { createUser } from '@/services/user';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const FormItem = Form.Item;

const AddUser: React.FC<FormComponentProps> = (props: any) => {
  const { getFieldDecorator, getFieldsValue, validateFields, resetFields } = props.form

  const submit = useCallback(() => {
    validateFields((err?: any) => {
      const data = getFieldsValue()
      createUser(data).then(res => {
        if (res.responseCode === 200) {
          message.success(res.message || '添加成功')
          resetFields()
        } else {
          message.error(res.message || '添加失败，请重试')
        }
      })
      // console.log(data, 'data');
    })
  }, [getFieldsValue()])

  const InputStyle = {
    width: 180
  }

  return (
    <PageHeaderWrapper>
      <Row type="flex" justify="start">
        <Col span={6}>
          <Form layout="vertical">
            <FormItem label="姓名">
              {getFieldDecorator('username', {
                rule: [
                  { required: true, message: '请输入姓名' },
                ]
              })(
                <Input style={InputStyle} placeholder="请输入姓名" />
              )}
            </FormItem>
            <FormItem label="初始密码">
              {getFieldDecorator('password', {
                initialValue: '88888888',
                rule: [
                  { required: true, message: '初始密码' },
                ]
              })(
                <Input style={InputStyle} placeholder="请输入初始密码" />
              )}
            </FormItem>
            <FormItem label="昵称(可选)">
              {getFieldDecorator('name', {
                rule: [
                  { required: true, message: '请输入昵称' },
                ]
              })(
                <Input style={InputStyle} placeholder="请输入昵称" />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={submit}>创建用户</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </PageHeaderWrapper>
  )
}

export default Form.create()(AddUser);
