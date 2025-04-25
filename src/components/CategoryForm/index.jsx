import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Form,
  Input,
  message,
  Select,
} from 'antd';
import styles from './index.module.css'
import { getCategoryList, CategoryAdd, getCategoryById, categoryUpdate } from '../../api/category';
import { all } from 'axios';


export default function CategoryForm() {
  const [level, setLevel] = useState(1)
  const [form] = Form.useForm()
  const [levelOneList, setLevelOneList] = useState([])
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams();

  const handleFinish = async (values) => {
    try {
      if (id) {
        try {
          await categoryUpdate(id, values);
          messageApi.open({ type: 'success', content: 'Updated successfully' });
          navigate('/categories');
        } catch (error) {
          const msg = error?.response?.data?.message || 'Update failed!';
          messageApi.open({
            type: 'error',
            content: msg,
          });
        }
      } else {
        await CategoryAdd(values);
        messageApi.open({ type: 'success', content: 'Created successfully' });
        navigate('/categories');
      }
    } catch (error) {
      const msg = error?.response?.data?.message || 'This category already exists!';
      messageApi.open({
        type: 'error',
        content: msg,
      });
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCategoryList({ all: true, level: 1 });
        setLevelOneList(res.data);

        if (id) {
          const data = await getCategoryById(id);
          setLevel(data.data.level);
          form.setFieldsValue(data.data);
        }
      } catch (error) {
        const msg = error?.response?.data?.message || 'Failed to load category data';
        messageApi.open({
          type: 'error',
          content: msg,
        });
      }
    };

    fetchData();
  }, [id])

  const levelOneOptions = useMemo(() => {
    return levelOneList.map(item => ({
      value: item._id,
      label: item.name
    }))
  }, [levelOneList])

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
            message: 'Please enter category title'
          }]}
        >
          <Input placeholder='Please enter...' />
        </Form.Item>
        <Form.Item
          label="level"
          name="level"
          rules={[{
            required: true,
            message: 'Please select level'
          }]}
        >
          <Select
            onChange={(value) => setLevel(value)}
            placeholder='Please select...'
            options={[
              { value: 1, label: 'Level 1' },
              { value: 2, label: 'Level 2' },
            ]}
          >
          </Select>
        </Form.Item>
        {level === 2 && <Form.Item
          label="parent"
          name="parent"
          rules={[{
            required: true,
            message: 'Please select parent category'
          }]}
        >
          <Select
            placeholder='Please select...'
            options={levelOneOptions}
          >
            {/* <Select.Option value="demo">level 1</Select.Option> */}
          </Select>
        </Form.Item>}
        <Form.Item label=" " colon={false}>
          <Button type='primary' size='large' htmlType='submit' className={styles.btn}>Submit</Button>
        </Form.Item>
      </Form>
    </>
  );
};