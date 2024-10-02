import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogout } from '../../hooks/useLogout';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useLogout();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleMenuClick = (e: any) => {
    navigate(e.key);
  };

  const menuItems = [
    { key: '/languages', label: 'Мови' },
    { key: '/colors', label: 'Кольори' },
    { key: '/brands', label: 'Торгові марки' },
    { key: '/houses', label: 'Будинки' },
    { key: '/images', label: 'Зображення' },
    { key: '/widgets', label: 'Віджети' },
  ];

  return (
    <Sider width={200} style={{ background: '#fff' }}>
      <Menu
        mode="inline"
        onClick={handleMenuClick}
        selectedKeys={[location.pathname]}
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;