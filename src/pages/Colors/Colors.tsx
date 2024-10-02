import React, { useEffect, useMemo, useState } from 'react';
import { Form, Input, Button, Table, Select, Modal } from 'antd';
import Spin from '../../components/ui/Spin';
import useNotification from '../../hooks/useNotification';
import { subscribeToLanguages, subscribeToColors, addColor, deleteColor } from '../../api/colorService';
import { Color, Language } from '../../types/types';

const Colors: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState<Color[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribeLanguages = subscribeToLanguages(setLanguages);
    const unsubscribeColors = subscribeToColors(setColors);

    return () => {
      unsubscribeLanguages();
      unsubscribeColors();
    };
  }, []);

  const filteredColors = useMemo(() => {
    return selectedLanguage
      ? colors.filter((color) => color.language === selectedLanguage)
      : colors;
  }, [selectedLanguage, colors]);

  const onFinish = async (values: Omit<Color, 'key'>) => {
    if (!selectedLanguage) {
      showError('Помилка', 'Будь ласка, оберіть мову перед створенням кольору!');
      return;
    }

    setLoading(true);
    try {
      await addColor({ ...values, language: selectedLanguage });
      showSuccess('Успіх', 'Колір успішно створено!');
      setIsModalVisible(false); // Закрытие модального окна после успешного добавления
    } catch (error) {
      showError('Помилка', 'Не вдалося створити колір!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (key: string) => {
    setLoading(true);
    try {
      await deleteColor(key);
      showSuccess('Успіх', 'Колір успішно видалено!');
    } catch (error) {
      showError('Помилка', 'Не вдалося видалити колір!');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Назва кольору',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Код кольору',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Мова',
      dataIndex: 'language',
      key: 'language',
    },
    {
      title: 'Дії',
      key: 'action',
      render: (text: any, record: Color) => (
        <Button type="link" onClick={() => handleDelete(record.key)}>
          Видалити
        </Button>
      ),
    },
  ];

  return (
    <div>
      {loading ? (
        <Spin />
      ) : (
        <>
          <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: "20px" }}>
            Додати колір
          </Button>

          <Table dataSource={filteredColors} columns={columns} pagination={{ pageSize: 20 }} rowKey="key" />

          <Modal
            title="Додати новий колір"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
          >
            <Form onFinish={onFinish} layout="vertical">
              <Form.Item
                label="Мова"
                name="language"
                rules={[{ required: true, message: 'Будь ласка, оберіть мову!' }]}
              >
                <Select placeholder="Оберіть мову" onChange={(value) => setSelectedLanguage(value)}>
                  {languages.map((language) => (
                    <Select.Option key={language.id} value={language.name}>
                      {language.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Назва кольору"
                name="name"
                rules={[{ required: true, message: 'Будь ласка, введіть назву кольору!' }]}
              >
                <Input placeholder="Чорний" />
              </Form.Item>
              <Form.Item
                label="HEX Код кольору"
                name="code"
                rules={[{ required: true, message: 'Будь ласка, введіть код кольору!' }]}
              >
                <Input placeholder="#000000" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Додати колір
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Colors;
