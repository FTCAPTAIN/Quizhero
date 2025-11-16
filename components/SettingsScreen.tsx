import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeftIcon, SparklesIcon, SunIcon, MoonIcon, Cog8ToothIcon, LightBulbIcon } from './Icons';
import { GameState, Theme, ThemeColorSetting } from '../types';
import { presetThemeColors } from '../data/themeColors';
import ToggleSwitch from './ToggleSwitch';

interface SettingsScreenProps {
  onNavigate: (state: GameState) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeColor: ThemeColorSetting;
  setThemeColor: (themeColor: ThemeColorSetting) => void;
  isSoundEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
}

const ThemeOption: React.FC<{
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}> = ({ label, icon, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 ${
      isSelected
        ? 'bg-[var(--accent-color)]/20 border-[var(--accent-color)]'
        : 'bg-slate-100 dark:bg-slate-700/50 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
    }`}
  >
    <div className={`w-8 h-8 mb-1 ${isSelected ? 'text-[var(--accent-color)]' : 'text-slate-500 dark:text-slate-400'}`}>{icon}</div>
    <span className={`font-semibold text-sm ${isSelected ? 'text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{label}</span>
  </button>
);


const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate, theme, setTheme, themeColor, setThemeColor, isSoundEnabled, onToggleSound }) => {
  const { t } = useLanguage();
  const colorInputRef = useRef<HTMLInputElement>(null);

  const handleCustomColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThemeColor({ type: 'custom', value: event.target.value });
  };

  return (
    <div className="relative flex flex-col h-full w-full p-4 md:p-6 text-slate-800 dark:text-white overflow-y-auto animate-fade-in">
      <header className="w-full max-w-2xl mx-auto pt-16 md:pt-4 mb-8 flex items-center">
        <button onClick={() => onNavigate(GameState.HOME)} className="p-2 -ml-2 mr-2 text-slate-500 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white" aria-label="Go back">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-4xl font-bold">{t('settings_nav')}</h1>
      </header>

      <div className="w-full max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-300 pt-4 pb-2">{t('appearance')}</h2>
        
        <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
           <h3 className="font-semibold text-lg mb-1">{t('theme_mode')}</h3>
           <div className="flex justify-between items-center gap-4">
              <ThemeOption label={t('light_mode')} icon={<SunIcon />} isSelected={theme === 'light'} onClick={() => setTheme('light')} />
              <ThemeOption label={t('dark_mode')} icon={<MoonIcon />} isSelected={theme === 'dark'} onClick={() => setTheme('dark')} />
              <ThemeOption label={t('auto_mode')} icon={<Cog8ToothIcon />} isSelected={theme === 'auto'} onClick={() => setTheme('auto')} />
           </div>
           {theme === 'auto' && <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-3">{t('auto_mode_desc')}</p>}
        </div>

        <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-semibold text-lg">{t('sound_effects')}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('sound_effects_desc')}</p>
                </div>
                <ToggleSwitch checked={isSoundEnabled} onChange={onToggleSound} ariaLabel={t('sound_effects')} />
            </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-600 dark:text-slate-300 pt-4 pb-2">{t('personalization')}</h2>
        
        <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">{t('theme_color')}</h3>
            <div className="grid grid-cols-4 gap-3">
                <button
                    onClick={() => setThemeColor({ type: 'auto', value: 'auto' })}
                    className={`h-12 flex flex-col items-center justify-center rounded-lg border-2 transition-colors ${themeColor.type === 'auto' ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/20' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'}`}
                >
                    <SparklesIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">{t('auto_color')}</span>
                </button>
                {presetThemeColors.map(color => {
                    const isSelected = themeColor.type === 'preset' && themeColor.value === color.id;
                    return (
                        <button
                            key={color.id}
                            title={t(color.nameKey)}
                            onClick={() => setThemeColor({ type: 'preset', value: color.id })}
                            className={`h-12 rounded-lg transition-transform transform hover:scale-110 ${isSelected ? 'ring-2 ring-offset-2 ring-offset-slate-100 dark:ring-offset-slate-800/50 ring-[var(--accent-color)]' : ''}`}
                            style={{ backgroundColor: color.hex }}
                        />
                    );
                })}
                <button
                    onClick={() => colorInputRef.current?.click()}
                    className={`h-12 flex items-center justify-center rounded-lg border-2 bg-cover bg-center transition-colors ${themeColor.type === 'custom' ? 'border-[var(--accent-color)]' : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'}`}
                    style={{ backgroundImage: 'conic-gradient(from 180deg at 50% 50%, #EF4444 0deg, #F59E0B 60deg, #84CC16 120deg, #06B6D4 180deg, #3B82F6 240deg, #A855F7 300deg, #EF4444 360deg)'}}
                >
                    {themeColor.type === 'custom' && (
                        <div className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-900" style={{ backgroundColor: themeColor.value }}></div>
                    )}
                </button>
                <input
                    type="color"
                    ref={colorInputRef}
                    onChange={handleCustomColorChange}
                    value={themeColor.type === 'custom' ? themeColor.value : '#06b6d4'}
                    className="absolute w-0 h-0 opacity-0"
                />
            </div>
             {themeColor.type === 'auto' && <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-3">{t('auto_color_desc')}</p>}
        </div>

        <button onClick={() => onNavigate(GameState.WALLPAPER_SETTINGS)} className="w-full bg-slate-100 dark:bg-slate-800/50 p-4 rounded-lg flex justify-between items-center text-left hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <div>
            <h3 className="font-semibold text-lg">{t('wallpaper')}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('wallpaper_desc')}</p>
          </div>
          <LightBulbIcon className="w-6 h-6 text-[var(--accent-color)]" />
        </button>
      </div>
      
      <div className="w-full max-w-2xl mx-auto text-center mt-auto py-4">
          <p className="text-xs text-slate-500 dark:text-slate-600">Powered by Gemini</p>
      </div>
    </div>
  );
};

export default SettingsScreen;
