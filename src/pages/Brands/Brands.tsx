import { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Table, Popconfirm, Modal } from 'antd';
import Spin from '../../components/ui/Spin';
import useNotification from '../../hooks/useNotification';
import {
  subscribeToBrands,
  subscribeToColors,
  subscribeToLanguages,
  addBrand,
  deleteBrand,
} from '../../api/brandService'; 
//import { Brand, Color, Language } from '../types'; 

interface Brand {
  key: string;
  name: string;
  description: string;
  colors: string[];
  advantages: { title: string; description: string }[];
  language: string;
}

interface Color {
  key: string;
  name: string;
  code: string;
  language: string;
}

interface Language {
  id: string;
  name: string;
}
const { Option } = Select;

const Brands: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const [form] = Form.useForm();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [filteredColors, setFilteredColors] = useState<Color[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [advantages, setAdvantages] = useState<{ title: string; description: string }[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToLanguages(setLanguages);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToColors(setColors);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToBrands(setBrands);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedLanguage) {
      const filteredBrands = brands.filter((brand) => brand.language === selectedLanguage);
      setFilteredBrands(filteredBrands);

      const filteredColors = colors.filter((color) => color.language === selectedLanguage);
      setFilteredColors(filteredColors);
    } else {
      setFilteredBrands(brands);
      setFilteredColors([]);
    }
  }, [selectedLanguage, brands, colors]);

  const onFinish = async (values: Omit<Brand, 'key'>) => {
    if (!selectedLanguage) {
      showError('Помилка', 'Будь ласка, оберіть мову перед створенням бренду!');
      return;
    }

    setLoading(true);
    try {
      await addBrand({
        ...values,
        advantages,
        language: selectedLanguage,
      });
      showSuccess('Успіх', 'Бренд успішно створено!');
      form.resetFields();
      setAdvantages([]);
      setIsModalVisible(false);
    } catch (error) {
      showError('Помилка', 'Не вдалося створити бренд!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (key: string) => {
    try {
      setLoading(true);
      await deleteBrand(key);
      showSuccess('Успіх', 'Бренд успішно видалено!');
    } catch (error) {
      showError('Помилка', 'Не вдалося видалити бренд!');
    } finally {
      setLoading(false);
    }
  };

  const addAdvantage = () => {
    setAdvantages([...advantages, { title: '', description: '' }]);
  };

  const removeAdvantage = (index: number) => {
    const newAdvantages = advantages.filter((_, i) => i !== index);
    setAdvantages(newAdvantages);
  };

  const handleAdvantageChange = (index: number, field: 'title' | 'description', value: string) => {
    const newAdvantages = [...advantages];
    newAdvantages[index][field] = value;
    setAdvantages(newAdvantages);
  };

  const columns = [
    {
      title: 'Назва бренду',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Опис бренду',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Кольори',
      dataIndex: 'colors',
      key: 'colors',
      render: (colors: string[]) => (
        <span>
          {colors.map((color) => (
            <span key={color} style={{ backgroundColor: color, padding: '4px 8px', marginRight: 8 }}>
              {color}
            </span>
          ))}
        </span>
      ),
    },
    {
      title: 'Переваги',
      dataIndex: 'advantages',
      key: 'advantages',
      render: (advantages: { title: string; description: string }[]) => (
        <div>
          {advantages.map((adv, index) => (
            <div key={index}>
              <strong>{adv.title}</strong>: {adv.description}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Мова',
      dataIndex: 'language',
      key: 'language',
    },
    {
      title: 'Дії',
      key: 'action',
      render: (text: any, record: Brand) => (
        <Popconfirm title="Ви впевнені, що хочете видалити цей бренд?" onConfirm={() => handleDelete(record.key)}>
          <Button type="link">Видалити</Button>
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
          <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: "20px" }}>
            Додати бренд
          </Button>

          <Table
            dataSource={filteredBrands}
            columns={columns}
            pagination={{ pageSize: 20 }}
            rowKey="key"
          />

          <Modal
            title="Додати новий бренд"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
          >
            <Form form={form} onFinish={onFinish} layout="vertical">
              <Form.Item
                label="Мова"
                name="language"
                rules={[{ required: true, message: 'Будь ласка, оберіть мову!' }]}
              >
                <Select
                  placeholder="Оберіть мову"
                  onChange={(value) => setSelectedLanguage(value)}
                >
                  {languages.map((language) => (
                    <Option key={language.id} value={language.name}>
                      {language.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Назва бренду"
                name="name"
                rules={[{ required: true, message: 'Будь ласка, введіть назву бренду!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Опис бренду"
                name="description"
                rules={[{ required: true, message: 'Будь ласка, введіть опис бренду!' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item
                label="Кольори"
                name="colors"
                rules={[{ required: true, message: 'Будь ласка, виберіть кольори!' }]}
              >
                <Select mode="multiple" placeholder="Оберіть кольори">
                  {filteredColors.map((color) => (
                    <Option key={color.key} value={color.code}>
                      {color.name} ({color.code})
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Переваги">
                {advantages.map((advantage, index) => (
                  <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "20px" }}>
                    <Input
                      placeholder="Заголовок переваги"
                      value={advantage.title}
                      onChange={(e) => handleAdvantageChange(index, 'title', e.target.value)}
                    />
                    <Input.TextArea
                      placeholder="Опис переваги"
                      value={advantage.description}
                      onChange={(e) => handleAdvantageChange(index, 'description', e.target.value)}
                      rows={4}
                    />
                    <Button onClick={() => removeAdvantage(index)} type="link" danger>
                      Видалити
                    </Button>
                  </div>
                ))}
                <Button type="dashed" onClick={addAdvantage}>
                  Додати перевагу
                </Button>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Створити бренд
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Brands;
