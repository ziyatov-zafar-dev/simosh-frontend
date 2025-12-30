
import React, { useState } from 'react';
import { uploadLogo } from '../logoService';

interface LogoManagerProps {
  currentLogoUrl: string | null;
  onLogoUpdated: (newUrl: string) => void;
  onClose: () => void;
}

const LogoManager: React.FC<LogoManagerProps> = ({ currentLogoUrl, onLogoUpdated, onClose }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    const newUrl = await uploadLogo(selectedFile);
    setIsUploading(false);
    if (newUrl) {
      onLogoUpdated(newUrl);
      onClose();
    } else {
      alert("Xatolik: Logo yuklanmadi.");
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-emerald-950 rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300 border border-emerald-50 dark:border-emerald-800">
        <div className="p-6 border-b border-gray-100 dark:border-emerald-800 flex justify-between items-center bg-emerald-50 dark:bg-emerald-900/50">
          <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-50">Logo Sozlamalari</h3>
          <button onClick={onClose} className="text-emerald-900 dark:text-emerald-300 hover:text-emerald-600 transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-2xl bg-gray-100 dark:bg-emerald-900/50 flex items-center justify-center overflow-hidden border-2 border-dashed border-emerald-200 dark:border-emerald-700 mb-4 shadow-inner relative group">
              {preview || currentLogoUrl ? (
                <img src={preview || (currentLogoUrl as string)} alt="Logo Preview" className="w-full h-full object-cover" />
              ) : (
                <i className="fas fa-image text-3xl text-gray-300 dark:text-emerald-800"></i>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-emerald-300/60 text-center">Tizim uchun yangi logo tanlang</p>
          </div>

          <label className="block mb-8">
            <div className="w-full border-2 border-dashed border-gray-200 dark:border-emerald-800 rounded-2xl p-8 text-center hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 cursor-pointer transition-all group">
              <i className="fas fa-cloud-upload-alt text-3xl text-gray-300 dark:text-emerald-800 group-hover:text-emerald-500 mb-3 block"></i>
              <span className="text-sm font-medium text-gray-600 dark:text-emerald-300 block">Rasm yuklang</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          </label>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {isUploading ? (
              <><i className="fas fa-spinner fa-spin mr-2"></i> Yuklanmoqda...</>
            ) : (
              'Logoni yangilash'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoManager;
