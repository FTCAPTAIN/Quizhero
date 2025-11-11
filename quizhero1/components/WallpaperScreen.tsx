import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Wallpaper } from '../types';
import { presetWallpapers } from '../data/wallpapers';
import { ArrowLeftIcon, CheckCircleIcon } from './Icons';

interface WallpaperScreenProps {
  onBack: () => void;
  currentWallpaper: Wallpaper;
  onSetWallpaper: (wallpaper: Wallpaper) => void;
  onShowToast: (message: string) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

const WallpaperScreen: React.FC<WallpaperScreenProps> = ({ onBack, currentWallpaper, onSetWallpaper, onShowToast }) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        onShowToast(t('error_invalid_file_type'));
        return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        onShowToast(t('error_file_too_large'));
        return;
    }

    try {
        const base64 = await fileToBase64(file);
        setPreviewImage(base64);
    } catch (error) {
        console.error("Error converting file to base64", error);
    }
  };

  const applyCustomWallpaper = () => {
    if (previewImage) {
      onSetWallpaper({ type: 'custom', value: previewImage });
      setPreviewImage(null);
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full p-4 md:p-6 text-slate-800 dark:text-white overflow-y-auto animate-fade-in">
      <header className="w-full max-w-4xl mx-auto pt-16 md:pt-4 mb-8 flex items-center">
        <button onClick={onBack} className="p-2 -ml-2 mr-2 text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white" aria-label="Go back">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-4xl font-bold">{t('wallpaper')}</h1>
      </header>

      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8">
            <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg text-left hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
                <h2 className="font-semibold text-lg">{t('upload_your_own')}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('upload_desc')}</p>
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
            />
        </div>

        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-300">{t('preset_wallpapers')}</h2>
            <button
                onClick={() => onSetWallpaper({ type: 'default', value: '' })}
                className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400"
            >
                {t('reset_to_default')}
            </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {presetWallpapers.map((preset) => {
            const isSelected = currentWallpaper.type === 'preset' && currentWallpaper.value === preset.id;
            return (
              <div key={preset.id} className="text-center">
                <button
                  onClick={() => onSetWallpaper({ type: 'preset', value: preset.id })}
                  className="w-full aspect-[3/4] rounded-lg overflow-hidden relative border-2 transition-all duration-200"
                  style={isSelected ? { borderColor: 'var(--tw-color-cyan-500)'} : { borderColor: 'transparent' }}
                >
                  <div className="absolute inset-0 bg-cover bg-center" style={preset.style}></div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-cyan-500 rounded-full text-white">
                      <CheckCircleIcon className="w-6 h-6" />
                    </div>
                  )}
                </button>
                <p className="font-semibold text-sm mt-2 text-slate-800 dark:text-slate-200">{t(preset.nameKey)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t(preset.descriptionKey)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in-fast">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center">
                <h2 className="text-xl font-bold text-white mb-4">{t('wallpaper_preview')}</h2>
                <div className="w-full aspect-[16/9] rounded-lg mb-6 bg-cover bg-center" style={{ backgroundImage: `url(${previewImage})` }}></div>
                <div className="w-full flex gap-4">
                    <button onClick={() => setPreviewImage(null)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors">
                        {t('cancel')}
                    </button>
                    <button onClick={applyCustomWallpaper} className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-colors">
                        {t('apply_wallpaper')}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default WallpaperScreen;
