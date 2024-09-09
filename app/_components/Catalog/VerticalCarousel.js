import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const VerticalCarousel = ({ images, onGalleryUpdate }) => {
  const galleryItems = images.map((src, index) => ({
    original: src.url instanceof File ? URL.createObjectURL(src.url) : src.url,
    thumbnail: src.url instanceof File ? URL.createObjectURL(src.url) : src.url,
    thumbnailLabel: (
      <button
        className="delete-button"
        onClick={(e) => handleDeleteImage(e, src.id)}
      >
        &times;
      </button>
    ),
  }));

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file, index) => {
      return {
        id: index,
        url: file
      }
    });
    onGalleryUpdate([...images, ...newImages]);
  };

  const handleDeleteImage = (e, index) => {
    e.stopPropagation(); // Чтобы избежать переключения изображения
    const updatedImages = images.map(i => {
      if (i.id === index) {
        return {id: i.id, url: null};
      }
      return i;
    });
    onGalleryUpdate(updatedImages);
  };

  return (
    <div className="w-full vertical-carousel">
      <ImageGallery
        items={galleryItems}
        showThumbnails={true}
        showFullscreenButton={true}
        showPlayButton={false}
        showNav={false}
        additionalClass="custom-gallery"
        thumbnailPosition="left" // Миниатюры расположены слева
        renderThumbInner={(item) => (
          <div style={{ position: "relative" }}>
            <img
              src={item.thumbnail}
              alt=""
              style={{ height: "80px", width: "80px", objectFit: "cover" }}
            />
            {item.thumbnailLabel}
          </div>
        )}
      />
      <div className="mt-4 flex justify-center">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded"
        >
          Загрузить изображения
        </label>
      </div>
    </div>
  );
};

export default VerticalCarousel;
