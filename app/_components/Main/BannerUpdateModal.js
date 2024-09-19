"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Form, Input, Upload, Button, message, Spin, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function BannerUpdateModal({ visible, onClose, bannerId }) {
  const [form] = Form.useForm();
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("ru");
  const [isSaveDisabled, setIsSaveDisabled] = useState(true); // Управление кнопкой "Готово"

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
    link: '',
    active: true,
    orderNum: 0,
  });

  console.log("UpdateItem", updateItem);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await axios.get(`http://213.230.91.55:8130/v1/banner/${bannerId}`, {
          headers: {
            "Accept-Language": "",
          },
        });
        const data = response.data.data;
        const processedData = {
          ...data,
          categoryName: data.categoryName || { uz: "", ru: "", en: "" },
          title: data.title || { uz: "", ru: "", en: "" },
          subTitle: data.subTitle || { uz: "", ru: "", en: "" },
          tagName: data.tagName || { uz: "", ru: "", en: "" },
          logo: data.logo || { id: null, url: "" },
          photo: data.photo || { id: null, url: "" },
          background: data.productBackground || { id: null, url: "" },
          link: data.link || { uz: "", ru: "", en: "" },
        };

        setUpdateItem(processedData);
        form.setFieldsValue(processedData);
        checkIfImagesPresent(processedData); // Проверка наличия изображений
      } catch (error) {
        message.error("Failed to fetch banner data.");
      }
    };

    if (bannerId) {
      fetchBannerData();
    }
  }, [bannerId, form]);

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
    setInputValue("");
  };

  // Проверка, есть ли изображения
  const checkIfImagesPresent = (data) => {
    const allImagesPresent = data.logo.url && data.photo.url && data.background.url;
    setIsSaveDisabled(!allImagesPresent); // Делаем кнопку активной или неактивной
  };

  // Замена изображения вместо удаления
  const handleUploadChange = (field, { fileList }) => {
    const file = fileList[0]?.originFileObj || null;
    setUpdateItem((prev) => ({ ...prev, [field]: { ...prev[field], url: file } }));
    setIsSaveDisabled(!file); // Проверяем, если ли изображение, чтобы активировать кнопку
  };

  // Function to upload new photos to API
  const uploadNewPhoto = async (file, id) => {
    const formData = new FormData();
    formData.append("new-photo", file);
    try {
      const response = await axios.put(`http://213.230.91.55:8130/photo/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data.url; // return the new URL
    } catch (error) {
      message.error("Ошибка при загрузке изображения");
      throw error;
    }
  };

  // Function to handle form submission and image uploading
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

      // Check if images are file objects and need to be uploaded
      const updatedImages = { ...updateItem };

      if (updateItem.logo?.url instanceof File) {
        const newLogoUrl = await uploadNewPhoto(updateItem.logo.url, updateItem.logo.id);
        updatedImages.logo.url = newLogoUrl;
      }

      if (updateItem.photo?.url instanceof File) {
        const newPhotoUrl = await uploadNewPhoto(updateItem.photo.url, updateItem.photo.id);
        updatedImages.photo.url = newPhotoUrl;
      }

      if (updateItem.background?.url instanceof File) {
        const newBackgroundUrl = await uploadNewPhoto(updateItem.background.url, updateItem.background.id);
        updatedImages.background.url = newBackgroundUrl;
      }

        const data = JSON.stringify({
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
          link: updateItem.link,
          active: updateItem.active,
          orderNum: updateItem.orderNum,
        })

      await axios.put("http://213.230.91.55:8130/v1/banner/slider", data, {
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("Баннер успешно обновлен!");
      onClose();
    } catch (error) {
      console.error("Error updating banner:", error);
      message.error("Произошла ошибка. Пожалуйста, проверьте данные и попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Редактировать баннер"
      onCancel={onClose}
      footer={[
        <Button key="submit" type="primary" onClick={handleFormSubmit} disabled={isSaveDisabled || loading}>
          {loading ? <Spin /> : "Готово"}
        </Button>,
      ]}
    >
      <div className="flex justify-end mb-4">
        <Button.Group>
          <Button type={language === "ru" ? "primary" : "default"} onClick={() => setLanguage("ru")}>
            RU
          </Button>
          <Button type={language === "uz" ? "primary" : "default"} onClick={() => setLanguage("uz")}>
            UZ
          </Button>
          <Button type={language === "en" ? "primary" : "default"} onClick={() => setLanguage("en")}>
            EN
          </Button>
        </Button.Group>
      </div>
      <Form form={form} layout="vertical">
        <Form.Item label="Название категории" name={`categoryName.${language}`}>
          <Input
            placeholder="Название категории"
            defaultValue={updateItem.categoryName[language]}
            onChange={(e) => handleNestedInputChange("categoryName", language, e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Заголовок баннера" name={`title.${language}`}>
          <Input
            placeholder="Заголовок баннера"
            defaultValue={updateItem.title?.[language]}
            onChange={(e) => handleNestedInputChange("title", language, e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Подзаголовок" name={`subTitle.${language}`}>
          <TextArea
            placeholder="Подзаголовок"
            autoSize={{ minRows: 2 }}
            defaultValue={updateItem.subTitle?.[language]}
            onChange={(e) => handleNestedInputChange("subTitle", language, e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Ссылка" name={`link.${language}`}>
          <Input
            placeholder="Ссылка"
            defaultValue={updateItem.link?.[language]}
            onChange={(e) => handleNestedInputChange("link", language, e.target.value)}
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

        {/* Логотип */}
        <Form.Item label="Логотип производителя" name="logo">
          <Upload
            fileList={
              updateItem.logo.url && !(updateItem.logo.url instanceof File)
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
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>{updateItem.logo.url ? "Изменить" : "Загрузить"}</div>
            </div>
          </Upload>
        </Form.Item>

        {/* Изображение товара */}
        <Form.Item label="Изображение товара" name="photo">
          <Upload
            fileList={
              updateItem.photo.url && !(updateItem.photo.url instanceof File)
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
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>{updateItem.photo.url ? "Изменить" : "Загрузить"}</div>
            </div>
          </Upload>
        </Form.Item>

        {/* Фон товара */}
        <Form.Item label="Фон товара" name="background">
          <Upload
            fileList={
              updateItem.background?.url && !(updateItem.background.url instanceof File)
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
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>{updateItem.background?.url ? "Изменить" : "Загрузить"}</div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
