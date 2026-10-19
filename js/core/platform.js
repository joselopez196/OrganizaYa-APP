/* ===== NÚCLEO · js/core/platform.js =====
   Detección de plataforma y enlaces seguros para Android / iOS. */
const UA=navigator.userAgent,IOS=/iP(hone|ad|od)/.test(UA)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1),AND=/Android/i.test(UA);
const IOSM={'com.android.chrome':'googlechromes://','com.microsoft.emmx':'microsoft-edge-https://','com.samsung.android.dialer':'tel:','com.samsung.android.messaging':'sms:','com.android.vending':'itms-apps://'};
const pkgOf=u=>(/^intent:.*package=([\w.]+)/i.exec(u)||[])[1];
const hideL=l=>{if(!IOS)return false;const p=pkgOf(l.url);return !!p&&!IOSM[p]&&(/^com\.(sec|samsung)\./.test(p)||p==='com.android.settings')};
const safeU=(u,l)=>{if(!/^(https?:\/\/|whatsapp:|intent:|tel:|sms:|itms-apps:|googlechromes:|microsoft-edge-https:)/i.test(u))return '#';
 const p=pkgOf(u),q=/^https:\/\/play\.google\.com\/store\/search.*[?&]q=([^&]*)/.exec(u);
 if(IOS){if(p)return IOSM[p]||'itms-apps://search.itunes.apple.com/WebObjects/MZSearch.woa/wa/search?media=software&term='+encodeURIComponent(l?l.name:p);if(q)return 'itms-apps://search.itunes.apple.com/WebObjects/MZSearch.woa/wa/search?media=software&term='+q[1];return u}
 if(!AND&&p)return 'https://play.google.com/store/apps/details?id='+p;return u};
