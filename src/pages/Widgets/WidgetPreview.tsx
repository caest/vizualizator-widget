import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../api/firebase";
import { useParams } from "react-router-dom";
import { Button, List, Col, Row, Image, Carousel } from "antd";
import { CheckCircleOutlined, DownloadOutlined } from "@ant-design/icons";
import FeedbackForm from "./FeedbackForm";
import useNotification from '../../hooks/useNotification';
import Spin from '../../components/ui/Spin';

interface Advantage {
  title: string;
  description: string;
}

interface Brand {
  id: string;
  name: string;
  colors: string[];
  description: string;
  advantages: Advantage[];
}

interface Widget {
  id: string;
  name: string;
  header: string;
  description: string;
  colors: { id: string; code: string; name: string; language: string }[];
  brands: Brand[];
  houses: string[];
  emails: string[];
  language: string;
  downloadButton: string;
  resetButton: string; 
  submitButton: string;
  sendButton: string;
  messageCantDownoloadWgd: string;
  messageError: string;
  messageCantDownoloadImg: string;
  messageChooseAllParams: string;
  cannotFindImg: string;
  success: string;
  sendedForm: string;
  fieldName: string;
  fieldNameRule: string;
  fieldPhoneNumber: string;
  fieldPhoneNumberRule:string;
  fieldPhoneNumberValidation:string;
  fieldEmailRule: string;
  fieldEmailValidation: string;
}

interface Images {
  brand: string[];
  color: { code: string; name: string }[];
  house: string[];
  name: string;
  url: string;
}

