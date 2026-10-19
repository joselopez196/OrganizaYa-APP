# Arquitectura de OrganizaYa (MVC)

La app es una PWA hecha con JavaScript simple (sin librerías ni compilación). El código está separado en capas **Modelo – Vista – Controlador**. Los archivos se cargan con `<script src>` en el orden de `index.html`.

```
index.html          estructura de la página + carga de archivos
css/                estilos (base.css, styles.css)
js/
  core/             utilidades sin dependencias (util, ics, platform, bus)
  config/           constantes, textos de la guía, iconos
  model/            DATOS Y REGLAS: estado, almacenamiento, sincronización, validación, consultas
  view/             PANTALLAS: dibujan HTML a partir del estado (hoy, tareas, calendario, …)
  controller/       ACCIONES: lo que pasa cuando el usuario toca algo (crear/editar/borrar, backup, sync)
  main.js           arranque: conecta las capas y inicia la app
```

## Cómo se comunican
- **Vista → Controlador**: los botones llaman funciones del controlador (`onclick="…"`).
- **Controlador → Modelo**: cambia los datos y llama a `save()`.
- **Modelo → Vista**: el modelo no conoce la pantalla; avisa con eventos (`Bus.emit('render')`, `Bus.emit('toast', msg)`) y `main.js` los conecta con el dibujado.

## Patrones de diseño usados
| Patrón | Dónde |
|---|---|
| **MVC** | carpetas `model/`, `view/`, `controller/` |
| **Observer** (eventos) | `core/bus.js` |
| **Repository** (acceso a datos) | `model/storage.js` (localStorage + IndexedDB) |
| **Strategy / Adapter** | `model/cloud-claude.js` y `model/cloud-supabase.js` ofrecen la misma interfaz (`get/set/onSnapshot`) y se elige una al iniciar |
| **Singleton** | el estado único `S` en `model/state.js` |
| **Facade** | `save()` esconde sellos de edición, guardado local y envío a la nube |

## Nota honesta
Es una separación por archivos y responsabilidades; la lógica no se reescribió, para que la app se comporte igual que antes. Algunos botones de la vista todavía cambian variables simples de pantalla (pestaña activa, filtros) directamente; los datos importantes siempre pasan por el controlador y el modelo.

## Publicar cambios
Sube el número `VERSION` en `service-worker.js` cada vez que publiques. Si agregas un archivo en `css/` o `js/`, agrégalo también a la lista `SHELL` del service worker y al `index.html`.
