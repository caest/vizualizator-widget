import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import { Widget, Language, Color, Brand, House } from '../../types/types';

const { Option } = Select;

interface WidgetFormProps {
  form: any;
  widgetData: Widget;
  languages: Language[];
  filteredColors: Color[];
  filteredHouses: House[];
  filteredBrands: Brand[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: any[]) => void;
  handleLanguageChange: (value: string) => void;
  handleAddWidget: () => void;
}

const WidgetForm: React.FC<WidgetFormProps> = ({
  form,
  widgetData,
  languages,
  filteredColors,
  filteredHouses,
  filteredBrands,
  handleChange,
  handleSelectChange,
  handleLanguageChange,
  handleAddWidget,
}) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item label="Мова" required>
        <Select
          value={widgetData.language}
          onChange={handleLanguageChange}
          placeholder="Виберіть мову"
        >
          {languages.map((lang) => (
            <Option key={lang.id} value={lang.name}>
              {lang.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Назва віджету" required>
        <Input
          name="name"
          value={widgetData.name}
          onChange={handleChange}
          placeholder="Введіть назву віджету"
        />
      </Form.Item>
      <Form.Item label="Заголовок" required>
        <Input
          name="header"
          value={widgetData.header}
          onChange={handleChange}
          placeholder="Введіть заголовок"
        />
      </Form.Item>
      <Form.Item label="Опис" required>
        <Input.TextArea
          name="description"
          value={widgetData.description}
          onChange={handleChange}
          placeholder="Введіть опис"
        />
      </Form.Item>
      <Form.Item label="Кольори" required>
        <Select
          mode="multiple"
          value={widgetData.colors.map((color) => color.name)}
          onChange={(value) => handleSelectChange('colors', value)}
          placeholder="Виберіть кольори"
        >
          {filteredColors.map((color) => (
            <Option key={color.key} value={color.name}>
              {color.name} ({color.code})
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Будинки" required>
        <Select
          mode="multiple"
          value={widgetData.houses}
          onChange={(value) => handleSelectChange('houses', value)}
          placeholder="Виберіть будинки"
        >
          {filteredHouses.map((house) => (
            <Option key={house.id} value={house.name}>
              {house.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Email" required>
        <Select
          mode="tags"
          value={widgetData.emails}
          onChange={(value) => handleSelectChange('emails', value)}
          placeholder="Введіть email адреси"
        />
      </Form.Item>
      <Form.Item label="Торгові марки" required>
        <Select
          mode="multiple"
          value={widgetData.brands.map((brand) => brand.name)}
          onChange={(value) => handleSelectChange('brands', value)}
          placeholder="Виберіть торгові марки"
        >
          {filteredBrands.map((brand) => (
            <Option key={brand.id} value={brand.name}>
              {brand.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {/* Поля для текста кнопок */}
      <Form.Item label="Текст для кнопки 'Завантажити PDF'" required>
        <Input
          name="downloadButton"
          value={widgetData.downloadButton}
          onChange={handleChange}
          placeholder="Введіть текст кнопки"
        />
      </Form.Item>
      <Form.Item label="Текст для кнопки 'Скинути вибір'" required>
        <Input
          name="resetButton"
          value={widgetData.resetButton}
          onChange={handleChange}
          placeholder="Введіть текст кнопки"
        />
      </Form.Item>
      <Form.Item label="Текст для кнопки 'Замовити'" required>
        <Input
          name="submitButton"
          value={widgetData.submitButton}
          onChange={handleChange}
          placeholder="Введіть текст кнопки"
        />
      </Form.Item>
      <Form.Item label="Текст для кнопки 'У формі'" required>
        <Input
          name="sendButton"
          value={widgetData.sendButton}
          onChange={handleChange}
          placeholder="Введіть текст кнопки"
        />
      </Form.Item>
      <Form.Item label="Текст для 'Помилки'" required>
        <Input
          name="messageError"
          value={widgetData.messageError}
          onChange={handleChange}
          placeholder="Введіть текст помилки"
        />
      </Form.Item>
      <Form.Item label="Текст для повідомлення 'Не вдалося завантажити віджет'" required>
        <Input
          name="messageCantDownoloadWgd"
          value={widgetData.messageCantDownoloadWgd}
          onChange={handleChange}
          placeholder="Введіть текст повідомлення"
        />
              </Form.Item>
        <Form.Item label="Текст для повідомлення 'Не вдалося завантажити фото'" required>
        <Input
          name="messageCantDownoloadImg"
          value={widgetData.messageCantDownoloadImg}
          onChange={handleChange}
          placeholder="Введіть текст повідомлення"
        />
              </Form.Item>
         <Form.Item label="Текст для повідомлення 'Оберіть усі параметри'" required>
        <Input
          name="messageChooseAllParams"
          value={widgetData.messageChooseAllParams}
          onChange={handleChange}
          placeholder="Введіть текст повідомлення"
        />
      </Form.Item>
      <Form.Item label="Текст для повідомлення 'Не вдалося знайти зображення'" required>
        <Input
          name="cannotFindImg"
          value={widgetData.cannotFindImg}
          onChange={handleChange}
          placeholder="Введіть текст повідомлення"
        />
      </Form.Item>
      <Form.Item label="Текст для повідомлення 'Успіх'" required>
        <Input
          name="success"
          value={widgetData.success}
          onChange={handleChange}
          placeholder="Введіть текст повідомлення"
        />
      </Form.Item>
      <Form.Item label="Текст для повідомлення 'Ваше замовлення було надіслано'" required>
        <Input
          name="sendedForm"
          value={widgetData.sendedForm}
          onChange={handleChange}
          placeholder="Введіть текст повідомлення"
        />
      </Form.Item>
      <Form.Item label="Текст для поля форми 'Ім'я'" required>
        <Input
          name="fieldName"
          value={widgetData.fieldName}
          onChange={handleChange}
          placeholder="Ім'я"
        />
      </Form.Item>
      <Form.Item label="Текст для правила поля форми 'Ім'я'" required>
        <Input
          name="fieldNameRule"
          value={widgetData.fieldNameRule}
          onChange={handleChange}
          placeholder="Будь ласка, введіть ваше ім'я!"
        />
      </Form.Item>
      <Form.Item label="Текст для поля форми 'Номер телефону'" required>
        <Input
          name="fieldPhoneNumber"
          value={widgetData.fieldPhoneNumber}
          onChange={handleChange}
          placeholder="Номер телефону"
        />
      </Form.Item>
      <Form.Item label="Текст для правила поля форми 'Номер телефону'" required>
        <Input
          name="fieldPhoneNumberRule"
          value={widgetData.fieldPhoneNumberRule}
          onChange={handleChange}
          placeholder="Будь ласка, введіть номер телефону!"
        />
      </Form.Item>
      <Form.Item label="Текст для валідації поля форми 'Номер телефону'" required>
        <Input
          name="fieldPhoneNumberValidation"
          value={widgetData.fieldPhoneNumberValidation}
          onChange={handleChange}
          placeholder="Номер телефону не повинен містити літери!"
        />
      </Form.Item>
      <Form.Item label="Текст для правила поля форми 'Email'" required>
        <Input
          name="fieldEmailRule"
          value={widgetData.fieldEmailRule}
          onChange={handleChange}
          placeholder="Будь ласка, введіть ваш e-mail!"
        />
      </Form.Item>
      <Form.Item label="Текст для валідації поля форми 'Email'" required>
        <Input
          name="fieldEmailValidation"
          value={widgetData.fieldEmailValidation}
          onChange={handleChange}
          placeholder="Введіть коректний e-mail!"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={handleAddWidget}>
          Додати віджет
        </Button>
      </Form.Item>
    </Form>
  );
};

export default WidgetForm;
