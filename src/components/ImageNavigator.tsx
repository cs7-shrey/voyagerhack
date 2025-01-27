import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageNavigatorProps {
  images: string[];
  onClose?: () => void;
}

const ImageNavigator = ({ images, onClose }: ImageNavigatorProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isFullscreen = false;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const imageTags = images.map((img, index) => (
    <img
      src={img}
      alt={`Image ${index + 1}`}
      className="w-full h-full max-h-64 min-h-full object-cover"
    />
  ))

  return (
    <div className={`relative min-h-60 max-h-64 ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'w-full'}`}>
      {/* Main Image */}
      <div className="relative w-full h-full min-h-60 bg-gray-100">
        
        { imageTags[currentIndex] }

        {/* Navigation Controls */}
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <button
            onClick={prevImage}
            className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextImage}
            className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Top Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {/* <div className="flex gap-2 mt-2 p-2 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`flex-shrink-0 w-20 h-20 transition-all ${
              index === currentIndex ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover rounded-md"
            />
          </button>
        ))}
      </div> */}
    </div>
  );
};

export default ImageNavigator;