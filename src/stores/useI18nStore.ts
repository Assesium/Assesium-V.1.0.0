import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'pt'
  | 'ru'
  | 'zh'
  | 'ja'
  | 'ko'
  | 'ar'
  | 'hi'
  | 'bn'
  | 'ur'
  | 'tr';

export type Region = 
  | 'US'
  | 'GB'
  | 'ES'
  | 'FR'
  | 'DE'
  | 'IT'
  | 'PT'
  | 'RU'
  | 'CN'
  | 'JP'
  | 'KR'
  | 'SA'
  | 'IN'
  | 'BD'
  | 'PK'
  | 'TR';

export interface Locale {
  language: Language;
  region: Region;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  timeFormat: string;
  numberFormat: string;
  currencyFormat: string;
  firstDayOfWeek: number;
  measurementSystem: 'metric' | 'imperial';
}

export interface Translation {
  key: string;
  namespace: string;
  language: Language;
  value: string;
  context?: string;
  pluralForms?: Record<string, string>;
}

export interface TranslationNamespace {
  name: string;
  description: string;
  translations: Translation[];
}

interface I18nStore {
  currentLocale: Locale;
  availableLocales: Locale[];
  translations: Translation[];
  namespaces: TranslationNamespace[];
  setLocale: (locale: Locale) => void;
  addTranslation: (translation: Omit<Translation, 'id'>) => void;
  updateTranslation: (key: string, language: Language, value: string) => void;
  deleteTranslation: (key: string, language: Language) => void;
  addNamespace: (namespace: Omit<TranslationNamespace, 'translations'>) => void;
  updateNamespace: (name: string, namespace: Partial<TranslationNamespace>) => void;
  deleteNamespace: (name: string) => void;
  translate: (key: string, params?: Record<string, any>, count?: number) => string;
  formatDate: (date: Date | string) => string;
  formatTime: (date: Date | string) => string;
  formatNumber: (number: number) => string;
  formatCurrency: (amount: number, currency: string) => string;
  getAvailableLanguages: () => Language[];
  getAvailableRegions: () => Region[];
  getTranslationStats: () => {
    totalTranslations: number;
    byLanguage: Record<Language, number>;
    byNamespace: Record<string, number>;
    missingTranslations: Record<Language, string[]>;
  };
}

const defaultLocale: Locale = {
  language: 'en',
  region: 'US',
  direction: 'ltr',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: 'hh:mm A',
  numberFormat: '1,234.56',
  currencyFormat: '$1,234.56',
  firstDayOfWeek: 0,
  measurementSystem: 'imperial',
};

const availableLocales: Locale[] = [
  {
    language: 'en',
    region: 'US',
    direction: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'hh:mm A',
    numberFormat: '1,234.56',
    currencyFormat: '$1,234.56',
    firstDayOfWeek: 0,
    measurementSystem: 'imperial',
  },
  {
    language: 'en',
    region: 'GB',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: '1,234.56',
    currencyFormat: '£1,234.56',
    firstDayOfWeek: 1,
    measurementSystem: 'metric',
  },
  {
    language: 'es',
    region: 'ES',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: '1.234,56',
    currencyFormat: '1.234,56 €',
    firstDayOfWeek: 1,
    measurementSystem: 'metric',
  },
  {
    language: 'ar',
    region: 'SA',
    direction: 'rtl',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: '١,٢٣٤.٥٦',
    currencyFormat: '١,٢٣٤.٥٦ ريال',
    firstDayOfWeek: 6,
    measurementSystem: 'metric',
  },
];

