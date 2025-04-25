import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Select, Space, Row, Col, Table, Image, message } from 'antd';
import dayjs from "dayjs";
import { getBookList, bookDelete, getBookById } from "../api/book";
import { getCategoryList } from "../api/category";
import { all } from "axios";
import { createLimiter } from '../utils/throttleDebounce';



const COLUMNS = [
  {
    title: 'name',
    dataIndex: 'name',
    key: 'name',
    width: 200
  },
  {
    title: 'cover',
    dataIndex: 'cover',
    key: 'cover',
    width: 120,
    render: (text) => {
      return <Image
        width={80}
        src={text}
      />
    }
  },
  {
    title: 'author',
    dataIndex: 'author',
    key: 'author',
    width: 120
  },
  {
    title: 'category',
    dataIndex: 'category',
    key: 'category',
    width: 80,
    render: (text) => {
      return text?.name ?? '-'
    }
  },
  {
    title: 'description',
    dataIndex: 'description',
    key: 'description',
    ellipise: true,
    width: 260,
  },
  {
    title: 'stock',
    dataIndex: 'stock',
    key: 'stock',
    width: 80
  },
  {
    title: 'createAt',
    dataIndex: 'createAt',
    key: 'createAt',
    width: 130,
    render: (text) => dayjs(text).format('YYYY-MM-DD')
  },
];

function Books() {
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

  async function fetchData(values = {}, currentPage = pagination.current) {
    const res = await getBookList({
      current: currentPage,
      pageSize: pagination.pageSize,
      ...values
    });
    const data = res.data;
    setData(data);
    setPagination((prev) => ({
      ...prev,
      current: currentPage,
      total: res.total
    }));
  }

  useEffect(() => {
    fetchData({}, 1)
    getCategoryList({ all: true }).then(res => {
      setCategoryList(res.data)
    })
  }, [])

  const debouncedSearch = createLimiter(async (values) => {
    const res = await getBookList({ ...values, current: 1, pageSize: pagination.pageSize });
    setData(res.data);
    setPagination({ ...pagination, current: 1, total: res.total });
  }, 500, 'debounce');  // 使用防抖，500ms延迟

  const handleSearchFinish = (values) => {
    debouncedSearch(values);  // 使用防抖函数
  };

  const handleSearchReset = () => {
    form.resetFields();
    debouncedSearch({}); // 重置后也调用防抖函数
  };

  const handleBookEdit = async (id) => {
    try {
      const res = await getBookById(id);
      navigate(`/books/edit/${id}`);
    } catch (error) {
      const msg = error?.response?.data?.message || 'Book not found!';
      messageApi.open({
        type: 'error',
        content: msg,
      });
    }
  }
  // const handleBookEdit = () => { navigate(`/books/edit/:id`); }

  const handleTableChange = async (pagination) => {
    // console.log(pagination);
    setPagination(pagination)
    const query = form.getFieldsValue()
    const res = await getBookList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    })
    setData(res.data);
    setPagination({ ...pagination, total: res.total }); // 更新分页信息
  }

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
          <Col span={7}>
            <Form.Item name="author" label="author"
              style={{ width: '100%' }}
              labelCol={{ flex: '80px' }}
              wrapperCol={{ flex: 'auto' }}>
              <Input placeholder="Please enter..." allowClear />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="category" label="category"
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
        rowKey="_id"
        columns={columns}
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
                  await bookDelete(deleteId);
                  messageApi.open({ type: 'success', content: 'Deleted Success!' });

                  const newTotal = pagination.total - 1;
                  const newPageCount = Math.ceil(newTotal / pagination.pageSize);
                  const newCurrent = pagination.current > newPageCount ? newPageCount || 1 : pagination.current;

                  setPagination((prev) => ({
                    ...prev,
                    total: newTotal,
                    current: newCurrent
                  }));

                  await fetchData(form.getFieldsValue(), newCurrent);
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

export default Books;
