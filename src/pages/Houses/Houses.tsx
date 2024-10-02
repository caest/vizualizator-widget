// src/pages/Houses.tsx
import { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Popconfirm, Select, Modal } from 'antd';
import Spin from '../../components/ui/Spin'; // Импорт компонента Spin
import useNotification from '../../hooks/useNotification';
import {
  subscribeToLanguages,
  subscribeToHouses,
  addHouse as createHouse,
  deleteHouse as removeHouse,
} from '../../api/houseService';

interface House {
  key: string;
  name: string;
  language: string;
}

interface Language {
  id: string;
  name: string;
}

const Houses: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const [form] = Form.useForm();
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false); // Состояние для управления видимостью модального окна

  useEffect(() => {
    const unsubscribeLanguages = subscribeToLanguages(setLanguages);
    return () => unsubscribeLanguages();
  }, []);

  useEffect(() => {
    const unsubscribeHouses = subscribeToHouses(setHouses);
    return () => unsubscribeHouses();
  }, []);

  // Убираем фильтрацию, чтобы отображать все дома
  const filteredHouses = selectedLanguage
    ? houses.filter((house) => house.language === selectedLanguage)
    : houses;

  const onFinish = async (values: Omit<House, 'key' | 'language'>) => {
    if (!selectedLanguage) {
      showError('Помилка', 'Будь ласка, оберіть мову перед створенням будинку!');
      return;
    }

    setLoading(true);
    try {
      await createHouse({
        ...values,
        language: selectedLanguage,
      });
      showSuccess('Успіх', 'Будинок успішно створено!');
      form.resetFields();
      setIsModalVisible(false); // Закрыть модальное окно после успешного добавления
    } catch (error) {
      showError('Помилка', 'Не вдалося створити будинок!');
    } finally {
      setLoading(false);
    }
  };

  const deleteHouse = async (key: string) => {
    try {
      setLoading(true);
      await removeHouse(key);
      showSuccess('Успіх', 'Будинок успішно видалено!');
    } catch (error) {
      showError('Помилка', 'Не вдалося видалити будинок!');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Назва будинку',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Дії',
      key: 'actions',
      render: (_: any, record: House) => (
        <Popconfirm
          title="Ви впевнені, що хочете видалити цей будинок?"
          onConfirm={() => deleteHouse(record.key)}
          okText="Так"
          cancelText="Ні"
        >
          <Button type="link" danger>
            Видалити
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      {loading ? (
        <Spin />
      ) : (
        <>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Створити будинок
          </Button>

          <Modal
            title="Додати будинок"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
          >
            <Form form={form} onFinish={onFinish} layout="vertical">
              <Form.Item label="Мова" name="language" rules={[{ required: true, message: 'Будь ласка, оберіть мову!' }]}>
                <Select placeholder="Оберіть мову" onChange={(value) => setSelectedLanguage(value)}>
                  {languages.map((language) => (
                    <Select.Option key={language.id} value={language.name}>
                      {language.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Назва будинку"
                name="name"
                rules={[{ required: true, message: 'Будь ласка, введіть назву будинку!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Створити будинок
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Table
            dataSource={filteredHouses}
            columns={columns}
            pagination={{ pageSize: 20 }}
            rowKey="key"
            style={{ marginTop: 20 }}
          />
        </>
      )}
    </div>
  );
};

export default Houses;