export const useI18nStore = create<I18nStore>()(
  persist(
    (set, get) => ({
      currentLocale: defaultLocale,
      availableLocales,
      translations: [],
      namespaces: [],

      setLocale: (locale) => {
        set({ currentLocale: locale });
      },

      addTranslation: (translation) => {
        set((state) => ({
          translations: [...state.translations, translation],
        }));
      },

      updateTranslation: (key, language, value) => {
        set((state) => ({
          translations: state.translations.map((t) =>
            t.key === key && t.language === language
              ? { ...t, value }
              : t
          ),
        }));
      },

      deleteTranslation: (key, language) => {
        set((state) => ({
          translations: state.translations.filter(
            (t) => !(t.key === key && t.language === language)
          ),
        }));
      },

      addNamespace: (namespace) => {
        set((state) => ({
          namespaces: [
            ...state.namespaces,
            { ...namespace, translations: [] },
          ],
        }));
      },

      updateNamespace: (name, namespace) => {
        set((state) => ({
          namespaces: state.namespaces.map((n) =>
            n.name === name ? { ...n, ...namespace } : n
          ),
        }));
      },

      deleteNamespace: (name) => {
        set((state) => ({
          namespaces: state.namespaces.filter((n) => n.name !== name),
          translations: state.translations.filter(
            (t) => t.namespace !== name
          ),
        }));
      },

      translate: (key, params = {}, count) => {
        const { currentLocale, translations } = get();
        const translation = translations.find(
          (t) => t.key === key && t.language === currentLocale.language
        );

        if (!translation) return key;

        let value = translation.value;

        if (count !== undefined && translation.pluralForms) {
          const pluralForm = getPluralForm(count, currentLocale.language);
          value = translation.pluralForms[pluralForm] || translation.value;
        }

        return replaceParams(value, params);
      },

      formatDate: (date) => {
        const { currentLocale } = get();
        const d = new Date(date);
        return formatDateString(d, currentLocale.dateFormat);
      },

      formatTime: (date) => {
        const { currentLocale } = get();
        const d = new Date(date);
        return formatTimeString(d, currentLocale.timeFormat);
      },

      formatNumber: (number) => {
        const { currentLocale } = get();
        return formatNumberString(number, currentLocale.numberFormat);
      },

      formatCurrency: (amount, currency) => {
        const { currentLocale } = get();
        return formatCurrencyString(amount, currency, currentLocale.currencyFormat);
      },

      getAvailableLanguages: () => {
        return Array.from(
          new Set(get().availableLocales.map((l) => l.language))
        ) as Language[];
      },

      getAvailableRegions: () => {
        return Array.from(
          new Set(get().availableLocales.map((l) => l.region))
        ) as Region[];
      },

      getTranslationStats: () => {
        const { translations, namespaces } = get();
        const languages = get().getAvailableLanguages();

        const byLanguage = languages.reduce(
          (acc, lang) => ({
            ...acc,
            [lang]: translations.filter((t) => t.language === lang).length,
          }),
          {} as Record<Language, number>
        );

        const byNamespace = namespaces.reduce(
          (acc, ns) => ({
            ...acc,
            [ns.name]: translations.filter((t) => t.namespace === ns.name).length,
          }),
          {} as Record<string, number>
        );

        const missingTranslations = languages.reduce(
          (acc, lang) => ({
            ...acc,
            [lang]: getMissingTranslations(lang),
          }),
          {} as Record<Language, string[]>
        );

        return {
          totalTranslations: translations.length,
          byLanguage,
          byNamespace,
          missingTranslations,
        };
      },
    }),
    {
      name: 'i18n-storage',
    }
  )
);

// Helper functions
function getPluralForm(count: number, language: Language): string {
  // Simplified plural form rules
  if (language === 'ar') {
    if (count === 0) return 'zero';
    if (count === 1) return 'one';
    if (count === 2) return 'two';
    if (count >= 3 && count <= 10) return 'few';
    if (count >= 11 && count <= 99) return 'many';
    return 'other';
  }

  if (count === 1) return 'one';
  return 'other';
}

function replaceParams(value: string, params: Record<string, any>): string {
  return value.replace(/\{(\w+)\}/g, (_, key) => params[key]?.toString() || `{${key}}`);
}

function formatDateString(date: Date, format: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day);
}

function formatTimeString(date: Date, format: string): string {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;

  return format
    .replace('HH', String(hours).padStart(2, '0'))
    .replace('hh', String(hour12).padStart(2, '0'))
    .replace('mm', minutes)
    .replace('A', ampm);
}

function formatNumberString(number: number, format: string): string {
  return number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatCurrencyString(
  amount: number,
  currency: string,
  format: string
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

function getMissingTranslations(language: Language): string[] {
  const store = useI18nStore.getState();
  const { translations, namespaces } = store;
  const allKeys = new Set(
    namespaces.flatMap((ns: TranslationNamespace) =>
      translations
        .filter((t: Translation) => t.namespace === ns.name)
        .map((t: Translation) => t.key)
    )
  );

  const translatedKeys = new Set(
    translations
      .filter((t: Translation) => t.language === language)
      .map((t: Translation) => t.key)
  );

  return Array.from(allKeys).filter((key: string) => !translatedKeys.has(key));
} 