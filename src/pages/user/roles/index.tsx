import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva'
import { Row, Col, Button, Form, Table, Drawer, Divider } from 'antd';
import HandleLogs from './components/handleLogs';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const Roles = (props: any) => {
  // const [currentPage, setPage] = useState({})
  const [handleShow, setShow] = useState(false)
  const [record, setRecord] = useState(false)
  const { dispatch } = props

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      align: 'center',
    },
    {
      title: '角色名',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      align: 'center',
    },
    {
      title: '角色备注',
      dataIndex: 'remark',
      align: 'center',
      key: 'remark',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      key: 'createTime',
    },
    {
      title: '修改时间',
      dataIndex: 'lastUpdateTime',
      align: 'center',
      key: 'lastUpdateTime',
    },
    {
      title: '处理人',
      dataIndex: 'lastUpdateBy',
      key: 'lastUpdateBy',
      width: 150,
      align: 'center'
    },
    {
      title: '操作',
      dataIndex: '',
      width: 240,
      // align: 'center',
      key: 'x',
      render: (d: any) => (
        <>
          <Button type="primary" onClick={() => update(d)}>编辑</Button>
          <Divider type="vertical" />
          <Button type="danger" onClick={() => remove(d)}>删除</Button>
        </>
      ),
    },
  ]

  useEffect(() => {
    dispatch({
      type: 'user_roles/fetch',
    })
  }, [])

  const paginationProps = useCallback(() => {
    return {
      showSizeChanger: false,
      showQuickJumper: false,
      ...props.user_roles.pagination
    }
  }, [props.user_roles.pagination])

  const update = useCallback((record: any) => {
    setRecord(record)
    setShow(true)
  }, [])

  const remove = (record: any) => {
    dispatch({
      type: 'user_roles/remove',
      payload: record.id,
      callback: () => {
        dispatch({
          type: 'user_roles/fetch'
        });
      }
    });
  }

  const refreshList = () => {
    dispatch({
      type: 'user_roles/fetch'
    });
  }

  const tableOnChange = (pagination: any) => {
    const { dispatch } = props;

    const params: any = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'user_roles/fetch',
      payload: params,
    });
  };

  return (
    <PageHeaderWrapper>
      <Row>
        <Col>
          <Button type="primary" onClick={() => setShow(true)}>新建</Button>
        </Col>
      </Row>
      <div style={{ height: 25, width: 1 }} />
      <Table
        pagination={paginationProps()}
        onChange={tableOnChange}
        bordered={true}
        columns={columns}
        dataSource={props.user_roles.list}
        rowKey="id"
      />
      <Drawer title="角色信息" visible={handleShow} width={250} onClose={() => { setShow(false) }}>
        {
          handleShow ? (
            <HandleLogs setRecord={setRecord} record={record} dispatch={dispatch} setShow={setShow} refreshList={refreshList} />
          ) : null
        }

      </Drawer>
    </PageHeaderWrapper>
  )
}

export default
  connect(
    ({
      user_roles,
      loading,
    }: {
      user_roles: any;
      loading: {
        models: {
          [key: string]: boolean;
        };
      };
    }) => ({
      user_roles,
      loading: loading.models.rule,
    }),
  )(
    Form.create()(Roles)
  )
