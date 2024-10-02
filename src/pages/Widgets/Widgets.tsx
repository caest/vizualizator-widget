import React, { useState, useEffect } from 'react';
import { Table, notification, Space, Form, Button, message } from 'antd';
import { EyeOutlined, CopyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../../api/firebase';
import WidgetForm from './WidgetForm';
import { Widget, Color, House, Brand, Language } from '../../types/types'; // Интерфейсы вынесены в отдельный файл типов

const Widgets: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [widgetData, setWidgetData] = useState<Widget>({
    key: Date.now().toString(),
    name: '',
    header: '',
    description: '',
    colors: [],
    brands: [],
    houses: [],
    emails: [],
    language: '',
    downloadButton: '',
    resetButton: '',
    submitButton: '', 
    sendButton: '', 
    messageCantDownoloadWgd: '',
    messageError: '',
    messageCantDownoloadImg: '',
    messageChooseAllParams: '',
    cannotFindImg: '',
    success: '',
    sendedForm: '',
    fieldName: '',
    fieldNameRule: '',
    fieldPhoneNumber: '',
    fieldPhoneNumberRule:'',
    fieldPhoneNumberValidation:'',
    fieldEmailRule: '',
    fieldEmailValidation: '',
  });
  

  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [filteredColors, setFilteredColors] = useState<Color[]>([]);
  const [filteredHouses, setFilteredHouses] = useState<House[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  // Получение данных из Firebase
  useEffect(() => {
    const unsubscribeLanguages = onSnapshot(collection(db, 'languages'), (snapshot) => {
      const languageData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Language[];
      setLanguages(languageData);
    });

    const unsubscribeColors = onSnapshot(collection(db, 'colors'), (snapshot) => {
      const colorData = snapshot.docs.map((doc) => ({ key: doc.id, ...doc.data() })) as Color[];
      setColors(colorData);
    });

    const unsubscribeHouses = onSnapshot(collection(db, 'houses'), (snapshot) => {
      const houseData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as House[];
      setHouses(houseData);
    });

    const unsubscribeBrands = onSnapshot(collection(db, 'brands'), (snapshot) => {
      const brandData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Brand[];
      setBrands(brandData);
    });

    const unsubscribeWidgets = onSnapshot(collection(db, 'widgets'), (snapshot) => {
      const widgetData = snapshot.docs.map((doc) => ({
        id: doc.id,
        key: doc.id,
        name: doc.data().name ?? '',
        header: doc.data().header ?? '',
        description: doc.data().description ?? '',
        colors: doc.data().colors ?? [],
        brands: doc.data().brands ?? [],
        houses: doc.data().houses ?? [],
        emails: doc.data().emails ?? [],
        language: doc.data().language ?? '',
        downloadButton: doc.data().downloadButton ?? '',
        resetButton: doc.data().resetButton ?? '',
        submitButton: doc.data().submitButton ?? '',
        sendButton: doc.data().submitButton ?? '',
        messageCantDownoloadWgd:  doc.data().messageCantDownoloadWgd ?? '',
        messageError:  doc.data().messageError ?? '',
        messageCantDownoloadImg:  doc.data().messageCantDownoloadImg ?? '',
        messageChooseAllParams:  doc.data().messageChooseAllParams ?? '',
        cannotFindImg:  doc.data().cannotFindImg ?? '',
        success: doc.data().success ??'',
        sendedForm: doc.data().sendedForm ??'',
        fieldName: doc.data().fieldName ??'',
        fieldNameRule: doc.data().fieldNameRule ??'',
        fieldPhoneNumber: doc.data().fieldPhoneNumber ??'',
        fieldPhoneNumberRule: doc.data().fieldPhoneNumberRule ??'',
        fieldPhoneNumberValidation:doc.data().fieldPhoneNumberValidation ??'',
        fieldEmailRule: doc.data().fieldEmailRule ??'',
        fieldEmailValidation: doc.data().fieldEmailValidation ??'',
      })) as Widget[];
      
      setWidgets(widgetData);
      
    });

    return () => {
      unsubscribeLanguages();
      unsubscribeColors();
      unsubscribeHouses();
      unsubscribeBrands();
      unsubscribeWidgets();
    };
  }, []);

  // Фильтрация данных в зависимости от выбранного языка
  useEffect(() => {
    if (selectedLanguage) {
      const filteredColors = colors.filter((color) => color.language === selectedLanguage);
      const filteredHouses = houses.filter((house) => house.language === selectedLanguage);
      const filteredBrands = brands.filter((brand) => brand.language === selectedLanguage);
      setFilteredColors(filteredColors);
      setFilteredHouses(filteredHouses);
      setFilteredBrands(filteredBrands);
    } else {
      setFilteredColors([]);
      setFilteredHouses([]);
      setFilteredBrands([]);
    }
  }, [selectedLanguage, colors, houses, brands]);

  // Обработка изменений в форме
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setWidgetData((prev) => ({ ...prev, [name]: value }));
  };
  //copy iframe code
  const handleCopyIframe = (widgetId: string) => {
    const iframeCode = `<iframe src="${window.location.origin}/widget-preview/${widgetId}" width="1600" height="900" frameborder="0" allowfullscreen></iframe>`;
  
    // Проверка на поддержку Clipboard API и копирование текста
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(iframeCode)
        .then(() => {
          message.success('Код iFrame успішно скопійовано!');
        })
        .catch(() => {
          message.error('Не вдалося скопіювати код iFrame.');
        });
    } else {
      message.error('Ваш браузер не підтримує Clipboard API.');
    }
  };
  
  const handleSelectChange = (name: string, value: any[]) => {
    if (name === 'colors') {
      const selectedColors = filteredColors.filter((color) => value.includes(color.name));
      setWidgetData((prev) => ({ ...prev, colors: selectedColors }));
    } else if (name === 'brands') {
      const selectedBrands = filteredBrands.filter((brand) => value.includes(brand.name));
      setWidgetData((prev) => ({ ...prev, [name]: selectedBrands }));
    } else {
      setWidgetData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    setWidgetData((prev) => ({ ...prev, language: value }));
  };

  // Добавление нового виджета
  const handleAddWidget = async () => {
    try {
      await addDoc(collection(db, 'widgets'), widgetData);
      notification.success({ message: 'Віджет успішно додано!' });
      setWidgetData({
        key: Date.now().toString(),
        name: '',
        header: '',
        description: '',
        colors: [],
        brands: [],
        houses: [],
        emails: [],
        language: '',
        downloadButton: '',
        resetButton: '', 
        submitButton: '',
        sendButton: '',
        messageCantDownoloadWgd: '',
        messageError: '',
        messageCantDownoloadImg: '',
        messageChooseAllParams: '',
        cannotFindImg: '',
        success: '',
        sendedForm: '',
        fieldName: '',
        fieldNameRule: '',
        fieldPhoneNumber: '',
        fieldPhoneNumberRule:'',
        fieldPhoneNumberValidation:'',
        fieldEmailRule: '',
        fieldEmailValidation: '',
      });
      form.resetFields();
    } catch (error) {
      notification.error({ message: 'Сталася помилка при додаванні віджета.' });
    }
  };

  // Превью виджета
  const handlePreview = (widget: Widget) => {
    navigate(`/widget-preview/${widget.key}`);
  };

  // Определение колонок таблицы
  const columns = [
    { title: 'Назва', dataIndex: 'name', key: 'name' },
    {
      title: 'Email',
      dataIndex: 'emails',
      key: 'emails',
      render: (emails: string[]) =>
        emails.length ? emails.join(', ') : 'Немає email адрес',
    },
    { title: 'Мова', dataIndex: 'language', key: 'language' },
    {
      title: 'Дії',
      key: 'actions',
      render: (widget: Widget) => (
        <Space>
          <EyeOutlined onClick={() => handlePreview(widget)} />
          <CopyOutlined
          onClick={() => handleCopyIframe(widget.key)}
          style={{ cursor: 'pointer' }}
        />
        </Space>
        
        
      ),
    },
  ];
  

  return (
    <div>
      <WidgetForm
        form={form}
        widgetData={widgetData}
        languages={languages}
        filteredColors={filteredColors}
        filteredHouses={filteredHouses}
        filteredBrands={filteredBrands}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        handleLanguageChange={handleLanguageChange}
        handleAddWidget={handleAddWidget}
      />

      {/* Таблица отображения виджетов */}
      <Table dataSource={widgets} columns={columns} rowKey="key" />
    </div>
  );
};

export default Widgets;
