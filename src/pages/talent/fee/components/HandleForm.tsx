import { Form, Input, Row, Col, DatePicker, Radio, Switch, Button, Divider, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import {connect} from 'dva';
import { Dispatch } from 'redux';
import moment from 'moment';
import { StateType } from '../model';
import styles from '../style.less';

const TextArea = Input.TextArea
const RadioGroup = Radio.Group

interface CreateFormProps extends FormComponentProps{
  handleModalVisible: (flag?: boolean) => void;
  originData: any;
  refreshList: any;
  dispatch: Dispatch<any>;
  talent_fee: any;
}

const HandleForm: React.FC<CreateFormProps> = props => {
  const { form, handleModalVisible, originData } = props;
  const { getFieldDecorator, getFieldsValue, validateFields, resetFields } = form;
  const itemLayout = {
    lg: 10,
    sm: 24
  }
  const MarkingMap = [
    { label: '优秀', value: 2 },
    { label: '良好', value: 1 },
    { label: '无效', value: 0 },
  ]

  const handleCancel = () => {
    handleModalVisible(false);
    resetFields();
  }

  const handleAdd = (container?: boolean) => {
    const { dispatch, refreshList } = props;
    validateFields((err?:any) => {
      if (!err) {
        const data = getFieldsValue();
        if (data.followUpDate) {
          data.followUpDate = data.followUpDate.valueOf()
        }
        data.isRefund = +data.isRefund
        data.isDelivery = +data.isDelivery
        data.isEvaluate = +data.isEvaluate
        const id = originData.id;
        if (id) {
          data.id = id
        }
        dispatch({
          type: 'talent_fee/add',
          payload: data,
          callback: () => {
            refreshList(1)
          }
        });
        message.success('操作成功');
        // resetFields();
        !container && handleModalVisible() && resetFields();
      }
    })
    // this.handleModalVisible();
  };

  return (
    <div>
      <Form layout="vertical" hideRequiredMark>
        <div className="formContent">
          <div className="formTitle">基础信息</div>
          <Row gutter={24}>
            <Col {...itemLayout}>
              <Form.Item label='产品型号'>
                {getFieldDecorator('productModel', {
                  initialValue: originData.productModel,
                  rules: [{ required: true, message: '请输入产品型号' }],
                })(<Input placeholder="请输入产品型号" />)}
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div className="formContent">
          <div className="formTitle">达人信息</div>
          <Row gutter={24} type="flex">
            <Col {...itemLayout}>
              <Form.Item label="渠道昵称">
                {getFieldDecorator('channelNickname', {
                  initialValue: originData.channelNickname,
                  rules: [{ required: true, message: '请输入' }],
                })(
                  <TextArea
                    style={{ width: '100%' }}
                    placeholder="请输入"
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              <Form.Item label="渠道">
                {getFieldDecorator('sourcesInformation', {
                  initialValue: originData.sourcesInformation,
                  rules: [{ required: true, message: '请输入' }],
                })(
                  <TextArea
                    style={{ width: '100%' }}
                    placeholder="请输入"
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              <Form.Item label="粉丝量">
                {getFieldDecorator('fanNumber', {
                  initialValue: originData.fanNumber,
                  rules: [{ required: true, message: '请输入' }],
                })(
                  <Input type="number"
                    style={{ width: '100%' }}
                    placeholder="请输入"
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              <Form.Item label="合作方式">
                {getFieldDecorator('methodCooperation', {
                  initialValue: originData.methodCooperation,
                  rules: [{ required: true, message: '请输入' }],
                })(
                  <TextArea
                    style={{ width: '100%' }}
                    placeholder="请输入"
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              <Form.Item label='链接'>
                {getFieldDecorator('link', {
                  initialValue: originData.link,
                  rules: [{ required: true, message: '请输入链接' }],
                })(<Input placeholder="请输入链接" />)}
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              <Form.Item label='联系方式'>
                {getFieldDecorator('phoneNumber', {
                  initialValue: originData.phoneNumber,
                  rules: [{ required: true, message: '请输入联系方式' }],
                })(<Input placeholder="请输入联系方式" />)}
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              <Form.Item label='合作效果'>
                {getFieldDecorator('cooperativeEffect', {
                  initialValue: originData.cooperativeEffect,
                  rules: [{ required: true, message: '请输入合作效果' }],
                })(<Input placeholder="请输入合作效果" />)}
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div className="formContent">
          <div className="formTitle">其他信息</div>
          <Row gutter={24}>
            <Col {...itemLayout}>
              <Form.Item label='达人打标'>
                {getFieldDecorator('talentMarking', {
                  initialValue: originData.talentMarking,
                })(
                  <RadioGroup options={MarkingMap} />
                )}
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              <Form.Item label="跟进日期">
                {getFieldDecorator('followUpDate', {
                  initialValue: moment(originData.followUpDate),
                })(
                  <DatePicker />
                )}
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              {/* <Form layout="horizontal"> */}
                <Row type="flex">
                  <Col span={24}>
                    <Form.Item label='是否收货' labelCol={{ span: 6 }} >
                      {getFieldDecorator('isDelivery', {
                        valuePropName: 'checked',
                        initialValue: !!originData.isDelivery,
                      })(
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label='是否退款' labelCol={{ span: 6 }}>
                      {getFieldDecorator('isRefund', {
                        valuePropName: 'checked',
                        initialValue: !!originData.isRefund,
                      })(
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label='是否评价' labelCol={{ span: 6 }}>
                      {getFieldDecorator('isEvaluate', {
                        valuePropName: 'checked',
                        initialValue: !!originData.isEvaluate,
                      })(
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              {/* </Form> */}
            </Col>
            <Col {...itemLayout}>
              <Form.Item label='领取信息'>
                {getFieldDecorator('getInformation', {
                    initialValue: originData.getInformation,
                  })(
                  <Input placeholder="请输入" />
                )}
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
      <div style={{width: 1, height: 15}} />
      <Row type="flex" justify="end" className={styles.drawerFooter}>
        <Col>
          <Button size="large" type="ghost" onClick={handleCancel} >取消</Button>
          <Divider type="vertical" />
          <Button size="large" type="dashed" onClick={() => handleAdd(true)}>继续添加</Button>
          <Divider type="vertical" />
          <Button size="large" type="primary" onClick={() => handleAdd(false)}>确认</Button>
        </Col>
      </Row>
      <div style={{width: 1, height: 15}}/>
    </div>
  );
};

const IForm =
connect(
  ({
    talent_fee,
    loading,
  }: {
    talent_fee: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    talent_fee,
    loading: loading.models.rule,
  }),
)(Form.create()(HandleForm))
export default IForm;
