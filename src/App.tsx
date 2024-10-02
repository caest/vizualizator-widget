import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Spin from './components/ui/Spin';
import Sidebar from './components/ui/Sidebar';
import AppHeader from './components/ui/Header';
import { Layout } from 'antd';
import AppRoutes from './routes/AppRoutes';
import React from 'react';

const { Content } = Layout;

const App: React.FC = React.memo(() => {
  const { isAuthenticated, initialized } = useAuth(); 
  const location = useLocation();

  if (initialized) {
    console.log('App component rendered', {
      isAuthenticated,
      location: location.pathname,
    });
  }

  if (!initialized) {
    return <Spin />;
  }

  const isLoginPage = location.pathname === '/';
  const isPreviewPage = location.pathname.includes('/widget-preview/');

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isLoginPage && !isPreviewPage && isAuthenticated && <Sidebar />}
      
      <Layout>
        {!isLoginPage && !isPreviewPage && isAuthenticated && <AppHeader />}
        
        <Content style={{ padding: '24px' }}>
          <AppRoutes isAuthenticated={!!isAuthenticated} />
        </Content>
      </Layout>
    </Layout>
  );
});

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;