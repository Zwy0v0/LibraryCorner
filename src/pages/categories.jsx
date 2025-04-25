import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Select, Space, Row, Col, Table, Tag, Modal, message } from 'antd';
import dayjs from "dayjs";
import { getCategoryList, categoryDelete } from "../api/category";
import { createLimiter } from '../utils/throttleDebounce';



const COLUMNS = [
  {
    title: 'name',
    dataIndex: 'name',
    key: 'name',
    width: 200
  },
  {
    title: 'level',
    dataIndex: 'level',
    key: 'level',
    width: 200,
    render: (text) => {
      return <Tag color={text === 1 ? "green" : "cyan"}>level{text}</Tag>
    }
  },
  {
    title: 'parent',
    dataIndex: 'parent',
    key: 'parent',
    width: 200,
    render: (text) => {
      return text?.name ?? '-'
    }
  },
  {
    title: 'createAt',
    dataIndex: 'createAt',
    key: 'createAt',
    width: 200,
    render: (text) => dayjs(text).format('YYYY-MM-DD')
  },
];

function Categories() {
  const navigate = useNavigate();
  const [form] = Form.useForm()
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
    showSizeChanger: true
  })

  const [data, setData] = useState([])
  const [messageApi, contextHolder] = message.useMessage();

  async function fetchData(values) {
    const res = await getCategoryList({
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
  }, [])

  const handleSearchFinish = createLimiter(async (values) => {
    const res = await getCategoryList({ ...values, current: 1, pageSize: pagination.pageSize });
    setData(res.data);
    setPagination({ ...pagination, current: 1, total: res.total });
  }, 500); // 500ms 防抖延迟

  const handleSearchReset = () => {
    form.resetFields()
  }

  const handleBookEdit = (id) => {
    // console.log(id);
    navigate(`/categories/edit/${id}`);
  }
  // const handleBookEdit = () => { navigate(`/categories/edit/:id`); }

  const handleTableChange = createLimiter(async (pagination) => {
    setPagination(pagination);
    const query = form.getFieldsValue();
    const res = await getCategoryList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    });
    setData(res.data);
    setPagination({ ...pagination, total: res.total });
  }, 500); // 500ms 节流延迟


  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const handleBookDelete = (id) => {
    setDeleteId(id);        // 记录要删除的 id
    setShowConfirm(true);   // 显示弹窗
  };


  const columns = COLUMNS.concat([
    {
      title: 'action', key: 'action', render: (col, row) => {
        // console.log('当前行数据:', row._id);
        return <Space>
          <Button type="link" onClick={() => handleBookEdit(row._id)}>edit</Button>
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
              <Input placeholder="Please enter..." allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="level" label="level"
              style={{ width: '100%' }}
              labelCol={{ flex: '80px' }}
              wrapperCol={{ flex: 'auto' }}>
              <Select
                allowClear
                showSearch
                placeholder="Please select..."
                options={[
                  { value: 1, label: 'Level 1' },
                  { value: 2, label: 'Level 2' },
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
                try {
                  await categoryDelete(deleteId);
                  messageApi.open({ type: 'success', content: 'Deleted Success!' });
                  const values = form.getFieldsValue();
                  // 第一次获取总数
                  const res = await getCategoryList({
                    ...values,
                    current: pagination.current,
                    pageSize: pagination.pageSize
                  });

                  const newTotal = res.total;
                  const maxPage = Math.ceil(newTotal / pagination.pageSize);
                  const newCurrent = pagination.current > maxPage ? maxPage : pagination.current;

                  // 第二次根据新页码获取数据
                  const finalRes = await getCategoryList({
                    ...values,
                    current: newCurrent,
                    pageSize: pagination.pageSize
                  });

                  setData(finalRes.data);
                  setPagination(prev => ({
                    ...prev,
                    current: newCurrent,
                    total: finalRes.total
                  }));
                } catch (error) {
                  const msg = error?.response?.data?.message || 'Delete failed!';
                  messageApi.open({
                    type: 'error',
                    content: msg,
                  });
                }
                setShowConfirm(false);
                setDeleteId(null);
                // fetchData(form.getFieldsValue())
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

export default Categories;
