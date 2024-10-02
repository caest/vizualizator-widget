import { Layout, Button } from 'antd';
import { useLogout } from '../../hooks/useLogout';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useLogout();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
      <Button type="primary" onClick={handleLogout}>
        Вихід
      </Button>
    </Header>
  );
};

export default AppHeader;