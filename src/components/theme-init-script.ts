/** Keep in sync with the ThemeProvider props in `src/app/layout.tsx`. */
export const THEME_STORAGE_KEY = "theme";
export const THEME_DEFAULT = "dark";

/**
 * Runs from the root layout before paint. next-themes' own script is rendered
 * by a client component, which React 19 refuses to execute.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})||${JSON.stringify(THEME_DEFAULT)};if(t==="system"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var d=document.documentElement;d.classList.remove("light","dark");if(t==="light"||t==="dark"){d.classList.add(t);d.style.colorScheme=t}}catch(e){}})();`;
