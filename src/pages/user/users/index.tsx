import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva'
import { Row, Col, Button, Form, Table, Drawer, Input, Tag, Divider } from 'antd';
import Handle from './components/handle';
import {queryRole} from '@/services/user'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import MyEmpty from '@/components/MyEmpty'
// import styles from './index.less';

const FormItem = Form.Item

const Users = (props: any) => {
  // const [currentPage, setPage] = useState({})
  const [handleShow, setShow] = useState(false)
  const [record, setRecord] = useState({})
  const [formValues, setFormValues] = useState({})
  const [roleList, setRoles] = useState([])
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
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 180,
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      width: 180,
      align: 'center',
      render: (v: any) => {
        return v ? v : <MyEmpty/>
      }
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 180,
      align: 'center',
      render: (v: any) => {
        return v ? v : <MyEmpty/>
      }
    },
    {
      title: '用户权限',
      dataIndex: 'role',
      key: 'role',
      width: 180,
      align: 'center',
      render: (role: any) => {
        if (role && role.name) return <Tag color="#87d068">{role.name}</Tag>
        return  <MyEmpty/>
      }
    },
    {
      title: '操作',
      dataIndex: '',
      width: 150,
      align: 'center',
      key: 'x',
      render: (d: any) => (
        <>
          <Button type="primary" onClick={() => update(d)}>操作</Button>
          <Divider type="vertical" />
          <Button type="danger" onClick={() => remove(d)}>删除</Button>
        </>
      ),
    },
  ]

  useEffect(() => {
    dispatch({
      type: 'users/fetch',
      payload: props.users.pagination
    })
    queryRole().then(res => {
      // console.log(res.data.list, 'res')
      setRoles(res.data.list)
    })
  }, [])

  const paginationProps = useCallback(() => {
    return {
      showSizeChanger: false,
      showQuickJumper: false,
      ...props.users.pagination
    }
  }, [props.users.pagination])

  const update = useCallback((record: any) => {
    setRecord(record)
    setShow(true)
  }, [])

  const remove = (record: any) => {
    dispatch({
      type: 'users/remove',
      payload: record.id,
      callback: () => {
        // const {current, pageSize, currentPage} = props.users.pagination
        dispatch({
          type: 'users/fetch',
          payload: {
            currentPage: props.users.pagination.current || 1
          }
        });
      }
    })
    // dispatch({
    //   type: 'users/fetch',
    //   payload: {
    //     currentPage: props.users.data.pagination.current || 1
    //   }
    // });
  }

  const refreshList = (page?: number) => {
    dispatch({
      type: 'users/fetch',
      payload: {
        currentPage: page || props.users.pagination.current
      }
    });
  }

  const handleSearch = () => {
    const { getFieldsValue } = form
    const data = getFieldsValue()
    const filterData = Object.keys(data).reduce((obj?: any, key?: any) => {
      const newObj = { ...obj };
      if (data[key] !== undefined && data[key] !== null) {
        newObj[key] = data[key];
        return newObj;
      }
    }, {});
    const params = {
      ...props.users.pagination,
      parameter: {
        ...filterData
      }
    }
    setFormValues(params);
    dispatch({
      type: 'users/fetch',
      payload: params
    })
  }


  const tableOnChange = (pagination: any) => {
    const { dispatch } = props;

    const params: any = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };

    dispatch({
      type: 'users/fetch',
      payload: params,
    });
  };

  return (
    <PageHeaderWrapper>
      <SearchForm handleSearch={handleSearch} setShow={setShow} form={form} />
      <div style={{ height: 25, width: 1 }} />
      <Table
        pagination={paginationProps()}
        onChange={tableOnChange}
        bordered={true}
        columns={columns}
        dataSource={props.users.list}
        rowKey="id"
      />
      <Drawer title="用户资料" visible={handleShow} width={350} onClose={() => { setShow(false) }}>
        {
          handleShow ? (
            <Handle
              setRecord={setRecord}
              record={record}
              dispatch={dispatch}
              setShow={setShow}
              roleList={roleList}
              pagination={paginationProps()}
              refreshList={refreshList}/>
            ) : null
        }
      </Drawer>
    </PageHeaderWrapper>
  )
}

export default
  connect(
    ({
      users,
      user,
      loading,
    }: {
      users: any;
      user: any;
      loading: {
        models: {
          [key: string]: boolean;
        };
      };
    }) => ({
      users,
      user,
      loading: loading.models.rule,
    }),
  )(
    Form.create()(Users)
  )

interface SearchFormProps {
  form: any;
  setShow: any;
  handleSearch: any;
}

const SearchForm = (props: SearchFormProps) => {
  const { setShow, handleSearch, form } = props
  const { getFieldDecorator } = form

  return (
    <>
      <Row>
        <Col span={24}>
          <Form layout="inline">
            <FormItem>
              {
                getFieldDecorator('username')(
                  <Input placeholder="请输入用户名" />
                )
              }
            </FormItem>
            <FormItem>
              {
                getFieldDecorator('mobile')(
                  <Input placeholder="请输入手机号码" />
                )
              }
            </FormItem>
            <FormItem>
              {
                getFieldDecorator('email')(
                  <Input placeholder="请输入邮箱" />
                )
              }
            </FormItem>
            <FormItem>
              <Button icon="search" type="primary" onClick={handleSearch}>搜索</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <Row style={{marginTop: 20}}>
        <Col span={24}>
          <Button type="primary" onClick={() => setShow(true)}>新建</Button>
        </Col>
      </Row>
    </>
  )
}
