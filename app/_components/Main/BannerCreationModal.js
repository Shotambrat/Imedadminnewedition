"use client";
import { useState } from "react";
import axios from "axios";
import { Modal, Form, Input, Select, Tag, Upload, Button, message, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function BannerCreationModal({ visible, onClose }) {
  const [form] = Form.useForm();
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false); // State for loading spinner

  const [language, setLanguage] = useState("ru"); // Default language

  const [createItem, setCreateItem] = useState({
    type: "other",
    category: true,
    from: "",
    to: "",
    categoryName: {
      uz: "",
      ru: "",
      en: "",
    },
    title: {
      uz: "",
      ru: "",
      en: "",
    },
    subTitle: {
      uz: "",
      ru: "",
      en: "",
    },
    tag: true,
    tagName: {
      uz: "",
      ru: "",
      en: "",
    },
    backgroundColour: "",
    logo: [],
    photo: [],
    background: [],
    active: true,
    orderNum: 0,
  });

  const handleInputChange = (field, value) => {
    setCreateItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (field, lang, value) => {
    setCreateItem((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  };

  const handleTagClose = (lang, removedTag) => {
    const updatedTags = createItem.tagName[lang]
      .split(",")
      .filter((tag) => tag !== removedTag)
      .join(",");
    setCreateItem((prev) => ({
      ...prev,
      tagName: { ...prev.tagName, [lang]: updatedTags },
    }));
  };

  const handleTagInputConfirm = (lang) => {
    if (inputValue && !createItem.tagName[lang].includes(inputValue)) {
      const updatedTags = createItem.tagName[lang]
        ? `${createItem.tagName[lang]},${inputValue}`
        : inputValue;
      setCreateItem((prev) => ({
        ...prev,
        tagName: { ...prev.tagName, [lang]: updatedTags },
      }));
    }
    setInputValue(""); // Clear the input value after confirming
  };

  const handleUploadChange = (field, { fileList }) => {
    const files = fileList.map((file) => file.originFileObj || file);
    setCreateItem((prev) => ({ ...prev, [field]: files }));
  };

  const handleFormSubmit = async () => {
    setLoading(true); // Start the loading spinner
    try {
      const authFormData = new FormData();
      authFormData.append("username", "nasiniemsin");
      authFormData.append("password", "2x2=xx");
      const authResponse = await axios.post(
        "http://213.230.91.55:8130/v1/auth/login",
        authFormData
      );

      const token = authResponse.data.data.token;

      const formData = new FormData();

      formData.append("json", JSON.stringify({
        type: createItem.type,
        category: createItem.category,
        from: createItem.from,
        to: createItem.to,
        categoryName: createItem.categoryName,
        title: createItem.title,
        subTitle: createItem.subTitle,
        tag: createItem.tag,
        tagName: createItem.tagName,
        backgroundColour: createItem.backgroundColour,
        active: createItem.active,
        orderNum: createItem.orderNum,
      }));

      if (createItem.logo.length > 0) {
        formData.append("logo", createItem.logo[0]);
      }
      if (createItem.photo.length > 0) {
        formData.append("photo", createItem.photo[0]);
      }
      if (createItem.background.length > 0) {
        formData.append("background", createItem.background[0]);
      }

      const response = await axios.post(
        "http://213.230.91.55:8130/v1/banner/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Баннер успешно добавлен!"); // Show success message
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Произошла ошибка. Пожалуйста, проверьте данные и попробуйте снова."); // Show error message
    } finally {
      setLoading(false); // Stop the loading spinner
    }
  };

  return (
    <Modal
      visible={visible}
      title="Редактировать баннер"
      onCancel={onClose}
      footer={[
        <Button key="submit" type="primary" onClick={handleFormSubmit} disabled={loading}>
          {loading ? <Spin /> : "Готово"}
        </Button>,
      ]}
    >
      <div className="flex justify-end mb-4">
        <Button.Group>
          <Button
            type={language === "ru" ? "primary" : "default"}
            onClick={() => setLanguage("ru")}
          >
            RU
          </Button>
          <Button
            type={language === "uz" ? "primary" : "default"}
            onClick={() => setLanguage("uz")}
          >
            UZ
          </Button>
          <Button
            type={language === "en" ? "primary" : "default"}
            onClick={() => setLanguage("en")}
          >
            EN
          </Button>
        </Button.Group>
      </div>
      <Form
        form={form}
        layout="vertical"
        initialValues={createItem}
        onValuesChange={(changedValues) => {
          const [field] = Object.keys(changedValues);
          if (field in createItem) {
            handleInputChange(field, changedValues[field]);
          }
        }}
      >
        <Form.Item label="Название категории" name={`categoryName.${language}`}>
          <Input
            placeholder="Название категории"
            value={createItem.categoryName[language]}
            onChange={(e) =>
              handleNestedInputChange("categoryName", language, e.target.value)
            }
          />
        </Form.Item>

        <Form.Item label="Заголовок баннера" name={`title.${language}`}>
          <Input
            placeholder="Заголовок баннера"
            value={createItem.title[language]}
            onChange={(e) =>
              handleNestedInputChange("title", language, e.target.value)
            }
          />
        </Form.Item>

        <Form.Item label="Подзаголовок" name={`subTitle.${language}`}>
          <TextArea
            placeholder="Подзаголовок"
            autoSize={{ minRows: 2 }}
            value={createItem.subTitle[language]}
            onChange={(e) =>
              handleNestedInputChange("subTitle", language, e.target.value)
            }
          />
        </Form.Item>

        <Form.Item label="Теги" name={`tagName.${language}`}>
          {createItem.tagName[language].split(",").map((tag, index) => (
            <Tag key={index} closable onClose={() => handleTagClose(language, tag)}>
              {tag}
            </Tag>
          ))}
          <Input
            type="text"
            size="small"
            style={{ width: 100 }}
            placeholder="Новый тег"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={() => handleTagInputConfirm(language)}
          />
        </Form.Item>

        <Form.Item label="Фон баннера" name="backgroundColour">
          <Input
            type="color"
            value={createItem.backgroundColour}
            onChange={(e) => handleInputChange("backgroundColour", e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Логотип производителя" name="logo">
          <Upload
            fileList={createItem.logo.map((file, index) => ({
              uid: index,
              name: file.name,
              status: "done",
              url: URL.createObjectURL(file),
              originFileObj: file,
            }))}
            listType="picture-card"
            onChange={(info) => handleUploadChange("logo", info)}
          >
            {createItem.logo.length < 1 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Загрузить файл</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item label="Изображение товара" name="photo">
          <Upload
            fileList={createItem.photo.map((file, index) => ({
              uid: index,
              name: file.name,
              status: "done",
              url: URL.createObjectURL(file),
              originFileObj: file,
            }))}
            listType="picture-card"
            onChange={(info) => handleUploadChange("photo", info)}
          >
            {createItem.photo.length < 1 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Загрузить файл</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item label="Фон товара" name="background">
          <Upload
            fileList={createItem.background.map((file, index) => ({
              uid: index,
              name: file.name,
              status: "done",
              url: URL.createObjectURL(file),
              originFileObj: file,
            }))}
            listType="picture-card"
            onChange={(info) => handleUploadChange("background", info)}
          >
            {createItem.background.length < 1 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Загрузить файл</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
