import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Locale } from '../types';

const languages: { code: Locale, label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'HI' },
    { code: 'te', label: 'TE' },
];

const LanguageSwitcher: React.FC = () => {
    const { locale, setLocale } = useLanguage();

    return (
        <div className="p-4">
             <p className="text-xs text-gray-400 font-semibold uppercase mb-2 px-3">Language</p>
            <div className="flex items-center bg-gray-800/50 rounded-full p-1">
                {languages.map(lang => (
                    <button
                        key={lang.code}
                        onClick={() => setLocale(lang.code)}
                        className={`w-full text-center text-sm font-bold py-1.5 rounded-full transition-colors duration-300 ${
                            locale === lang.code
                                ? 'bg-[var(--accent-color)] text-[var(--accent-color-contrast)]'
                                : 'text-gray-400 hover:bg-gray-700/50'
                        }`}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LanguageSwitcher;