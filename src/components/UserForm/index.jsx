import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Form,
  Input,
  message,
  Space,
  Radio
} from 'antd';
import styles from './index.module.css'
import { getUserById, updateUser, userAdd } from '../../api/user';

export default function UserForm() {
  const [form] = Form.useForm()
  const navigate = useNavigate();
  const { id } = useParams();
  const [messageApi, contextHolder] = message.useMessage();

  const handleFinish = async (values) => {
    try {
      if (id) {
        if (!values.password) {
          delete values.password;
        }
        try {
          await updateUser(id, values);
          messageApi.open({ type: 'success', content: 'Updated successfully' });
          navigate('/users');
        } catch (error) {
          const msg = error?.response?.data?.message || 'Update failed!';
          messageApi.open({
            type: 'error',
            content: msg,
          });
        }
      } else {
        await userAdd(values);
        messageApi.open({ type: 'success', content: 'Created successfully' });
        navigate('/users');
      }      
    } catch (error) {
      const msg = error?.response?.data?.message || 'This user already exists!';
      messageApi.open({
        type: 'error',
        content: msg,
      });
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const res = await getUserById(id);
          form.setFieldsValue(res.data);
        }
      } catch (error) {
        const msg = error?.response?.data?.message || 'User not found!';
        messageApi.open({ type: 'error', content: 'User not found!' });
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
            message: 'Please enter user name'
          }]}
        >
          <Input placeholder='Please enter...' />
        </Form.Item>
        <Form.Item
          label="nickName"
          name="nickName"
          rules={[{
            required: true,
            message: 'Please enter nickName'
          }]}
        >
          <Input placeholder='Please enter...' />
        </Form.Item>
        <Form.Item
          label="sex"
          name="sex"
        >
          <Radio.Group>
            <Radio value="male">male</Radio>
            <Radio value="female">female</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="password"
          name="password"
          rules={[{
            required: true,
            message: 'Please enter password'
          }]}
        >
          <Space compact='true'>
            <Input.Password
              placeholder='Please enter password...'
              style={{ width: 360 }}
            />
          </Space>
        </Form.Item>
        <Form.Item
          label="status"
          name="status"
        >
          <Radio.Group>
            <Radio value="normal">normal</Radio>
            <Radio value="forbidden">forbidden</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="role"
          name="role"
        >
          <Radio.Group>
            <Radio value="user">user</Radio>
            <Radio value="admin">admin</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Button type='primary' size='large' htmlType='submit' className={styles.btn}>Submit</Button>
        </Form.Item>
      </Form>
    </>
  );
};