import { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router-dom';
import useNotification from '../hooks/useNotification';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  const { login, loading } = useLogin();
  const { showError } = useNotification();

  const handleLogin = async () => {
    const success = await login(email, password);
    if (success) {
      navigate('/colors');
    } else {
      showError('Помилка входу', 'Неправильний логін або пароль');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Form onFinish={handleLogin} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Будь ласка, введіть ваш email!' }]}
        >
          <Input type="email" onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: 'Будь ласка, введіть ваш пароль!' }]}
        >
          <Input.Password onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Увійти
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;