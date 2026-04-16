# Acompañar v2.0 — Guía de deploy


## Deploy en Vercel (10 minutos)

### 1. Instalar Node.js
https://nodejs.org — versión LTS

### 2. Instalar dependencias
```bash
npm install
```

### 3. Probar local (opcional)
```bash
npm run dev
# Abre http://localhost:5173
```

### 4. Deploy a Vercel
```bash
npm install -g vercel
vercel
```
- ¿Nuevo proyecto? → Y
- Nombre → `acompanar` (o el que quieras)
- Directorio → `.`
- Override settings? → N

Al terminar te da una URL como `https://acompanar.vercel.app`

---

## Instalar como app en el celular

### iPhone (Safari)
1. Abrí la URL en **Safari** (no Chrome)
2. Tocá el ícono compartir ↑
3. **"Agregar a pantalla de inicio"**
4. Nombre: Acompañar → Agregar
5. ¡Listo! Ícono azul en la pantalla

### Android (Chrome)
1. Abrí en Chrome
2. Tres puntos ⋮ → **"Instalar app"**
3. Confirmar

---

## Configurar API keys (para funciones IA)

### Martita — Anthropic Claude
1. https://console.anthropic.com → crear cuenta gratuita
2. API Keys → Create Key → copiar
3. En Vercel: Settings → Environment Variables
4. Agregar: `VITE_ANTHROPIC_KEY` = tu key
5. En `src/App.jsx` buscar el fetch a `/v1/messages` y agregar:
   `"x-api-key": import.meta.env.VITE_ANTHROPIC_KEY`

### Voz Paola — ElevenLabs
1. https://elevenlabs.io → crear cuenta gratuita (10.000 chars/mes)
2. Profile → API Key → copiar
3. En la app: panel Valeria/Romina → Alertas → "Voz de Martita" → pegar key

### Sensor SwitchBot
1. Comprar: SwitchBot Motion Sensor + Hub Mini (~$55 USD)
2. Configurar con app SwitchBot
3. En app SwitchBot: Perfil → API Token → copiar
4. En la app: Dispositivos → Sensor → pegar token + Device ID

---

## Actualizaciones futuras
```bash
vercel --prod
```

---

## Estructura
```
acompanar-deploy/
├── index.html          ← Entry point PWA
├── vite.config.js      ← Vite + PWA plugin
├── vercel.json         ← Routing SPA
├── package.json
├── src/
│   ├── main.jsx        ← Entry React
│   └── App.jsx         ← App completa (3128 líneas)
└── public/
    └── icons/          ← Íconos iOS/Android
```
