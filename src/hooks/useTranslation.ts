import en from '../locales/en.json';

type Dictionary = Record<string, any>;

export function useTranslation() {
  // Simple implementation for English only right now.
  // Can be extended to use Context/State for multiple languages.
  const t = (key: string): string => {
    const keys = key.split('.');
    let current: Dictionary | string = en;
    for (const k of keys) {
      if (typeof current === 'object' && current !== null && k in current) {
        current = current[k];
      } else {
        console.warn(`Missing translation for key: ${key}`);
        return key;
      }
    }
    return typeof current === 'string' ? current : key;
  };

  return { t };
}
