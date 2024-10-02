import { useState, useEffect } from 'react';
import { Upload, Button, Table, Image, Popconfirm, Select, Modal, Form } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { collection, onSnapshot, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db } from '../../api/firebase';
import useNotification from '../../hooks/useNotification';

interface UploadedImage {
  uid: string;
  name: string;
  url: string;
  brand: string[];
  color: string[];
  house: string[];
}

interface Brand {
  id: string;
  name: string;
}

interface Color {
  id: string;
  name: string;
  code: string;
}

interface House {
  id: string;
  name: string;
}

const Images: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const [fileList, setFileList] = useState<UploadedImage[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingImage, setEditingImage] = useState<UploadedImage | null>(null);
  const storage = getStorage();

  useEffect(() => {
    const unsubscribeBrands = onSnapshot(collection(db, 'brands'), (snapshot) => {
      const brandsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      })) as Brand[];
      setBrands(brandsData);
    });
    
    const unsubscribeColors = onSnapshot(collection(db, 'colors'), (snapshot) => {
      const colorsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        code: doc.data().code,
      })) as Color[];
      setColors(colorsData);
    });

    const unsubscribeHouses = onSnapshot(collection(db, 'houses'), (snapshot) => {
      const housesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      })) as House[];
      setHouses(housesData);
    });

    return () => {
      unsubscribeBrands();
      unsubscribeColors();
      unsubscribeHouses();
    };
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      const imagesSnapshot = await getDocs(collection(db, 'images'));
      const imagesData = imagesSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as UploadedImage[];
      setFileList(imagesData);
    };

    fetchImages();
  }, []);

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      showError('Помилка', 'Можна завантажувати тільки файли JPG/PNG.');
      return Upload.LIST_IGNORE;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      showError('Помилка', 'Зображення повинно бути менше 5MB!');
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handleChange = async (info: any) => {
    let newFileList = [...info.fileList];
  
    newFileList = newFileList.map((file: any) => {
      if (file.response) {
        file.status = 'done';
      } else if (file.status === 'error') {
        showError('Помилка', `Завантаження ${file.name} не вдалося.`);
      }
      return file;
    });
  
    const successfulUploads: UploadedImage[] = [];
  
    for (const file of newFileList) {
      if (file.status === 'done') {
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file.originFileObj);
        const url = await getDownloadURL(storageRef);
        successfulUploads.push({
          uid: file.uid,
          name: file.name,
          url,
          brand: selectedBrand,
          color: selectedColor,
          house: selectedHouse,
        });
  
        await addDoc(collection(db, 'images'), {
          name: file.name,
          url,
          brand: selectedBrand,
          color: selectedColor.map((colorName) => {
            const color = colors.find((c) => c.name === colorName);
            return { name: color?.name, code: color?.code };  // Добавляем код цвета
          }),
          house: selectedHouse,
        });        
      }
    }
  
    setFileList((prevList) => [...prevList, ...successfulUploads]);
  
    if (successfulUploads.length > 0) {
      showSuccess('Успіх', 'Зображення успішно завантажене!');
      
      setSelectedBrand([]);
      setSelectedColor([]);
      setSelectedHouse([]);
    }
  };
  
  const deleteImage = async (uid: string, name: string) => {
    try {
      // Удаляем документ из коллекции 'images' в Firestore
      const imageRef = doc(db, 'images', uid);
      await deleteDoc(imageRef);
  
      // Удаляем файл из Firebase Storage
      const fileRef = ref(storage, `images/${name}`);
      await deleteObject(fileRef);
  
      // Обновляем локальный стейт fileList
      const updatedList = fileList.filter((file) => file.uid !== uid);
      setFileList(updatedList);
  
      showSuccess('Успіх', 'Зображення успішно видалено!');
    } catch (error) {
      showError('Помилка', 'Не вдалося видалити зображення.');
      console.error('Ошибка удаления изображения:', error);
    }
  };
  

  const editImage = (record: UploadedImage) => {
    setEditingImage(record);
    setIsEditing(true);
  };

  const handleEditOk = async (values: any) => {
    if (editingImage) {
      const imageRef = doc(db, 'images', editingImage.uid);
      await updateDoc(imageRef, {
        brand: values.brand,
        color: (values.color as string[]).map((colorName: string) => {
          const color = colors.find((c) => c.name === colorName);
          return { name: color?.name, code: color?.code };  // Обновляем код цвета
        }),
        house: values.house,
      });

      setFileList((prevList) =>
        prevList.map((img) => (img.uid === editingImage.uid ? { ...img, ...values } : img))
      );

      showSuccess('Успіх', 'Зображення успішно відредаговане!');
      setIsEditing(false);
      setEditingImage(null);
    }
  };

  const columns = [
    {
      title: 'Назва зображення',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Зображення',
      dataIndex: 'url',
      key: 'url',
      render: (url: string) => <Image width={100} src={url} alt="uploaded" />,
    },
    {
      title: 'Бренд',
      dataIndex: 'brand',
      key: 'brand',
      render: (brands: string[]) => brands.join(', '),
    },
    {
      title: 'Колір',
      dataIndex: 'color',
      key: 'color',
      render: (colors: string[]) => colors.join(', '),
    },
    {
      title: 'Дім',
      dataIndex: 'house',
      key: 'house',
      render: (houses: string[]) => houses.join(', '),
    },
    {
      title: 'Дії',
      key: 'actions',
      render: (_: any, record: UploadedImage) => (
        <>
          <Button type="link" onClick={() => editImage(record)}>
            Редагувати
          </Button>
          <Popconfirm
            title="Ви впевнені, що хочете видалити це зображення?"
            onConfirm={() => deleteImage(record.uid, record.name)}
            okText="Так"
            cancelText="Ні"
          >
            <Button type="link" danger>
              Видалити
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const onSelectBrand = (value: string[]) => setSelectedBrand(value);
  const onSelectColor = (value: string[]) => setSelectedColor(value);
  const onSelectHouse = (value: string[]) => setSelectedHouse(value);

  return (
    <div>
      <Select
        mode="multiple"
        placeholder="Оберіть бренд"
        style={{ width: 200, marginRight: 16 }}
        onChange={onSelectBrand}
        value={selectedBrand}
      >
        {brands.map((brand) => (
          <Select.Option key={brand.id} value={brand.name}>
            {brand.name}
          </Select.Option>
        ))}
      </Select>

      <Select
        mode="multiple"
        placeholder="Оберіть колір"
        style={{ width: 200, marginRight: 16 }}
        onChange={onSelectColor}
        value={selectedColor}
      >
        {colors.map((color) => (
          <Select.Option key={color.id} value={color.name}>
            {color.name}
          </Select.Option>
        ))}
      </Select>

      <Select
        mode="multiple"
        placeholder="Оберіть дім"
        style={{ width: 200 }}
        onChange={onSelectHouse}
        value={selectedHouse}
      >
        {houses.map((house) => (
          <Select.Option key={house.id} value={house.name}>
            {house.name}
          </Select.Option>
        ))}
      </Select>

      <Upload
        listType="picture"
        beforeUpload={beforeUpload}
        onChange={handleChange}
        maxCount={1}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />} style={{ marginTop: 16 }}>
          Завантажити зображення
        </Button>
      </Upload>

      <Table
        dataSource={fileList}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey="uid"
        style={{ marginTop: 20 }}
      />

      <Modal
        title="Редагувати зображення"
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={null}
      >
        <Form
          initialValues={{
            brand: editingImage?.brand,
            color: editingImage?.color,
            house: editingImage?.house,
          }}
          onFinish={handleEditOk}
        >
          <Form.Item name="brand" label="Бренд" rules={[{ required: true }]}>
            <Select mode="multiple" placeholder="Оберіть бренд">
              {brands.map((brand) => (
                <Select.Option key={brand.id} value={brand.name}>
                  {brand.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="color" label="Колір" rules={[{ required: true }]}>
          <Select mode="multiple" placeholder="Оберіть колір">
            {colors.map((color) => (
              <Select.Option key={color.id} value={color.name}>
                {color.name} ({color.code})  // Отображаем код вместе с именем
              </Select.Option>
            ))}
          </Select>
        </Form.Item>


          <Form.Item name="house" label="Дім" rules={[{ required: true }]}>
            <Select mode="multiple" placeholder="Оберіть дім">
              {houses.map((house) => (
                <Select.Option key={house.id} value={house.name}>
                  {house.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Зберегти
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Images;