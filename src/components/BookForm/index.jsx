import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookAdd, bookUpdate, getBookById } from '../../api/book';
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Space,
  Image
} from 'antd';
import styles from './index.module.css'
import dayjs from 'dayjs';
import { getCategoryList } from '../../api/category';

const { TextArea } = Input;

export default function BookForm() {
  const [preview, setPreview] = useState("")
  const [categoryList, setCategoryList] = useState([])
  const [form] = Form.useForm()
  const navigate = useNavigate();
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();

  const handleFinish = async (values) => {
    if (values.publishAt) {
      values.publishAt = dayjs(values.publishAt).valueOf()
    }
    if (id) {
      try {
        await bookUpdate(id, values);
        messageApi.open({ type: 'success', content: "Updated Successfully" });
        navigate('/books');
      } catch (error) {
        const msg = error?.response?.data?.message || 'Updated failed!';
        messageApi.open({
          type: 'error',
          content: msg,
        });
      }
    } else {
      await bookAdd(values);
      messageApi.open({ type: 'success', content: "Created Successfully" });
      navigate('/books');
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCategoryList({ all: true });
        setCategoryList(res.data);

        if (id) {
          const bookRes = await getBookById(id);
          const bookData = bookRes.data;
          if (bookData.publishAt) {
            bookData.publishAt = dayjs(bookData.publishAt);
          }
          if (bookData.category) {
            const matchedCategory = res.data.find(
              item => item.name === bookData.category || item.name === bookData.category.name
            );
            if (matchedCategory) {
              bookData.category = matchedCategory._id;
            } else {
              bookData.category = undefined;
            }
          }

          form.setFieldsValue(bookData);
        }
      } catch (error) {
        const msg = error?.response?.data?.message || 'Book not found!';
        messageApi.error(msg);
      }
    };

    fetchData();
  }, [id])

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
          label="name"
          name="name"
          rules={[{
            required: true,
            message: 'Please enter book name'
          }]}
        >
          <Input placeholder='Please enter...' />
        </Form.Item>
        <Form.Item
          label="author"
          name="author"
          rules={[{
            required: true,
            message: 'Please enter author'
          }]}
        >
          <Input placeholder='Please enter...' />
        </Form.Item>
        <Form.Item
          label="category"
          name="category"
          rules={[{
            required: true,
            message: 'Please select category'
          }]}
        >
          <Select
            placeholder='Please select...'
            options={categoryList.map(item => ({ label: item.name, value: item._id }))}
          >
          </Select>
        </Form.Item>
        <Form.Item label="cover" name="cover">
          <Space compact='true'>
            <Input
              placeholder='Please enter url of picture...'
              style={{ width: 360 }}
              onChange={(e) => form.setFieldValue('cover', e.target.value)}
            />
            <Button type='primary' onClick={() => setPreview(form.getFieldValue('cover'))}>preview</Button>
          </Space>
        </Form.Item>
        {preview && (<Form.Item label=" " colon={false}>
          <Image src={preview} width={150} height={150}></Image>
        </Form.Item>)}
        <Form.Item label="publishAt" name="publishAt">
          <DatePicker placeholder='Please select...' />
        </Form.Item>
        <Form.Item
          label="stock"
          name="stock"
          rules={[
            {
              type: 'number',
              min: 0,
              message: 'The stock cannot be less than 0',
            },
          ]}
        >
          <InputNumber placeholder='Please enter...' />
        </Form.Item>
        <Form.Item label="description" name="description">
          <TextArea rows={4} placeholder='Please enter...' />
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Button type='primary' size='large' htmlType='submit' className={styles.btn}>Submit</Button>
        </Form.Item>
      </Form>
    </>
  );
};