const WidgetPreview: React.FC = () => {
  const { widgetId } = useParams<{ widgetId: string }>();
  const [widget, setWidget] = useState<Widget | null>(null);
  const [images, setImages] = useState<Images[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const [loading, setLoading] = useState(true); 
  const translations = {
    sendButton: widget?.sendButton || 'Замовити',
    messageCantDownoloadWgd: widget?.messageCantDownoloadWgd || 'Не вдалося завантажити віджет',
    messageError: widget?.messageError || 'Помилка',
    messageCantDownoloadImg: widget?.messageCantDownoloadImg || 'Не вдалося завантажити зображення',
    messageChooseAllParams: widget?.messageChooseAllParams || 'Оберіть усі параметри',
    cannotFindImg: widget?.cannotFindImg || 'Не вдалося знайти зображення',
    success: widget?.success || 'Успішно!',
    sendedForm: widget?.sendedForm || 'Ваше замовлення було надіслано.',
    fieldName: widget?.fieldName || "Ім'я",
    fieldNameRule: widget?.fieldNameRule || "Будь ласка, введіть ваше ім'я!",
    fieldPhoneNumber: widget?.fieldPhoneNumber || 'Номер телефону',
    fieldPhoneNumberRule: widget?.fieldPhoneNumberRule || "Будь ласка, введіть номер телефону!",
    fieldPhoneNumberValidation: widget?.fieldPhoneNumberValidation || "Номер телефону не повинен містити літери!",
    fieldEmailRule: widget?.fieldEmailRule || "Будь ласка, введіть ваш e-mail!",
    fieldEmailValidation: widget?.fieldEmailValidation || "Введіть коректний e-mail!",
  };
  
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    const fetchWidget = async () => {
      setLoading(true);
      try {
        if (widgetId) {
          const docRef = doc(db, "widgets", widgetId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as Omit<Widget, "id">;
            setWidget({ ...data, id: docSnap.id });
          }
        }
      } catch (error) {
        showError((translations.messageError), (translations.messageCantDownoloadWgd));
      } finally {
        setLoading(false); 
      }
    };

    const fetchImages = async () => {
      setLoading(true);
      try {
        const imagesCollection = collection(db, "images");
        const imageDocs = await getDocs(imagesCollection);
        const imagesData = imageDocs.docs.map(doc => doc.data() as Images);
        setImages(imagesData);
      } catch (error) {
        showError((translations.messageError), (translations.messageCantDownoloadImg));
      } finally {
        setLoading(false); 
      }
    };

    fetchWidget();
    fetchImages();
  }, [widgetId]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setSelectedBrand(null);
    setSelectedHouse(null);
  };

  const handleBrandSelect = (brand: Brand) => {
    setSelectedBrand(brand);
    setSelectedHouse(null);
  };

  const handleHouseSelect = (house: string) => {
    setSelectedHouse(house);
  };

  const handleReset = () => {
    setSelectedColor(null);
    setSelectedBrand(null);
    setSelectedHouse(null);
  };

  const handleOpenFeedbackForm = () => {
    if (!selectedColor || !selectedBrand || !selectedHouse) {
      showError((translations.messageError), (translations.messageChooseAllParams));      return;
    }
    setShowFeedbackForm(true);
  };

  const handleCloseFeedbackForm = () => {
    setShowFeedbackForm(false);
  };

  const filteredImages = images.filter((image) => {
    if (!selectedColor || !selectedBrand || !selectedHouse) {
      return false;
    }

    const matchesColor = image.color.some((imgColor) =>
      imgColor.code.toLowerCase() === selectedColor.toLowerCase()
    );

    const matchesBrand = image.brand.some((imgBrand) =>
      imgBrand.toLowerCase() === selectedBrand.name.toLowerCase()
    );

    const matchesHouse = image.house.some((imgHouse) =>
      imgHouse.toLowerCase() === selectedHouse.toLowerCase()
    );

    return matchesColor && matchesBrand && matchesHouse;
  });

  const uniqueFilteredImages = filteredImages.filter((value, index, self) =>
    index === self.findIndex((t) => t.name === value.name)
  );


  const sliderSettings = {
    dots: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <div className="container">
      <Row style={{ marginBottom: "20px" , gap: "20px" }}>
        <Col span={18}>
          <div style={{ fontSize: "20px", lineHeight: "26px", marginBottom: "20px" }}>
            {widget?.header}
          </div>
          <div style={{ fontSize: "20px", lineHeight: "26px", marginBottom: "20px" }}>
            {widget?.description}
          </div>
          <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "20px" }}>
            {widget?.houses.map((house) => (
              <Button
                key={house}
                onClick={() => handleHouseSelect(house)}
                disabled={
                  selectedColor === null ||
                  selectedBrand === null ||
                  !widget.brands.some((brand) =>
                    brand.colors.includes(selectedColor)
                  )
                }
                style={{ fontSize: "14px" }}
                type={selectedHouse === house ? "primary" : "default"}
              >
                {house}
              </Button>
            ))}
          </div>
          
          <div style={{ marginTop: "20px" }}>
            {selectedColor && selectedBrand && selectedHouse ? (
              uniqueFilteredImages.length > 0 ? (
                uniqueFilteredImages.length === 1 ? (
                  <Image src={uniqueFilteredImages[0].url} style={{ width: "100%" }} />
                ) : (
                  <Carousel {...sliderSettings}>
                    {uniqueFilteredImages.map((image) => (
                      <div key={image.name}>
                        <Image src={image.url} style={{ width: '100%' }} />
                      </div>
                    ))}
                  </Carousel>
                )
              ) : (
                <p style={{background:"#fff", display: "flex", justifyContent: "center", alignItems: "center", height: "400px"}}>{translations.cannotFindImg}</p>
              )
            ) : (
              <p style={{background:"#fff", display: "flex", justifyContent: "center", alignItems: "center", height: "400px"}}>{translations.messageChooseAllParams}</p>
            )}
          </div>
        </Col>

        <Col span={4}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {widget?.colors.map((color) => (
              <Button
                key={color.id}
                style={{
                  backgroundColor: selectedColor === color.code ? color.code : selectedColor ? "#ccc" : color.code,
                  color: selectedColor === color.code ? "#000" : selectedColor ? "#777" : "#000",
                  width: "45%",
                  height: "50px",
                  textWrap: "wrap"
                }}
                onClick={() => handleColorSelect(color.code)}
                disabled={selectedColor !== null && selectedColor !== color.code}
              >
                {color.name}
              </Button>
            ))}
          </div>
          <Button onClick={handleReset} style={{ marginTop: "20px" }}>
          {widget?.resetButton || 'Скинути вибір'}
          </Button>
        </Col>
      </Row>

      <Row>
        <Col span={18}>
          {widget?.brands.map((brand) => (
            <Button
              key={brand.id}
              onClick={() => handleBrandSelect(brand)}
              disabled={selectedColor === null || !brand.colors.includes(selectedColor)}
              style={{ margin: "5px" }}
              type={selectedBrand?.id === brand.id ? "primary" : "default"}
            >
              {brand.name}
            </Button>
          ))}
          <div style={{ fontSize: "16px", lineHeight: "26px" }}>
            {selectedBrand?.description}
          </div>
            <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "20px" }}>
            <Button type="primary" onClick={handleOpenFeedbackForm}>
                 {widget?.submitButton || 'Замовити'}
          </Button>

          <Button type="primary" icon={<DownloadOutlined />}  onClick={handleOpenFeedbackForm}>
          {widget?.downloadButton || 'Завантажити'}
           </Button>
            </div>
        </Col>
        <Col span={6}>
          {selectedBrand && (
            <div>
              <List
                dataSource={selectedBrand.advantages}
                renderItem={(advantage) => (
                  <List.Item key={advantage.title}>
                    <CheckCircleOutlined style={{ marginRight: "8px" }} />
                    <strong>{advantage.title}:</strong> {advantage.description}
                  </List.Item>
                )}
              />
            </div>
          )}
        </Col>
      </Row>

      <FeedbackForm
        visible={showFeedbackForm}
        onClose={handleCloseFeedbackForm}
        selectedColor={selectedColor}
        selectedBrand={selectedBrand ? selectedBrand.name : null}
        selectedHouse={selectedHouse}
        uniqueFilteredImages={uniqueFilteredImages}
        colors={widget?.colors || []}
        translations={translations}
        recipientEmails={widget?.emails || []} 
      />
    </div>
  );
};

export default WidgetPreview;