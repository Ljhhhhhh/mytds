import React from 'react'
import { Form, Input, Row, Col, Button } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import {Dispatch} from 'redux';

const FormItem = Form.Item;

interface IFormComponentProps extends FormComponentProps {
  // test: string;
  record: any;
  setRecord: any;
  dispatch: Dispatch;
  setShow: (flag: boolean) => {};
  refreshList: (page?:number) => {}
}

class Handle extends React.Component<IFormComponentProps> {
  constructor(props: IFormComponentProps) {
    super(props);
  }

  setShow = (flag: boolean) => {
    this.props.setShow(flag);
  }

  submit = () => {
    const {dispatch, refreshList, setShow, record, setRecord} = this.props;
    const { getFieldsValue, validateFields, resetFields } = this.props.form;
    validateFields((err?: any) => {
      if (!err) {
        const data = getFieldsValue();
        if (record && record.id) {
          data.id = record.id
        }
        setRecord({})
        dispatch({
          type: 'user_roles/add',
          payload: data,
          callback: () => {
            refreshList()
            setShow(false)
            setRecord({})
            resetFields()
          }
        })
      }
    })
  }

  cancel = () => {
    const { setRecord } = this.props;
    setRecord({})
    this.setShow(false)
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const record = this.props.record || {
      roleName: '',
      mark: '',
    };
    return (
      <Form>
        <FormItem label="角色名称">
          {
            getFieldDecorator('name', {
              initialValue: record.name,
              rules: [
                { required: true, message: '请填写角色名称' },
              ]
            })(
              <Input placeholder="请填写角色名称" />
            )
          }
        </FormItem>
        <FormItem label="角色备注">
          {
            getFieldDecorator('remark', {
              initialValue: record.remark,
              rules: [
                { required: true, message: '请填写角色备注' },
              ]
            })(
              <Input placeholder="请填写角色备注" />
            )
          }
        </FormItem>
        <Row type="flex" justify="space-around">
          <Col><Button type="dashed" onClick={this.cancel}>取消</Button></Col>
          <Col><Button type="primary" onClick={this.submit}>确定</Button></Col>
        </Row>
      </Form>
    )
  }
}
const HandleLogs: any = Form.create()(Handle)
export default HandleLogs
