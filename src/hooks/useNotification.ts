import { notification } from 'antd';

const useNotification = () => {
  const showSuccess = (message: string, description?: string) => {
    notification.success({
      message,
      description,
    });
  };

  const showError = (message: string, description?: string) => {
    notification.error({
      message,
      description,
    });
  };

  return { showSuccess, showError };
};

export default useNotification;