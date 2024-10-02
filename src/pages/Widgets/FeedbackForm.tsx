import React, { useState } from "react"; // Не забудьте импортировать useState
import { Form, Input, Button, Modal } from "antd";
import useNotification from '../../hooks/useNotification';
import emailjs from 'emailjs-com';

interface FeedbackFormProps {
  visible: boolean;
  onClose: () => void;
  selectedColor: string | null;
  selectedBrand: string | null;
  selectedHouse: string | null;
  uniqueFilteredImages: { url: string; name: string }[];
  colors: { code: string; name: string }[];
  translations: {
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
    fieldPhoneNumberRule: string;
    fieldPhoneNumberValidation: string;
    fieldEmailRule: string;
    fieldEmailValidation: string;
  };
  recipientEmails: string[]; // новый пропс
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  visible,
  onClose,
  selectedColor,
  selectedBrand,
  selectedHouse,
  uniqueFilteredImages,
  colors,
  translations,
  recipientEmails, // используем новый пропс
}) => {
  const { showSuccess, showError } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false); // Флаг для отслеживания состояния отправки

  const handleSubmit = async (values: any) => {
    if (isSubmitting) return; // Если уже отправляется, не выполнять снова
    setIsSubmitting(true); // Устанавливаем флаг отправки

    try {
      // Данные для отправки
      const emailData = {
        name: values.name,
        phone: values.phone,
        email: values.email,
        color: selectedColor,
        brand: selectedBrand,
        house: selectedHouse,
        image_url: uniqueFilteredImages.length > 0 ? uniqueFilteredImages[0].url : '',
      };

      // Отправка данных на email пользователя
      const responseUser = await emailjs.send(
        'service_ktnjhub',
        'template_gu3an7k',
        { 
          ...emailData, 
          recipient_email: values.email // Отправляем на email пользователя
        },
        'eFyXm2R0EUmgFSUxI'
      );
      console.log("Ответ от emailjs для пользователя:", responseUser);

      // Отправка данных на другие адреса
      for (const recipientEmail of recipientEmails) {
        const responseRecipient = await emailjs.send(
          'service_ktnjhub',
          'template_gu3an7k',
          { 
            ...emailData, 
            recipient_email: recipientEmail 
          },
          'eFyXm2R0EUmgFSUxI'
        );
        console.log("Ответ от emailjs для адресата:", responseRecipient);
      }

      showSuccess(translations.success, translations.sendedForm);
      onClose();
    } catch (error) {
      console.error("Ошибка отправки:", error);
      showError(translations.messageError, translations.messageCantDownoloadWgd);
    } finally {
      setIsSubmitting(false); // Сбрасываем флаг после завершения
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label={translations.fieldName}
          name="name"
          rules={[{ required: true, message: translations.fieldNameRule }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={translations.fieldPhoneNumber}
          name="phone"
          rules={[
            { required: true, message: translations.fieldPhoneNumberRule },
            {
              validator: (_, value) => {
                if (!value || /^[0-9]*$/.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(translations.fieldPhoneNumberValidation));
              },
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={translations.fieldEmailRule}
          name="email"
          rules={[
            { required: true, message: translations.fieldEmailRule },
            { type: 'email', message: translations.fieldEmailValidation },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Колір">
          <Input value={selectedColor || ''} readOnly />
        </Form.Item>
        
        <Form.Item label="Бренд">
          <Input value={selectedBrand || ''} readOnly />
        </Form.Item>

        <Form.Item label="Дім">
          <Input value={selectedHouse || ''} readOnly />
        </Form.Item>

        {uniqueFilteredImages.length > 0 && (
          <Form.Item label="Зображення">
            <img src={uniqueFilteredImages[0].url} alt="Preview" style={{ width: '100%' }} />
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={isSubmitting}> {/* Отключаем кнопку при отправке */}
            {translations.sendButton || 'Замовити'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FeedbackForm;
