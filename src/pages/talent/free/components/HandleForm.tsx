import { Form, Input, Row, Col, DatePicker, Radio, Switch, Icon, Button, Divider, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import moment from 'moment';
import { StateType } from '../model';
import styles from '../style.less';

const TextArea = Input.TextArea
const RadioGroup = Radio.Group

interface CreateFormProps extends FormComponentProps {
  handleModalVisible: (flag?: boolean) => void;
  originData: any;
  refreshList: any;
  dispatch: Dispatch<any>;
  talent: any;
}

const HandleForm: React.FC<CreateFormProps> = props => {
  const [trialTalentInfos, setTrialTalentInfos]: [any[], any] = useState([])
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

  useEffect(() => {
    const newValue = [
      {
        content: '',
        ditch: '',
        readNumber: '',
        evaluationReward: ''
      }
    ]
    if (originData.trialTalentInfos) {
      const list = [...originData.trialTalentInfos] || newValue;
      setTrialTalentInfos(list)
    } else {
      setTrialTalentInfos(newValue)
    }
    // const list = [...originData.trialTalentInfos] || [];
    // setTrialTalentInfos(list)
  }, [originData])

  const valueChnage = (e: any, type: string, index: number) => {
    const newList = trialTalentInfos.map((value: any, idx: number) => {
      if (idx === index) {
        value[type] = e.currentTarget.value
      }
      return value
    })
    setTrialTalentInfos(newList);
  }

  const removeField = (idx: number) => {
    trialTalentInfos.splice(idx, 1);
    setTrialTalentInfos([...trialTalentInfos])
  }

  const addField = () => {
    const newValue = [
      {
        content: '',
        ditch: '',
        readNumber: '',
        evaluationReward: ''
      }
    ]
    const newList = [...trialTalentInfos].concat(newValue)
    setTrialTalentInfos(newList)
    // const newItem = contentLength.length ? contentLength[contentLength.length -1] + 1 : 1
    // const d = [...contentLength, newItem];
    // setContentLength(d)
  }

  const handleCancel = () => {
    handleModalVisible(false);
    resetFields();
    const value = {
      content: '',
      ditch: '',
      readNumber: '',
      evaluationReward: ''
    }
    setTrialTalentInfos([value])
  }

  const handleAdd = (container?: boolean) => {
    const { dispatch, refreshList } = props;
    validateFields((err?: any) => {
      if (!err) {
        const data = getFieldsValue();
        if (data.followUpDate) {
          data.followUpDate = data.followUpDate.valueOf()
        }
        data.isRefund = +data.isRefund
        data.isDelivery = +data.isDelivery
        data.isEvaluate = +data.isEvaluate
        data.trialTalentInfos = trialTalentInfos;
        const id = originData.id;
        if (id) {
          data.id = id
        }
        dispatch({
          type: 'talent/add',
          payload: data,
          callback: () => {
            refreshList(1)
          }
        });
        message.success('操作成功');
        const value = {
          content: '',
          ditch: '',
          readNumber: '',
          evaluationReward: ''
        }
        setTrialTalentInfos([value]);
        if (!container) {
          handleModalVisible();
          resetFields()
        }
      }
    })
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
            <Col {...itemLayout}>
              <Form.Item label="来源">
                {getFieldDecorator('sourcesInformation', {
                  initialValue: originData.sourcesInformation,
                  rules: [{ required: true, message: '请输入来源' }],
                })(
                  <Input
                    style={{ width: '100%' }}
                    placeholder="请输入来源"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div className="formContent">
          <div className="formTitle">达人信息</div>
          <Row gutter={24} type="flex">
            <Col {...itemLayout}>
              <Form.Item label='微信昵称'>
                {getFieldDecorator('wechatNickname', {
                  initialValue: originData.wechatNickname,
                  rules: [{ required: true, message: '请输入微信昵称' }],
                })(<Input placeholder="请输入微信昵称" />)}
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              <Form.Item label="微信账号">
                {getFieldDecorator('wechatAccount', {
                  initialValue: originData.wechatAccount,
                  rules: [{ required: true, message: '请输入微信账号' }],
                })(
                  <Input
                    style={{ width: '100%' }}
                    placeholder="请输入微信账号"
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              <Form.Item label="联系电话">
                {getFieldDecorator('phoneNumber', {
                  initialValue: originData.phoneNumber,
                  rules: [{ required: true, message: '请输入联系电话' }],
                })(
                  <Input
                    style={{ width: '100%' }}
                    placeholder="请输入联系电话"
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              <Form.Item label="粉丝总量估计">
                {getFieldDecorator('totalFanEstimate', {
                  initialValue: originData.totalFanEstimate,
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
              <Form.Item label="主力渠道">
                {getFieldDecorator('mainChannel', {
                  initialValue: originData.mainChannel,
                  rules: [{ required: true, message: '请输入主力渠道' }],
                })(
                  <Input
                    style={{ width: '100%' }}
                    placeholder="请输入主力渠道"
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...itemLayout}>
              <Form.Item label="主力渠道粉丝量">
                {getFieldDecorator('mainChannelFansNumber', {
                  initialValue: originData.mainChannelFansNumber,
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
              <Form.Item label="简介">
                {getFieldDecorator('introduction', {
                  initialValue: originData.introduction,
                  rules: [{ required: true, message: '请输入' }],
                })(
                  <TextArea
                    style={{ width: '100%' }}
                    placeholder="请输入"
                  />
                )}
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
                  <TextArea placeholder="请输入" />
                )}
              </Form.Item>
            </Col>
          </Row>
          {/* {
            trialTalentInfos.length ? (
              <Row className={styles.rowBt}>
              <Col span={4}>渠道</Col>
              <Col span={4}>阅读</Col>
              <Col span={12}>评价奖励</Col>
            </Row>
            ) : null
          } */}
          {
            ContentField({
              list: trialTalentInfos,
              removeField,
              valueChnage
              // getFieldDecorator,
              // form,
              // list: originData.trialTalentInfos
            })
          }
          <Row type="flex" justify="center" style={{ marginBottom: 30 }}>
            <Col><Button type="dashed" icon="plus" onClick={addField}>添加信息</Button></Col>
          </Row>
        </div>
      </Form>
      <div style={{ width: 1, height: 15 }} />
      <Row type="flex" justify="end" className={styles.drawerFooter}>
        <Col>
          <Button size="large" type="ghost" onClick={handleCancel} >取消</Button>
          <Divider type="vertical" />
          <Button size="large" type="dashed" onClick={() => handleAdd(true)}>继续添加</Button>
          <Divider type="vertical" />
          <Button size="large" type="primary" onClick={() => handleAdd(false)}>确认</Button>
        </Col>
      </Row>
      <div style={{ width: 1, height: 15 }} />
    </div>
  );
};

interface ContentFieldProp {
  len?: number[];
  removeField: any;
  valueChnage: any;
  form?: any,
  list: any[]
}

const ContentField = (props: ContentFieldProp) => {
  const { list, removeField, valueChnage } = props;
  // const [modalShow, setModalShow] = useState(false);
  // const [content, setContent] = useState('');
  // const [idx, setIdx] = useState(-1);

  // const onOpen = (idx: number) => {
  //   setContent(list[idx].content);
  //   setIdx(idx)
  //   setModalShow(true);
  // }

  // const onOk = () => {
  //   setModalShow(false);
  // }

  // const onCancel = (idx: number) => {
  //   console.log(idx, content)
  //   list[idx].content = content;
  //   setModalShow(false);
  // }

  return list.map((val: any, idx: number) => {
    const data = list[idx];

    // const ContentArea = (i: number):any => {
    //   console.log(idx, 'idx')
    //   return (
    //     <Form.Item>
    //       <TextArea
    //       onChange={(e) => valueChnage(e, 'content', idx)}
    //       value={data.content}
    //       placeholder="请填写内容"
    //       rows={10}
    //       />
    //     </Form.Item>
    //   )
    // }

    return (
      <React.Fragment key={idx}>
        <Row className={styles.rowBt}>
          <Col span={4}>渠道</Col>
          <Col span={4}>阅读</Col>
          <Col span={12}>评价奖励</Col>
        </Row>
        <Row>
          <Col span={4}>
            <Form.Item>
              <Input onChange={(e) => valueChnage(e, 'ditch', idx)} placeholder="渠道" value={data.ditch} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              <Input onChange={(e) => valueChnage(e, 'readNumber', idx)} type="number" placeholder="阅读量" value={data.readNumber} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item>
              <Input onChange={(e) => valueChnage(e, 'evaluationReward', idx)} placeholder="请输入奖励内容" value={data.evaluationReward} />
            </Form.Item>

            {/* <Input
             readOnly
             placeholder="请填写内容"
             value={data.content}
             onClick={() => {onOpen(idx)}}
           />
           <Modal
             title="填写内容"
             visible={modalShow}
             onOk={onOk}
             onCancel={() => onCancel(idx)}
             okText="确认"
             cancelText="取消"
           >
             {ContentArea(idx)}
           </Modal> */}
          </Col>
          <Col span={2}>
            <Icon onClick={() => removeField(idx)} type="minus-circle" className={styles.handleIcon} />
          </Col>
        </Row>
        <Row className={styles.rowBt}>
          <Col span={20}>
            <Form.Item label="内容">
              <TextArea onChange={(e) => valueChnage(e, 'content', idx)} placeholder="内容" value={data.content} />
            </Form.Item>
          </Col>
        </Row>
      </React.Fragment>
    )
  })
}

const IForm =
  connect(
    ({
      talent,
      loading,
    }: {
      talent: StateType;
      loading: {
        models: {
          [key: string]: boolean;
        };
      };
    }) => ({
      talent,
      loading: loading.models.rule,
    }),
  )(Form.create()(HandleForm))
export default IForm;
