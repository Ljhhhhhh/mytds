import React from 'react'
import { Form, Input, Row, Col, Button, Radio, Divider, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import {Dispatch} from 'redux';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

interface IFormComponentProps extends FormComponentProps {
  // test: string;
  record: any;
  setRecord: any;
  dispatch: Dispatch;
  roleList: any[];
  pagination: any;
  setShow: (flag: boolean) => {};
  refreshList: (page?:number) => {}
}

class Handle extends React.Component<IFormComponentProps> {
  constructor(props: IFormComponentProps) {
    super(props);
  }

  setShow = (flag: boolean) => {
    const { setRecord } = this.props;
    setRecord({})
    this.props.setShow(flag);
  }

  submit = () => {
    const {dispatch, refreshList, setShow, record, setRecord, pagination} = this.props;
    const { getFieldsValue, validateFields } = this.props.form;
    validateFields((err?: any) => {
      if (!err) {
        const data = getFieldsValue();
        let type = 'users/add'
        if (record && record.id) {
          data.id = record.id
          type = 'users/update'
        }
        // setRecord({})
        dispatch({
          type,
          payload: data,
          callback: () => {
            let page = 1;
            if (type === 'users/update') {
              page = pagination.current;
            }
            refreshList(page)
            setShow(false)
            setRecord({})
          }
        })
      } else {
        message.error('填写有误，请坚持核对')
      }
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const record = Object.assign({}, {
      username: '',
      password: '88888888',
      name: '',
      mobile: '',
      email: '',
      roleId: ''
    }, this.props.record)
    return (
      <Form layout="vertical" labelCol={{span: 6}}>
        <FormItem label="用户名">
          {getFieldDecorator('username', {
            initialValue: record.username,
            rules: [
              { required: true, message: '用户名' }
            ]
          })(
            <Input placeholder="请填写用户名" />
          )}
        </FormItem>
        {
          this.props.record && this.props.record.id ? null : (
            <FormItem label="密码">
              {getFieldDecorator('password', {
                initialValue: record.password,
                rules: [
                  { required: true, message: '密码' }
                ]
              })(
                <Input placeholder="请填写密码" />
              )}
            </FormItem>
          )
        }
        <FormItem label="昵称">
          {getFieldDecorator('name', {
            initialValue: record.name
          })(
            <Input placeholder="请填写昵称" />
          )}
        </FormItem>
        <FormItem label="角色">
          {getFieldDecorator('roleId', {
            // valuePropName: 'checked',
            initialValue: record.roleId
          })(
            <RadioGroup>
              {
                this.props.roleList.map((role: any) => {
                  return <Radio key={role.id} value={role.id}>{role.name}</Radio>
                })
              }
            </RadioGroup>
          )}
        </FormItem>
        <FormItem label="手机号码">
          {getFieldDecorator('mobile', {
            initialValue: record.mobile
          })(
            <Input placeholder="请填写手机号" />
          )}
        </FormItem>
        <FormItem label="邮箱">
          {getFieldDecorator('email', {
            initialValue: record.email
          })(
            <Input placeholder="请填写邮箱" />
          )}
        </FormItem>
        <Row type="flex" justify="end" className="drawerFooter">
          <Col>
            <Button type="ghost" onClick={() => {this.setShow(false)}} >取消</Button>
            <Divider type="vertical" />
            <Button type="primary" onClick={this.submit}>确认</Button>
          </Col>
        </Row>
      </Form>

    )
  }
}
const HandleForm: any = Form.create()(Handle)
export default HandleForm
