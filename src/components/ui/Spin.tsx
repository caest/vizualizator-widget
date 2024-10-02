import { Spin as AntdSpin } from 'antd';

const Spin: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <AntdSpin size="large" />
    </div>
  );
};

export default Spin;