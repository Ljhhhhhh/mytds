import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva'
import { Row, Col, Button, DatePicker, Form, Select, Table, Drawer, Popover } from 'antd';
import HandleLogs from './components/handleLogs';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';

const RangePicker = DatePicker.RangePicker
const FormItem = Form.Item
const Option = Select.Option

const Logs = (props: any) => {
  // const [currentPage, setPage] = useState({})
  const [handleShow, setShow] = useState(false)
  const [record, setRecord] = useState(false)
  const [formValues, setFormValues] = useState({})
  const { form, dispatch } = props

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      align: 'center',
    },
    {
      title: '日期',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 180,
      align: 'center',
    },
    {
      title: '工作总结',
      // dataIndex: 'x',
      align: 'center',
      key: 'y',
      render: (d: any) => {
        return (
          <div className={styles.summaryWrap}>
            <div className={styles.summary} >
              <span className={styles.summaryTitle}>当日工作总结</span>
              <Popover content={d.summaryWorkDay}>
                  <span className={styles.summaryContent}>{d.summaryWorkDay}</span>
              </Popover>
            </div>
            <div className={styles.summary}>
              <span className={styles.summaryTitle}>次日工作安排</span>
              <Popover content={d.nextDayWorkSchedule}>
                <span className={styles.summaryContent}>{d.nextDayWorkSchedule}</span>
              </Popover>
            </div>
            <div className={styles.summary}>
              <span className={styles.summaryTitle}>问题、建议</span>
                <Popover content={d.problemsProposals}>
                  <span className={styles.summaryContent}>{d.problemsProposals}</span>
                </Popover>
            </div>
          </div>
        )
      }
    },
    {
      title: '处理人',
      dataIndex: 'buttJoint',
      key: 'buttJoint',
      width: 150,
      align: 'center',
      render: (user: any) => (
        user.username
      )
    },
    {
      title: '操作',
      dataIndex: '',
      width: 150,
      align: 'center',
      key: 'x',
      render: (d: any) => <Button type="primary" onClick={() => update(d)}>操作</Button>,
    },
  ]

  useEffect(() => {
    dispatch({
      type: 'talent_log/fetch',
    })
    dispatch({
      type: 'user/fetchUser'
    });
  }, [])

  const paginationProps = useCallback(() => {
    return {
      showSizeChanger: false,
      showQuickJumper: false,
      ...props.talent_log.pagination
    }
  }, [props.talent_log.pagination])

  const update = useCallback((record: any) => {
    setRecord(record)
    setShow(true)
  }, [])

  const refreshList = (page?: number) => {
    dispatch({
      type: 'talent_log/fetch',
      payload: {
        currentPage: page || props.talent_log.data.pagination.current
      }
    });
  }

  const handleSearch = () => {
    const { getFieldsValue } = form
    const data = getFieldsValue()
    // buttJointName
    if (data.range_time && data.range_time.length) {
      const [startTime, endTime] = data.range_time
      data.startTime = +new Date(startTime.format('YYYY-MM-DD')) - 60 * 60 * 8 * 1000
      data.endTime = +new Date(endTime.format('YYYY-MM-DD')) + 60 * 60 * 16 * 1000
    }
    delete data.range_time;

    const filterData = Object.keys(data).reduce((obj?: any, key?: any) => {
      const newObj = { ...obj };
      if (data[key] !== undefined && data[key] !== null) {
        newObj[key] = data[key];
        return newObj;
      }
    }, {});

    const params = {
      ...props.talent_log.pagination,
      parameter: {
        ...filterData
      }
    }
    setFormValues(params);
    dispatch({
      type: 'talent_log/fetch',
      payload: params
    })
  }


  const tableOnChange = (pagination: any) => {
    const { dispatch } = props;
    // const { formValues } = this.state;

    // const filters = Object.keys(filtersArg).reduce((obj, key) => {
    //   const newObj = { ...obj };
    //   newObj[key] = getValue(filtersArg[key]);
    //   return newObj;
    // }, {});

    const params: any = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };

    dispatch({
      type: 'talent_log/fetch',
      payload: params,
    });
  };

  return (
    <PageHeaderWrapper>
      <SearchForm handleSearch={handleSearch} setShow={setShow} form={form} userList={props.user.userList} />
      <div style={{ height: 25, width: 1 }} />
      <Table
        pagination={paginationProps()}
        onChange={tableOnChange}
        bordered={true}
        columns={columns}
        dataSource={props.talent_log.list}
        rowKey="id"
      />
      <Drawer title="工作日志" visible={handleShow} width={650} onClose={() => { setShow(false) }}>
        <HandleLogs record={record} dispatch={dispatch} setShow={setShow} refreshList={refreshList} />
      </Drawer>
    </PageHeaderWrapper>
  )
}

export default
  connect(
    ({
      talent_log,
      user,
      loading,
    }: {
      talent_log: any;
      user: any;
      loading: {
        models: {
          [key: string]: boolean;
        };
      };
    }) => ({
      talent_log,
      user,
      loading: loading.models.rule,
    }),
  )(
    Form.create()(Logs)
  )

interface SearchFormProps {
  form: any;
  setShow: any;
  handleSearch: any;
  userList: any[];
}

const SearchForm = (props: SearchFormProps) => {
  const { setShow, handleSearch, form, userList } = props
  const { getFieldDecorator } = form

  return (
    <>
      <Row>
        <Col span={24}>
          <Form layout="inline">
            <FormItem>
              {getFieldDecorator('range_time')(
                <RangePicker />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('buttJointName')(
                <Select placeholder="请选择处理人" style={{ width: 200 }}>
                  <Option value=''>所有</Option>
                  {
                    userList.map((item: any) => {
                      return (
                        <Option key={item.id} value={item.username}>{item.username}</Option>
                      )
                    })
                  }
                </Select>
              )}
            </FormItem>
            <FormItem>
              <Button icon="search" type="primary" onClick={handleSearch}>搜索</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <Row style={{marginTop: 20}}>
        <Col span={24}>
          <Button type="primary" onClick={() => setShow(true)}>新建日志</Button>
        </Col>
      </Row>
    </>
  )
}
