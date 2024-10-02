import  { useState, useEffect, useMemo } from 'react';
import { Form, Input, Button, Table, Modal } from 'antd';
import { getLanguages, addLanguage, updateLanguage, deleteLanguage } from '../../api/languageService';
import useNotification from '../../hooks/useNotification';
import Spin from '../../components/ui/Spin';

interface Language {
  id: string;
  name: string;
  code: string; 
}

const LanguagesManager: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const unsubscribe = getLanguages(setLanguages);
    return () => unsubscribe();
  }, []);

  const openModal = (language?: Language) => {
    if (language) {
      setEditingLanguage(language);
      form.setFieldsValue({
        name: language.name,
        code: language.code,
      });
    } else {
      setEditingLanguage(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values: { name: string; code: string }) => {
    setLoading(true);
    try {
      if (editingLanguage) {
        // Обновление языка
        await updateLanguage(editingLanguage.id, values.name, values.code);
        showSuccess('Успіх', 'Мова успішно оновлена!');
      } else {
        // Добавление нового языка
        await addLanguage(values.name, values.code);
        showSuccess('Успіх', 'Мова успішно додана!');
      }
    } catch (error) {
      showError('Помилка', 'Не вдалося зберегти мову!');
    } finally {
      setLoading(false);
      setIsModalVisible(false);
      form.resetFields();
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Ви впевнені, що хочете видалити цю мову?',
      onOk: async () => {
        setLoading(true);
        try {
          await deleteLanguage(id);
          showSuccess('Успіх', 'Мова успішно видалена!');
        } catch (error) {
          showError('Помилка', 'Не вдалося видалити мову!');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const columns = useMemo(
    () => [
      {
        title: 'Назва мови',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Код мови',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: 'Дії',
        key: 'action',
        render: (_: any, record: Language) => (
          <>
            <Button type="link" onClick={() => openModal(record)}>
              Редагувати
            </Button>
            <Button type="link" danger onClick={() => handleDelete(record.id)}>
              Видалити
            </Button>
          </>
        ),
      },
    ],
    [languages]
  );

  return (
    <div>
      {loading ? (
        <Spin />
      ) : (
        <>
          <Button type="primary" onClick={() => openModal()}>
            Додати мову
          </Button>
          <Table dataSource={languages} columns={columns} rowKey="id" pagination={{ pageSize: 20 }} />

          <Modal
            title={editingLanguage ? 'Редагувати мову' : 'Додати мову'}
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <Form form={form} onFinish={onFinish} layout="vertical">
              <Form.Item
                label="Назва мови"
                name="name"
                rules={[{ required: true, message: 'Будь ласка, введіть назву мови!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Код мови"
                name="code"
                rules={[{ required: true, message: 'Будь ласка, введіть код мови!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {editingLanguage ? 'Зберегти зміни' : 'Додати мову'}
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </div>
  );
};

export default LanguagesManager;
