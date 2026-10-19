/* ===== VISTA · js/view/theme.js =====
   Tema claro / oscuro. */
const THEMES=['auto','light','dark'],TL={auto:'Auto',light:'Claro',dark:'Oscuro'};
let theme='auto';try{theme=localStorage.getItem('ms-theme')||'auto';if(!THEMES.includes(theme))theme='auto'}catch(e){}
const applyTheme=()=>{const r=document.documentElement;if(theme==='auto')r.removeAttribute('data-theme');else r.setAttribute('data-theme',theme)};
applyTheme();
function cycleTheme(){theme=THEMES[(THEMES.indexOf(theme)+1)%THEMES.length];try{localStorage.setItem('ms-theme',theme)}catch(e){}applyTheme();draw()}
