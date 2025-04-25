import { Button, Form, Input, message } from "antd";
import styles from "./index.module.css"
import { Login } from "../../api/login";
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [form] = Form.useForm()
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const handleFinish = async (values) => {
    try {
      const res = await Login(values);
      if (res?.data?.data?.status === 'forbidden') {
        localStorage.removeItem('token');
        messageApi.open({
          type: 'error',
          content: 'Your account has been forbidden from logging in.',
        });
        return;
      }
      messageApi.open({ type: 'success', content: "Login Successfully" });
      navigate('/');
    } catch (error) {
      const msg = error?.response?.data?.message || 'Incorrect user name or password!';
      messageApi.open({
        type: 'error',
        content: msg,
      });
    }
  }

  return (
    <div className={styles.body}>
      {contextHolder}
      <div className={styles.container}>
        <h2 className={styles.title}>Library Corner</h2>
        <Form form={form} labelAlign="left" labelCol={{ flex: '80px' }} onFinish={handleFinish}>
          <Form.Item label="name" name="name"
            rules={[{
              required: true,
              message: 'Please enter user name'
            }]}
          >
            <Input placeholder="admin/user/forbid" />
          </Form.Item>
          <Form.Item label="password" name="password"
            rules={[{
              required: true,
              message: 'Please enter password'
            }]}
          >
            <Input.Password placeholder="admin/user/forbid" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" className={styles.btn}>Login</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}