import React from 'react'
import { Form, Input, Row, Col, Button, Divider } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import {Dispatch} from 'redux';

const FormItem = Form.Item;
const TextArea = Input.TextArea

interface IFormComponentProps extends FormComponentProps {
  // test: string;
  record: any;
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
    const {dispatch, refreshList, setShow, record} = this.props;
    const { getFieldsValue, validateFields, resetFields } = this.props.form;
    validateFields((err?: any) => {
      if (!err) {
        const data = getFieldsValue();
        if (record && record.id) {
          data.id = record.id
        }
        dispatch({
          type: 'talent_log/add',
          payload: data,
          callback: () => {
            refreshList(1)
            setShow(false)
            resetFields()
          }
        })
      }
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const record = this.props.record || {
      summaryWorkDay: '',
      nextDayWorkSchedule: '',
      problemsProposals: '',
    };
    return (
      <Form>
        <div className="formContent">
          <div className="formTitle">当日工作总结</div>
        </div>
        <FormItem>
          {getFieldDecorator('summaryWorkDay', {
            initialValue: record.summaryWorkDay,
            rules: [
              { required: true, message: '请填写当日工作总结' }
            ]
          })(
            <TextArea rows={7} />
          )}
        </FormItem>
        <div className="formContent">
          <div className="formTitle">次日工作安排</div>
        </div>
        <FormItem>
          {getFieldDecorator('nextDayWorkSchedule', {
            initialValue: record.nextDayWorkSchedule,
            rules: [
              { required: true, message: '请填写次日工作安排' }
            ]
          })(
            <TextArea rows={7} />
          )}
        </FormItem>
        <div className="formContent">
          <div className="formTitle">问题、建议</div>
        </div>
        <FormItem>
          {getFieldDecorator('problemsProposals', {
            initialValue: record.problemsProposals,
          })(
            <TextArea rows={7} />
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
const HandleLogs: any = Form.create()(Handle)
export default HandleLogs
