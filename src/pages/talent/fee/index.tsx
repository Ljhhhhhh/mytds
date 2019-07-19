import {
  // Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  message,
  Drawer,
  Badge,
  Upload,
  Icon,
  Modal,
  Alert,
  Popover
} from 'antd';
import React, { Component, Fragment } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
// import moment from 'moment';
import { StateType } from './model';
import HandleForm from './components/HandleForm';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import UpdateForm, { FormValsType } from './components/UpdateForm';
import {exportTrialFee} from '@/services/talent';
import {downloadFile, numberFormat, transformBr} from '@/utils/utils'
import MyEmpty from './components/MyEmpty'
// import Handle from '../handle';
import { TableListItem, TableListPagination, TableListParams } from './data';

import styles from './style.less';
import moment from 'moment';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const confirm = Modal.confirm;
const { Option } = Select;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

// type IStatusMapType = 'default' | 'processing' | 'success' | 'error';
// const statusMap = ['default', 'processing', 'success', 'error'];
// const status = ['关闭', '运行中', '已上线', '异常'];

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  user: any;
  loading: boolean;
  originData: any;
  talent_fee: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
  originData: any;
  pageSize: number;
  markingMap: {[key: string]: {status: 'default' | 'success' | 'processing', text: string}}
}

interface IStatusRender {
  type: 'Delivery' | 'Refund' | 'Evaluate';
  status: 0 | 1;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    talent_fee,
    user,
    loading,
  }: {
    talent_fee: StateType;
    user: any;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    talent_fee,
    user,
    loading: loading.models.rule,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    pageSize: 10,
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    originData: {},
    markingMap: {
      '-1': {text: '无效', status: 'default'},
      '1': {text: '良好', status: 'success'},
      '2': {text: '优秀', status: 'processing'},
    }
  };

  columns: StandardTableColumnProps[] = [
    // {
    //   title: '序号',
    //   dataIndex: 'id',
    //   width: 80
    // },
    {
      title: '添加时间',
      dataIndex: 'createdTime',
      width: 150,
      align: 'center',
      render: (time) => {
        return moment(time).format('YYYY年MM月DD日')
      }
    },
    {
      title: '产品型号',
      dataIndex: 'productModel',
      width: 120,
      align: 'center'
    },
    {
      title: '渠道昵称',
      dataIndex: 'channelNickname',
      width: 120,
      align: 'center',
      className: 'hideMore10',
      render: (field) => {
        const html = transformBr(field, 'html');
        const content = <div dangerouslySetInnerHTML={{__html: html}} />
        return (
          <Popover content={content} placement="topLeft">
            {field || <MyEmpty/>}
          </Popover>
        )
      }
    },
    {
      title: '渠道',
      dataIndex: 'sourcesInformation',
      width: 120,
      align: 'center'
    },
    {
      title: '粉丝量',
      dataIndex: 'fanNumber',
      width: 120,
      align: 'center',
      render: (number) => {
        const value = +number / 10000;
        let cs;
        if (value <= 10) {
          cs = 'statusGreen';
        } else if (value <= 100) {
          cs = 'statusBlue';
        } else {
          cs = 'statusRed';
        }
        return (
          <span className={styles[cs]}>{numberFormat(number)}</span>
        )
      }
    },
    {
      title: '合作方式',
      dataIndex: 'methodCooperation',
      width: 180,
      align: 'center'
    },
    {
      title: '达人评价',
      dataIndex: 'talentMarking',
      width: 120,
      align: 'center',
      render: (value: number | null) => {
        if (value) {
          const obj = this.state.markingMap[value]
          return <Badge text={obj.text} status={obj.status}/>
        } else {
          return <MyEmpty/>
        }
      }
    },
    {
      title: '跟进日期',
      dataIndex: 'followUpDate',
      width: 160,
      align: 'center',
      render: (value: any) => {
        if (value) {
        return (
          <React.Fragment>
            <Badge status='error' />
            <span style={{color: '#f5222d'}}>{moment(value).format('YYYY年MM月DD日')}</span>
          </React.Fragment>)
        } else {
          return <MyEmpty/>
        }
        }
    },
    {
      title: '对接人',
      align: 'center',
      dataIndex: 'buttJoint',
      width: 100,
      render: (value: any) => {
        if (value && value.username) {
          return value.username
        } else {
          return <MyEmpty/>
        }
      }
    },
    {
      title: '操作',
      width: 160,
      align: 'center',
      render: (text, record) => {
        const {isAdmin, id: userId} = this.props.user.currentUser;
        const disabled = !isAdmin && userId !== record.createdAdminId;
        return (
          <Fragment>
            <Button size="small" disabled={disabled} onClick={() => this.updateItem(record)}>编辑</Button>
            <Divider type="vertical" />
            <Button size="small" disabled={disabled} onClick={() => this.delItem(record)} type="danger">删除</Button>
          </Fragment>
        )
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'talent_fee/fetch'
    });
    dispatch({
      type: 'user/fetchUser'
    });
  }
  refreshList = (page?:number) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'talent_fee/fetch',
      payload: {
        currentPage: page || this.props.talent_fee.data.pagination.current
      }
    });
  }

  delItem = (record: any) => {
    const self = this;
    confirm({
      title: '确认要删除吗？',
      onOk() {
        const { dispatch } = self.props;
        dispatch({
          type: 'talent_fee/remove',
          payload: record.id,
          callback: () => {
            self.refreshList()
          }
        });
      },
      onCancel() {},
    });
  }

  updateItem = (record: any) => {
    this.setState({
      originData: record,
      modalVisible: true
    })
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    // this.setState({
    //   canExpand: {}
    // })

    dispatch({
      type: 'talent_fee/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {}
    });
    dispatch({
      type: 'talent_fee/fetch',
      payload: {},
    });
  };

  handleMenuClick = (e: { key: string }) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'talent_fee/remove',
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.rangeTime) {
        const [startTime, endTime] = fieldsValue.rangeTime
        fieldsValue.startTime = +new Date(startTime.format('YYYY-MM-DD'))  - 60 * 60 * 8 * 1000
        fieldsValue.endTime = +new Date(endTime.format('YYYY-MM-DD')) + 60 * 60 * 16 * 1000
        delete fieldsValue.rangeTime
      }
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values
      });

      dispatch({
        type: 'talent_fee/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: FormValsType) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleUpdate = (fields: FormValsType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'talent_fee/update'
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const userList = this.props.user.userList;
    const rangeConfig = {
      rules: [{ type: 'array', message: 'Please select time!' }],
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={6} type="flex">
          <Col md={3} sm={6}>
            <FormItem >
              {getFieldDecorator('buttJointName')(
                <Select placeholder="请选择对接人" style={{ width: '100%' }}>
                  {
                    userList.map((item: any) => {
                      if (item.id === 1) return;
                      return (
                        <Option key={item.id} value={item.username}>{item.username}</Option>
                      )
                    })
                  }
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={3} sm={6}>
            <FormItem>
              {getFieldDecorator('wechatNickname')(<Input placeholder="搜索微信昵称" />)}
            </FormItem>
          </Col>
          <Col md={3} sm={8}>
            <FormItem>
              {getFieldDecorator('channelNickname')(<Input placeholder="搜索渠道昵称" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={12}>
            <Form.Item>
              {getFieldDecorator('rangeTime', rangeConfig)(
                <RangePicker style={{width: 220}} showTime format="YYYY-MM-DD" />,
              )}
            </Form.Item>
          </Col>
          <Col md={3} sm={8}>
            <Form.Item>
              {getFieldDecorator('followUpDate')(
                <DatePicker placeholder="选择跟进日期" style={{width: 130}} format="YYYY-MM-DD" />,
              )}
            </Form.Item>
          </Col>
          <Col md={4} sm={12}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  // statusRender = (type: 'Delivery' | 'Refund' | 'Evaluate' , status: 0 | 1) => {
  statusRender = (props: IStatusRender) => {
    const {type, status} = props
    let text;
    switch (type) {
      case 'Delivery':
        text = '收货'
        break;
      case 'Refund':
        text = '退款'
        break;
      case 'Evaluate':
        text = '评价'
        break;
    }
    if (!status) {
      return (
        <React.Fragment>
          <Badge color='#f5222d' />
          <span style={{color: '#f5222d'}}>未{text}</span>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <Badge color='#096dd9' />
          <span style={{color: '#096dd9'}}>已{text}</span>
        </React.Fragment>
      )
    }
  }

  expandedRowRender = (field: any) => {
    const {isAdmin, id: userId} = this.props.user.currentUser
    if (!isAdmin && userId !== field.createdAdminId) {
      return <Alert message="权限不足，无法查看详情！" type="error" showIcon />
    }
    const html = transformBr(field.getInformation, 'html')
    const content = <div dangerouslySetInnerHTML={{__html: html}} />
    return (
      <React.Fragment>
        <Row className={styles.otherRow}>
          <Col span={2}>联系方式</Col>
          <Col span={3}>链接</Col>
          <Col span={3}>合作效果</Col>
          <Col className='hideMore10' span={3}>领取信息</Col>
          <Col span={2}>是否收货</Col>
          <Col span={2}>是否退款</Col>
          <Col span={2}>是否评价</Col>
          <Col span={3}>来源</Col>
        </Row>
        <Row className={styles.otherRow} align="middle">
          <Col span={2}>{field.phoneNumber}</Col>
          <Col span={3}>{field.link || <MyEmpty/>}</Col>
          <Col span={3}>{field.cooperativeEffect}</Col>
          <Col className='hideMore10' span={3}>
            <Popover content={content} placement="topLeft">
              {field.getInformation || <MyEmpty/>}
            </Popover>
          </Col>
          <Col span={2}>{this.statusRender({
            type: 'Delivery',
            status: field.isDelivery
          })}</Col>
          <Col span={2}>{this.statusRender({
            type: 'Refund',
            status: field.isRefund
          })}</Col>
          <Col span={2}>{this.statusRender({
            type: 'Evaluate',
            status: field.isEvaluate
          })}</Col>
          <Col span={3}>{field.sourcesInformation}</Col>
        </Row>
      </React.Fragment>
    )
  }

  exportExcel = () => {
    const formValues = this.state.formValues;
    const pagination = this.props.talent_fee.data.pagination;
    const params: Partial<TableListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues
    };
    exportTrialFee(params).then(blob => {
      blob && downloadFile(blob, '收费达人.xlsx');
      !blob && message.error('文件导出失败')
    })
  }

  importExcel= {
    showUploadList: false,
    name: 'excel',
    action: 'http://120.77.222.130:8090/fee/lead',
    headers: {
      token: localStorage.getItem('token') || ''
    },
    onChange: (info: any) => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 导入成功`);
        this.refreshList();
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 导入失败`);
      }
    },
  }

  handleAdd = () => {
    this.setState({
      originData: {}
    })
    this.handleModalVisible(true)
  }

  render() {
    const {
      talent_fee: { data },
      loading,
      form,
    } = this.props;

    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    const searchKeyLenth = Object.keys(this.state.formValues).filter((key: string) => {
      if (this.state.formValues[key]) return key;
      return;
    }).length;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={this.handleAdd}>
                新建
              </Button>
              <div>
              {
                this.props.user.currentUser.isAdmin || !searchKeyLenth ? (
                  <Button
                  icon="download"
                  type="dashed"
                  onClick={() => this.exportExcel()}
                >
                  导出
                </Button>
                ) : null
              }
              <Upload {...this.importExcel}>
                <Button>
                  <Icon type="upload" /> 导入
                </Button>
              </Upload>
              </div>
              {selectedRows.length > 0 && (
                <span>
                  <Button type="danger">批量删除</Button>
                </span>
              )}
            </div>
            <StandardTable
              loading={loading}
              scroll={{x: 1400}}
              data={data}
              rowKey="id"
              columns={this.columns}
              onChange={this.handleStandardTableChange}
              expandedRowRender={this.expandedRowRender}
            />

          </div>
        </Card>
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
            form={form}
          />
        ) : null}
        <Drawer
          onClose={() => this.handleModalVisible(false)}
          title="达人资料"
          visible={modalVisible}
          maskClosable={false}
          width={720}>
            {
              modalVisible ? (
                <HandleForm
                  clearData={() => this.setState({
                    originData: {}
                  })}
                  refreshList={this.refreshList}
                  originData={this.state.originData}
                  handleModalVisible={this.handleModalVisible}
                />
              ) : null
            }
        </Drawer>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
