import React, { useState, useEffect } from "react";
import { Button, Form, Select, Space, Row, Col, Table, message, Tag } from 'antd';
import dayjs from "dayjs";
import { getBookList } from "../api/book";
import { all } from "axios";
import { borrowDelete, getBorrowList, updateBorrow } from "../api/borrow";
import { getUserList } from "../api/user";
import { createLimiter } from '../utils/throttleDebounce';



const COLUMNS = [
  {
    title: 'book',
    dataIndex: 'book',
    key: 'book',
    width: 200,
    render: (book) => book?.name || '-',
  },
  {
    title: 'status',
    dataIndex: 'status',
    key: 'status',
    width: 200,
    render: (text) => {
      return text === "on" ? (<Tag color="red">unreturned</Tag>) : (<Tag color="green">returned</Tag>)
    }
  },
  {
    title: 'user',
    dataIndex: 'user',
    key: 'user',
    width: 160,
    render: (user) => user?.name || '-'
  },
  {
    title: 'backAt',
    dataIndex: 'backAt',
    key: 'backAt',
    width: 160,
    render: (text) => text ? dayjs(text).format('YYYY-MM-DD') : '-'
  },
  {
    title: 'createDAt',
    dataIndex: 'createDAt',
    key: 'createDAt',
    width: 160,
    render: (text) => dayjs(text).format('YYYY-MM-DD')
  },
];

function Borrows() {
  const [form] = Form.useForm()
  const [categoryList, setCategoryList] = useState([])
  const [userList, setUserList] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
    showSizeChanger: true
  })

  const [data, setData] = useState([])
  const [messageApi, contextHolder] = message.useMessage();

  async function fetchData(values) {
    const res = await getBorrowList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...values
    })
    const data = res.data
    setData(data)
    setPagination({ ...pagination, current: pagination.current, total: res.total })
    // console.log(data);
  }

  useEffect(() => {
    fetchData()
    getBookList({ all: true }).then(res => {
      setCategoryList(res.data)
    })
    getUserList({ all: true }).then(res => {
      setUserList(res.data)
    })
  }, [])

  const handleSearchFinish = createLimiter(async (values) => {
    const res = await getBorrowList({ ...values, current: 1, pageSize: pagination.pageSize })
    setData(res.data)
    setPagination({ ...pagination, current: 1, total: res.total })
  }, 500)
  const handleSearchReset = () => {
    form.resetFields()
  }

  const handleBookEdit = async (id) => {
    try {
      await updateBorrow(id);
      messageApi.open({ type: 'success', content: 'Returned Successfully' });
      fetchData()
    } catch (error) {
      const msg = error?.response?.data?.message || 'Return failed, please try again';
      messageApi.open({
        type: 'error',
        content: msg,
      });
    }
  }
  // const handleBookEdit = () => { navigate(`/books/edit/:id`); }

  const handleTableChange = createLimiter(async (pagination) => {
    setPagination(pagination)
    const query = form.getFieldsValue()
    const res = await getBorrowList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    })
    setData(res.data)
    setPagination({ ...pagination, total: res.total })
  }, 500) // 500ms 节流延迟


  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const handleBookDelete = (id) => {
    setDeleteId(id);        // 记录要删除的 id
    setShowConfirm(true);   // 显示弹窗
  };

  const columns = COLUMNS.concat([
    {
      title: 'action', key: 'action', render: (col, row) => {
        return <Space>
          <Button type="link" onClick={() => handleBookEdit(row._id)}>return</Button>
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
          <Col span={6}>
            <Form.Item name="book" label="book"
              style={{ width: '100%' }}
              labelCol={{ flex: '80px' }}
              wrapperCol={{ flex: 'auto' }}>
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder="Please select..."
                options={categoryList.map(item => ({ label: item.name, value: item._id }))}
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
                  { value: "on", label: 'unreturned' },
                  { value: "off", label: 'returned' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="user" label="user"
              style={{ width: '100%' }}
              labelCol={{ flex: '80px' }}
              wrapperCol={{ flex: 'auto' }}>
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder="Please select..."
                options={userList.map(item => ({ label: item.name, value: item._id }))}
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
                  await borrowDelete(deleteId);
                  messageApi.open({ type: 'success', content: 'Deleted Success!' });
                  const values = form.getFieldsValue()
                  const res = await getBorrowList({
                    ...values,
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                  })

                  const newTotal = res.total
                  const maxPage = Math.ceil(newTotal / pagination.pageSize)
                  const newCurrent = pagination.current > maxPage ? maxPage : pagination.current

                  const finalRes = await getBorrowList({
                    ...values,
                    current: newCurrent,
                    pageSize: pagination.pageSize
                  })

                  setData(finalRes.data)
                  setPagination(prev => ({ ...prev, current: newCurrent, total: finalRes.total }))
                } catch (error) {
                  const msg = error?.response?.data?.message || 'Delete failed!';
                  messageApi.open({
                    type: 'error',
                    content: msg,
                  });
                }
                setShowConfirm(false);
                setDeleteId(null);
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

export default Borrows;
