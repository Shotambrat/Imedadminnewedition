"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Form, Input, Upload, Button, message, Spin, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function BannerUpdateModal({ visible, onClose, bannerData }) {
  const [form] = Form.useForm();
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("ru");

  const [updateItem, setUpdateItem] = useState({
    id: null,
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
    logo: { id: null, url: "" },
    photo: { id: null, url: "" },
    background: { id: null, url: "" },
    active: true,
    orderNum: 0,
  });

  useEffect(() => {
    if (bannerData) {
      // Проверка на null и задание значений по умолчанию
      const processedData = {
        ...bannerData,
        categoryName: bannerData.categoryName || { uz: "", ru: "", en: "" },
        title: bannerData.title || { uz: "", ru: "", en: "" },
        subTitle: bannerData.subTitle || { uz: "", ru: "", en: "" },
        tagName: bannerData.tagName || { uz: "", ru: "", en: "" },
        logo: bannerData.logo || { id: null, url: "" },
        photo: bannerData.photo || { id: null, url: "" },
        background: bannerData.productBackground || { id: null, url: "" },
      };

      setUpdateItem(processedData);
      form.setFieldsValue(processedData);
    }
  }, [bannerData, form]);

  const handleInputChange = (field, value) => {
    setUpdateItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (field, lang, value) => {
    setUpdateItem((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  };

  const handleTagClose = (lang, removedTag) => {
    const updatedTags = updateItem.tagName[lang]
      .split(",")
      .filter((tag) => tag !== removedTag)
      .join(",");
    setUpdateItem((prev) => ({
      ...prev,
      tagName: { ...prev.tagName, [lang]: updatedTags },
    }));
  };

  const handleTagInputConfirm = (lang) => {
    if (inputValue && !updateItem.tagName[lang].includes(inputValue)) {
      const updatedTags = updateItem.tagName[lang]
        ? `${updateItem.tagName[lang]},${inputValue}`
        : inputValue;
      setUpdateItem((prev) => ({
        ...prev,
        tagName: { ...prev.tagName, [lang]: updatedTags },
      }));
    }
    setInputValue(""); // Clear the input value after confirming
  };

  const handleUploadChange = (field, { fileList }) => {
    const file = fileList[0]?.originFileObj || null;
    setUpdateItem((prev) => ({ ...prev, [field]: { ...prev[field], file } }));
  };

  const handleFormSubmit = async () => {
    setLoading(true);
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
      formData.append(
        "json",
        JSON.stringify({
          id: updateItem.id,
          type: updateItem.type,
          category: updateItem.category,
          from: updateItem.from,
          to: updateItem.to,
          categoryName: updateItem.categoryName,
          title: updateItem.title,
          subTitle: updateItem.subTitle,
          tag: updateItem.tag,
          tagName: updateItem.tagName,
          backgroundColour: updateItem.backgroundColour,
          active: updateItem.active,
          orderNum: updateItem.orderNum,
        })
      );

      // Check for files and append them to the formData
      if (updateItem.logo.file) {
        const logoFormData = new FormData();
        logoFormData.append("new-photo", updateItem.logo.file);
        await axios.put(
          `http://213.230.91.55:8130/photo/${updateItem.logo.id}`,
          logoFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (updateItem.photo.file) {
        const photoFormData = new FormData();
        photoFormData.append("new-photo", updateItem.photo.file);
        await axios.put(
          `http://213.230.91.55:8130/photo/${updateItem.photo.id}`,
          photoFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (updateItem.background.file) {
        const backgroundFormData = new FormData();
        backgroundFormData.append("new-photo", updateItem.background.file);
        await axios.put(
          `http://213.230.91.55:8130/photo/${updateItem.background.id}`,
          backgroundFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      const response = await axios.put(
        "http://213.230.91.55:8130/banner/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Баннер успешно обновлен!");
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error updating banner:", error);
      message.error("Произошла ошибка. Пожалуйста, проверьте данные и попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  console.log("UpdateItem", updateItem);

  return (
    <Modal
      visible={visible}
      title="Редактировать баннер"
      onCancel={onClose}
      footer={[
        <Button
          key="submit"
          type="primary"
          onClick={handleFormSubmit}
          disabled={loading}
        >
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
        initialValues={updateItem}
        onValuesChange={(changedValues) => {
          const [field] = Object.keys(changedValues);
          if (field in updateItem) {
            handleInputChange(field, changedValues[field]);
          }
        }}
      >
        <Form.Item label="Название категории" name={`categoryName.${language}`}>
          <Input
            placeholder="Название категории"
            value={updateItem.categoryName?.[language] || ""}
            onChange={(e) =>
              handleNestedInputChange("categoryName", language, e.target.value)
            }
          />
        </Form.Item>

        <Form.Item label="Заголовок баннера" name={`title.${language}`}>
          <Input
            placeholder="Заголовок баннера"
            value={updateItem.title?.[language] || ""}
            onChange={(e) =>
              handleNestedInputChange("title", language, e.target.value)
            }
          />
        </Form.Item>

        <Form.Item label="Подзаголовок" name={`subTitle.${language}`}>
          <TextArea
            placeholder="Подзаголовок"
            autoSize={{ minRows: 2 }}
            value={updateItem.subTitle?.[language] || ""}
            onChange={(e) =>
              handleNestedInputChange("subTitle", language, e.target.value)
            }
          />
        </Form.Item>

        <Form.Item label="Теги" name={`tagName.${language}`}>
          {updateItem.tagName?.[language]
            ?.split(",")
            .map((tag, index) => (
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
            value={updateItem.backgroundColour}
            onChange={(e) => handleInputChange("backgroundColour", e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Логотип производителя" name="logo">
          <Upload
            fileList={
              updateItem.logo.url
                ? [
                    {
                      uid: "1",
                      name: "logo",
                      status: "done",
                      url: updateItem.logo.url,
                    },
                  ]
                : []
            }
            listType="picture-card"
            onChange={(info) => handleUploadChange("logo", info)}
          >
            {!updateItem.logo.url && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Загрузить файл</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item label="Изображение товара" name="photo">
          <Upload
            fileList={
              updateItem.photo.url
                ? [
                    {
                      uid: "1",
                      name: "photo",
                      status: "done",
                      url: updateItem.photo.url,
                    },
                  ]
                : []
            }
            listType="picture-card"
            onChange={(info) => handleUploadChange("photo", info)}
          >
            {!updateItem.photo.url && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Загрузить файл</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item label="Фон товара" name="background">
          <Upload
            fileList={
              updateItem.background?.url
                ? [
                    {
                      uid: "1",
                      name: "background",
                      status: "done",
                      url: updateItem.background.url,
                    },
                  ]
                : []
            }
            listType="picture-card"
            onChange={(info) => handleUploadChange("background", info)}
          >
            {!updateItem.background?.url && (
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