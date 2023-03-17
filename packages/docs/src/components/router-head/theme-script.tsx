import { combineInlines } from '@builder.io/qwik';

export const themeStorageKey = 'theme-preference';

function setTheme() {
  const colorTheme = localStorage.getItem(themeStorageKey);
  if (colorTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    localStorage.setItem(themeStorageKey, colorTheme || 'dark');
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export const ThemeScript = () => {
  return <script dangerouslySetInnerHTML={combineInlines(setTheme)} />;
};
