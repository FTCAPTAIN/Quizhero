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
             <p className="text-xs text-slate-500 font-semibold uppercase mb-2 px-3">Language</p>
            <div className="flex items-center justify-start gap-2 px-2">
                {languages.map(lang => (
                    <button
                        key={lang.code}
                        onClick={() => setLocale(lang.code)}
                        className={`text-sm font-bold py-1.5 px-4 rounded-md transition-colors duration-300 ${
                            locale === lang.code
                                ? 'bg-sky-500 text-white'
                                : 'text-slate-400 hover:bg-slate-700'
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