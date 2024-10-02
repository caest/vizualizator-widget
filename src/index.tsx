import { createRoot } from 'react-dom/client';
import App from './App'; 
import './styles/main.scss';
import Spin  from './components/ui/Spin'; 

const domNode = document.getElementById('root');

const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin />
  </div>
);

if (domNode) {
  const root = createRoot(domNode as HTMLElement);

  const startApp = async () => {
      root.render(
          <App />
      );
  };

  root.render(<Loading />);

  startApp();
} else {
  console.error('Root element not found');
}