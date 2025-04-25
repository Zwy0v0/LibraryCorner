import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Select, Space, Row, Col, Table, Image, message, Tag } from 'antd';
import dayjs from "dayjs";
import { all } from "axios";
import { getUserList, updateUser, userDelete } from "../api/user";
import { createLimiter } from '../utils/throttleDebounce';



const COLUMNS = [
  {
    title: 'name',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: 'nickName',
    dataIndex: 'nickName',
    key: 'nickName',
    width: 200,
  },
  {
    title: 'role',
    dataIndex: 'role',
    key: 'role',
    width: 160,
    render: (text) => {
      let color = text === 'admin' ? 'volcano' : 'blue';
      return <Tag color={color}>{text}</Tag>;
    }
  },
  {
    title: 'status',
    dataIndex: 'status',
    key: 'status',
    width: 160,
    render: (text) => {
      return text === "forbidden" ? (<Tag color="red">forbidden</Tag>) : (<Tag color="green">normal</Tag>)
    }
  },
  {
    title: 'createAt',
    dataIndex: 'createAt',
    key: 'createAt',
    width: 160,
    render: (text) => dayjs(text).format('YYYY-MM-DD')
  },
];

function Users() {
  const navigate = useNavigate();
  const [form] = Form.useForm()
  const [categoryList, setCategoryList] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
    showSizeChanger: true
  })

  const [data, setData] = useState([])
  const [messageApi, contextHolder] = message.useMessage();

  async function fetchData(values) {
    const res = await getUserList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...values
    })
    const data = res.data
    setData(data)
    setCategoryList(data)
    setPagination({ ...pagination, current: pagination.current, total: res.total })
    // console.log(data);
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSearchFinish = createLimiter(async (values) => {
    const res = await getUserList({ ...values, current: 1, pageSize: pagination.pageSize });
    setData(res.data);
    setPagination({ ...pagination, current: 1, total: res.total });
  }, 500);
  const handleSearchReset = () => {
    form.resetFields()
  }

  const handleBookEdit = (id) => { navigate(`/users/edit/${id}`); }
  // const handleBookEdit = () => { navigate(`/books/edit/:id`); }

  const handleTableChange = createLimiter(async (pagination) => {
    setPagination(pagination);
    const query = form.getFieldsValue();
    const res = await getUserList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query,
    });
    setData(res.data);
    setPagination({ ...pagination, total: res.total });
  }, 500); // 延迟500ms


  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const handleBookDelete = (id) => {
    setDeleteId(id);        // 记录要删除的 id
    setShowConfirm(true);   // 显示弹窗
  };

  const handleForbid = createLimiter(async (id, currentStatus) => {
    const newStatus = currentStatus === "forbidden" ? "normal" : "forbidden";
    try {
      await updateUser(id, { status: newStatus });
      messageApi.open({ type: 'success', content: 'Status updated successfully' });
    } catch (error) {
      const msg = error?.response?.data?.message || 'Status update failed!';
      messageApi.open({ type: 'error', content: msg });
    }
    await fetchData(form.getFieldsValue());
  }, 500); // 延迟500ms


  const columns = COLUMNS.concat([
    {
      title: 'action', key: 'action', render: (col, row) => {
        return <Space>
          <Button type="link" onClick={() => handleBookEdit(row._id)}>edit</Button>
          <Button
            type="link"
            danger={row.status !== "forbidden"}
            onClick={() => handleForbid(row._id, row.status)}
          >
            {row.status === "forbidden" ? "enable" : "forbid"}
          </Button>
          <Button type="link" danger onClick={() => handleBookDelete(row._id)}>delete</Button>
        </Space>
      }
    }
  ])

  return (
    <>
      {contextHolder}
      <Form
        name="search"
        form={form}
        // layout="inline"
        onFinish={handleSearchFinish}
        initialValues={{
          name: "",
          author: "",
          category: ""
        }}
      >
        <Row gutter={24}>
          <Col span={7}>
            <Form.Item name="name" label="name"
              style={{ width: '100%' }}
              labelCol={{ flex: '80px' }}
              wrapperCol={{ flex: 'auto' }}>
              <Input
                allowClear
                placeholder="Please enter..."
              // options={categoryList.map(item => ({ label: item.name, value: item.name }))}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="status" label="status"
              style={{ width: '100%' }}
              labelCol={{ flex: '80px' }}
              wrapperCol={{ flex: 'auto' }}>
              <Select
                allowClear
                placeholder="Please select..."
                options={[
                  { value: "normal", label: 'normal' },
                  { value: "forbidden", label: 'forbidden' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="role" label="role"
              style={{ width: '100%' }}
              labelCol={{ flex: '80px' }}
              wrapperCol={{ flex: 'auto' }}>
              <Select
                allowClear
                placeholder="Please select..."
                options={[
                  { value: "admin", label: 'admin' },
                  { value: "user", label: 'user' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
                <Button htmlType="submit" onClick={handleSearchReset}>
                  Clear
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="_id"
        scroll={{ x: 1000 }}
        onChange={handleTableChange}
        pagination={{ ...pagination, showTotal: () => `A total of ${pagination.total}` }}
      />
      {showConfirm && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <p>Are you sure you want to delete this category?</p>
            <Space>
              <Button danger onClick={async () => {
                // setShowConfirm(false);
                try {
                  await userDelete(deleteId);
                  messageApi.open({ type: 'success', content: 'Deleted Success!' });
                  const newTotal = pagination.total - 1;
                  const totalPages = Math.ceil(newTotal / pagination.pageSize);
                  const newCurrent = pagination.current > totalPages ? totalPages : pagination.current;

                  setPagination({ ...pagination, current: newCurrent, total: newTotal });

                  await fetchData({ ...form.getFieldsValue(), current: newCurrent });
                } catch (error) {
                  const msg = error?.response?.data?.message || 'Deleted failed!';
                  messageApi.open({
                    type: 'error',
                    content: msg,
                  });
                }
                setShowConfirm(false);
                setDeleteId(null);
                // await fetchData(form.getFieldsValue())
              }}>
                Yes
              </Button>
              <Button onClick={() => setShowConfirm(false)}>Cancel</Button>
            </Space>
          </div>
        </div>
      )}
    </>
  )
}

export default Users;

