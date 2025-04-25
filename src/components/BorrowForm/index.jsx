import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Form,
  message,
  Select,
  Alert
} from 'antd';
import styles from './index.module.css'
import { getUserList } from '../../api/user';
import { getBookList } from '../../api/book';
import { borrowAdd } from '../../api/borrow';

export default function BorrowForm() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  // const { id } = useParams();
  const [form] = Form.useForm()
  const handleFinish = async (values) => {
    try {
      await borrowAdd(values);
      messageApi.open({ type: 'success', content: "Created Successfully" });
      navigate('/borrows');
    } catch (error) {
      const msg = error?.response?.data?.message || 'Create failed!';
      messageApi.open({
        type: 'error',
        content: msg,
      });
    }
  }
  const [userList, setUserList] = useState([])
  const [bookList, setBookList] = useState([])
  const [stock, setStock] = useState(9999)

  useEffect(() => {
    getUserList().then(res => setUserList(res.data))
    getBookList().then(res => setBookList(res.data))
  }, [])

  const handleBookChange = (value, option) => {
    setStock(option.stock)
  }

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        className={styles.form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}
        onFinish={handleFinish}
      >
        <Form.Item
          label="book"
          name="book"
          rules={[{
            required: true,
            message: 'Please select book'
          }]}
        >
          <Select
            onChange={handleBookChange}
            placeholder='Please select...'
            options={bookList.map((item) => ({
              label: item.name,
              value: item._id,
              stock: item.stock
            }))}
          >
          </Select>
        </Form.Item>
        <Form.Item
          label="user"
          name="user"
          rules={[{
            required: true,
            message: 'Please select user'
          }]}
        >
          <Select
            placeholder='Please select...'
            options={userList.map((item) => ({
              label: item.name,
              value: item._id
            }))}
          >
          </Select>
        </Form.Item>
        <Form.Item
          label="stock"
        // name="stock"
        >
          {stock}
        </Form.Item>
        {stock < 1 && (
          <Form.Item label=" " colon={false}>
            <Alert
              message="Insufficient stock!"
              description="The current stock is zero and the book cannot be borrowed!"
              type="error"
              showIcon
            />
          </Form.Item>
        )}
        <Form.Item label=" " colon={false}>
          <Button
            type='primary'
            size='large'
            htmlType='submit'
            className={styles.btn}
            disabled={stock < 1}
          >Submit</Button>
        </Form.Item>
      </Form>
    </>
  )
}