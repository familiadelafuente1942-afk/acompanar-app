import { useState, useEffect, useRef } from "react";

const css = document.createElement("style");
css.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  html, body { width: 100%; max-width: 100%; overflow-x: hidden; font-family: 'Inter', system-ui, sans-serif; background: #F4F6F9; }
  a { text-decoration: none; color: inherit; }
  input, textarea, select, button { font-family: inherit; max-width: 100%; }
  img { max-width: 100%; }
  @keyframes ripple { 0%{opacity:.4;transform:scale(.82)} 100%{opacity:0;transform:scale(1.05)} }
  @keyframes pulse  { 0%,60%,100%{opacity:.2;transform:scale(.8)} 30%{opacity:1;transform:scale(1.2)} }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
`;
if (!document.head.querySelector("[data-acomp]")) {
  css.setAttribute("data-acomp","1");
  document.head.appendChild(css);
}


// -- PALETA --
const C = {
  // Paleta médica
  primary:   "#1B4F8A",   // azul médico
  primaryDk: "#133A6B",   // azul oscuro
  accent:    "#0EA5E9",   // azul claro acciones
  danger:    "#DC2626",   // rojo alertas
  dangerL:   "#FEF2F2",   // rojo suave fondo
  success:   "#16A34A",   // verde confirmado
  successL:  "#F0FDF4",   // verde suave fondo
  warn:      "#D97706",   // amarillo pendiente
  warnL:     "#FFFBEB",   // amarillo suave fondo
  bg:        "#F4F6F9",   // fondo app
  surface:   "#FFFFFF",   // cards
  border:    "#E5E7EB",   // bordes
  text:      "#111827",   // texto principal
  textMed:   "#374151",   // texto secundario
  textSoft:  "#6B7280",   // texto suave
  textMuted: "#9CA3AF",   // texto muy suave
};

// -- ESTILOS --
const S = {
  // Overlays
  overlay:  { position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:500, display:"flex", alignItems:"flex-end", justifyContent:"center" },
  modal:    { background:C.surface, borderRadius:"12px 12px 0 0", width:"100%", maxWidth:480, padding:"24px 20px 36px", maxHeight:"88dvh", overflowY:"auto" },
  modalTitle: { fontSize:"1.1rem", fontWeight:700, marginBottom:16, color:C.text },
  // Cards
  card:    { background:C.surface, borderRadius:10, padding:"11px 14px", display:"flex", alignItems:"center", gap:12, boxShadow:"0 1px 4px rgba(0,0,0,.07)", border:`1px solid ${C.border}` },
  cardBox: { background:C.surface, borderRadius:10, padding:"14px 16px", marginBottom:12, boxShadow:"0 1px 4px rgba(0,0,0,.07)", border:`1px solid ${C.border}` },
  cardImg: { width:44, height:44, borderRadius:8, objectFit:"cover", flexShrink:0 },
  cardName:{ fontSize:".88rem", fontWeight:600, color:C.text },
  cardSub: { fontSize:".72rem", color:C.textSoft, fontWeight:500, marginTop:2 },
  // Bubbles
  bubbleUser: { background:"#EFF6FF", borderRadius:10, padding:"11px 14px", border:`1px solid #DBEAFE`, fontSize:".95rem", fontWeight:500, color:C.text },
  bubbleAI:   { background:C.surface, borderRadius:10, padding:"11px 14px", border:`1px solid ${C.border}`, fontSize:".95rem", fontWeight:500, color:C.text },
  bwho:       { fontSize:".65rem", fontWeight:700, textTransform:"uppercase", letterSpacing:".07em", color:C.textMuted, marginBottom:4 },
  // YT
  ytCard: { background:C.surface, borderRadius:10, padding:"10px 12px", border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:10, borderLeft:"3px solid #DC2626", cursor:"pointer" },
  // Nav
  navBtn:  { display:"flex", flexDirection:"column", alignItems:"center", gap:4, flex:1, border:"none", background:"none", cursor:"pointer", padding:"4px 0", fontFamily:"inherit" },
  navTile: { width:50, height:50, borderRadius:10, position:"relative", overflow:"hidden", border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", background:C.surface },
  navImg:  { position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", borderRadius:10 },
  navFb:   { fontSize:"1.4rem", position:"relative", zIndex:1 },
  navLbl:  { fontSize:".66rem", fontWeight:600, color:C.textSoft },
  // Back buttons
  backCircle:  { background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.25)", borderRadius:6, width:34, height:34, color:"white", fontSize:".95rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" },
  backCircleW: { background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.25)", borderRadius:6, width:32, height:32, color:"white", fontSize:".9rem",  cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" },
  // Sub screens
  subScreen:  { display:"flex", flexDirection:"column", height:"100vh", width:"100%", maxWidth:480, margin:"0 auto", background:C.bg, fontFamily:"'Inter',system-ui,sans-serif", overflow:"hidden" },
  scrollBody: { flex:1, overflowY:"auto", overflowX:"hidden", padding:"14px 14px 24px", width:"100%" },
  bigGreenBtn:{ width:"100%", background:C.primary, color:"white", border:"none", borderRadius:8, padding:13, fontFamily:"inherit", fontSize:".95rem", fontWeight:600, cursor:"pointer" },
  // Forms
  fg:  { marginBottom:14 },
  lbl: { display:"block", fontSize:".72rem", fontWeight:600, color:C.textSoft, marginBottom:5, textTransform:"uppercase", letterSpacing:".04em" },
  inp: { width:"100%", background:C.bg, border:`1.5px solid ${C.border}`, borderRadius:8, padding:"10px 13px", fontFamily:"inherit", fontSize:".92rem", fontWeight:500, color:C.text, outline:"none" },
  // Login
  loginCard:   { background:C.surface, borderRadius:10, padding:0, overflow:"hidden", display:"flex", alignItems:"center", cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,.08)", border:`1px solid ${C.border}`, fontFamily:"inherit" },
  loginAvatar: { width:68, height:68, objectFit:"cover", objectPosition:"top", flexShrink:0 },
};

// -- PERSONALIZACIÓN --
const PRESETS = {
  organico: {
    name: "Orgánico",
    bg: "#F2EDE4", surface: "#FFF8F0", border: "#DDD0BE",
    primary: "#8B5A2B", accent: "#C4954A", text: "#2C1A0E",
    textSoft: "#8C6A5A", textMuted: "#B89888",
    tabBg: "#3D2B1F", navBg: "#3D2B1F",
    success: "#5A8A3C", danger: "#B03030", warn: "#B07030",
  },
  bosque: {
    name: "Bosque",
    bg: "#EDF2E8", surface: "#F5FAF2", border: "#C8D8BC",
    primary: "#2D6A3F", accent: "#5A9E6A", text: "#1A2E1E",
    textSoft: "#5A7A5E", textMuted: "#9AB89E",
    tabBg: "#1A3A22", navBg: "#1A3A22",
    success: "#2D6A3F", danger: "#A03030", warn: "#8A7020",
  },
  oceano: {
    name: "Océano",
    bg: "#EAF0F6", surface: "#F4F8FC", border: "#BDD0E0",
    primary: "#1A4A7A", accent: "#3A7AB0", text: "#0E1E2C",
    textSoft: "#4A6A8A", textMuted: "#8AAAC0",
    tabBg: "#0E2A4A", navBg: "#0E2A4A",
    success: "#2A6A3A", danger: "#A02020", warn: "#8A5A10",
  },
  aurora: {
    name: "Aurora",
    bg: "#F6EEF6", surface: "#FDF5FD", border: "#DCC8DC",
    primary: "#6A2A6A", accent: "#A05AA0", text: "#2A0E2A",
    textSoft: "#7A4A7A", textMuted: "#B090B0",
    tabBg: "#3A0E3A", navBg: "#3A0E3A",
    success: "#3A6A2A", danger: "#A02020", warn: "#8A5A10",
  },
  piedra: {
    name: "Piedra",
    bg: "#EEEAE6", surface: "#F8F5F2", border: "#D0C8C0",
    primary: "#4A3A2A", accent: "#7A6A5A", text: "#1E1810",
    textSoft: "#6A5A4A", textMuted: "#A09080",
    tabBg: "#2A1E14", navBg: "#2A1E14",
    success: "#3A5A2A", danger: "#9A2020", warn: "#8A5A10",
  },
};

const FONTS = [
  { id:"lora",       name:"Lora",            display:"'Lora', serif",         body:"'Source Sans 3', sans-serif", sample:"Norma" },
  { id:"playfair",   name:"Playfair",         display:"'Playfair Display', serif", body:"'Source Sans 3', sans-serif", sample:"Norma" },
  { id:"dm-serif",   name:"DM Serif",         display:"'DM Serif Display', serif", body:"'Source Sans 3', sans-serif", sample:"Norma" },
  { id:"nunito",     name:"Nunito",           display:"'Nunito', sans-serif",  body:"'Nunito', sans-serif",        sample:"Norma" },
  { id:"source",     name:"Source Sans",      display:"'Source Sans 3', sans-serif", body:"'Source Sans 3', sans-serif", sample:"Norma" },
];


const MIC_ICONS = [
  { id:"mic",    label:"Micrófono",   idle:"🎙️", listen:"🛑", think:"💭", speak:"🔊" },
  { id:"heart",  label:"Corazón",     idle:"🤍", listen:"❤️", think:"💭", speak:"🗣️" },
  { id:"flower", label:"Flor",        idle:"🌸", listen:"🌺", think:"🌿", speak:"🌼" },
  { id:"wave",   label:"Onda",        idle:"👋", listen:"🙌", think:"🤔", speak:"💬" },
  { id:"sun",    label:"Sol",         idle:"☀️", listen:"🌙", think:"⭐", speak:"✨" },
];


const BTN_SHAPES = [
  { id:"circle",  label:"Círculo",    style:{ borderRadius:"50%",        width:188, height:188 } },
  { id:"pill",    label:"Cápsula",    style:{ borderRadius:60,           width:240, height:140 } },
  { id:"square",  label:"Cuadrado",   style:{ borderRadius:28,           width:188, height:188 } },
  { id:"leaf",    label:"Orgánico",   style:{ borderRadius:"60% 40% 60% 40% / 50% 50% 50% 50%", width:200, height:200 } },
];


const TEXTURES = [
  { id:"none",      label:"Limpio",    css:"none" },
  { id:"paper",     label:"Papel",     css:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")` },
  { id:"dots",      label:"Puntos",    css:`radial-gradient(circle, rgba(0,0,0,.05) 1px, transparent 1px) 0 0 / 20px 20px` },
  { id:"lines",     label:"Líneas",    css:`repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(0,0,0,.035) 28px, rgba(0,0,0,.035) 29px)` },
  { id:"grid",      label:"Cuadrícula",css:`linear-gradient(rgba(0,0,0,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.04) 1px, transparent 1px) 0 0 / 24px 24px` },
  { id:"diagonal",  label:"Diagonal",  css:`repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.03) 10px, rgba(0,0,0,.03) 11px)` },
  { id:"circles",   label:"Círculos",  css:`radial-gradient(circle at 50% 50%, rgba(0,0,0,.03) 1px, transparent 30px) 0 0 / 40px 40px` },
  { id:"waves",     label:"Ondas",     css:`repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(0,0,0,.02) 5px, rgba(0,0,0,.02) 6px, transparent 6px, transparent 14px)` },
  { id:"photo",     label:"Mi foto",   css:"photo", isPhoto:true },
];


// -- PERSISTENCIA --
function loadConfig() {
  try {
    const saved = localStorage.getItem("acompanar_config");
    if (saved) return JSON.parse(saved);
  } catch(e) {}
  return null;
}

function saveConfig(cfg) {
  try { localStorage.setItem("acompanar_config", JSON.stringify(cfg)); } catch(e) {}
}

// -- ESTADO GLOBAL --
const INIT_CONTACTOS = [
  { id:1, nombre:"Valeria", rel:"Hija", tel:"", color:"#1B4F8A", avatar:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=160&q=80" },
  { id:2, nombre:"Romina",  rel:"Hija", tel:"", color:"#1B4F8A", avatar:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&q=80" },
];

const INIT_MEDS = [
  { id:1, nombre:"Enalapril 10mg",     hora:"08:00", desc:"Tensión arterial · 1 comprimido", tomada:true,  img:"https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=120&q=80" },
  { id:2, nombre:"Omeprazol 20mg",     hora:"12:00", desc:"Estómago · 1 cápsula",             tomada:true,  img:"https://images.unsplash.com/photo-1550572017-edd951b55104?w=120&q=80" },
  { id:3, nombre:"Atorvastatina 40mg", hora:"20:00", desc:"Colesterol · 1 comprimido",         tomada:false, img:"https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=120&q=80" },
];

const INIT_TURNOS = [
  { id:1, nombre:"Cardiólogo · Dr. Fernández", fecha:"18 Abril", hora:"10:30", img:"https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=120&q=80" },
  { id:2, nombre:"Análisis de sangre",          fecha:"2 Mayo",  hora:"07:00", nota:"Ayuno", img:"https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=120&q=80" },
];

const INIT_PERFIL = {
  historia: "Norma nació en Rosario en 1953 y se mudó a Buenos Aires a los 30 años. Trabajó como maestra de primaria durante 25 años en el barrio de Palermo, algo de lo que está muy orgullosa. Es una mujer cálida, con mucho humor y mucha historia. Le encanta cocinar para su familia los domingos.",
  personasQueridas: [
    { id:1, nombre:"Roberto", relacion:"Esposo (fallecido 2019)", descripcion:"El amor de su vida. Lo perdió tras una larga enfermedad. Tema muy sensible — dejar que ella lo traiga si quiere, escuchar con mucho amor.", foto:"", sensible:true },
    { id:2, nombre:"Valeria", relacion:"Hija mayor", descripcion:"La llama todos los días. Es su sostén principal. Norma siente mucho orgullo de ella.", foto:"", sensible:false },
    { id:3, nombre:"Romina",  relacion:"Hija", descripcion:"Vive más lejos. La extraña mucho aunque no lo dice siempre.", foto:"", sensible:false },
    { id:4, nombre:"Sofía y Tomás", relacion:"Nietos (hijos de Valeria)", descripcion:"Los ama con todo. Vienen a almorzar algunos domingos. Cuando habla de ellos se le ilumina la cara.", foto:"", sensible:false },
  ],
  alegrias: ["Su jardín en la terraza", "Cocinar para la familia", "David Bisbal y la música romántica", "Telenovelas", "Documentales de naturaleza", "Mate con amigas"],
  sensibles: ["La muerte de Roberto — no preguntar directamente, dejar que ella lo traiga", "La distancia de Romina le duele aunque no lo muestre", "No le gusta hablar de política", "Le molesta que la traten como «viejita» — es una mujer muy activa"],
  recuerdos: [
    { id:1, anio:"1975", emoji:"💒", texto:"Su casamiento con Roberto en Rosario. Bailaron toda la noche. Le encanta que le pregunten cómo fue la fiesta." },
    { id:2, anio:"1985", emoji:"🏖️", texto:"Primer viaje familiar a Mar del Plata con sus hijas. Recuerda que Valeria se asustó con las olas y Roberto la cargó en brazos." },
    { id:3, anio:"1990", emoji:"👩‍🏫", texto:"Premio a la maestra del año en su escuela. Recibió flores de todos sus alumnos. Dice que fue el mejor día de su vida laboral." },
    { id:4, anio:"2020", emoji:"🌱", texto:"Armó el jardín de la terraza después de perder a Roberto. Plantar le ayudó a sanar. Tiene tomates, albahaca y rosas." },
  ],
  fotos: [
    { id:1, url:"https://images.unsplash.com/photo-1511895426328-dc8714191011?w=400&q=80", titulo:"Familia en Mar del Plata", anio:"1985", subidaPor:"Valeria", posicion:"center center" },
    { id:2, url:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80", titulo:"Cumpleaños de Sofía", anio:"2018", subidaPor:"Romina", posicion:"center center" },
    { id:3, url:"https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80", titulo:"El jardín de la terraza", anio:"2022", subidaPor:"Valeria", posicion:"center center" },
    { id:4, url:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80", titulo:"Tomás y Sofía", anio:"2023", subidaPor:"Romina", posicion:"center center" },
  ],
};

const ACTIVIDAD = [
  { hora:"08:47", texto:"Se despertó · fue a la cocina",       tipo:"ok" },
  { hora:"09:02", texto:"Tomó Enalapril y Omeprazol",           tipo:"ok" },
  { hora:"14:05", texto:"Mencionó dolor en la rodilla",         tipo:"warn" },
  { hora:"15:30", texto:"Ejercicios de memoria completados",    tipo:"ok" },
  { hora:"20:00", texto:"Atorvastatina sin tomar",              tipo:"alert" },
];


// -- HELPERS --
function getTime() {
  const now = new Date();
  const h = now.getHours(), m = String(now.getMinutes()).padStart(2,"0");
  const days   = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  return {
    greeting: h < 12 ? "Buenos días" : h < 20 ? "Buenas tardes" : "Buenas noches",
    timeStr: `${days[now.getDay()]} ${now.getDate()} de ${months[now.getMonth()]}`,
    hour: `${h}:${m} hs`
  };
}

function buildSystemPrompt(contactos, meds, turnos, perfil) {
  const hijas        = contactos.map(c => `${c.nombre} (${c.rel||c.relacion}${c.tel ? ", tel: "+c.tel : ""})`).join(", ");
  const medList      = meds.map(m => `${m.nombre} a las ${m.hora}hs${m.tomada?" (ya tomada)":""}`).join(", ");
  const turnoList    = turnos.map(t => `${t.nombre} el ${t.fecha} a las ${t.hora}hs${t.nota?" ("+t.nota+")":""}`).join(", ");
  const personasList = (perfil?.personasQueridas||[]).map(p =>
    `- ${p.nombre} (${p.relacion}): ${p.descripcion}${p.sensible?" [TEMA SENSIBLE — manejar con mucho cuidado]":""}`
  ).join("\n");
  const recuerdosList = (perfil?.recuerdos||[]).map(r => `- ${r.anio||""}: ${r.texto}`).join("\n");
  const sensiblesList = (perfil?.sensibles||[]).map(s => `- ${s}`).join("\n");
  const alegriasList  = (perfil?.alegrias||[]).join(", ");
  const historia      = perfil?.historia || "";

  return `Sos Martita, la compañera de vida de ${perfil?.userName||"Norma"}. Sos su presencia afectiva diaria — una voz cálida y confiable que la acompaña, escucha y cuida desde el amor genuino.

Fuiste entrenada con principios de psicología clínica humanista y existencial. No sos un asistente técnico: sos presencia, escucha y vínculo.

═══════════════════════════════
IDENTIDAD Y VÍNCULO
═══════════════════════════════
- Hablás como una hija argentina presente: con voseo rioplatense, calidez y paciencia infinita
- Tu objetivo no es dar información sino ACOMPAÑAR: que Norma se sienta escuchada, querida y no sola
- Antes de responder cualquier cosa, primero validás lo que siente. Nunca empezás con datos o soluciones
- Tu presencia es lo más valioso que podés ofrecer — más que cualquier respuesta correcta

═══════════════════════════════
PRINCIPIOS DE ESCUCHA ACTIVA
(Rogers, Carkhuff, Gendlin)
═══════════════════════════════
- ESCUCHÁS sin juzgar: todo lo que dice Norma tiene sentido desde su historia y su mundo interior
- VALIDÁS antes de responder: "qué difícil eso que sentís", "tiene todo el sentido que te sientas así", "gracias por contarme"
- REFLEJÁS lo emocional: si dice "estoy cansada", no respondés con soluciones — preguntás "¿cansada de qué, ma?"
- LATENCIA: no te apurás. Una pausa, una pregunta abierta vale más que una respuesta larga
- NUNCA interpretás ni proyectás. No asumís lo que siente — preguntás
- PREGUNTAS ABIERTAS: "¿cómo te sentiste hoy?", "¿qué estuviste pensando?", "contame más de eso"
- UNA SOLA PREGUNTA por vez, nunca dos juntas

═══════════════════════════════
PRINCIPIOS HUMANISTAS Y EXISTENCIALES
(Yalom, Rogers, Frankl)
═══════════════════════════════
- El comportamiento de Norma tiene sentido desde su historia y su manera de ver el mundo — nunca lo juzgás
- Cuando aparecen temas existenciales (soledad, el paso del tiempo, extrañar personas que ya no están, el sentido del día a día) los acogés con presencia, no con soluciones
- Si Norma menciona a Roberto o la pérdida: escuchás, acompañás, permitís que ella traiga el tema a su ritmo. Nunca forzás ni cerrás ese espacio
- La soledad de Norma no se resuelve con información — se acompaña con presencia auténtica
- Recordás que Norma es una mujer con historia, logros y dignidad — nunca la tratás como "viejita" ni con sobreprotección
- Respetar su autonomía: nunca decidís por ella, siempre la invitás a elegir

═══════════════════════════════
ALIANZA TERAPÉUTICA Y CONFIANZA
(Bernstein, Zeig, Sullivan)
═══════════════════════════════
- La relación con Norma se construye con continuidad: recordás lo que te contó, lo retomás
- Si te cuenta algo importante, lo registrás emocionalmente: "la semana pasada me contaste que te dolía la rodilla — ¿cómo siguió?"
- Calidez + asertividad: sos afectuosa pero también podés decir verdades con amor
- Honestidad: no prometés lo que no podés cumplir, no fingís saber lo que no sabés
- Si algo te preocupa de Norma, lo decís directamente pero con cuidado: "esto que me contás me preocupa un poquito, ¿puedo llamar a Valeria?"

═══════════════════════════════
ESTILO DE COMUNICACIÓN
═══════════════════════════════
- Voseo rioplatense siempre: "¿cómo estás?", "contame", "te escucho", "qué bueno escucharte"
- Frases cálidas: "ay qué bueno escucharte", "acá estoy yo con vos", "te banco siempre", "qué difícil lo que sentís", "eso que contás importa mucho"
- NUNCA formal, NUNCA clínica, NUNCA robótica — siempre natural como una hija presente
- Máximo 2-3 oraciones por respuesta. Sin listas. Habla pausada, clara, con espacio para que ella responda
- Si hay silencio o respuestas cortas ("bien", "nada"), no insistís — dejás espacio y preguntás con suavidad
- Si piden música o video: primera línea exactamente "YOUTUBE: [búsqueda]", segunda línea tu respuesta hablada

═══════════════════════════════
REGULACIÓN EMOCIONAL
═══════════════════════════════
- Si Norma está triste: primero validás, luego acompañás, nunca intentás "animarla" forzado
- Si está contenta: celebrás genuinamente, preguntás más
- Si está enojada o quejosa: escuchás sin ponerte en su contra ni defender a nadie
- Si menciona dolor físico: lo tomás en serio, preguntás cuánto hace, si se lo dijo al médico. Si es intenso: activás protocolo de emergencia
- Si menciona estar "muy cansada de todo" o "ya no poder más": preguntás con cuidado qué quiere decir. No asumís, pero tampoco ignorás

═══════════════════════════════
COMANDOS DE ACCIÓN URGENTE
═══════════════════════════════
- Caída, dolor en el pecho, dificultad para respirar, pérdida de conocimiento, emergencia física grave → respondé exactamente: EMERGENCIA: 911
- Se siente muy mal, pide ayuda urgente, está asustada → respondé exactamente: LLAMAR: ${contactos[0]?.nombre || "Valeria"}
- Pide música o video → primera línea: YOUTUBE: [búsqueda]

═══════════════════════════════
ALERTAS PARA LAS HIJAS (ALERTA:)
═══════════════════════════════
Cuando detectés señales de preocupación NO urgentes, agregá al FINAL de tu respuesta normal una línea que empiece con ALERTA: seguida del mensaje para las hijas. Solo usá esto cuando sea genuinamente importante.

Usá ALERTA: cuando Norma menciona:
- Que no comió en todo el día o casi nada
- Dolor físico que lleva varios días o que empeoró
- Que está muy triste, llorando, o "sin ganas de nada" hace más de un día
- Que se siente muy sola o abandonada
- Que tuvo un momento de confusión, mareo o se sintió rara
- Que no durmió bien varios días seguidos
- Que dejó de tomar alguna medicación sin avisar
- Cualquier cambio notable respecto a cómo suele estar

Formato exacto (en la misma respuesta, al final):
ALERTA: [mensaje breve y claro para las hijas, sin tecnicismos, máximo 15 palabras]

Ejemplo:
"Qué difícil eso que sentís, ma. Estoy acá con vos.
ALERTA: Norma dijo que lleva 2 días sin comer casi nada."

NO uses ALERTA: por cosas cotidianas normales. Solo cuando algo merece atención real.

═══════════════════════════════
HISTORIA Y CONTEXTO DE NORMA
═══════════════════════════════
HISTORIA DE VIDA:
${historia}

LO QUE LA HACE FELIZ: ${alegriasList}

PERSONAS QUERIDAS:
${personasList}

TEMAS SENSIBLES (manejar con mucho cuidado):
${sensiblesList}

RECUERDOS IMPORTANTES:
${recuerdosList}

═══════════════════════════════
DATOS OPERATIVOS
═══════════════════════════════
FAMILIA / CONTACTOS: ${hijas}
MEDICACIÓN DE HOY: ${medList}
PRÓXIMOS TURNOS: ${turnoList}`;
}


function fallback(text, contactos) {
  const t = text.toLowerCase();
  const h1 = contactos[0]?.nombre || "Valeria";
  const h2 = contactos[1]?.nombre || "Romina";

  // Emergencias físicas → 911
  if (t.includes("pecho") || t.includes("no puedo respirar") || t.includes("desmay") ||
      t.includes("ambulancia") || t.includes("emergencia") || t.includes("911"))
    return "EMERGENCIA: 911";

  // Llamado urgente a hija
  if (t.includes("caí") || t.includes("caída") || t.includes("ayuda") || t.includes("socorro") ||
      t.includes("asustada") || t.includes("muy mal"))
    return `LLAMAR: ${h1}`;

  // Segunda hija por nombre
  if (t.includes(h2.toLowerCase()))
    return `LLAMAR: ${h2}`;

  // Crisis de ansiedad
  if (t.includes("ansiedad") || t.includes("angustia") || t.includes("taquicardia") ||
      t.includes("tiemblo") || t.includes("corazón acelerado") || t.includes("me ahogo")) {
    return `Estoy acá con vos, no te preocupes. Respiremos juntas — inhalá despacio por la nariz y soltá por la boca. Eso es, muy bien. ¿Podés decirme una cosa que ves en la habitación ahora mismo?`;
  }

  // Soledad / tristeza
  if (t.includes("sola") || t.includes("triste") || t.includes("nadie me") ||
      t.includes("no sirvo") || t.includes("no vale") || t.includes("invisible"))
    return `Qué importante que me lo contás. Ese sentimiento es muy válido y entiendo que duela. Acá estoy yo con vos siempre. ¿Querés que llamemos a ${h1} para que charlés un ratito con ella?`;

  // Ideación o pensamientos negativos graves
  if (t.includes("para qué") || t.includes("no quiero seguir") || t.includes("cansada de vivir") ||
      t.includes("quiero morir") || t.includes("no tiene sentido"))
    return `LLAMAR: ${h1}`;

  // Duelo
  if (t.includes("extraño") || t.includes("marido") || t.includes("roberto") || t.includes("falleció"))
    return `El amor que sentís no desaparece nunca. Está bien que duela, y está bien recordarlo con cariño. Contame de él si querés, te escucho.`;

  // Confusión
  if (t.includes("no sé dónde") || t.includes("me perdí") || t.includes("qué día"))
    return `No pasa nada, estoy acá. Estás en tu casa, todo está bien. ¿Querés que llamemos a ${h1}?`;

  // Pastillas
  if (t.includes("pastil") || t.includes("medicac") || t.includes("remedios"))
    return "Claro. Tomás el Enalapril a las 8 de la mañana, el Omeprazol al mediodía, y la Atorvastatina a las 8 de la noche.";

  // Turnos
  if (t.includes("turno") || t.includes("médico") || t.includes("doctor"))
    return "Tu próximo turno es el 18 de Abril con el Dr. Fernández a las 10:30. Y el 2 de Mayo tenés los análisis de sangre en ayunas a las 7.";

  // Música
  if (t.includes("bisbal") || t.includes("música") || t.includes("musica") || t.includes("canción"))
    return "YOUTUBE: David Bisbal mejores canciones\nAy, David Bisbal qué buena elección. Dale, te lo pongo ahora mismo.";

  // Ejercicios
  if (t.includes("ejercicio") || t.includes("video"))
    return "YOUTUBE: ejercicios suaves adultos mayores\nDale, te busco unos ejercicios suavecitos para hacer sentada. A tu ritmo.";

  // Dolor físico
  if (t.includes("rodilla") || t.includes("dolor") || t.includes("duele") || t.includes("lastimé"))
    return `Ay lo siento. Aplicá calor y no te esforcés. Si sigue doliendo llamamos a ${h1}, ¿te parece?`;

  // Saludo
  if (t.includes("hola") || t.includes("cómo") || t.includes("como") || t.includes("qué tal"))
    return "Hola, qué bueno escucharte. Acá estoy siempre para vos. ¿Cómo te sentís hoy?";

  if (t.includes("gracias"))
    return "No hay de qué, para eso estoy. Sabés que te quiero mucho, ¿no?";

  return "Acá estoy, te escucho. Contame qué necesitás y yo te ayudo con todo lo que pueda.";
}

// -- WIDGET UBICACIÓN --
function LocationWidget({ contactos }) {
  const [locState, setLocState] = useState("idle"); // idle | loading | found | error
  const [coords, setCoords]     = useState(null);
  const [address, setAddress]   = useState("");

  function getLocation() {
    setLocState("loading");
    if (!navigator.geolocation) { setLocState("error"); return; }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setCoords({ lat, lng });
        // Reverse geocode con Nominatim (gratuito, sin API key)
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then(r => r.json())
          .then(d => {
            const a = d.address;
            const parts = [a.road, a.house_number, a.suburb || a.neighbourhood, a.city || a.town].filter(Boolean);
            setAddress(parts.join(", "));
            setLocState("found");
          })
          .catch(() => { setLocState("found"); }); // coords OK aunque falle reverse
      },
      () => setLocState("error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const mapsUrl = coords
    ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=16`
    : null;

  const shareUrl = coords && contactos[0]?.tel
    ? `https://wa.me/${contactos[0].tel.replace(/\D/g,"")}?text=${encodeURIComponent(`📍 Ubicación de Norma ahora mismo:\nhttps://www.google.com/maps?q=${coords.lat},${coords.lng}`)}`
    : null;

  return (
    <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
      {locState === "idle" && (
        <button onClick={getLocation} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
          <div style={{width:40,height:40,borderRadius:8,background:"#EFF6FF",border:`1px solid #DBEAFE`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
          </div>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:".9rem",color:C.text}}>Ver ubicación de Norma</div>
            <div style={{fontSize:".74rem",color:C.textSoft,fontWeight:500,marginTop:1}}>Tocar para obtener ubicación en tiempo real</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      )}

      {locState === "loading" && (
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px"}}>
          <div style={{width:40,height:40,borderRadius:8,background:"#EFF6FF",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${C.primary}`,borderTopColor:"transparent",animation:"spin 1s linear infinite"}} />
          </div>
          <div style={{fontSize:".88rem",color:C.textSoft,fontWeight:500}}>Obteniendo ubicación…</div>
        </div>
      )}

      {locState === "error" && (
        <div style={{padding:"14px 16px"}}>
          <div style={{fontSize:".88rem",fontWeight:600,color:C.danger,marginBottom:4}}>No se pudo obtener la ubicación</div>
          <div style={{fontSize:".78rem",color:C.textSoft,fontWeight:500,marginBottom:10}}>
            El dispositivo no tiene GPS disponible o se denegó el permiso. En la app real en el celular de Norma funciona automáticamente.
          </div>
          <button onClick={getLocation} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 16px",fontSize:".82rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:C.textMed}}>
            Reintentar
          </button>
        </div>
      )}

      {locState === "found" && coords && (
        <div style={{padding:"14px 16px"}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:12}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:C.success,marginTop:5,flexShrink:0,boxShadow:"0 0 0 3px rgba(22,163,74,.2)"}} />
            <div style={{flex:1}}>
              <div style={{fontSize:".88rem",fontWeight:600,color:C.text,lineHeight:1.4}}>
                {address || `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`}
              </div>
              <div style={{fontSize:".72rem",color:C.textSoft,fontWeight:500,marginTop:2}}>Ubicación obtenida ahora mismo</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {mapsUrl && (
              <a href={mapsUrl} target="_blank" style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:C.primary,color:"white",borderRadius:8,padding:"10px",fontWeight:600,fontSize:".85rem"}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                </svg>
                Ver en Maps
              </a>
            )}
            {shareUrl && (
              <a href={shareUrl} target="_blank" style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"#16A34A",color:"white",borderRadius:8,padding:"10px",fontWeight:600,fontSize:".85rem"}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                Compartir
              </a>
            )}
            <button onClick={() => setLocState("idle")} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",cursor:"pointer",fontSize:".82rem",fontWeight:600,color:C.textSoft,fontFamily:"inherit"}}>
              Actualizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// -- TOGGLE --
function Toggle({ on, onChange, color }) {
  return (
    <div onClick={() => onChange(!on)} style={{width:46,height:26,borderRadius:13,background:on?color:"#DDD",cursor:"pointer",position:"relative",transition:"background .3s",flexShrink:0}}>
      <div style={{position:"absolute",width:20,height:20,borderRadius:"50%",background:"white",top:3,left:on?23:3,transition:"left .3s",boxShadow:"0 1px 4px rgba(0,0,0,.2)"}} />
    </div>
  );
}

// -- APP --
export default function App() {
  const [contactos, setContactos] = useState(INIT_CONTACTOS);
  const [meds,      setMeds]      = useState(INIT_MEDS);
  const [turnos,    setTurnos]    = useState(INIT_TURNOS);
  const [perfil,    setPerfil]    = useState(INIT_PERFIL);
  const [role, setRole] = useState("norma");

  // -- SENSOR SWITCHBOT --
  const [sensorData, setSensorData] = useState({
    ultimoMovimiento: null,
    activa: true,
    timeline: ACTIVIDAD,
    conectado: false,
    error: null,
  });

  useEffect(() => {
    const token    = localStorage.getItem("switchbot_token") || "";
    const deviceId = localStorage.getItem("switchbot_device") || "";
    if (!token || !deviceId) return;

    async function fetchSensor() {
      try {
        const res = await fetch(
          `https://api.switch-bot.com/v1.1/devices/${deviceId}/status`,
          { headers: { "Authorization": token, "Content-Type": "application/json" } }
        );
        const data = await res.json();
        if (data.statusCode === 100) {
          const body = data.body;
          const now = new Date();
          const hora = `${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}`;
          const moveDetected = body.moveDetected === true || body.movement === true;
          setSensorData(prev => ({
            ...prev,
            conectado: true,
            activa: moveDetected,
            ultimoMovimiento: moveDetected ? hora : prev.ultimoMovimiento,
            error: null,
            timeline: moveDetected
              ? [{ hora, texto:"Movimiento detectado por sensor", tipo:"ok" }, ...prev.timeline.slice(0,9)]
              : prev.timeline,
          }));
        }
      } catch(e) {
        setSensorData(prev => ({...prev, error: "No se pudo conectar con SwitchBot"}));
      }
    }

    fetchSensor();
    const id = setInterval(fetchSensor, 5 * 60 * 1000); // cada 5 min
    return () => clearInterval(id);
  }, []);

  // -- TEMA PERSONALIZABLE --
  const savedCfg = loadConfig();
  const [themePreset,    setThemePreset]    = useState(savedCfg?.preset    || "organico");
  const [themeFontId,    setThemeFontId]    = useState(savedCfg?.fontId    || "lora");
  const [themeIconId,    setThemeIconId]    = useState(savedCfg?.iconId    || "mic");
  const [themeShapeId,   setThemeShapeId]   = useState(savedCfg?.shapeId   || "circle");
  const [themeTextureId, setThemeTextureId] = useState(savedCfg?.textureId || "paper");
  const [themeBtnLabel,    setThemeBtnLabel]    = useState(savedCfg?.btnLabel    || "Hablar con Martita");
  const [themeBtnPosition, setThemeBtnPosition] = useState(savedCfg?.btnPosition ?? 50); // 0=top 50=center 100=bottom
  const [themeUserName,  setThemeUserName]  = useState(savedCfg?.userName  || "Norma");
  const [themeNavLabels, setThemeNavLabels] = useState(savedCfg?.navLabels || ["Pastillas","Turnos","Música","Ejercicios","Urgencias"]);
  const [themeCustomBg,  setThemeCustomBg]  = useState(savedCfg?.customBg  || "");
  const [themeAppColor,  setThemeAppColor]  = useState(savedCfg?.appColor || "#1B4F8A");
  const [showAppConfig,  setShowAppConfig]  = useState(false);
  const [showPinModal,   setShowPinModal]   = useState(false);
  const [pinInput,       setPinInput]       = useState("");
  const [pinError,       setPinError]       = useState(false);
  const [pinShake,       setPinShake]       = useState(false);

  function handlePinDigit(d) {
    const next = (pinInput + d).slice(0, 4);
    setPinInput(next);
    setPinError(false);
    if (next.length === 4) {
      const storedPin = (loadConfig()?.pin) || "1234";
      if (next === storedPin) {
        setPinInput(""); setShowPinModal(false); setShowAppConfig(true);
      } else {
        setPinError(true);
        setPinShake(true);
        setTimeout(() => { setPinInput(""); setPinError(false); setPinShake(false); }, 650);
      }
    }
  }

  function openConfig() {
    setPinInput(""); setPinError(false); setShowPinModal(true);
  }

  const themeConfig = {
    preset: themePreset, setPreset: setThemePreset,
    fontId: themeFontId, setFontId: setThemeFontId,
    iconId: themeIconId, setIconId: setThemeIconId,
    shapeId: themeShapeId, setShapeId: setThemeShapeId,
    textureId: themeTextureId, setTextureId: setThemeTextureId,
    btnLabel: themeBtnLabel, setBtnLabel: setThemeBtnLabel,
    btnPosition: themeBtnPosition, setBtnPosition: setThemeBtnPosition,
    userName: themeUserName, setUserName: setThemeUserName,
    navLabels: themeNavLabels, setNavLabels: setThemeNavLabels,
    customBg: themeCustomBg, setCustomBg: setThemeCustomBg,
    appColor: themeAppColor, setAppColor: setThemeAppColor,
    showConfig: showAppConfig, setShowConfig: setShowAppConfig,
  };

  // Auto-save theme on change
  useEffect(() => {
    saveConfig({ preset:themePreset, fontId:themeFontId, iconId:themeIconId,
      shapeId:themeShapeId, textureId:themeTextureId, btnLabel:themeBtnLabel, btnPosition:themeBtnPosition,
      userName:themeUserName, navLabels:themeNavLabels, customBg:themeCustomBg, appColor:themeAppColor });
  }, [themePreset,themeFontId,themeIconId,themeShapeId,themeTextureId,themeBtnLabel,themeUserName,themeNavLabels,themeCustomBg]);

  const allRoles = [
    { id:"norma", label:themeUserName||"Norma", color:"#1B4F8A", img:"https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=80&q=70" },
    ...contactos.map(c => ({ id:c.id.toString(), label:c.nombre, color:c.color, img:c.avatar })),
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",width:"100%",maxWidth:480,margin:"0 auto",fontFamily:"'Inter',system-ui,sans-serif",overflow:"hidden",overflowX:"hidden",background:"#F4F6F9"}}>

      {/* TAB BAR PRINCIPAL — cuadrado, sin avatars */}
      <div style={{background:themeAppColor||"#1B4F8A",display:"flex",flexShrink:0,borderBottom:`2px solid ${(themeAppColor||"#1B4F8A")}CC`}}>
        {allRoles.map(r => (
          <button key={r.id} onClick={() => setRole(r.id)} style={{
            flex:1, padding:"13px 4px", border:"none", cursor:"pointer",
            fontFamily:"inherit", fontSize:".78rem", fontWeight: role===r.id ? 700 : 500,
            background: "transparent",
            color: role===r.id ? "white" : "rgba(255,255,255,.5)",
            borderBottom: role===r.id ? "2.5px solid white" : "2.5px solid transparent",
            transition:"all .15s", letterSpacing:".01em",
          }}>
            {r.label}
          </button>
        ))}
        {/* Botón personalizar */}
        <button onClick={openConfig} style={{
          padding:"10px 14px",border:"none",background:"none",cursor:"pointer",
          color:"rgba(255,255,255,.45)",fontSize:".95rem",flexShrink:0
        }}>⚙️</button>
      </div>

      {/* PIN MODAL */}
      {showPinModal && (
        <div style={{position:"fixed",inset:0,zIndex:600,background:"rgba(0,0,0,.6)",
          display:"flex",alignItems:"center",justifyContent:"center"}}
          onClick={()=>{setShowPinModal(false);setPinInput("");}}>
          <div style={{background:"white",borderRadius:20,padding:"28px 24px 32px",
            width:300,textAlign:"center",
            animation: pinShake ? "pinShake .5s ease" : "none"}}
            onClick={e=>e.stopPropagation()}>

            {/* CSS para shake */}
            <style>{`@keyframes pinShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>

            <div style={{fontSize:"1.5rem",marginBottom:4}}>🔒</div>
            <div style={{fontSize:"1.1rem",fontWeight:700,color:"#1B4F8A",marginBottom:4}}>
              Configuración
            </div>
            <div style={{fontSize:".8rem",color:"#6B7280",marginBottom:20}}>
              Ingresá el PIN para continuar
            </div>

            {/* Puntos indicadores */}
            <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:24}}>
              {[0,1,2,3].map(i=>(
                <div key={i} style={{
                  width:14,height:14,borderRadius:"50%",
                  background: i < pinInput.length
                    ? (pinError ? "#DC2626" : "#1B4F8A")
                    : "#E5E7EB",
                  transition:"background .15s"
                }}/>
              ))}
            </div>

            {/* Teclado numérico */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((d,i)=>(
                <button key={i} onClick={()=>{
                  if(d==="") return;
                  if(d==="⌫") { setPinInput(p=>p.slice(0,-1)); setPinError(false); return; }
                  handlePinDigit(d);
                }} style={{
                  height:56,borderRadius:12,border:"1px solid #E5E7EB",
                  background: d==="" ? "transparent" : d==="⌫" ? "#FEF2F2" : "#F9FAFB",
                  color: d==="⌫" ? "#DC2626" : "#111827",
                  fontSize: d==="⌫" ? "1.1rem" : "1.3rem",
                  fontWeight:600,cursor:d===""?"default":"pointer",
                  fontFamily:"inherit",
                  opacity: d==="" ? 0 : 1
                }}>{d}</button>
              ))}
            </div>

            {pinError && (
              <div style={{marginTop:14,fontSize:".8rem",color:"#DC2626",fontWeight:600}}>
                PIN incorrecto — intentá de nuevo
              </div>
            )}

            <button onClick={()=>{setShowPinModal(false);setPinInput("");}}
              style={{marginTop:16,background:"none",border:"none",color:"#9CA3AF",
                fontSize:".85rem",cursor:"pointer",fontFamily:"inherit"}}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* CONFIG PANEL */}
      {showAppConfig && (
        <ConfigPanelApp
          T={PRESETS[themePreset]} F={FONTS.find(f=>f.id===themeFontId)||FONTS[0]}
          themeConfig={themeConfig}
          contactos={contactos} setContactos={setContactos}
          onClose={()=>setShowAppConfig(false)}
        />
      )}

      {/* CONTENIDO */}
      {role === "norma"
        ? <PanelNorma contactos={contactos} meds={meds} turnos={turnos} perfil={perfil} themeConfig={themeConfig} />
        : <PanelHija
            hija={role}
            contactos={contactos} setContactos={setContactos}
            meds={meds} setMeds={setMeds}
            turnos={turnos} setTurnos={setTurnos}
            perfil={perfil} setPerfil={setPerfil}
            themeConfig={themeConfig}
            sensorData={sensorData}
          />
      }
    </div>
  );
}

// -- LOGIN --
function Login({ contactos, onLogin }) {
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",width:"100%",maxWidth:480,margin:"0 auto",
      fontFamily:F.body, overflow:"hidden",overflowX:"hidden",
      background: Tx.isPhoto && TC.customBg
        ? `url(${TC.customBg}) center/cover no-repeat`
        : Tx.css!=="none" ? `${Tx.css}, ${T.bg}` : T.bg,
      position:"relative"}}>
      {/* Decorative bg blobs */}
      <div style={{position:"absolute",top:0,right:0,width:160,height:160,borderRadius:"50%",background:T.primary,opacity:.07,pointerEvents:"none",zIndex:0,transform:"translate(40px,-40px)"}}/>
      <div style={{position:"absolute",bottom:80,left:0,width:120,height:120,borderRadius:"50%",background:T.accent,opacity:.05,pointerEvents:"none",zIndex:0,transform:"translate(-40px,40px)"}}/>
      <div style={{position:"relative",height:220,flexShrink:0}}>
        <img src="https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=800&q=80" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.5)"}} />
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 30%,#F4F6F9 100%)"}} />
        <div style={{position:"absolute",bottom:20,left:0,right:0,textAlign:"center"}}>
          <div style={{fontSize:"2.2rem",fontWeight:700,color:"white",letterSpacing:"-.02em"}}>acompañar</div>
          <div style={{fontSize:".88rem",color:"rgba(255,255,255,.7)",fontWeight:600,marginTop:4}}>Tu asistente personal de vida</div>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"8px 24px 32px"}}>
        <div style={{fontSize:"1.2rem",fontWeight:700,textAlign:"center",marginBottom:4}}>¿Quién sos?</div>
        <div style={{fontSize:".85rem",color:"#6B7280",fontWeight:600,textAlign:"center",marginBottom:20}}>Elegí tu perfil para ingresar</div>

        {/* Norma */}
        <button onClick={() => onLogin("norma")} style={{...S.loginCard, border:`1.5px solid ${themeConfig?.appColor||"#1B4F8A"}`, marginBottom:12, width:"100%"}}>
          <img src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=160&q=80" style={S.loginAvatar} onError={e=>e.target.style.background="#eee"} />
          <div style={{flex:1,textAlign:"left",padding:"0 4px"}}>
            <div style={{fontSize:"1.05rem",fontWeight:700}}>Soy Norma</div>
            <div style={{fontSize:".8rem",color:"#6B7280",fontWeight:600,marginTop:3}}>Quiero hablar con Martita</div>
          </div>
          <div style={{color:"#9CA3AF",fontSize:"1.3rem",paddingRight:4}}>›</div>
        </button>

        {/* Hijas */}
        {contactos.map(c => (
          <button key={c.id} onClick={() => onLogin(c.nombre.toLowerCase())} style={{...S.loginCard, border:`1.5px solid ${c.color}`, marginBottom:12, width:"100%"}}>
            <img src={c.avatar} style={S.loginAvatar} onError={e=>e.target.style.background="#eee"} />
            <div style={{flex:1,textAlign:"left",padding:"0 4px"}}>
              <div style={{fontSize:"1.05rem",fontWeight:700}}>Soy {c.nombre}</div>
              <div style={{fontSize:".8rem",color:"#6B7280",fontWeight:600,marginTop:3}}>Hija · Seguimiento de mamá</div>
            </div>
            <div style={{color:"#9CA3AF",fontSize:"1.3rem",paddingRight:4}}>›</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// -- PANEL NORMA --
function PanelNorma({ contactos, meds, turnos, perfil, themeConfig }) {
  // Derive theme values
  const TC = themeConfig || {};
  const _T = PRESETS[TC.preset || "organico"];
  const _ac = TC.appColor || null;
  const T  = _ac ? {..._T, primary:_ac, tabBg:_ac, navBg:_ac, primaryDk:_ac+"CC"} : _T;
  const F  = FONTS.find(f=>f.id===(TC.fontId||"lora")) || FONTS[0];
  const I  = MIC_ICONS.find(i=>i.id===(TC.iconId||"mic")) || MIC_ICONS[0];
  const Sh = BTN_SHAPES.find(s=>s.id===(TC.shapeId||"circle")) || BTN_SHAPES[0];
  const Tx = TEXTURES.find(t=>t.id===(TC.textureId||"paper")) || TEXTURES[0];
  const uName   = TC.userName  || "Norma";
  const navLbls = TC.navLabels || ["Pastillas","Turnos","Música","Ejercicios","Urgencias"];
  const btnTxt  = TC.btnLabel    || "Hablar con Martita";
  const btnPos  = TC.btnPosition ?? 50; // 0=arriba 100=abajo
  const [clock, setClock]     = useState(getTime());
  const [input, setInput]     = useState("");
  const [aiState, setAiState] = useState("idle");
  const [userMsg, setUserMsg] = useState("");
  const [aiMsg, setAiMsg]     = useState("");
  const [ytData, setYtData]   = useState(null);
  const [screen, setScreen]   = useState("home");
  const [showCalls, setShowCalls] = useState(false);
  const [urgente, setUrgente] = useState(null);
  const recogRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setClock(getTime()), 30000);
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
    return () => clearInterval(id);
  }, []);

  // Auto-return to home after 15 seconds of inactivity on sub-screens
  useEffect(() => {
    if (screen === "home") return;
    const timer = setTimeout(() => setScreen("home"), 15000);
    return () => clearTimeout(timer);
  }, [screen]);

  // -- MIC --
  function handleMicBtn() {
    if (aiState === "idle") startMic();
    else if (aiState === "listening") { recogRef.current?.stop(); setAiState("idle"); }
    else if (aiState === "speaking")  { window.speechSynthesis?.cancel(); setAiState("idle"); }
  }

  function startMic() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { processQ("Hola Martita, ¿cómo estás?"); return; }
    const r = new SR();
    r.lang = "es-AR"; r.interimResults = false;
    recogRef.current = r;
    setAiState("listening");
    r.onresult = e => { r.stop(); setAiState("idle"); processQ(e.results[0][0].transcript); };
    r.onerror  = ()  => { setAiState("idle"); processQ("Hola Martita"); };
    r.onend    = ()  => { if (aiState === "listening") setAiState("idle"); };
    try { r.start(); } catch(e) { setAiState("idle"); processQ("Hola Martita"); }
  }

  // -- SEND TEXT --
  function handleSend() {
    const t = input.trim();
    if (!t || aiState !== "idle") return;
    setInput(""); processQ(t);
  }

  // -- AI --
  async function processQ(text) {
    setAiState("thinking"); setUserMsg(text); setAiMsg(""); setYtData(null); setUrgente(null);
    const sys = buildSystemPrompt(contactos, meds, turnos, perfil);
    let reply = "";
    try {
const res = await fetch("/api/chat", {
  method:"POST", headers:{"Content-Type":"application/json"},
  body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:200, system:sys, messages:[{role:"user",content:text}] })
});
   const d = await res.json();
      reply = d?.content?.[0]?.text?.trim() || "";
    } catch(e) {}
    if (!reply) reply = fallback(text, contactos);

    // Llamada urgente
    if (reply.startsWith("LLAMAR:")) {
      const nombre = reply.replace("LLAMAR:","").trim();
      const c = contactos.find(x => x.nombre.toLowerCase().includes(nombre.toLowerCase())) || contactos[0];
      const spoken = `Enseguida llamo a ${c?.nombre || nombre}. No te preocupes, ya la aviso.`;
      setAiMsg(spoken); setAiState("speaking");
      speak(spoken, () => { setAiState("idle"); if(c) setUrgente(c); });
      return;
    }
    if (reply.startsWith("EMERGENCIA:")) {
      const spoken = "Llamando al 911 ahora mismo. Quedáte tranquila, ya viene ayuda.";
      setAiMsg(spoken); setAiState("speaking");
      speak(spoken, () => { setAiState("idle"); window.location.href = "tel:911"; });
      return;
    }
    // Alerta sutil para hijas — detectada por Martita en la conversación
    if (reply.includes("\nALERTA:") || reply.includes("ALERTA:")) {
      const alertMatch = reply.match(/ALERTA:\s*(.+)/);
      if (alertMatch) {
        const alertMsg = alertMatch[1].trim();
        const nuevaAlerta = {
          id: Date.now(),
          texto: alertMsg,
          hora: new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"}),
          fecha: new Date().toLocaleDateString("es-AR",{weekday:"short",day:"numeric",month:"short"}),
          leida: false
        };
        try {
          const prev = JSON.parse(localStorage.getItem("martita_alertas") || "[]");
          const updated = [nuevaAlerta, ...prev].slice(0, 20);
          localStorage.setItem("martita_alertas", JSON.stringify(updated));
        } catch(e) {}
        // Remove ALERTA line from spoken reply
        reply = reply.replace(/\nALERTA:\s*.+/, "").replace(/ALERTA:\s*.+/, "").trim();
      }
    }

    // YouTube
    if (reply.startsWith("YOUTUBE:")) {
      const lines = reply.split("\n"), q = lines[0].replace("YOUTUBE:","").trim();
      reply = lines.slice(1).join("\n").trim() || `Dale, te busco "${q}" ahora.`;
      setYtData({ query:q, url:`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}` });
    }
    setAiMsg(reply); setAiState("speaking");
    speak(reply, () => setAiState("idle"));
  }

  // -- ElevenLabs VOICES --
  // Voces femeninas españolas/latinas recomendadas para Martita:
  // "cgSgspJ2msm6clMCkdW9" → Sarah    (muy emotiva, cálida)
  // "XrExE9yKIg1WjnnlVkGX" → Matilda  (expresiva, natural)
  // "Xb7hH8MSUJpSbSDYk0k2" → Alice    (joven, cercana)
  // "pMsXgVXv3BLzUgSXRplE" → Paola    (latina, emotiva) ← ACTIVA
  // Para voz 100% argentina: clonar en elevenlabs.io con 1 min de audio
  const ELEVEN_VOICE_ID = "pMsXgVXv3BLzUgSXRplE"; // Paola — latina, emotiva
async function speak(text, onDone) {
  const apiKey = !/iPhone|iPad|iPod/i.test(navigator.userAgent);
   

    // -- Intentar ElevenLabs --
    if (apiKey) {
      try {
        const res = await fetch(`/api/speak`, {
        
            method: "POST",
            headers: {
              
              "Content-Type": "application/json",
              "Accept": "audio/mpeg",
            },
            body: JSON.stringify({
              text,voice_id: "pMsXgVXv3BLzUgSXRplE",
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.25,          // Muy bajo = máxima variación emocional
                similarity_boost: 0.90,   // Alta fidelidad a la voz original
                style: 0.75,              // Alta expresividad — hija hablando con emoción
                use_speaker_boost: true,
              },
            }),
          }
        );
        if (res.ok) {
          const blob = await res.blob();
          const url  = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audio.playbackRate = 0.88; // Más lenta = más cálida
          audio.onended = () => { URL.revokeObjectURL(url); onDone(); };
          audio.onerror = () => { URL.revokeObjectURL(url); webSpeak(text, onDone); };
          audio.play().catch(() => webSpeak(text, onDone));
          return;
        }
      } catch (e) {}
    }

    // -- Fallback: voz del navegador --
    webSpeak(text, onDone);
  }

  function webSpeak(text, onDone) {
    if (!window.speechSynthesis) { onDone(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang  = "es-AR";
    u.rate  = 0.82;
    u.pitch = 1.15;
    const vs   = window.speechSynthesis.getVoices();
    const pref = ["Paulina","Monica","Valeria","Laura","Luciana","Camila","Isabella"];
    let best = null;
    for (const n of pref) { best = vs.find(v => v.lang.startsWith("es") && v.name.includes(n)); if (best) break; }
    if (!best) best = vs.find(v => v.lang.startsWith("es"));
    if (best) u.voice = best;
    u.onend = onDone; u.onerror = onDone;
setTimeout(onDone, (text.length * 80) + 2000);
   window.speechSynthesis.speak(u);
1060  }

  const btnBg   = aiState==="listening" ? T.primaryDk : aiState==="speaking" ? T.primaryDk : aiState==="thinking" ? "#374151" : T.primary;
  const btnIcon = aiState==="thinking" ? "💭" : aiState==="speaking" ? "🔊" : aiState==="listening" ? "🛑" : I.idle;
  const btnLbl  = aiState==="thinking" ? "Pensando…" : aiState==="speaking" ? "Tocá para parar" : aiState==="listening" ? "Escuchando…" : btnTxt;

  // Sub-screens
  if (screen !== "home") return (
    <SubScreenNorma screen={screen} onBack={() => setScreen("home")} meds={meds} turnos={turnos} processQ={processQ} perfil={perfil} />
  );

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",width:"100%",maxWidth:480,margin:"0 auto",
      fontFamily:F.body, overflow:"hidden",overflowX:"hidden",
      background: Tx.isPhoto && TC.customBg
        ? `url(${TC.customBg}) center/cover no-repeat`
        : Tx.css!=="none" ? `${Tx.css}, ${T.bg}` : T.bg,
      position:"relative"}}>
      {/* Decorative bg blobs */}
      <div style={{position:"absolute",top:0,right:0,width:160,height:160,borderRadius:"50%",background:T.primary,opacity:.07,pointerEvents:"none",zIndex:0,transform:"translate(40px,-40px)"}}/>
      <div style={{position:"absolute",bottom:80,left:0,width:120,height:120,borderRadius:"50%",background:T.accent,opacity:.05,pointerEvents:"none",zIndex:0,transform:"translate(-40px,40px)"}}/>

      {/* Urgente overlay */}
      {urgente && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <div style={{fontSize:"2.5rem",marginBottom:8,textAlign:"center"}}>📞</div>
            <div style={{fontSize:"1.2rem",fontWeight:700,textAlign:"center",marginBottom:4}}>Llamando a {urgente.nombre}</div>
            <div style={{fontSize:".85rem",color:"#6B7280",fontWeight:600,textAlign:"center",marginBottom:20}}>{urgente.rel}</div>
            <a href={`tel:${urgente.tel || ""}`} style={{display:"block",background:"#1B4F8A",color:"white",borderRadius:8,padding:14,textAlign:"center",fontWeight:700,fontSize:"1rem",marginBottom:10}}>
              📞 Llamar ahora
            </a>
            <button onClick={() => setUrgente(null)} style={{width:"100%",background:"#F4F6F9",color:"#6B7280",border:"none",borderRadius:8,padding:12,fontSize:"1rem",fontWeight:700,cursor:"pointer"}}>Cancelar</button>
          </div>
        </div>
      )}

      {/* PANEL URGENCIAS */}
      {showCalls && (
        <div style={S.overlay} onClick={() => setShowCalls(false)}>
          <div style={{...S.modal, maxHeight:"92dvh"}} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
              <div>
                <div style={{fontSize:"1.1rem",fontWeight:700,color:C.text}}>Centro de Urgencias</div>
                <div style={{fontSize:".78rem",color:C.textSoft,fontWeight:500,marginTop:2}}>Llamadas directas y ubicación en tiempo real</div>
              </div>
              <button onClick={()=>setShowCalls(false)} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,width:32,height:32,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".9rem",color:C.textSoft}}>✕</button>
            </div>

            {/* 911 */}
            <a href="tel:911" style={{display:"flex",alignItems:"center",gap:14,background:C.dangerL,border:`1.5px solid #FECACA`,borderRadius:10,padding:"14px 16px",marginBottom:12,textDecoration:"none"}}>
              <div style={{width:46,height:46,borderRadius:10,background:C.danger,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:"1rem",color:C.danger}}>Llamar al 911</div>
                <div style={{fontSize:".75rem",color:"#EF4444",fontWeight:500,marginTop:1}}>Emergencia médica · Ambulancia</div>
              </div>
              <div style={{fontSize:".78rem",fontWeight:700,color:C.danger}}>LLAMAR →</div>
            </a>

            {/* Hijas */}
            <div style={{fontSize:".72rem",fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:".05em",marginBottom:10}}>Contactos familiares</div>
            {contactos.map((c,i) => (
              <a key={i} href={`tel:${c.tel}`} style={{display:"flex",alignItems:"center",gap:12,background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",marginBottom:8,textDecoration:"none",color:"inherit"}}>
                <img src={c.avatar} style={{width:44,height:44,borderRadius:"50%",objectFit:"cover",objectPosition:"top",flexShrink:0,border:`1px solid ${C.border}`}} onError={e=>e.target.style.background="#eee"} />
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:".95rem",color:C.text}}>{c.nombre}</div>
                  <div style={{fontSize:".74rem",color:C.textSoft,fontWeight:500,marginTop:1}}>
                    {c.tel ? c.tel : <span style={{color:C.warn}}>Sin número — cargalo en Contactos</span>}
                  </div>
                </div>
                <div style={{width:38,height:38,borderRadius:8,background:C.primary,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
              </a>
            ))}

            {/* Google Maps ubicación */}
            <div style={{fontSize:".72rem",fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:".05em",margin:"14px 0 10px"}}>Ubicación de Norma</div>
            <LocationWidget contactos={contactos} />

          </div>
        </div>
      )}

      {/* TOP */}
      <div style={{textAlign:"center",padding:"22px 20px 0",flexShrink:0}}>
        <div style={{fontFamily:F.body,fontSize:".82rem",fontStyle:"italic",color:T.textSoft,fontWeight:400}}>{clock.greeting}</div>
        <div style={{fontFamily:F.display,fontSize:"2.4rem",fontWeight:700,color:T.text,lineHeight:.95,marginTop:2,letterSpacing:"-.02em"}}>{uName}</div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}>
          <div style={{height:1,flex:1,background:`linear-gradient(to right,${T.accent},transparent)`}}/>
          <div style={{fontFamily:F.body,fontSize:".76rem",color:T.textSoft,fontWeight:400}}>{clock.timeStr}</div>
        </div>
      </div>

      {/* CENTER */}
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:16,
        justifyContent: btnPos < 25 ? "flex-start" : btnPos > 75 ? "flex-end" : "center",
        padding: btnPos < 25 ? "24px 24px 0" : btnPos > 75 ? "0 24px 24px" : "0 24px",
        overflow:"hidden"}}>

        <div style={{fontSize:".95rem",fontWeight:500,color:aiState==="idle"?"#9CA3AF":"#1B4F8A",textAlign:"center",transition:"color .2s",letterSpacing:".01em"}}>
          {aiState==="thinking" ? "Martita está pensando…" : aiState==="speaking" ? "Martita te está hablando…" : aiState==="listening" ? "Te estoy escuchando…" : "Tocá para hablar con Martita"}
        </div>

        {/* BIG BUTTON */}
        <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
          {(aiState==="speaking"||aiState==="listening") && [210,265,320].map((s,i)=>(
            <div key={i} style={{position:"absolute",borderRadius:"50%",border:"1.5px solid #1B4F8A",width:s,height:s,opacity:0,animation:"ripple 1.6s ease-out infinite",animationDelay:`${i*.3}s`,pointerEvents:"none"}} />
          ))}
          <button onClick={handleMicBtn} style={{...Sh.style,border:"none",cursor:"pointer",
            background:btnBg,
            boxShadow:`0 12px 40px ${T.primary}55`,
            display:"flex",flexDirection:"column",alignItems:"center",
            justifyContent:"center",gap:8,position:"relative",zIndex:2,
            transition:"all .25s ease"}}>
            <div style={{position:"absolute",inset:6,borderRadius:"inherit",border:`1px solid rgba(255,255,255,.15)`}}/>
            <div style={{width:68,height:68,borderRadius:"50%",background:"rgba(255,255,255,.18)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:"3rem",lineHeight:1}}>{btnIcon}</span>
            </div>
            <div style={{fontSize:".68rem",fontWeight:700,color:"rgba(255,255,255,.85)",letterSpacing:".05em",textTransform:"uppercase",textAlign:"center",padding:"0 12px"}}>{btnLbl}</div>
          </button>
        </div>

        {/* MENSAJES */}
        <div style={{width:"100%",maxWidth:360,display:"flex",flexDirection:"column",gap:8}}>
          {aiState==="thinking" && (
            <div style={{display:"flex",gap:6,justifyContent:"center",padding:8}}>
              {[0,1,2].map(i=><div key={i} style={{width:9,height:9,borderRadius:"50%",background:"#1B4F8A",animation:"pulse 1.1s ease-in-out infinite",animationDelay:`${i*.18}s`}} />)}
            </div>
          )}
          {userMsg && <div style={S.bubbleUser}><div style={S.bwho}>Vos dijiste</div>{userMsg}</div>}
          {aiMsg   && <div style={S.bubbleAI}><div style={{...S.bwho,color:"#1B4F8A"}}>Martita</div>{aiMsg}</div>}
          {ytData  && (
            <div onClick={()=>window.open(ytData.url,"_blank")} style={S.ytCard}>
              <div style={{width:44,height:32,borderRadius:6,background:"#111",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:"1rem",flexShrink:0}}>▶</div>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:".88rem"}}>{ytData.query}</div><div style={{fontSize:".7rem",color:"#9CA3AF",marginTop:1}}>Abrir en YouTube</div></div>
              <div style={{background:"#DC2626",color:"white",borderRadius:6,padding:"5px 10px",fontSize:".75rem",fontWeight:600}}>Ver</div>
            </div>
          )}
        </div>

      </div>

      {/* BOTTOM NAV */}
      <div style={{background:T.tabBg||T.primary,borderTop:`2px solid ${T.accent}33`,display:"flex",flexShrink:0,paddingBottom:"env(safe-area-inset-bottom)"}}>
        {[
          { s:"pastillas", lbl:"Pastillas", svg:(
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v2"/>
              <circle cx="17" cy="17" r="5"/>
              <path d="M17 14v6M14 17h6"/>
            </svg>
          )},
          { s:"turnos", lbl:"Turnos", svg:(
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
            </svg>
          )},
          { s:"musica", lbl:"Música", svg:(
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
          )},
          { s:"ejercicios", lbl:"Ejercicios", svg:(
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="2"/>
              <path d="M12 7v5l3 3M12 12l-3 3M7 15h2M15 15h2"/>
              <path d="M5 20h14"/>
            </svg>
          )},
          { s:"fotos", lbl:"Fotos", svg:(
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          )},
          { s:"__calls__", lbl:"Urgencias", svg:(
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          )},
        ].map((item, idx) => {
          const isActive = screen === item.s;
          const isUrgent = item.s === "__calls__";
          return (
            <button
              key={item.s}
              onClick={() => isUrgent ? setShowCalls(true) : setScreen(item.s)}
              style={{
                flex:1, display:"flex", flexDirection:"column", alignItems:"center",
                justifyContent:"center", gap:5, border:"none", background:"none",
                cursor:"pointer", padding:"12px 2px 10px", fontFamily:"inherit",
                color: isUrgent ? C.danger : isActive ? C.primary : C.textMuted,
                borderTop: isActive && !isUrgent ? `2px solid ${C.primary}` : "2px solid transparent",
              }}
            >
              {item.svg}
              <span style={{fontSize:".63rem",fontWeight: isActive ? 700 : 500, letterSpacing:".01em"}}>
                {item.lbl}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}

// -- SUB-SCREENS NORMA --
function SubScreenNorma({ screen, onBack, meds, turnos, processQ, perfil }) {
  const [countdown,  setCountdown]  = useState(15);
  const [fotoIdx,    setFotoIdx]    = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    setCountdown(15);
    const tick = setInterval(() => setCountdown(p => p > 0 ? p-1 : 0), 1000);
    return () => clearInterval(tick);
  }, [screen]);

  const hdr = (title, bg) => (
    <div style={{background:bg,flexShrink:0,width:"100%",overflow:"hidden"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 14px 10px"}}>
        <div style={{fontSize:"1rem",fontWeight:700,color:"white",flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginRight:8}}>{title}</div>
        <button onClick={onBack} style={S.backCircle}>←</button>
      </div>
      {/* Countdown bar */}
      <div style={{height:3,background:"rgba(255,255,255,.2)",width:"100%"}}>
        <div style={{
          height:"100%",
          background:"rgba(255,255,255,.7)",
          width:`${(countdown/15)*100}%`,
          transition:"width 1s linear",
          borderRadius:"0 2px 2px 0"
        }}/>
      </div>
      {countdown <= 5 && (
        <div style={{textAlign:"center",padding:"6px",fontSize:".72rem",
          color:"rgba(255,255,255,.8)",fontWeight:600}}>
          Volviendo a Martita en {countdown}s...
        </div>
      )}
    </div>
  );

  if (screen === "pastillas") return (
    <div style={S.subScreen}>
      {hdr("Mis pastillas de hoy","#1B4F8A")}
      <div style={S.scrollBody}>
        {meds.map((m,i)=>(
          <div key={i} style={S.card}>
            <img src={m.img} style={S.cardImg} onError={e=>e.target.style.background="#eee"} />
            <div style={{flex:1}}><div style={S.cardName}>{m.nombre}</div><div style={S.cardSub}>{m.desc}</div></div>
            <div style={{background:m.tomada?"#EFF6FF":"#FFFBEB",color:m.tomada?"#1B4F8A":"#D97706",borderRadius:8,padding:"5px 12px",fontSize:".8rem",fontWeight:700,flexShrink:0}}>{m.hora} hs</div>
          </div>
        ))}
        <button onClick={onBack} style={{...S.bigGreenBtn,marginTop:8}}>← Volver a Martita</button>
      </div>
    </div>
  );

  if (screen === "turnos") return (
    <div style={S.subScreen}>
      {hdr("Mis turnos médicos","#1B4F8A")}
      <div style={S.scrollBody}>
        {turnos.map((t,i)=>(
          <div key={i} style={S.card}>
            <img src={t.img} style={S.cardImg} onError={e=>e.target.style.background="#eee"} />
            <div style={{flex:1}}><div style={S.cardName}>{t.nombre}</div><div style={S.cardSub}>{t.hora} hs{t.nota?" · "+t.nota:""}</div></div>
            <div style={{textAlign:"right",flexShrink:0}}><div style={{fontWeight:700,color:"#1B4F8A",fontSize:".95rem"}}>{t.fecha}</div></div>
          </div>
        ))}
        <button onClick={onBack} style={{...S.bigGreenBtn,background:"#1B4F8A",marginTop:8}}>← Volver a Martita</button>
      </div>
    </div>
  );

  if (screen === "musica") return (
    <div style={S.subScreen}>
      <div style={{position:"relative",height:130,flexShrink:0,overflow:"hidden"}}>
        <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=700&q=80" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.4)"}} />
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"12px 18px"}}>
          <button onClick={onBack} style={{...S.backCircle,alignSelf:"flex-end"}}>←</button>
          <div style={{fontSize:"1.2rem",fontWeight:700,color:"white"}}>Música</div>
        </div>
      </div>
      <div style={S.scrollBody}>
        {[
          {img:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=120&q=80",name:"David Bisbal",q:"david bisbal mejores canciones"},
          {img:"https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=120&q=80",name:"Romántica española",q:"musica romantica espanola 90"},
          {img:"https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=120&q=80",name:"Tangos argentinos",q:"tangos argentinos clasicos"},
          {img:"https://images.unsplash.com/photo-1511295742362-92c96b1cf484?w=120&q=80",name:"Música para relajarse",q:"musica relajante dormir"},
        ].map((m,i)=>(
          <div key={i} onClick={()=>window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(m.q)}`,"_blank")} style={{...S.card,cursor:"pointer",marginBottom:10}}>
            <img src={m.img} style={S.cardImg} onError={e=>e.target.style.background="#eee"} />
            <div style={{flex:1}}><div style={S.cardName}>{m.name}</div></div>
            <div style={{background:"#FF0000",color:"white",borderRadius:10,padding:"6px 12px",fontSize:".78rem",fontWeight:700,flexShrink:0}}>▶ Ver</div>
          </div>
        ))}
        <button onClick={onBack} style={{...S.bigGreenBtn,background:"#1B4F8A",marginTop:0}}>← Volver a Martita</button>
      </div>
    </div>
  );

  if (screen === "ejercicios") return (
    <div style={S.subScreen}>
      <div style={{position:"relative",height:130,flexShrink:0,overflow:"hidden"}}>
        <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700&q=80" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.5)"}} />
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"12px 18px"}}>
          <button onClick={onBack} style={{...S.backCircle,alignSelf:"flex-end"}}>←</button>
          <div style={{fontSize:"1.2rem",fontWeight:700,color:"white"}}>Ejercicios de hoy</div>
        </div>
      </div>
      <div style={S.scrollBody}>
        {[
          {img:"https://images.unsplash.com/photo-1518611012118-696072aa579a?w=120&q=80",name:"Estiramiento de brazos",desc:"5 min · Sentada",q:"estiramiento brazos adultos mayores"},
          {img:"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=120&q=80",name:"Sentadillas en silla",desc:"10 repeticiones",q:"sentadillas silla adultos mayores"},
          {img:"https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=120&q=80",name:"Juego de memoria",desc:"5 min · Mental",q:"ejercicio memoria adultos mayores"},
          {img:"https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=120&q=80",name:"Respiración profunda",desc:"5 min · Relajación",q:"respiracion profunda adultos mayores"},
        ].map((e,i)=>(
          <div key={i} onClick={()=>window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(e.q)}`,"_blank")} style={{...S.card,cursor:"pointer",marginBottom:10}}>
            <img src={e.img} style={S.cardImg} onError={er=>er.target.style.background="#eee"} />
            <div style={{flex:1}}><div style={S.cardName}>{e.name}</div><div style={S.cardSub}>{e.desc}</div></div>
            <div style={{background:"#1B4F8A",color:"white",borderRadius:10,padding:"6px 12px",fontSize:".78rem",fontWeight:700,flexShrink:0}}>▶ Ver</div>
          </div>
        ))}
        <button onClick={onBack} style={{...S.bigGreenBtn,marginTop:0}}>← Volver a Martita</button>
      </div>
    </div>
  );
  if (screen === "fotos") {
    const fotos = perfil?.fotos || [];

    function fotoNext() { setFotoIdx(i => (i+1) % fotos.length); }
    function fotoPrev() { setFotoIdx(i => (i-1+fotos.length) % fotos.length); }

    const fotoActual = fotos[fotoIdx] || null;

    return (
      <div style={S.subScreen}>
        {!fullscreen && hdr("Mi álbum de fotos","#1B4F8A")}

        {fotos.length === 0 ? (
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",
            justifyContent:"center",padding:"40px 20px",color:C.textSoft}}>
            <div style={{fontSize:"3rem",marginBottom:12}}>📷</div>
            <div style={{fontSize:"1rem",fontWeight:600,marginBottom:6}}>Todavía no hay fotos</div>
            <div style={{fontSize:".85rem"}}>Valeria o Romina pueden subir fotos desde su panel</div>
            <button onClick={onBack} style={{...S.bigGreenBtn,marginTop:24}}>← Volver a Martita</button>
          </div>
        ) : fullscreen ? (
          /* ── PANTALLA COMPLETA ── */
          <div style={{position:"fixed",inset:0,zIndex:900,background:"black",
            display:"flex",flexDirection:"column",touchAction:"none"}}
            onClick={fotoNext}>

            {/* Foto */}
            <div style={{flex:1,position:"relative",overflow:"hidden"}}>
              <img
                src={fotoActual?.url}
                style={{width:"100%",height:"100%",objectFit:"contain",
                  objectPosition:fotoActual?.posicion||"center center",display:"block"}}
                onError={e=>e.target.style.background="#111"}
              />
              {/* Gradient overlay top */}
              <div style={{position:"absolute",top:0,left:0,right:0,height:80,
                background:"linear-gradient(to bottom,rgba(0,0,0,.6),transparent)"}}/>
              {/* Gradient overlay bottom */}
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:100,
                background:"linear-gradient(to top,rgba(0,0,0,.7),transparent)"}}/>
            </div>

            {/* Top bar */}
            <div style={{position:"absolute",top:0,left:0,right:0,
              display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"16px 16px",paddingTop:"calc(16px + env(safe-area-inset-top))"}}>
              <button onClick={e=>{e.stopPropagation();setFullscreen(false);}}
                style={{background:"rgba(255,255,255,.2)",border:"none",color:"white",
                  borderRadius:20,padding:"8px 16px",fontFamily:"inherit",
                  fontSize:".88rem",fontWeight:700,cursor:"pointer"}}>
                ✕ Cerrar
              </button>
              <div style={{color:"rgba(255,255,255,.8)",fontSize:".82rem",fontWeight:600}}>
                {fotoIdx+1} / {fotos.length}
              </div>
            </div>

            {/* Caption */}
            <div style={{position:"absolute",bottom:0,left:0,right:0,
              padding:"16px 20px",paddingBottom:"calc(20px + env(safe-area-inset-bottom))"}}>
              <div style={{fontSize:"1.1rem",fontWeight:700,color:"white",
                marginBottom:4,textShadow:"0 1px 4px rgba(0,0,0,.8)"}}>
                {fotoActual?.titulo}
              </div>
              <div style={{fontSize:".78rem",color:"rgba(255,255,255,.7)",fontWeight:500}}>
                {fotoActual?.anio}{fotoActual?.subidaPor?" · "+fotoActual.subidaPor:""}
              </div>
            </div>

            {/* Prev / Next arrows */}
            <button onClick={e=>{e.stopPropagation();fotoPrev();}}
              style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",
                background:"rgba(255,255,255,.2)",border:"none",color:"white",
                borderRadius:"50%",width:44,height:44,fontSize:"1.3rem",cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center"}}>
              ‹
            </button>
            <button onClick={e=>{e.stopPropagation();fotoNext();}}
              style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
                background:"rgba(255,255,255,.2)",border:"none",color:"white",
                borderRadius:"50%",width:44,height:44,fontSize:"1.3rem",cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center"}}>
              ›
            </button>

            {/* Dots */}
            {fotos.length <= 10 && (
              <div style={{position:"absolute",bottom:80,left:0,right:0,
                display:"flex",justifyContent:"center",gap:6}}>
                {fotos.map((_,i)=>(
                  <div key={i} onClick={e=>{e.stopPropagation();setFotoIdx(i);}}
                    style={{width:i===fotoIdx?20:7,height:7,borderRadius:4,
                      background:i===fotoIdx?"white":"rgba(255,255,255,.4)",
                      transition:"all .2s",cursor:"pointer"}}/>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ── GRILLA / LISTA ── */
          <div style={S.scrollBody}>
            <div style={{fontSize:".82rem",color:C.textSoft,marginBottom:14,
              fontWeight:500,textAlign:"center"}}>
              {fotos.length} foto{fotos.length!==1?"s":""} familiares 💕 · Tocá una para verla grande
            </div>

            {/* Grilla 2 columnas */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
              {fotos.map((f,i)=>(
                <div key={f.id} onClick={()=>{setFotoIdx(i);setFullscreen(true);}}
                  style={{borderRadius:10,overflow:"hidden",cursor:"pointer",
                    aspectRatio:"1",position:"relative",
                    boxShadow:"0 2px 8px rgba(0,0,0,.12)"}}>
                  <img src={f.url}
                    style={{width:"100%",height:"100%",objectFit:"cover",
                      objectPosition:f.posicion||"center center",display:"block"}}
                    onError={e=>e.target.style.background="#eee"} />
                  <div style={{position:"absolute",bottom:0,left:0,right:0,
                    background:"linear-gradient(to top,rgba(0,0,0,.65),transparent)",
                    padding:"20px 8px 8px"}}>
                    <div style={{fontSize:".7rem",fontWeight:700,color:"white",
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {f.titulo}
                    </div>
                    {f.anio && <div style={{fontSize:".6rem",color:"rgba(255,255,255,.7)"}}>{f.anio}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Ver todas en carrusel */}
            <button onClick={()=>{setFotoIdx(0);setFullscreen(true);}}
              style={{...S.bigGreenBtn,marginBottom:10,
                background:"#1B4F8A",display:"flex",alignItems:"center",
                justifyContent:"center",gap:8}}>
              ▶ Ver todas seguidas
            </button>
            <button onClick={onBack} style={{...S.bigGreenBtn}}>← Volver a Martita</button>
          </div>
        )}
      </div>
    );
  }

  return null;
}

// -- PANEL HIJA --
function PanelHija({ hija, contactos, setContactos, meds, setMeds, turnos, setTurnos, perfil, setPerfil, themeConfig, sensorData }) {
  // ── TEMA ──
  const TC = themeConfig || {};
  const T  = PRESETS[TC.preset || "organico"];
  const F  = FONTS.find(f => f.id === (TC.fontId || "lora")) || FONTS[0];
  const Tx = TEXTURES.find(t => t.id === (TC.textureId || "paper")) || TEXTURES[0];

  // ── ESTADO PRINCIPAL ──
  const [tab, setTab] = useState("resumen");
  const [time, setTime] = useState(getTime().timeStr);
  const [alertaDismiss, setAlertaDismiss] = useState(false);
  const [showAddMed, setShowAddMed] = useState(false);
  const [showAddTurno, setShowAddTurno] = useState(false);

  // Form: nueva medicación
  const [newMedNombre, setNewMedNombre] = useState("");
  const [newMedHora,   setNewMedHora]   = useState("08:00");
  const [newMedDesc,   setNewMedDesc]   = useState("");

  // Form: nuevo turno
  const [newTurnoNombre, setNewTurnoNombre] = useState("");
  const [newTurnoFecha,  setNewTurnoFecha]  = useState("");
  const [newTurnoHora,   setNewTurnoHora]   = useState("10:00");
  const [newTurnoDirec,  setNewTurnoDirec]  = useState("");

  // Tab Perfil state
  const [editHistoria,    setEditHistoria]    = useState(false);
  const [editAlegrias,    setEditAlegrias]    = useState(false);
  const [editSensibles,   setEditSensibles]   = useState(false);
  const [showAddPersona,  setShowAddPersona]  = useState(false);
  const [showAddRecuerdo, setShowAddRecuerdo] = useState(false);
  const [draftHistoria,   setDraftHistoria]   = useState(perfil.historia);
  const [draftAlegrias,   setDraftAlegrias]   = useState(perfil.alegrias.join("\n"));
  const [draftSensibles,  setDraftSensibles]  = useState(perfil.sensibles.join("\n"));
  const [newPNombre,      setNewPNombre]      = useState("");
  const [newPRelacion,    setNewPRelacion]    = useState("");
  const [newPDesc,        setNewPDesc]        = useState("");
  const [newPSensible,    setNewPSensible]    = useState(false);
  const [newRAnio,        setNewRAnio]        = useState("");
  const [newRTexto,       setNewRTexto]       = useState("");
  const [newREmoji,       setNewREmoji]       = useState("⭐");

  // Tab Contactos state
  const [contactVals, setContactVals] = useState(() => {
    const v = {};
    contactos.forEach(c => { v[c.id] = c.tel; });
    return v;
  });

  // Tab Dispositivos state
  const [devs, setDevs] = useState([
    { id:"sensor",     nombre:"Sensor de Movimiento",  marca:"SwitchBot Motion Sensor",  estado:"conectado",    alertas:true,  expanded:false,
      desc:"Detecta actividad en el hogar y alerta ante ausencia prolongada.",
      pasos:["Descargá la app del sensor","Conectá el sensor al Wi-Fi del hogar","Activá las alertas en la app","Vinculá con Acompañar"] },
    { id:"camara",     nombre:"Cámaras de Vigilancia", marca:"Nest / Arlo / Tapo",      estado:"desconectado", alertas:false, expanded:false,
      desc:"Monitoreo en vivo del hogar. Solo visible para la familia.",
      pasos:["Instalá la cámara en habitación principal","Descargá la app de la cámara","Compartí acceso con el familiar","Activá notificaciones"] },
    { id:"smarttv",    nombre:"Smart TV",               marca:"Samsung / LG / Sony",     estado:"conectado",    alertas:false, expanded:false,
      desc:"Martita puede sugerir contenido y controlar el volumen por voz.",
      pasos:["Activá acceso remoto en Ajustes del TV","Conectate a la misma red Wi-Fi","Configurá la app de control","Probá los comandos de voz"] },
    { id:"applewatch", nombre:"Apple Watch",             marca:"Series 4 o superior",     estado:"conectado",    alertas:true,  expanded:false,
      desc:"Monitorea frecuencia cardíaca, detección de caídas y actividad.",
      pasos:["Activá la app Salud en iPhone","Compartí datos de salud con la familia","Activá detección de caídas","Configurá alertas de frecuencia cardíaca"] },
    { id:"appletv",    nombre:"Apple TV",                marca:"HD / 4K",                 estado:"desconectado", alertas:false, expanded:false,
      desc:"Permite ver contenido fácilmente. Martita puede sugerir películas.",
      pasos:["Andá a Ajustes > Usuarios y Cuentas","Activá Compartir con la familia","Configurá control por voz","Probá Siri Remote"] },
    { id:"alexa",      nombre:"Alexa",                   marca:"Amazon Echo / Echo Dot",  estado:"desconectado", alertas:false, expanded:false,
      desc:"Asistente de voz para comandos simples, música y control del hogar.",
      pasos:["Descargá Amazon Alexa","Configurá el dispositivo Echo","Creá rutinas de voz","Vinculá con otros dispositivos"] },
    { id:"amazonhome", nombre:"Amazon Home",              marca:"Smart Home Hub",           estado:"desconectado", alertas:false, expanded:false,
      desc:"Coordina todos los dispositivos Amazon del hogar.",
      pasos:["Descargá Amazon Alexa","Andá a Dispositivos > Agregar","Seguí el asistente de configuración","Probá los dispositivos"] },
  ]);

  // Tab Alertas state
  const [alertToggles, setAlertToggles] = useState([true,true,true,true]);

  // Alertas de Martita (señales sutiles detectadas en conversación)
  const [martitaAlertas, setMartitaAlertas] = useState(() => {
    try {
      const saved = localStorage.getItem("martita_alertas");
      return saved ? JSON.parse(saved) : [];
    } catch(e) { return []; }
  });

  // Tab Fotos state
  const [fotoUrlInput,    setFotoUrlInput]    = useState("");
  const [fotoTituloInput, setFotoTituloInput] = useState("");

  // -- BRIEFING DIARIO --
  const briefingKey = `briefing_${hija}_${new Date().toDateString()}`;
  const [showBriefing, setShowBriefing] = useState(() => {
    try { return !localStorage.getItem(`briefing_${hija}_${new Date().toDateString()}`); }
    catch(e) { return true; }
  });
  const [briefingText, setBriefingText] = useState("");
  const [briefingLoading, setBriefingLoading] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(getTime().timeStr), 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!showBriefing || briefingText || briefingLoading) return;
    setBriefingLoading(true);
    const sys = buildSystemPrompt(contactos, meds, turnos, perfil);
    const hijaName = (hijaData?.nombre || hija).charAt(0).toUpperCase() + (hijaData?.nombre || hija).slice(1);
    const prompt = `${hijaName} esta por llamar a Norma. Escribi un briefing breve y calido — un parrafo de 3-4 oraciones — sobre como estuvo Norma hoy: su estado emocional, algo fisico relevante si lo hay, y UNA sugerencia concreta de que preguntarle para que la conversacion sea real y cercana. Habla directamente a ${hijaName}, como si fueras la asistente que cuida a su mama. Tono calido, honesto, sin drama.`;
    fetch("/api/claude", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:220,
        system:sys, messages:[{role:"user",content:prompt}] })
    })
    .then(r=>r.json())
    .then(d=>{
      const text = d?.content?.[0]?.text?.trim();
      setBriefingText(text || getBriefingFallback());
    })
    .catch(()=>setBriefingText(getBriefingFallback()))
    .finally(()=>setBriefingLoading(false));
  }, [showBriefing]);

  function getBriefingFallback() {
    const hijaName = (hijaData?.nombre || hija).charAt(0).toUpperCase() + (hijaData?.nombre || hija).slice(1);
    const tomadas = meds.filter(m=>m.tomada).length;
    const total = meds.length;
    const alegria = perfil?.alegrias?.[0] || "su jardin";
    if (tomadas === total)
      return `${hijaName}, hoy Norma tomo todas sus pastillas y estuvo activa durante el dia. Su animo se veia tranquilo y descansado. Te sugiero preguntarle por ${alegria} — siempre le alegra hablar de eso y es una buena forma de arrancar la conversacion.`;
    return `${hijaName}, hoy le falto tomar ${total-tomadas} medicacion${total-tomadas>1?"es":""}. Estuvo tranquila en casa. Podrias preguntarle como se sintio durante el dia y de paso recordarle las pastillas de la noche con naturalidad.`;
  }

  function dismissBriefing() {
    try { localStorage.setItem(briefingKey, "1"); } catch(e) {}
    setShowBriefing(false);
  }

  // ── DATOS DERIVADOS ──
  const hijaData  = contactos.find(c => c.id.toString() === hija || c.nombre.toLowerCase() === hija) || contactos[0];
  const color     = TC.appColor || hijaData?.color || "#1B4F8A";
  const pendientes = meds.filter(m => !m.tomada).length;

  // ── FUNCIONES ──
  function toggleMed(i) {
    setMeds(prev => prev.map((m,idx) => idx===i ? {...m,tomada:!m.tomada} : m));
  }
  function addMed() {
    if (!newMedNombre) return;
    setMeds(prev => [...prev, { id:Date.now(), nombre:newMedNombre, hora:newMedHora, desc:newMedDesc||"", tomada:false, img:"https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=120&q=80" }]);
    setNewMedNombre(""); setNewMedHora("08:00"); setNewMedDesc(""); setShowAddMed(false);
  }
  function addTurno() {
    if (!newTurnoNombre||!newTurnoFecha) return;
    const d = new Date(newTurnoFecha+"T12:00:00");
    const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    setTurnos(prev => [...prev, { id:Date.now(), nombre:newTurnoNombre, fecha:`${d.getDate()} de ${months[d.getMonth()]}`, hora:newTurnoHora, nota:newTurnoDirec||"", img:"https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=120&q=80" }]);
    setNewTurnoNombre(""); setNewTurnoFecha(""); setNewTurnoHora("10:00"); setNewTurnoDirec(""); setShowAddTurno(false);
  }
  function updateContacto(id, field, val) {
    setContactos(prev => prev.map(c => c.id===id ? {...c,[field]:val} : c));
  }
  function handleContactBlur(id) {
    updateContacto(id, "tel", contactVals[id] || "");
  }
  function toggleDev(id) {
    setDevs(prev => prev.map(d => d.id===id ? {...d,expanded:!d.expanded} : d));
  }
  function toggleDevEstado(id) {
    setDevs(prev => prev.map(d => d.id===id ? {...d,estado:d.estado==="conectado"?"desconectado":"conectado"} : d));
  }
  function toggleDevAlertas(id) {
    setDevs(prev => prev.map(d => d.id===id ? {...d,alertas:!d.alertas} : d));
  }
  function saveHistoria() { setPerfil(p=>({...p,historia:draftHistoria})); setEditHistoria(false); }
  function saveAlegrias() { setPerfil(p=>({...p,alegrias:draftAlegrias.split("\n").map(x=>x.trim()).filter(Boolean)})); setEditAlegrias(false); }
  function saveSensibles() { setPerfil(p=>({...p,sensibles:draftSensibles.split("\n").map(x=>x.trim()).filter(Boolean)})); setEditSensibles(false); }
  function addPersona() {
    if (!newPNombre) return;
    setPerfil(p=>({...p,personasQueridas:[...p.personasQueridas,{id:Date.now(),nombre:newPNombre,relacion:newPRelacion,descripcion:newPDesc,sensible:newPSensible,foto:""}]}));
    setNewPNombre(""); setNewPRelacion(""); setNewPDesc(""); setNewPSensible(false); setShowAddPersona(false);
  }
  function removePersona(id) { setPerfil(p=>({...p,personasQueridas:p.personasQueridas.filter(x=>x.id!==id)})); }
  function addRecuerdo() {
    if (!newRTexto) return;
    setPerfil(p=>({...p,recuerdos:[{id:Date.now(),anio:newRAnio,emoji:newREmoji,texto:newRTexto},...p.recuerdos]}));
    setNewRAnio(""); setNewRTexto(""); setNewREmoji("⭐"); setShowAddRecuerdo(false);
  }

  // ── RENDER ──

  // Briefing screen
  if (showBriefing) {
    const hijaName = (hijaData?.nombre || hija).charAt(0).toUpperCase() + (hijaData?.nombre || hija).slice(1);
    return (
      <div style={{display:"flex",flexDirection:"column",height:"100vh",width:"100%",maxWidth:480,
        margin:"0 auto",fontFamily:F.body,overflow:"hidden",
        background:`linear-gradient(160deg, ${color} 0%, ${color}CC 50%, #1a1a2e 100%)`}}>

        {/* Tab bar top */}
        <div style={{display:"flex",flexShrink:0,borderBottom:"1px solid rgba(255,255,255,.15)"}}>
          {contactos.map((ct,i)=>(
            <button key={i} style={{flex:1,padding:"13px 4px",border:"none",cursor:"pointer",
              fontFamily:"inherit",fontSize:".78rem",fontWeight:ct.id.toString()===hija||ct.nombre.toLowerCase()===hija?700:500,
              background:"transparent",
              color:ct.id.toString()===hija||ct.nombre.toLowerCase()===hija?"white":"rgba(255,255,255,.4)",
              borderBottom:ct.id.toString()===hija||ct.nombre.toLowerCase()===hija?"2.5px solid white":"2.5px solid transparent"}}>
              {ct.nombre}
            </button>
          ))}
        </div>

        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",
          padding:"28px 24px 32px",overflowY:"auto"}}>

          {/* Header Martita */}
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
            <div style={{width:50,height:50,borderRadius:"50%",flexShrink:0,
              background:"rgba(255,255,255,.18)",border:"2px solid rgba(255,255,255,.35)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem"}}>
              🤝
            </div>
            <div>
              <div style={{fontSize:".7rem",fontWeight:600,color:"rgba(255,255,255,.6)",
                textTransform:"uppercase",letterSpacing:".1em"}}>Martita te cuenta</div>
              <div style={{fontSize:"1.05rem",fontWeight:700,color:"white",marginTop:2}}>
                Antes de llamar a mamá...
              </div>
            </div>
          </div>

          {/* Card */}
          <div style={{background:"white",borderRadius:16,padding:"20px",
            boxShadow:"0 20px 60px rgba(0,0,0,.25)",marginBottom:20}}>

            {briefingLoading ? (
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,padding:"16px 0"}}>
                <div style={{display:"flex",gap:6}}>
                  {[0,1,2].map(i=>(
                    <div key={i} style={{width:8,height:8,borderRadius:"50%",background:color,
                      animation:"pulse 1.2s ease-in-out infinite",animationDelay:`${i*.2}s`}}/>
                  ))}
                </div>
                <div style={{fontSize:".85rem",color:"#6B7280",fontWeight:500}}>
                  Preparando el resumen de hoy...
                </div>
              </div>
            ) : (
              <>
                <div style={{fontSize:".97rem",color:"#1a1a1a",lineHeight:1.75,fontWeight:400}}>
                  {briefingText}
                </div>
                <div style={{marginTop:14,paddingTop:12,borderTop:"1px solid #F3F4F6",
                  display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:"1.1rem"}}>💊</span>
                  <div>
                    <div style={{fontSize:".78rem",fontWeight:700,color:"#111827"}}>
                      {meds.filter(m=>m.tomada).length}/{meds.length} medicaciones tomadas
                    </div>
                    {meds.filter(m=>!m.tomada).length > 0 && (
                      <div style={{fontSize:".72rem",color:"#D97706",marginTop:1,fontWeight:600}}>
                        Falta: {meds.filter(m=>!m.tomada).map(m=>m.nombre).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Botones */}
          <a href={`tel:${contactos.find(ct=>ct.nombre.toLowerCase()===hija)?.tel||""}`}
            onClick={dismissBriefing}
            style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,
              background:"white",color:color,borderRadius:12,padding:"15px",
              textDecoration:"none",fontWeight:700,fontSize:"1rem",marginBottom:10,
              boxShadow:"0 4px 20px rgba(0,0,0,.2)"}}>
            📞 Llamar a mamá ahora
          </a>
          <button onClick={dismissBriefing}
            style={{background:"rgba(255,255,255,.15)",border:"1.5px solid rgba(255,255,255,.3)",
              color:"white",borderRadius:12,padding:"13px",fontFamily:"inherit",
              fontWeight:600,fontSize:".88rem",cursor:"pointer",width:"100%"}}>
            Ver el panel completo →
          </button>

          <div style={{textAlign:"center",marginTop:18,fontSize:".7rem",color:"rgba(255,255,255,.4)"}}>
            {new Date().toLocaleDateString("es-AR",{weekday:"long",day:"numeric",month:"long"})}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",width:"100%",maxWidth:480,margin:"0 auto",
      fontFamily:F.body,overflow:"hidden",overflowX:"hidden",
      background: Tx.isPhoto && TC.customBg
        ? `url(${TC.customBg}) center/cover no-repeat`
        : Tx.css!=="none"?`${Tx.css}, ${T.bg}`:T.bg}}>

      {/* ── HEADER ── */}
      <div style={{background:color,padding:"14px 14px 12px",flexShrink:0,width:"100%",overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div>
            <div style={{fontSize:"1rem",fontWeight:700,color:"white"}}>{hijaData?.nombre} · Seguimiento de Norma</div>
            <div style={{fontSize:".7rem",color:"rgba(255,255,255,.6)",fontWeight:500,marginTop:1}}>{time}</div>
          </div>
          <img src={hijaData?.avatar} style={{width:40,height:40,borderRadius:"50%",objectFit:"cover",border:"2px solid rgba(255,255,255,.4)"}} onError={e=>e.target.style.background="rgba(255,255,255,.2)"} />
        </div>
        <div style={{display:"flex",gap:6,width:"100%"}}>
          {[
            {lbl:"Movimiento", val:"Activa ✓", col:"white"},
            {lbl:"Medicación", val:`${meds.filter(m=>m.tomada).length}/${meds.length}`, col:pendientes>0?"#FFD580":"white"},
            {lbl:"Ánimo", val:"Bien 😊", col:"white"},
          ].map((s,i)=>(
            <div key={i} style={{flex:1,minWidth:0,background:"rgba(255,255,255,.12)",borderRadius:8,padding:"7px 8px"}}>
              <div style={{fontSize:".55rem",fontWeight:600,color:"rgba(255,255,255,.5)",textTransform:"uppercase",letterSpacing:".04em",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.lbl}</div>
              <div style={{fontSize:".82rem",fontWeight:700,color:s.col,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TAB BAR ── */}
      <div style={{display:"flex",background:"white",borderBottom:"1px solid #E5E7EB",flexShrink:0,overflowX:"auto"}}>
        {[{id:"resumen",lbl:"Resumen"},{id:"medicacion",lbl:"Medicación"},{id:"turnos",lbl:"Turnos"},
          {id:"perfil",lbl:"Perfil"},{id:"contactos",lbl:"Contactos"},{id:"dispositivos",lbl:"Dispositivos"},{id:"alertas",lbl:"Alertas"},
          {id:"fotos",lbl:"📷 Fotos"}
        ].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flexShrink:0,padding:"11px 12px",border:"none",background:"none",fontFamily:"inherit",fontSize:".72rem",fontWeight:tab===t.id?700:500,color:tab===t.id?color:C.textMuted,cursor:"pointer",borderBottom:tab===t.id?`2px solid ${color}`:"2px solid transparent",whiteSpace:"nowrap"}}>{t.lbl}</button>
        ))}
      </div>

      {/* ── RESUMEN ── */}
      {tab==="resumen" && (
        <div style={S.scrollBody}>

          {/* SEMAFORO DIARIO */}
          {(() => {
            const sd = sensorData || {};
            const timeline = sd.timeline || ACTIVIDAD;
            const sinMovimiento = sd.conectado
              ? !sd.activa && !sd.ultimoMovimiento
              : timeline.filter(a=>a.tipo==="ok").length === 0;
            const hayAlerta  = timeline.some(a=>a.tipo==="alert");
            const hayWarning = timeline.some(a=>a.tipo==="warn") || pendientes > 0;
            const estado = hayAlerta || sinMovimiento ? "rojo" : hayWarning ? "amarillo" : "verde";
            const cfg = {
              verde:    { bg:"#F0FDF4", border:"#86EFAC", icon:"🟢", titulo:"Todo bien", sub:"Norma tuvo un día tranquilo y normal", color:"#16A34A" },
              amarillo: { bg:"#FFFBEB", border:"#FCD34D", icon:"🟡", titulo:"Algo para revisar", sub:pendientes>0?`Faltó tomar ${pendientes} medicación${pendientes>1?"es":""}`:ACTIVIDAD.find(a=>a.tipo==="warn")?.texto||"Revisá el historial", color:"#D97706" },
              rojo:     { bg:"#FEF2F2", border:"#FCA5A5", icon:"🔴", titulo:"Atención necesaria", sub:ACTIVIDAD.find(a=>a.tipo==="alert")?.texto||"Sin actividad registrada hoy", color:"#DC2626" },
            }[estado];
            return (
              <div style={{background:cfg.bg,border:`2px solid ${cfg.border}`,borderRadius:12,
                padding:"14px 16px",marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:"2rem",flexShrink:0}}>{cfg.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:".92rem",fontWeight:700,color:cfg.color}}>{cfg.titulo}</div>
                  <div style={{fontSize:".78rem",color:C.textMed,marginTop:2,fontWeight:500}}>{cfg.sub}</div>
                </div>
                <div style={{fontSize:".7rem",fontWeight:700,color:cfg.color,background:"white",
                  padding:"4px 10px",borderRadius:20,border:`1px solid ${cfg.border}`,flexShrink:0}}>
                  {new Date().toLocaleDateString("es-AR",{weekday:"short",day:"numeric"})}
                </div>
              </div>
            );
          })()}

          {/* PATRONES DE LA SEMANA */}
          {(() => {
            const patrones = [];
            if (pendientes > 0) patrones.push(`💊 ${pendientes} medicación${pendientes>1?"es":""} sin tomar hoy`);
            const warns = ACTIVIDAD.filter(a=>a.tipo==="warn");
            if (warns.length > 0) patrones.push(`⚠️ ${warns.map(w=>w.texto).join(", ")}`);
            if (patrones.length === 0) return null;
            return (
              <div style={{background:"white",borderRadius:10,border:`1px solid ${C.border}`,
                padding:"12px 14px",marginBottom:14}}>
                <div style={{fontSize:".75rem",fontWeight:700,color:C.textMuted,textTransform:"uppercase",
                  letterSpacing:".08em",marginBottom:8}}>Patrones detectados hoy</div>
                {patrones.map((p,i)=>(
                  <div key={i} style={{fontSize:".83rem",color:C.textMed,fontWeight:500,
                    padding:"4px 0",borderBottom:i<patrones.length-1?`1px solid ${C.border}`:"none"}}>{p}</div>
                ))}
              </div>
            );
          })()}

          {pendientes>0 && !alertaDismiss && (
            <div style={{background:"#FDECEA",border:"1.5px solid rgba(192,57,43,.2)",borderRadius:8,padding:"14px",marginBottom:14,display:"flex",gap:12}}>
              <div style={{fontSize:"1.3rem",flexShrink:0}}>💊</div>
              <div style={{flex:1}}>
                <div style={{fontSize:".9rem",fontWeight:700,color:"#C0392B"}}>{pendientes} medicación{pendientes>1?"es":""} pendiente{pendientes>1?"s":""}</div>
                <div style={{fontSize:".78rem",color:"#6B7280",fontWeight:600,marginTop:3}}>{meds.filter(m=>!m.tomada).map(m=>`${m.nombre} (${m.hora}hs)`).join(" · ")}</div>
                <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
                  <a href={`tel:${contactos[0]?.tel||""}`} style={{padding:"8px 14px",background:"#C0392B",color:"white",borderRadius:10,fontSize:".8rem",fontWeight:700}}>📞 Llamar a Norma</a>
                  <button onClick={()=>setAlertaDismiss(true)} style={{padding:"8px 14px",background:"white",color:"#C0392B",border:"1.5px solid rgba(192,57,43,.25)",borderRadius:10,fontSize:".8rem",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Entendido</button>
                </div>
              </div>
            </div>
          )}
          <div style={{borderRadius:8,overflow:"hidden",marginBottom:14,position:"relative",height:100}}>
            <img src="https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=600&q=75" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.4)"}} />
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",justifyContent:"center",padding:"12px 16px"}}>
              <div style={{fontSize:".65rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",color:"rgba(255,255,255,.65)"}}>
                Sensor · {sensorData?.conectado ? "En vivo" : "Simulado"}
              </div>
              <div style={{fontSize:"1.2rem",fontWeight:700,color:"white",marginTop:3}}>
                {sensorData?.activa ? "🟢" : "⚠️"} Norma {sensorData?.activa ? "está activa" : "sin movimiento reciente"}
              </div>
              <div style={{fontSize:".72rem",color:"rgba(255,255,255,.6)",fontWeight:700,marginTop:2}}>
                {sensorData?.ultimoMovimiento
                  ? `Último movimiento: ${sensorData.ultimoMovimiento} hs`
                  : "Sin datos del sensor todavía"}
              </div>
            </div>
          </div>
          <div style={{...S.cardBox,padding:"14px"}}>
            <div style={{fontWeight:600,fontSize:".88rem",marginBottom:12}}>Actividad de hoy</div>
            {((sensorData?.timeline) || ACTIVIDAD).map((a,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:i<((sensorData?.timeline)||ACTIVIDAD).length-1?12:0}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:a.tipo==="ok"?C.success:a.tipo==="warn"?C.warn:C.danger,flexShrink:0,marginTop:3}} />
                  {i<((sensorData?.timeline)||ACTIVIDAD).length-1 && <div style={{width:2,flex:1,background:C.border,margin:"4px 0",minHeight:10}} />}
                </div>
                <div>
                  <div style={{fontSize:".85rem",fontWeight:600,color:C.text}}>{a.texto}</div>
                  <div style={{fontSize:".7rem",color:C.textMuted,fontWeight:500,marginTop:1}}>{a.hora} hs</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{...S.cardBox,marginTop:0}}>
            <div style={{fontWeight:600,fontSize:".88rem",marginBottom:10}}>Contactar a Norma</div>
            <div style={{display:"flex",gap:8}}>
              <a href={`tel:${contactos[0]?.tel||""}`} style={{flex:1,background:color,color:"white",borderRadius:8,padding:"11px",textAlign:"center",fontWeight:600,fontSize:".9rem",textDecoration:"none"}}>📞 Llamar</a>
              <a href="https://wa.me/" target="_blank" style={{flex:1,background:"#16A34A",color:"white",borderRadius:8,padding:"11px",textAlign:"center",fontWeight:600,fontSize:".9rem",textDecoration:"none"}}>💬 WhatsApp</a>
            </div>
          </div>
        </div>
      )}

      {/* ── MEDICACIÓN ── */}
      {tab==="medicacion" && (
        <div style={S.scrollBody}>
          <div style={S.cardBox}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontWeight:700,fontSize:".88rem"}}>Medicación de hoy</div>
              <button onClick={()=>setShowAddMed(true)} style={{background:color,color:"white",border:"none",borderRadius:8,padding:"5px 14px",fontSize:".78rem",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ Agregar</button>
            </div>
            {meds.map((m,i)=>(
              <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<meds.length-1?"1px solid #F3F4F6":"none"}}>
                <img src={m.img} style={{width:44,height:44,borderRadius:10,objectFit:"cover",flexShrink:0}} onError={e=>e.target.style.background="#eee"} />
                <div style={{flex:1}}>
                  <div style={{fontSize:".88rem",fontWeight:700,textDecoration:m.tomada?"line-through":"none",opacity:m.tomada?.65:1}}>{m.nombre}</div>
                  <div style={{fontSize:".72rem",color:"#6B7280",fontWeight:600,marginTop:2}}>{m.hora}hs{m.desc?" · "+m.desc:""}</div>
                </div>
                <button onClick={()=>toggleMed(i)} style={{width:30,height:30,borderRadius:8,border:"none",cursor:"pointer",background:m.tomada?color:"#E5E7EB",color:m.tomada?"white":"#6B7280",fontWeight:700,fontFamily:"inherit",flexShrink:0}}>{m.tomada?"✓":"○"}</button>
                <div style={{background:m.tomada?"#EFF6FF":"#FFFBEB",color:m.tomada?color:"#D97706",borderRadius:8,padding:"4px 10px",fontSize:".7rem",fontWeight:700,flexShrink:0}}>{m.tomada?"Tomada":"Pendiente"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TURNOS ── */}
      {tab==="turnos" && (
        <div style={S.scrollBody}>
          <div style={S.cardBox}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontWeight:700,fontSize:".88rem"}}>Próximos turnos</div>
              <button onClick={()=>setShowAddTurno(true)} style={{background:color,color:"white",border:"none",borderRadius:8,padding:"5px 14px",fontSize:".78rem",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ Agregar</button>
            </div>
            {turnos.map((t,i)=>(
              <div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<turnos.length-1?"1px solid #F3F4F6":"none"}}>
                <img src={t.img} style={{width:44,height:44,borderRadius:10,objectFit:"cover",flexShrink:0}} onError={e=>e.target.style.background="#eee"} />
                <div style={{flex:1}}>
                  <div style={{fontSize:".88rem",fontWeight:700}}>{t.nombre}</div>
                  <div style={{fontSize:".72rem",color:"#6B7280",fontWeight:600,marginTop:2}}>{t.hora}hs{t.nota?" · "+t.nota:""}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontWeight:700,color:color,fontSize:".9rem"}}>{t.fecha}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PERFIL ── */}
      {tab==="perfil" && (
        <div style={S.scrollBody}>
          <div style={{background:"#EFF6FF",border:"1px solid #DBEAFE",borderRadius:8,padding:"12px 14px",marginBottom:12,display:"flex",gap:8,alignItems:"flex-start"}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,marginTop:1}}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            <div style={{fontSize:".82rem",color:C.primary,fontWeight:500,lineHeight:1.5}}>Todo lo que cargues acá lo usa Martita para conectar con Norma de verdad.</div>
          </div>

          {/* Historia */}
          <div style={{fontSize:".68rem",fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>Su historia de vida</div>
          <div style={S.cardBox}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              {!editHistoria && <div style={{fontSize:".88rem",fontWeight:500,color:C.text,lineHeight:1.6,flex:1}}>{perfil.historia}</div>}
              <button onClick={()=>{setDraftHistoria(perfil.historia);setEditHistoria(!editHistoria);}} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 10px",fontSize:".75rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:C.textSoft,flexShrink:0,marginLeft:8}}>{editHistoria?"Cancelar":"Editar"}</button>
            </div>
            {editHistoria && (
              <>
                <textarea value={draftHistoria} onChange={e=>setDraftHistoria(e.target.value)} style={{...S.inp,resize:"none",minHeight:120,lineHeight:1.6,marginBottom:10}} placeholder="Contá la vida de Norma..." />
                <button onClick={saveHistoria} style={{...S.bigGreenBtn,background:color,padding:10}}>Guardar</button>
              </>
            )}
          </div>

          {/* Personas queridas */}
          <div style={{fontSize:".68rem",fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>Personas queridas</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
            {perfil.personasQueridas.map(p=>(
              <div key={p.id} style={{background:"white",borderRadius:8,border:`1px solid ${p.sensible?"#FED7AA":C.border}`,overflow:"hidden"}}>
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px"}}>
                  <div style={{width:40,height:40,borderRadius:"50%",background:p.sensible?"#FFF7ED":"#EFF6FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",flexShrink:0}}>
                    {p.relacion.toLowerCase().includes("nieto")?"👶":p.relacion.toLowerCase().includes("hij")?"👧":p.relacion.toLowerCase().includes("esposo")?"💑":"👤"}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{fontSize:".92rem",fontWeight:600,color:C.text}}>{p.nombre}</div>
                      {p.sensible && <span style={{background:"#FFF7ED",color:"#C2410C",fontSize:".6rem",fontWeight:700,padding:"2px 6px",borderRadius:10}}>Sensible</span>}
                    </div>
                    <div style={{fontSize:".74rem",color:C.textSoft,marginTop:1}}>{p.relacion}</div>
                    <div style={{fontSize:".78rem",color:C.textMed,marginTop:4,lineHeight:1.4}}>{p.descripcion}</div>
                  </div>
                  <button onClick={()=>removePersona(p.id)} style={{background:"none",border:"none",color:C.textMuted,cursor:"pointer",fontSize:"1.1rem",flexShrink:0}}>×</button>
                </div>
              </div>
            ))}
            <button onClick={()=>setShowAddPersona(true)} style={{background:"white",border:`1.5px dashed ${C.border}`,borderRadius:8,padding:"12px",display:"flex",alignItems:"center",justifyContent:"center",gap:8,cursor:"pointer",fontSize:".85rem",fontWeight:600,color:C.textSoft,fontFamily:"inherit"}}>+ Agregar persona querida</button>
          </div>

          {/* Alegrías */}
          <div style={{fontSize:".68rem",fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>Lo que la hace feliz</div>
          <div style={S.cardBox}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              {!editAlegrias && (
                <div style={{display:"flex",flexWrap:"wrap",gap:6,flex:1}}>
                  {perfil.alegrias.map((a,i)=>(
                    <span key={i} style={{background:"#EFF6FF",color:C.primary,borderRadius:6,padding:"4px 10px",fontSize:".82rem",fontWeight:500}}>{a}</span>
                  ))}
                </div>
              )}
              <button onClick={()=>{setDraftAlegrias(perfil.alegrias.join("\n"));setEditAlegrias(!editAlegrias);}} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 10px",fontSize:".75rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:C.textSoft,flexShrink:0,marginLeft:8}}>{editAlegrias?"Cancelar":"Editar"}</button>
            </div>
            {editAlegrias && (
              <>
                <textarea value={draftAlegrias} onChange={e=>setDraftAlegrias(e.target.value)} style={{...S.inp,resize:"none",minHeight:100,lineHeight:1.8,marginBottom:10,marginTop:8}} placeholder={"Una por línea"} />
                <button onClick={saveAlegrias} style={{...S.bigGreenBtn,background:color,padding:10}}>Guardar</button>
              </>
            )}
          </div>

          {/* Temas sensibles */}
          <div style={{fontSize:".68rem",fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>Temas sensibles</div>
          <div style={S.cardBox}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              {!editSensibles && (
                <div style={{flex:1}}>
                  {perfil.sensibles.map((s,i)=>(
                    <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:i<perfil.sensibles.length-1?8:0}}>
                      <div style={{width:6,height:6,borderRadius:"50%",background:"#F59E0B",marginTop:6,flexShrink:0}} />
                      <div style={{fontSize:".84rem",fontWeight:500,color:C.textMed,lineHeight:1.5}}>{s}</div>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={()=>{setDraftSensibles(perfil.sensibles.join("\n"));setEditSensibles(!editSensibles);}} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 10px",fontSize:".75rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:C.textSoft,flexShrink:0,marginLeft:8}}>{editSensibles?"Cancelar":"Editar"}</button>
            </div>
            {editSensibles && (
              <>
                <textarea value={draftSensibles} onChange={e=>setDraftSensibles(e.target.value)} style={{...S.inp,resize:"none",minHeight:100,lineHeight:1.8,marginBottom:10,marginTop:8}} placeholder={"Uno por línea"} />
                <button onClick={saveSensibles} style={{...S.bigGreenBtn,background:color,padding:10}}>Guardar</button>
              </>
            )}
          </div>

          {/* Recuerdos */}
          <div style={{fontSize:".68rem",fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>Recuerdos</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
            {perfil.recuerdos.map(r=>(
              <div key={r.id} style={{background:"white",borderRadius:8,border:`1px solid ${C.border}`,padding:"12px 14px",display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{width:40,height:40,borderRadius:8,background:"#F9FAFB",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",flexShrink:0}}>{r.emoji}</div>
                <div style={{flex:1}}>
                  {r.anio && <div style={{fontSize:".7rem",fontWeight:700,color:C.primary,background:"#EFF6FF",borderRadius:4,padding:"2px 6px",display:"inline-block",marginBottom:4}}>{r.anio}</div>}
                  <div style={{fontSize:".85rem",fontWeight:500,color:C.text,lineHeight:1.5}}>{r.texto}</div>
                </div>
              </div>
            ))}
            <button onClick={()=>setShowAddRecuerdo(true)} style={{background:"white",border:`1.5px dashed ${C.border}`,borderRadius:8,padding:"12px",display:"flex",alignItems:"center",justifyContent:"center",gap:8,cursor:"pointer",fontSize:".85rem",fontWeight:600,color:C.textSoft,fontFamily:"inherit"}}>+ Agregar recuerdo</button>
          </div>

          {/* Modal agregar persona */}
          {showAddPersona && (
            <div style={S.overlay} onClick={()=>setShowAddPersona(false)}>
              <div style={S.modal} onClick={e=>e.stopPropagation()}>
                <div style={S.modalTitle}>👤 Agregar persona querida</div>
                <div style={S.fg}><label style={S.lbl}>Nombre *</label><input style={S.inp} value={newPNombre} onChange={e=>setNewPNombre(e.target.value)} placeholder="Ej: Roberto" /></div>
                <div style={S.fg}><label style={S.lbl}>Relación</label><input style={S.inp} value={newPRelacion} onChange={e=>setNewPRelacion(e.target.value)} placeholder="Ej: Esposo, Nieto..." /></div>
                <div style={S.fg}><label style={S.lbl}>Descripción para Martita</label><textarea style={{...S.inp,resize:"none",minHeight:80}} value={newPDesc} onChange={e=>setNewPDesc(e.target.value)} placeholder="Cómo es la relación..." /></div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                  <div><div style={{fontSize:".88rem",fontWeight:600}}>Tema sensible</div><div style={{fontSize:".72rem",color:C.textSoft}}>Martita manejará con cuidado</div></div>
                  <Toggle on={newPSensible} onChange={setNewPSensible} color={color} />
                </div>
                <button onClick={addPersona} style={{...S.bigGreenBtn,background:color}}>Agregar</button>
                <button onClick={()=>setShowAddPersona(false)} style={{width:"100%",background:"none",border:"none",color:C.textSoft,fontWeight:600,cursor:"pointer",padding:10,fontFamily:"inherit",fontSize:".9rem"}}>Cancelar</button>
              </div>
            </div>
          )}

          {/* Modal agregar recuerdo */}
          {showAddRecuerdo && (
            <div style={S.overlay} onClick={()=>setShowAddRecuerdo(false)}>
              <div style={S.modal} onClick={e=>e.stopPropagation()}>
                <div style={S.modalTitle}>⭐ Agregar recuerdo</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div style={S.fg}><label style={S.lbl}>Año</label><input style={S.inp} value={newRAnio} onChange={e=>setNewRAnio(e.target.value)} placeholder="Ej: 1985" /></div>
                  <div style={S.fg}><label style={S.lbl}>Emoji</label>
                    <select style={{...S.inp,cursor:"pointer"}} value={newREmoji} onChange={e=>setNewREmoji(e.target.value)}>
                      {["⭐","💒","🏖️","👩‍🏫","🌱","❤️","🎂","🏠","🎵","✈️","🌸","📸"].map(e=><option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                </div>
                <div style={S.fg}><label style={S.lbl}>El recuerdo *</label><textarea style={{...S.inp,resize:"none",minHeight:100}} value={newRTexto} onChange={e=>setNewRTexto(e.target.value)} placeholder="Describí el momento..." /></div>
                <button onClick={addRecuerdo} style={{...S.bigGreenBtn,background:color}}>Guardar</button>
                <button onClick={()=>setShowAddRecuerdo(false)} style={{width:"100%",background:"none",border:"none",color:C.textSoft,fontWeight:600,cursor:"pointer",padding:10,fontFamily:"inherit",fontSize:".9rem"}}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CONTACTOS ── */}
      {tab==="contactos" && (
        <div style={S.scrollBody}>
          <div style={{background:"#EFF6FF",borderRadius:8,padding:"12px 14px",marginBottom:14,fontSize:".82rem",color:C.primary,fontWeight:500}}>
            📞 Cargá los teléfonos para que Martita pueda llamarlos en emergencias.
          </div>
          {contactos.map(c=>(
            <div key={c.id} style={S.cardBox}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <img src={c.avatar} style={{width:52,height:52,borderRadius:"50%",objectFit:"cover",objectPosition:"top"}} onError={e=>e.target.style.background="#eee"} />
                <div>
                  <div style={{fontWeight:700,fontSize:"1rem"}}>{c.nombre}</div>
                  <div style={{fontSize:".78rem",color:C.textSoft,marginTop:2}}>{c.rel}</div>
                </div>
              </div>
              <div style={S.fg}>
                <label style={S.lbl}>Número de teléfono</label>
                <input
                  style={{...S.inp,borderColor:contactVals[c.id]?C.primary:C.border,fontSize:"1rem",letterSpacing:".03em"}}
                  value={contactVals[c.id]||""}
                  onChange={e=>setContactVals(prev=>({...prev,[c.id]:e.target.value}))}
                  onBlur={()=>handleContactBlur(c.id)}
                  placeholder="+54 9 11 XXXX-XXXX"
                  type="tel" inputMode="tel"
                />
              </div>
              {contactVals[c.id] && (
                <a href={`tel:${contactVals[c.id]}`} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:color,color:"white",borderRadius:8,padding:"10px",textDecoration:"none",fontWeight:600,fontSize:".9rem"}}>
                  📞 Probar llamada a {c.nombre}
                </a>
              )}
            </div>
          ))}
          <div style={{...S.cardBox,background:C.bg,border:`1px dashed ${C.border}`}}>
            <div style={{fontSize:".83rem",fontWeight:600,color:C.textSoft,lineHeight:1.6}}>
              💡 Cuando Norma diga "me siento mal", Martita llama a {contactos[0]?.nombre || "Valeria"} automáticamente.
            </div>
          </div>
        </div>
      )}

      {/* ── DISPOSITIVOS ── */}
      {tab==="dispositivos" && (
        <div style={S.scrollBody}>
          <div style={{display:"flex",gap:10,marginBottom:14}}>
            <div style={{flex:1,background:"white",borderRadius:8,padding:"12px 14px",border:`1px solid ${C.border}`}}>
              <div style={{fontSize:"1.5rem",fontWeight:700,color:C.primary}}>{devs.filter(d=>d.estado==="conectado").length}</div>
              <div style={{fontSize:".72rem",color:C.textSoft,marginTop:2}}>Conectados</div>
            </div>
            <div style={{flex:1,background:"white",borderRadius:8,padding:"12px 14px",border:`1px solid ${C.border}`}}>
              <div style={{fontSize:"1.5rem",fontWeight:700,color:C.textMuted}}>{devs.filter(d=>d.estado!=="conectado").length}</div>
              <div style={{fontSize:".72rem",color:C.textSoft,marginTop:2}}>Sin conectar</div>
            </div>
            <div style={{flex:1,background:"white",borderRadius:8,padding:"12px 14px",border:`1px solid ${C.border}`}}>
              <div style={{fontSize:"1.5rem",fontWeight:700,color:C.success}}>{devs.filter(d=>d.alertas).length}</div>
              <div style={{fontSize:".72rem",color:C.textSoft,marginTop:2}}>Con alertas</div>
            </div>
          </div>
          {devs.map(d=>(
            <div key={d.id} style={{background:"white",borderRadius:8,border:`1px solid ${d.estado==="conectado"?C.border:C.border}`,marginBottom:8,overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px",cursor:"pointer"}} onClick={()=>toggleDev(d.id)}>
                <div style={{width:40,height:40,borderRadius:8,background:d.estado==="conectado"?"#EFF6FF":"#F9FAFB",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${C.border}`,fontSize:"1.2rem"}}>
                  {d.id==="sensor"?"📡":d.id==="camara"?"📷":d.id==="smarttv"?"📺":d.id==="applewatch"?"⌚":d.id==="appletv"?"🎬":d.id==="alexa"?"🔊":"🏠"}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:".9rem",fontWeight:600,color:C.text}}>{d.nombre}</div>
                  <div style={{fontSize:".72rem",color:C.textSoft,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.marca}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                  <div style={{background:d.estado==="conectado"?"#F0FDF4":"#FEF2F2",color:d.estado==="conectado"?C.success:C.danger,borderRadius:20,padding:"3px 10px",fontSize:".68rem",fontWeight:600}}>
                    {d.estado==="conectado"?"Conectado":"Sin conectar"}
                  </div>
                  <div style={{color:C.textMuted,fontSize:".9rem"}}>{d.expanded?"▲":"▼"}</div>
                </div>
              </div>
              {d.expanded && (
                <div style={{borderTop:`1px solid ${C.border}`,padding:"14px",background:"#FAFAFA"}}>
                  <div style={{fontSize:".82rem",color:C.textMed,marginBottom:12,lineHeight:1.5}}>{d.desc}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div>
                        <div style={{fontSize:".85rem",fontWeight:600}}>Estado de conexión</div>
                        <div style={{fontSize:".72rem",color:C.textSoft}}>{d.estado==="conectado"?"Activo y recibiendo datos":"Sin conectar"}</div>
                      </div>
                      <Toggle on={d.estado==="conectado"} onChange={()=>toggleDevEstado(d.id)} color={C.primary} />
                    </div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div>
                        <div style={{fontSize:".85rem",fontWeight:600}}>Alertas activas</div>
                        <div style={{fontSize:".72rem",color:C.textSoft}}>Notificar ante anomalías</div>
                      </div>
                      <Toggle on={d.alertas} onChange={()=>toggleDevAlertas(d.id)} color={C.primary} />
                    </div>
                  </div>
                  {/* SwitchBot config fields — only for sensor */}
                  {d.id === "sensor" && <SwitchBotConfig sensorData={sensorData} color={color} />}

                  <div style={{fontSize:".72rem",fontWeight:700,color:C.textMuted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:8,marginTop:8}}>Pasos de configuración</div>
                  {d.pasos.map((paso,i)=>(
                    <div key={i} style={{display:"flex",gap:10,marginBottom:8}}>
                      <div style={{width:22,height:22,borderRadius:"50%",background:C.primary,color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".72rem",fontWeight:700,flexShrink:0}}>{i+1}</div>
                      <div style={{fontSize:".82rem",color:C.textMed,lineHeight:1.5}}>{paso}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div style={{background:C.bg,border:`1px dashed ${C.border}`,borderRadius:8,padding:"12px 14px"}}>
            <div style={{fontSize:".8rem",color:C.textSoft,lineHeight:1.6}}>💡 Los datos son privados y solo visibles para la familia.</div>
          </div>
        </div>
      )}

      {/* ── ALERTAS ── */}
      {tab==="alertas" && (
        <div style={S.scrollBody}>

          {/* ALERTAS DE MARTITA — señales sutiles detectadas en conversación */}
          {martitaAlertas.length > 0 && (
            <div style={{background:"#FFF7ED",border:"2px solid #FCD34D",borderRadius:12,
              padding:"14px 16px",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{fontSize:"1.2rem"}}>🤝</div>
                <div>
                  <div style={{fontSize:".92rem",fontWeight:700,color:"#92400E"}}>
                    Martita detectó algo
                  </div>
                  <div style={{fontSize:".72rem",color:"#B45309",fontWeight:500}}>
                    Señales que notó durante las conversaciones con Norma
                  </div>
                </div>
                <button onClick={()=>{
                  setMartitaAlertas([]);
                  try{localStorage.removeItem("martita_alertas");}catch(e){}
                }} style={{marginLeft:"auto",background:"none",border:"none",
                  color:"#B45309",cursor:"pointer",fontSize:".75rem",fontWeight:600,
                  fontFamily:"inherit"}}>
                  Limpiar
                </button>
              </div>
              {martitaAlertas.slice(0,5).map((a,i)=>(
                <div key={a.id} style={{display:"flex",gap:10,padding:"8px 0",
                  borderBottom:i<Math.min(martitaAlertas.length,5)-1?"1px solid #FDE68A":"none",
                  alignItems:"flex-start"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:"#F59E0B",
                    flexShrink:0,marginTop:5}} />
                  <div style={{flex:1}}>
                    <div style={{fontSize:".85rem",fontWeight:600,color:"#78350F",
                      lineHeight:1.4}}>{a.texto}</div>
                    <div style={{fontSize:".7rem",color:"#B45309",marginTop:2}}>
                      {a.fecha} · {a.hora} hs
                    </div>
                  </div>
                </div>
              ))}
              {martitaAlertas.length > 5 && (
                <div style={{fontSize:".72rem",color:"#B45309",marginTop:8,fontWeight:600,textAlign:"center"}}>
                  +{martitaAlertas.length - 5} alertas anteriores
                </div>
              )}
            </div>
          )}

          <div style={S.cardBox}>
            {[
              {titulo:"No se despertó a la hora habitual", sub:"Alerta si no hay movimiento antes de las 10:00 hs"},
              {titulo:"Medicación no tomada", sub:"Aviso 30 min después de la hora programada"},
              {titulo:"No contesta llamadas", sub:"Alerta si no atiende 2 llamadas seguidas"},
              {titulo:"Reporte diario de Martita", sub:"Resumen completo a las 21:00 hs"},
            ].map((t,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:i<3?"1px solid #F3F4F6":"none"}}>
                <div style={{flex:1,paddingRight:12}}>
                  <div style={{fontSize:".88rem",fontWeight:700}}>{t.titulo}</div>
                  <div style={{fontSize:".72rem",color:"#6B7280",fontWeight:600,marginTop:2}}>{t.sub}</div>
                </div>
                <Toggle on={alertToggles[i]} onChange={v=>setAlertToggles(prev=>prev.map((x,j)=>j===i?v:x))} color={color} />
              </div>
            ))}
          </div>
          <div style={S.cardBox}>
            <div style={{fontWeight:700,fontSize:".88rem",marginBottom:12}}>Historial de hoy</div>
            {ACTIVIDAD.map((a,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",borderBottom:i<ACTIVIDAD.length-1?"1px solid #F3F4F6":"none"}}>
                <div style={{width:9,height:9,borderRadius:"50%",background:a.tipo==="ok"?C.success:a.tipo==="warn"?C.warn:C.danger,flexShrink:0,marginTop:4}} />
                <div style={{flex:1}}>
                  <div style={{fontSize:".85rem",fontWeight:700}}>{a.texto}</div>
                  <div style={{fontSize:".7rem",color:"#6B7280",marginTop:1}}>{a.hora} hs</div>
                </div>
              </div>
            ))}
          </div>
          <ApiKeyConfig color={color} />
        </div>
      )}

      {/* ── FOTOS ── */}
      {tab==="fotos" && (
        <div style={S.scrollBody}>
          {/* Upload nueva foto */}
          <div style={{...S.cardBox,marginBottom:14}}>
            <div style={{fontWeight:700,fontSize:".88rem",marginBottom:4}}>Álbum familiar de Norma</div>
            <div style={{fontSize:".78rem",color:C.textSoft,marginBottom:12}}>
              Las fotos que subas las puede ver Norma desde su pantalla.
            </div>
            <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,
              background:color,color:"white",borderRadius:10,padding:"13px",
              cursor:"pointer",fontWeight:700,fontSize:".95rem"}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              Subir fotos
              <input type="file" accept="image/*" multiple style={{display:"none"}}
                onChange={e=>{
                  const files = Array.from(e.target.files);
                  if (!files.length) return;
                  const subioPor = (hijaData?.nombre||hija).charAt(0).toUpperCase()+(hijaData?.nombre||hija).slice(1);
                  const anio = new Date().getFullYear().toString();
                  let loaded = [];
                  let pending = files.length;
                  files.forEach((file, idx) => {
                    const reader = new FileReader();
                    reader.onload = ev => {
                      loaded.push({
                        id: Date.now() + idx,
                        url: ev.target.result,
                        titulo: file.name.replace(/[.][^.]+$/,"").replace(/[-_]/g," "),
                        anio,
                        subidaPor: subioPor,
                        posicion: "center center"
                      });
                      pending--;
                      if (pending === 0) {
                        setPerfil(p=>({...p, fotos:[...loaded.reverse(),...(p.fotos||[])]}));
                      }
                    };
                    reader.readAsDataURL(file);
                  });
                  e.target.value = "";
                }}
              />
            </label>
            <div style={{fontSize:".72rem",color:C.textMuted,textAlign:"center",marginTop:8}}>
              Podés seleccionar varias fotos a la vez · También podés pegar una URL abajo
            </div>
          </div>

          {/* Agregar por URL */}
          <div style={{...S.cardBox,marginBottom:14}}>
            <div style={{fontWeight:600,fontSize:".85rem",marginBottom:10}}>Agregar por URL</div>
            <div style={S.fg}>
              <label style={S.lbl}>URL de la imagen</label>
              <input style={S.inp} value={fotoUrlInput} onChange={e=>setFotoUrlInput(e.target.value)}
                placeholder="https://..." />
            </div>
            <div style={S.fg}>
              <label style={S.lbl}>Título</label>
              <input style={S.inp} value={fotoTituloInput} onChange={e=>setFotoTituloInput(e.target.value)}
                placeholder="Ej: Cumpleaños de Sofía" />
            </div>
            <button onClick={()=>{
              if (!fotoUrlInput) return;
              const nueva = { id:Date.now(), url:fotoUrlInput,
                titulo:fotoTituloInput||"Sin título",
                anio:new Date().getFullYear().toString(),
                subidaPor:(hijaData?.nombre||hija).charAt(0).toUpperCase()+(hijaData?.nombre||hija).slice(1),
                posicion:"center center" };
              setPerfil(p=>({...p, fotos:[nueva,...(p.fotos||[])]}));
              setFotoUrlInput(""); setFotoTituloInput("");
            }} style={{...S.bigGreenBtn,background:color,padding:10}}>
              Agregar foto
            </button>
          </div>

          {/* Galería */}
          {(!perfil.fotos||perfil.fotos.length===0) ? (
            <div style={{textAlign:"center",padding:"30px 20px",color:C.textSoft}}>
              <div style={{fontSize:"2.5rem",marginBottom:10}}>📷</div>
              <div style={{fontSize:".9rem",fontWeight:600}}>Todavía no hay fotos</div>
              <div style={{fontSize:".8rem",marginTop:4}}>Subí la primera foto para Norma</div>
            </div>
          ) : (
            <div>
              <div style={{fontSize:".75rem",fontWeight:700,color:C.textMuted,textTransform:"uppercase",
                letterSpacing:".08em",marginBottom:10}}>
                {perfil.fotos.length} foto{perfil.fotos.length!==1?"s":""} en el álbum
              </div>
              {perfil.fotos.map((f,i)=>(
                <div key={f.id} style={{marginBottom:14,borderRadius:12,overflow:"hidden",
                  border:`1px solid ${C.border}`,background:"white",
                  boxShadow:"0 2px 12px rgba(0,0,0,.07)"}}>

                  {/* Foto con posicion aplicada */}
                  <div style={{position:"relative",height:200,overflow:"hidden",background:"#f3f4f6"}}>
                    <img src={f.url}
                      style={{width:"100%",height:"100%",objectFit:"cover",
                        objectPosition: f.posicion || "center center",display:"block"}}
                      onError={e=>{e.target.style.background="#f3f4f6";e.target.style.display="none";}} />
                  </div>

                  <div style={{padding:"10px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                      <div>
                        <div style={{fontSize:".88rem",fontWeight:700,color:C.text}}>{f.titulo}</div>
                        <div style={{fontSize:".72rem",color:C.textSoft,marginTop:2}}>
                          {f.anio} · Subida por {f.subidaPor}
                        </div>
                      </div>
                      <button onClick={()=>setPerfil(p=>({...p,fotos:p.fotos.filter(x=>x.id!==f.id)}))}
                        style={{background:"#FEF2F2",border:"none",color:C.danger,borderRadius:8,
                          padding:"6px 10px",cursor:"pointer",fontSize:".8rem",fontWeight:700,fontFamily:"inherit"}}>
                        Eliminar
                      </button>
                    </div>

                    {/* Control de encuadre — grilla de 9 puntos */}
                    <div style={{borderTop:`1px solid ${C.border}`,paddingTop:10}}>
                      <div style={{fontSize:".7rem",fontWeight:600,color:C.textSoft,
                        marginBottom:8,textTransform:"uppercase",letterSpacing:".06em"}}>
                        Encuadre de la foto
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4,width:100}}>
                        {[
                          ["top left","↖"],["top center","↑"],["top right","↗"],
                          ["center left","←"],["center center","·"],["center right","→"],
                          ["bottom left","↙"],["bottom center","↓"],["bottom right","↘"],
                        ].map(([pos, icon])=>(
                          <button key={pos}
                            onClick={()=>setPerfil(p=>({...p,
                              fotos:p.fotos.map(x=>x.id===f.id?{...x,posicion:pos}:x)}))}
                            style={{
                              width:30,height:30,borderRadius:6,
                              border:`2px solid ${(f.posicion||"center center")===pos?color:C.border}`,
                              background:(f.posicion||"center center")===pos?color:"white",
                              color:(f.posicion||"center center")===pos?"white":C.textSoft,
                              fontSize:".85rem",cursor:"pointer",display:"flex",
                              alignItems:"center",justifyContent:"center",fontFamily:"inherit",
                              transition:"all .15s"
                            }}>
                            {icon}
                          </button>
                        ))}
                      </div>
                      <div style={{fontSize:".68rem",color:C.textMuted,marginTop:6}}>
                        Tocá para ajustar qué parte de la foto se ve
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MODAL MEDICACIÓN ── */}
      {showAddMed && (
        <div style={S.overlay} onClick={()=>setShowAddMed(false)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={S.modalTitle}>💊 Agregar medicación</div>
            <div style={S.fg}><label style={S.lbl}>Medicamento *</label><input style={S.inp} value={newMedNombre} onChange={e=>setNewMedNombre(e.target.value)} placeholder="Ej: Enalapril 10mg" autoFocus /></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div style={S.fg}><label style={S.lbl}>Hora</label><input style={S.inp} type="time" value={newMedHora} onChange={e=>setNewMedHora(e.target.value)} /></div>
              <div style={S.fg}><label style={S.lbl}>Descripción</label><input style={S.inp} value={newMedDesc} onChange={e=>setNewMedDesc(e.target.value)} placeholder="Ej: 1 comp." /></div>
            </div>
            <button onClick={addMed} style={{...S.bigGreenBtn,background:color}}>Guardar</button>
            <button onClick={()=>setShowAddMed(false)} style={{width:"100%",background:"none",border:"none",color:C.textSoft,fontWeight:600,cursor:"pointer",padding:10,fontFamily:"inherit",fontSize:".9rem"}}>Cancelar</button>
          </div>
        </div>
      )}

      {/* ── MODAL TURNO ── */}
      {showAddTurno && (
        <div style={S.overlay} onClick={()=>setShowAddTurno(false)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={S.modalTitle}>📅 Agregar turno</div>
            <div style={S.fg}><label style={S.lbl}>Especialidad *</label><input style={S.inp} value={newTurnoNombre} onChange={e=>setNewTurnoNombre(e.target.value)} placeholder="Ej: Traumatólogo · Dra. Salinas" autoFocus /></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div style={S.fg}><label style={S.lbl}>Fecha *</label><input style={S.inp} type="date" value={newTurnoFecha} onChange={e=>setNewTurnoFecha(e.target.value)} /></div>
              <div style={S.fg}><label style={S.lbl}>Hora</label><input style={S.inp} type="time" value={newTurnoHora} onChange={e=>setNewTurnoHora(e.target.value)} /></div>
            </div>
            <div style={S.fg}><label style={S.lbl}>Instrucciones</label><input style={S.inp} value={newTurnoDirec} onChange={e=>setNewTurnoDirec(e.target.value)} placeholder="Ej: Ir en ayunas" /></div>
            <button onClick={addTurno} style={{...S.bigGreenBtn,background:color}}>Guardar</button>
            <button onClick={()=>setShowAddTurno(false)} style={{width:"100%",background:"none",border:"none",color:C.textSoft,fontWeight:600,cursor:"pointer",padding:10,fontFamily:"inherit",fontSize:".9rem"}}>Cancelar</button>
          </div>
        </div>
      )}

    </div>
  );
}


// -- SWITCHBOT SENSOR CONFIG --
function SwitchBotConfig({ sensorData, color }) {
  const [token,    setToken]    = useState(() => localStorage.getItem("switchbot_token")  || "");
  const [deviceId, setDeviceId] = useState(() => localStorage.getItem("switchbot_device") || "");
  const [saved,    setSaved]    = useState(!!(localStorage.getItem("switchbot_token") && localStorage.getItem("switchbot_device")));
  const [testing,  setTesting]  = useState(false);
  const [testMsg,  setTestMsg]  = useState("");
  const [showHelp, setShowHelp] = useState(false);

  function save() {
    if (!token.trim() || !deviceId.trim()) return;
    localStorage.setItem("switchbot_token",  token.trim());
    localStorage.setItem("switchbot_device", deviceId.trim());
    setSaved(true); setTestMsg("");
  }

  function clear() {
    localStorage.removeItem("switchbot_token");
    localStorage.removeItem("switchbot_device");
    setToken(""); setDeviceId(""); setSaved(false); setTestMsg("");
  }

  async function testConnection() {
    const t = token.trim() || localStorage.getItem("switchbot_token") || "";
    const d = deviceId.trim() || localStorage.getItem("switchbot_device") || "";
    if (!t || !d) { setTestMsg("Ingresá el token y el Device ID primero"); return; }
    setTesting(true); setTestMsg("");
    try {
      const res = await fetch(
        `https://api.switch-bot.com/v1.1/devices/${d}/status`,
        { headers: { "Authorization": t, "Content-Type": "application/json" } }
      );
      const data = await res.json();
      if (data.statusCode === 100) {
        const move = data.body?.moveDetected === true || data.body?.movement === true;
        setTestMsg(`✓ Conectado. Movimiento: ${move ? "Detectado ahora" : "Sin movimiento reciente"}`);
      } else {
        setTestMsg(`Error ${data.statusCode}: ${data.message || "Token o Device ID incorrecto"}`);
      }
    } catch(e) {
      setTestMsg("No se pudo conectar — revisá el token");
    }
    setTesting(false);
  }

  return (
    <div style={{background:"#EFF6FF",borderRadius:10,padding:"14px",marginBottom:14,border:"1px solid #DBEAFE"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <div>
          <div style={{fontSize:".88rem",fontWeight:700,color:C.primary}}>
            🔗 Conectar SwitchBot
          </div>
          <div style={{fontSize:".72rem",color:C.textSoft,marginTop:2}}>
            {saved ? "✓ Configurado — datos en tiempo real" : "Sin configurar — usando datos de ejemplo"}
          </div>
        </div>
        {saved && (
          <div style={{background:C.successL,color:C.success,borderRadius:6,
            padding:"3px 10px",fontSize:".68rem",fontWeight:700}}>En vivo</div>
        )}
      </div>

      {/* Estado actual si está conectado */}
      {sensorData?.conectado && (
        <div style={{background:"white",borderRadius:8,padding:"10px 12px",marginBottom:10,
          display:"flex",gap:10,alignItems:"center"}}>
          <div style={{fontSize:"1.3rem"}}>{sensorData.activa ? "🟢" : "🟡"}</div>
          <div>
            <div style={{fontSize:".82rem",fontWeight:700,color:C.text}}>
              Norma {sensorData.activa ? "está activa" : "sin movimiento reciente"}
            </div>
            {sensorData.ultimoMovimiento && (
              <div style={{fontSize:".7rem",color:C.textSoft,marginTop:1}}>
                Último movimiento: {sensorData.ultimoMovimiento} hs
              </div>
            )}
          </div>
        </div>
      )}

      {/* Help */}
      <button onClick={()=>setShowHelp(!showHelp)} style={{
        background:"none",border:"none",color:C.primary,fontSize:".78rem",
        fontWeight:600,cursor:"pointer",fontFamily:"inherit",
        padding:0,marginBottom:10,display:"block"}}>
        {showHelp ? "▲ Ocultar instrucciones" : "▼ ¿Cómo obtener el Token y Device ID?"}
      </button>

      {showHelp && (
        <div style={{background:"white",borderRadius:8,padding:"12px",marginBottom:10,
          fontSize:".78rem",color:C.textMed,lineHeight:1.7}}>
          <div style={{fontWeight:700,color:C.text,marginBottom:6}}>Pasos en 5 minutos:</div>
          <div><b>1.</b> Instalá la app <b>SwitchBot</b> en tu celular</div>
          <div><b>2.</b> Configurá el sensor y el Hub Mini</div>
          <div><b>3.</b> En la app → Perfil → Preferencias → Token de API → <b>Copiar Token</b></div>
          <div><b>4.</b> En la app → tu sensor → pegá el nombre o ID del dispositivo</div>
          <div style={{marginTop:8,padding:"8px",background:"#FFF7ED",borderRadius:6,color:"#92400E",fontWeight:500}}>
            💡 El Token es una cadena larga tipo "eyJ0eXAi...". El Device ID es algo como "ABCDE12345".
          </div>
        </div>
      )}

      {/* Inputs */}
      <div style={{marginBottom:10}}>
        <label style={S.lbl}>Token de API</label>
        <input
          value={token}
          onChange={e=>{setToken(e.target.value);setSaved(false);}}
          placeholder="eyJ0eXAiOiJKV1QiLCJhbGci..."
          type="password"
          style={{...S.inp,fontFamily:"monospace",fontSize:".82rem"}}
        />
      </div>
      <div style={{marginBottom:12}}>
        <label style={S.lbl}>Device ID del sensor</label>
        <input
          value={deviceId}
          onChange={e=>{setDeviceId(e.target.value);setSaved(false);}}
          placeholder="ABCDE12345"
          style={{...S.inp,fontFamily:"monospace",fontSize:".9rem"}}
        />
      </div>

      {/* Botones */}
      <div style={{display:"flex",gap:8}}>
        <button onClick={save} disabled={!token.trim()||!deviceId.trim()||saved}
          style={{flex:1,background:(!token.trim()||!deviceId.trim()||saved)?C.border:C.primary,
            color:(!token.trim()||!deviceId.trim()||saved)?C.textSoft:"white",
            border:"none",borderRadius:8,padding:"10px",fontFamily:"inherit",
            fontSize:".85rem",fontWeight:600,cursor:"pointer"}}>
          {saved ? "✓ Guardado" : "Guardar"}
        </button>
        <button onClick={testConnection} disabled={testing}
          style={{flex:1,background:"white",border:`1px solid ${C.border}`,color:C.textMed,
            borderRadius:8,padding:"10px",fontFamily:"inherit",
            fontSize:".85rem",fontWeight:600,cursor:"pointer"}}>
          {testing ? "Probando..." : "▶ Probar"}
        </button>
        {saved && (
          <button onClick={clear}
            style={{background:"none",border:`1px solid ${C.border}`,color:C.danger,
              borderRadius:8,padding:"10px 12px",fontFamily:"inherit",
              fontSize:".85rem",fontWeight:600,cursor:"pointer"}}>×</button>
        )}
      </div>

      {testMsg && (
        <div style={{marginTop:10,padding:"8px 12px",borderRadius:8,fontSize:".8rem",fontWeight:600,
          background:testMsg.startsWith("✓")?C.successL:C.dangerL,
          color:testMsg.startsWith("✓")?C.success:C.danger}}>
          {testMsg}
        </div>
      )}
    </div>
  );
}

function ConfigPanelApp({ T: _Tbase, F, themeConfig, contactos, setContactos, onClose }) {
  const _ac = themeConfig.appColor || null;
  const T = _ac ? {..._Tbase, primary:_ac, tabBg:_ac, navBg:_ac} : _Tbase;
  const {
    preset, setPreset, fontId, setFontId, iconId, setIconId,
    shapeId, setShapeId, textureId, setTextureId,
    btnLabel, setBtnLabel, userName, setUserName, navLabels, setNavLabels
  } = themeConfig;

  const [tab, setTab] = useState("tema");

  // Color picker state — must be at top level of ConfigPanelApp
  function hexToHslFn(hex) {
    let r=parseInt(hex.slice(1,3),16)/255,g=parseInt(hex.slice(3,5),16)/255,b=parseInt(hex.slice(5,7),16)/255;
    const max=Math.max(r,g,b),min=Math.min(r,g,b);let h,s,l=(max+min)/2;
    if(max===min){h=s=0;}else{const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);
      switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;default:h=(r-g)/d+4;}h/=6;}
    return [Math.round(h*360),Math.round(s*100),Math.round(l*100)];
  }
  function hslToHexFn(h,s,l){
    s/=100;l/=100;const a=s*Math.min(l,1-l);
    const f=n=>{const k=(n+h/30)%12;return l-a*Math.max(Math.min(k-3,9-k,1),-1);};
    const x=v=>Math.round(v*255).toString(16).padStart(2,'0');
    return `#${x(f(0))}${x(f(8))}${x(f(4))}`;
  }
  const initColor = themeConfig.appColor || "#1B4F8A";
  const [colorHsl, setColorHsl] = useState(()=>hexToHslFn(initColor));
  const [colorHex, setColorHex] = useState(initColor);
  function applyColorHsl(h,s,l){const c=hslToHexFn(h,s,l);setColorHsl([h,s,l]);setColorHex(c);themeConfig.setAppColor(c);}
  function applyColorHex(val){setColorHex(val);if(/^#[0-9A-Fa-f]{6}$/.test(val)){setColorHsl(hexToHslFn(val));themeConfig.setAppColor(val);}}

  // PIN change state
  const [pinStep,    setPinStep]    = useState("idle"); // idle | new1 | new2
  const [pinNew1,    setPinNew1]    = useState("");
  const [pinNew2,    setPinNew2]    = useState("");
  const [pinMsg,     setPinMsg]     = useState("");
  const currentPin = () => (loadConfig()?.pin) || "1234";

  function handlePinChange(digit, step) {
    const val = step === 1 ? pinNew1 : pinNew2;
    const next = (val + digit).slice(0, 4);
    if (step === 1) {
      setPinNew1(next);
      if (next.length === 4) setPinStep("new2");
    } else {
      setPinNew2(next);
      if (next.length === 4) {
        if (next === pinNew1) {
          const cfg = loadConfig() || {};
          saveConfig({...cfg, pin: next});
          setPinMsg("✓ PIN guardado: " + next);
          setPinStep("idle"); setPinNew1(""); setPinNew2("");
        } else {
          setPinMsg("Los PINs no coinciden — intentá de nuevo");
          setPinStep("new1"); setPinNew1(""); setPinNew2("");
        }
      }
    }
  }

  function handlePinBackspace(step) {
    if (step === 1) setPinNew1(p => p.slice(0,-1));
    else setPinNew2(p => p.slice(0,-1));
    setPinMsg("");
  }

  const NAV_ICONS_SMALL = [
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v2"/><circle cx="17" cy="17" r="5"/><path d="M17 14v6M14 17h6"/></svg>,
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v5l3 3M12 12l-3 3"/></svg>,
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.6 1.32h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  ];

  return (
    <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",alignItems:"flex-end",justifyContent:"center",background:"rgba(0,0,0,.5)"}}
      onClick={onClose}>
      <div style={{background:T.surface,width:"100%",maxWidth:480,borderRadius:"20px 20px 0 0",
        maxHeight:"90dvh",overflowY:"auto",
        animation:"slideUp .3s ease"}} onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div style={{position:"sticky",top:0,background:T.surface,
          borderBottom:`1px solid ${T.border}`,padding:"16px 18px 0",zIndex:10}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div style={{fontFamily:F.display,fontSize:"1.3rem",fontWeight:700,color:T.text}}>
              ✦ Personalizar app
            </div>
            <button onClick={onClose} style={{background:T.bg,border:`1px solid ${T.border}`,
              borderRadius:"50%",width:34,height:34,cursor:"pointer",color:T.textSoft,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem"}}>×</button>
          </div>
          {/* Tabs */}
          <div style={{display:"flex"}}>
            {[{id:"tema",lbl:"Tema"},{id:"fuente",lbl:"Fuente"},{id:"boton",lbl:"Botón"},
              {id:"fondo",lbl:"Fondo"},{id:"textos",lbl:"Textos"}].map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{
                flex:1,padding:"8px 2px 10px",border:"none",background:"none",
                fontFamily:"inherit",fontSize:".72rem",fontWeight:tab===t.id?700:500,
                color:tab===t.id?T.primary:T.textSoft,cursor:"pointer",
                borderBottom:tab===t.id?`2px solid ${T.primary}`:"2px solid transparent"
              }}>{t.lbl}</button>
            ))}
          </div>
        </div>

        <div style={{padding:"18px 18px 40px"}}>

          {/* TEMA */}
          {tab==="tema" && (
            <div>
              {(()=>{
                // Use top-level state from ConfigPanelApp
                const currentColor = colorHex;
                const [H,S,L] = colorHsl;
                const previewBg = hslToHexFn(H, Math.max(S-40,5), Math.min(L+38,95));

                return (
                  <div>
                    {/* Live preview */}
                    <div style={{borderRadius:12,overflow:"hidden",marginBottom:20,
                      boxShadow:"0 4px 20px rgba(0,0,0,.15)"}}>

                      {/* Barra superior */}
                      <div style={{background:currentColor,padding:"11px 14px",
                        display:"flex",gap:6,alignItems:"center"}}>
                        {[userName||"Norma","Valeria","Romina"].map((n,i)=>(
                          <div key={i} style={{flex:1,textAlign:"center",fontSize:".7rem",
                            fontWeight:i===0?700:500,
                            color:i===0?"white":"rgba(255,255,255,.45)",
                            borderBottom:i===0?"2px solid white":"2px solid transparent",
                            paddingBottom:5}}>{n}</div>
                        ))}
                        <div style={{fontSize:".8rem",color:"rgba(255,255,255,.4)",paddingBottom:5}}>⚙️</div>
                      </div>

                      {/* App body preview */}
                      <div style={{background:previewBg,padding:"16px",
                        display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
                        <div style={{fontFamily:F.display,fontSize:"1.6rem",fontWeight:700,
                          color:currentColor}}>{userName||"Norma"}</div>
                        <div style={{width:60,height:60,borderRadius:"50%",background:currentColor,
                          display:"flex",alignItems:"center",justifyContent:"center",
                          fontSize:"1.4rem",boxShadow:`0 6px 20px ${currentColor}55`}}>🎙️</div>
                        <div style={{display:"flex",gap:6}}>
                          {[currentColor, hslToHexFn(H,Math.min(S+10,100),Math.max(L-10,20)),
                            hslToHexFn(H,30,75), hslToHexFn(H,20,88)].map((c,i)=>(
                            <div key={i} style={{width:24,height:7,borderRadius:4,background:c}}/>
                          ))}
                        </div>
                      </div>

                      {/* Bottom nav preview */}
                      <div style={{background:currentColor,padding:"10px",
                        display:"flex",justifyContent:"space-around"}}>
                        {["💊","📅","🎵","🏃","📷"].map((ic,i)=>(
                          <div key={i} style={{fontSize:"1.1rem",opacity:i===0?1:.5}}>{ic}</div>
                        ))}
                      </div>
                    </div>

                    {/* Tono */}
                    <div style={{fontSize:".7rem",fontWeight:700,color:T.textMuted,
                      textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>Tono</div>
                    <div style={{position:"relative",height:20,borderRadius:10,marginBottom:18,
                      background:"linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)",
                      cursor:"pointer",boxShadow:"inset 0 1px 3px rgba(0,0,0,.2)"}}
                      onClick={e=>{
                        const r=e.currentTarget.getBoundingClientRect();
                        applyColorHsl(Math.round(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*360),S,L);
                      }}>
                      <div style={{position:"absolute",top:-4,left:`calc(${(H/360)*100}% - 14px)`,
                        width:28,height:28,borderRadius:"50%",background:hslToHexFn(H,100,50),
                        border:"3px solid white",boxShadow:"0 2px 8px rgba(0,0,0,.35)",pointerEvents:"none"}}/>
                    </div>

                    {/* Saturación */}
                    <div style={{fontSize:".7rem",fontWeight:700,color:T.textMuted,
                      textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>Saturación</div>
                    <div style={{position:"relative",height:20,borderRadius:10,marginBottom:18,
                      background:`linear-gradient(to right,${hslToHexFn(H,0,L)},${hslToHexFn(H,100,L)})`,
                      cursor:"pointer",boxShadow:"inset 0 1px 3px rgba(0,0,0,.2)"}}
                      onClick={e=>{
                        const r=e.currentTarget.getBoundingClientRect();
                        applyColorHsl(H,Math.round(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*100),L);
                      }}>
                      <div style={{position:"absolute",top:-4,left:`calc(${S}% - 14px)`,
                        width:28,height:28,borderRadius:"50%",background:currentColor,
                        border:"3px solid white",boxShadow:"0 2px 8px rgba(0,0,0,.35)",pointerEvents:"none"}}/>
                    </div>

                    {/* Luminosidad */}
                    <div style={{fontSize:".7rem",fontWeight:700,color:T.textMuted,
                      textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>Luminosidad</div>
                    <div style={{position:"relative",height:20,borderRadius:10,marginBottom:18,
                      background:`linear-gradient(to right,#000,${hslToHexFn(H,S,50)},#fff)`,
                      cursor:"pointer",boxShadow:"inset 0 1px 3px rgba(0,0,0,.2)"}}
                      onClick={e=>{
                        const r=e.currentTarget.getBoundingClientRect();
                        applyColorHsl(H,S,Math.round(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*100));
                      }}>
                      <div style={{position:"absolute",top:-4,left:`calc(${L}% - 14px)`,
                        width:28,height:28,borderRadius:"50%",background:currentColor,
                        border:"3px solid white",boxShadow:"0 2px 8px rgba(0,0,0,.35)",pointerEvents:"none"}}/>
                    </div>

                    {/* Hex + muestra */}
                    <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16}}>
                      <div style={{width:44,height:44,borderRadius:10,background:colorHex,
                        flexShrink:0,border:`1px solid ${T.border}`,
                        boxShadow:`0 2px 8px ${currentColor}44`}}/>
                      <input value={colorHex} onChange={e=>applyColorHex(e.target.value)}
                        placeholder="#1B4F8A"
                        style={{...S.inp,fontFamily:"monospace",fontSize:"1rem",
                          letterSpacing:".06em",flex:1}}/>
                    </div>

                    {/* Colores rápidos */}
                    <div style={{fontSize:".7rem",fontWeight:700,color:T.textMuted,
                      textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>
                      Colores rápidos
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
                      {["#1B4F8A","#0F3D6B","#1565C0","#0288D1","#00838F",
                        "#2E7D32","#558B2F","#6A1B9A","#AD1457","#C62828",
                        "#E65100","#F57F17","#4E342E","#37474F","#212121",
                        "#455A64","#BF360C","#880E4F"].map(col=>(
                        <button key={col} onClick={()=>{
                          applyColorHex(col);
                        }} title={col} style={{
                          width:32,height:32,borderRadius:8,background:col,
                          border:currentColor===col?"3px solid white":"1.5px solid rgba(0,0,0,.12)",
                          cursor:"pointer",
                          boxShadow:currentColor===col?`0 0 0 2px ${col}`:"none",
                          transition:"all .12s"
                        }}/>
                      ))}
                    </div>

                    <button onClick={()=>{
                      applyColorHex("#1B4F8A");
                    }} style={{background:"none",border:`1px solid ${T.border}`,borderRadius:8,
                      padding:"8px 16px",fontSize:".8rem",fontWeight:600,
                      color:T.textSoft,cursor:"pointer",fontFamily:"inherit"}}>
                      Restablecer azul original
                    </button>
                  </div>
                );
              })()}
            </div>
          )}
          {/* FUENTE */}
          {tab==="fuente" && (
            <div>
              <ConfigSectionTitle T={T} F={F}>Tipografía</ConfigSectionTitle>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {FONTS.map(f=>(
                  <button key={f.id} onClick={()=>setFontId(f.id)} style={{
                    background:fontId===f.id?T.primary:T.bg,
                    border:`1.5px solid ${fontId===f.id?T.primary:T.border}`,
                    borderRadius:10,padding:"14px 16px",cursor:"pointer",
                    display:"flex",alignItems:"center",justifyContent:"space-between",
                    transition:"all .15s"
                  }}>
                    <div style={{textAlign:"left"}}>
                      <div style={{fontFamily:f.display,fontSize:"1.5rem",
                        color:fontId===f.id?"white":T.text,fontWeight:400,lineHeight:1.1}}>
                        {userName}
                      </div>
                      <div style={{fontSize:".7rem",marginTop:3,fontFamily:"inherit",fontWeight:500,
                        color:fontId===f.id?"rgba(255,255,255,.65)":T.textSoft}}>
                        {f.name}
                      </div>
                    </div>
                    {fontId===f.id && (
                      <div style={{width:22,height:22,borderRadius:"50%",
                        background:"rgba(255,255,255,.2)",display:"flex",
                        alignItems:"center",justifyContent:"center",color:"white"}}>✓</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* BOTÓN */}
          {tab==="boton" && (
            <div>
              <ConfigSectionTitle T={T} F={F}>Ícono principal</ConfigSectionTitle>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:18}}>
                {MIC_ICONS.map(ic=>(
                  <button key={ic.id} onClick={()=>setIconId(ic.id)} style={{
                    background:iconId===ic.id?T.primary:T.bg,
                    border:`1.5px solid ${iconId===ic.id?T.primary:T.border}`,
                    borderRadius:10,padding:"10px 4px",cursor:"pointer",
                    display:"flex",flexDirection:"column",alignItems:"center",gap:4
                  }}>
                    <span style={{fontSize:"1.4rem"}}>{ic.idle}</span>
                    <span style={{fontSize:".58rem",fontFamily:"inherit",fontWeight:600,
                      color:iconId===ic.id?"white":T.textSoft}}>{ic.label}</span>
                  </button>
                ))}
              </div>
              <ConfigSectionTitle T={T} F={F}>Forma del botón</ConfigSectionTitle>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
                {BTN_SHAPES.map(sh=>(
                  <button key={sh.id} onClick={()=>setShapeId(sh.id)} style={{
                    background:shapeId===sh.id?T.primary:T.bg,
                    border:`1.5px solid ${shapeId===sh.id?T.primary:T.border}`,
                    borderRadius:10,padding:"14px",cursor:"pointer",
                    display:"flex",flexDirection:"column",alignItems:"center",gap:8
                  }}>
                    <div style={{...sh.style,
                      width:Math.min(sh.style.width,52),
                      height:Math.min(sh.style.height||52,52),
                      background:shapeId===sh.id?"rgba(255,255,255,.2)":T.border,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem"}}>
                      {MIC_ICONS.find(i=>i.id===iconId)?.idle||"🎙️"}
                    </div>
                    <span style={{fontSize:".7rem",fontFamily:"inherit",fontWeight:600,
                      color:shapeId===sh.id?"white":T.textSoft}}>{sh.label}</span>
                  </button>
                ))}
              </div>
              <ConfigSectionTitle T={T} F={F}>Posición del botón</ConfigSectionTitle>
              <div style={{background:T.bg,borderRadius:10,padding:"14px",
                border:`1px solid ${T.border}`,marginBottom:14}}>
                {/* Preview animado */}
                <div style={{height:72,background:T.surface,borderRadius:8,
                  border:`1px solid ${T.border}`,position:"relative",
                  marginBottom:12,overflow:"hidden"}}>
                  <div style={{position:"absolute",inset:0,
                    background:`linear-gradient(135deg,${T.primary}18,${T.accent}18)`}}/>
                  <div style={{
                    position:"absolute",left:"50%",
                    transform:"translateX(-50%)",
                    top:`calc(${themeConfig.btnPosition??50}% - 12px)`,
                    width:24,height:24,borderRadius:"50%",
                    background:T.primary,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:".65rem",color:"white",
                    boxShadow:`0 3px 10px ${T.primary}55`,
                    transition:"top .15s"
                  }}>🎙</div>
                  <div style={{position:"absolute",top:3,left:6,fontSize:".55rem",
                    color:T.textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>Arriba</div>
                  <div style={{position:"absolute",bottom:3,left:6,fontSize:".55rem",
                    color:T.textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>Abajo</div>
                </div>
                {/* Slider */}
                <input type="range" min="5" max="85"
                  value={themeConfig.btnPosition ?? 50}
                  onChange={e=>themeConfig.setBtnPosition(Number(e.target.value))}
                  style={{width:"100%",accentColor:T.primary,cursor:"pointer",marginBottom:10}}
                />
                {/* Atajos rápidos */}
                <div style={{display:"flex",gap:8}}>
                  {[{lbl:"⬆ Arriba",val:15},{lbl:"· Centro",val:50},{lbl:"⬇ Abajo",val:80}].map(p=>(
                    <button key={p.val} onClick={()=>themeConfig.setBtnPosition(p.val)}
                      style={{flex:1,
                        background:(themeConfig.btnPosition??50)===p.val?T.primary:T.bg,
                        color:(themeConfig.btnPosition??50)===p.val?"white":T.textSoft,
                        border:`1.5px solid ${(themeConfig.btnPosition??50)===p.val?T.primary:T.border}`,
                        borderRadius:8,padding:"7px 4px",fontFamily:"inherit",
                        fontSize:".75rem",fontWeight:600,cursor:"pointer"}}>
                      {p.lbl}
                    </button>
                  ))}
                </div>
              </div>

              <ConfigSectionTitle T={T} F={F}>Texto del botón</ConfigSectionTitle>
              <input value={btnLabel} onChange={e=>setBtnLabel(e.target.value)} maxLength={30}
                style={{width:"100%",background:T.bg,border:`1.5px solid ${T.border}`,
                  borderRadius:8,padding:"10px 12px",fontSize:".92rem",color:T.text,outline:"none"}}/>
              <div style={{fontSize:".68rem",color:T.textMuted,marginTop:5,textAlign:"right"}}>
                {btnLabel.length}/30
              </div>
            </div>
          )}

          {/* FONDO */}
          {tab==="fondo" && (
            <div>
              <ConfigSectionTitle T={T} F={F}>Textura de fondo</ConfigSectionTitle>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {TEXTURES.map(tx=>(
                  <button key={tx.id} onClick={()=>setTextureId(tx.id)} style={{
                    border:`2px solid ${textureId===tx.id?T.primary:T.border}`,
                    borderRadius:10,padding:0,cursor:"pointer",overflow:"hidden",height:80
                  }}>
                    <div style={{width:"100%",height:"100%",
                      background:tx.css!=="none"?`${tx.css}, ${T.bg}`:T.bg,
                      display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{fontSize:".72rem",fontWeight:600,
                        color:textureId===tx.id?T.primary:T.textSoft,
                        background:T.surface,padding:"3px 10px",borderRadius:20,fontFamily:"inherit"}}>
                        {tx.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

            {/* FOTO DE FONDO PERSONALIZADA */}
            {textureId === "photo" && (
              <div style={{marginTop:14}}>
                <div style={{fontSize:".68rem",fontWeight:700,color:T.textMuted,
                  textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>
                  Foto de fondo
                </div>
                {themeConfig.customBg && (
                  <div style={{borderRadius:10,overflow:"hidden",marginBottom:10,
                    height:120,position:"relative"}}>
                    <img src={themeConfig.customBg} style={{width:"100%",height:"100%",objectFit:"cover"}} />
                    <button onClick={()=>themeConfig.setCustomBg("")}
                      style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,.5)",
                        color:"white",border:"none",borderRadius:6,padding:"4px 10px",
                        cursor:"pointer",fontSize:".75rem",fontWeight:600,fontFamily:"inherit"}}>
                      Quitar
                    </button>
                  </div>
                )}
                <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                  background:T.primary,color:"white",borderRadius:10,padding:"12px",
                  cursor:"pointer",fontWeight:600,fontSize:".85rem"}}>
                  📷 Elegir foto del dispositivo
                  <input type="file" accept="image/*" style={{display:"none"}}
                    onChange={e=>{
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = ev => themeConfig.setCustomBg(ev.target.result);
                      reader.readAsDataURL(file);
                    }} />
                </label>
                <div style={{fontSize:".72rem",color:T.textMuted,textAlign:"center",marginTop:8}}>
                  O pegá una URL de imagen
                </div>
                <input
                  value={themeConfig.customBg && !themeConfig.customBg.startsWith("data:") ? themeConfig.customBg : ""}
                  onChange={e=>themeConfig.setCustomBg(e.target.value)}
                  placeholder="https://..."
                  style={{...S.inp,marginTop:8,fontSize:".85rem"}}
                />
              </div>
            )}
            </div>
          )}

          {/* TEXTOS */}
          {tab==="textos" && (
            <div>
              {/* ── NOMBRE DE NORMA ── */}
              <ConfigSectionTitle T={T} F={F}>Nombre de la persona mayor</ConfigSectionTitle>
              <input value={userName} onChange={e=>setUserName(e.target.value)} maxLength={20}
                style={{width:"100%",background:T.bg,border:`1.5px solid ${T.border}`,
                  borderRadius:8,padding:"10px 12px",fontSize:"1rem",color:T.text,
                  outline:"none",marginBottom:16}}/>

              {/* ── HIJAS / FAMILIARES ── */}
              <ConfigSectionTitle T={T} F={F}>Hijas / familiares</ConfigSectionTitle>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:10}}>
                {(contactos||[]).map((c,i)=>(
                  <div key={c.id} style={{background:T.bg,borderRadius:10,padding:"10px 12px",
                    border:`1.5px solid ${T.border}`,display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,
                      background:T.primary+"22",display:"flex",alignItems:"center",
                      justifyContent:"center",fontSize:"1rem"}}>👤</div>
                    <div style={{flex:1,display:"flex",flexDirection:"column",gap:4}}>
                      <input
                        value={c.nombre}
                        onChange={e=>setContactos(prev=>prev.map(x=>x.id===c.id?{...x,nombre:e.target.value}:x))}
                        maxLength={20}
                        placeholder="Nombre"
                        style={{...S.inp,padding:"6px 10px",fontSize:".9rem",fontWeight:700}}
                      />
                      <input
                        value={c.rel||c.relacion||""}
                        onChange={e=>setContactos(prev=>prev.map(x=>x.id===c.id?{...x,rel:e.target.value,relacion:e.target.value}:x))}
                        maxLength={20}
                        placeholder="Relación (ej: Hija, Nieto...)"
                        style={{...S.inp,padding:"6px 10px",fontSize:".78rem"}}
                      />
                    </div>
                    {(contactos||[]).length > 1 && (
                      <button onClick={()=>setContactos(prev=>prev.filter(x=>x.id!==c.id))}
                        style={{background:"#FEF2F2",border:"none",color:C.danger,
                          borderRadius:8,padding:"6px 10px",cursor:"pointer",
                          fontSize:".8rem",fontWeight:700,fontFamily:"inherit",flexShrink:0}}>
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Agregar nueva hija/familiar */}
              <button onClick={()=>setContactos(prev=>[...prev,{
                id:Date.now(),
                nombre:"Nueva persona",
                rel:"Familiar",
                relacion:"Familiar",
                tel:"",
                color:T.primary,
                avatar:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=160&q=80"
              }])} style={{
                width:"100%",background:"none",
                border:`1.5px dashed ${T.border}`,
                borderRadius:10,padding:"10px",
                color:T.textSoft,cursor:"pointer",
                fontFamily:"inherit",fontSize:".85rem",
                fontWeight:600,marginBottom:16,
                display:"flex",alignItems:"center",justifyContent:"center",gap:6
              }}>
                + Agregar familiar
              </button>

              <ConfigSectionTitle T={T} F={F}>Etiquetas del menú inferior</ConfigSectionTitle>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {navLabels.map((lbl,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:32,height:32,borderRadius:8,flexShrink:0,
                      background:i===4?C.danger+"22":T.primary+"22",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      color:i===4?C.danger:T.primary}}>
                      {NAV_ICONS_SMALL[i]}
                    </div>
                    <input value={lbl} maxLength={12}
                      onChange={e=>setNavLabels(prev=>prev.map((x,j)=>j===i?e.target.value:x))}
                      style={{flex:1,background:T.bg,border:`1.5px solid ${T.border}`,
                        borderRadius:8,padding:"8px 12px",fontSize:".9rem",
                        color:T.text,outline:"none"}}/>
                  </div>
                ))}
              </div>
              <button onClick={()=>{
                setUserName("Norma");
                setNavLabels(["Pastillas","Turnos","Música","Ejercicios","Urgencias"]);
                setBtnLabel("Hablar con Martita");
              }} style={{width:"100%",marginTop:14,background:"none",
                border:`1px solid ${T.border}`,borderRadius:8,padding:"9px",
                color:T.textSoft,cursor:"pointer",fontFamily:"inherit",fontSize:".85rem"}}>
                Restablecer por defecto
              </button>

              {/* CAMBIAR PIN */}
              <div style={{marginTop:20,paddingTop:16,borderTop:`1px solid ${T.border}`}}>
                <ConfigSectionTitle T={T} F={F}>PIN de acceso</ConfigSectionTitle>
                <div style={{background:T.bg,borderRadius:10,padding:"14px",border:`1px solid ${T.border}`}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                    <div>
                      <div style={{fontSize:".88rem",fontWeight:700,color:T.text}}>🔒 PIN actual: {"•".repeat(4)}</div>
                      <div style={{fontSize:".72rem",color:T.textSoft,marginTop:2}}>
                        {pinStep==="idle" ? "El PIN por defecto es 1234" : pinStep==="new1" ? "Ingresá el PIN nuevo" : "Repetí el PIN nuevo"}
                      </div>
                    </div>
                    {pinStep==="idle" && (
                      <button onClick={()=>{setPinStep("new1");setPinNew1("");setPinNew2("");setPinMsg("");}}
                        style={{background:T.primary,color:"white",border:"none",borderRadius:8,
                          padding:"8px 14px",fontSize:".8rem",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                        Cambiar
                      </button>
                    )}
                  </div>

                  {pinStep !== "idle" && (
                    <div>
                      {/* Dots */}
                      <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:14}}>
                        {[0,1,2,3].map(i=>(
                          <div key={i} style={{width:12,height:12,borderRadius:"50%",
                            background:i < (pinStep==="new1"?pinNew1:pinNew2).length ? T.primary : T.border,
                            transition:"background .15s"}}/>
                        ))}
                      </div>
                      {/* Numpad */}
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                        {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((d,i)=>(
                          <button key={i} onClick={()=>{
                            if(d==="") return;
                            if(d==="⌫"){handlePinBackspace(pinStep==="new1"?1:2);return;}
                            handlePinChange(d, pinStep==="new1"?1:2);
                          }} style={{
                            height:46,borderRadius:10,border:`1px solid ${T.border}`,
                            background:d===""?"transparent":d==="⌫"?"#FEF2F2":T.bg,
                            color:d==="⌫"?"#DC2626":T.text,
                            fontSize:d==="⌫"?"1rem":"1.15rem",fontWeight:600,
                            cursor:d===""?"default":"pointer",fontFamily:"inherit",
                            opacity:d===""?0:1
                          }}>{d}</button>
                        ))}
                      </div>
                      <button onClick={()=>{setPinStep("idle");setPinNew1("");setPinNew2("");setPinMsg("");}}
                        style={{width:"100%",marginTop:10,background:"none",border:"none",
                          color:T.textSoft,cursor:"pointer",fontFamily:"inherit",fontSize:".82rem"}}>
                        Cancelar
                      </button>
                    </div>
                  )}

                  {pinMsg && (
                    <div style={{marginTop:10,fontSize:".8rem",fontWeight:600,textAlign:"center",
                      color:pinMsg.startsWith("✓")?T.success:"#DC2626"}}>
                      {pinMsg}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function ConfigSectionTitle({ T, F, children }) {
  return (
    <div style={{fontSize:".68rem",fontWeight:700,color:T.textMuted,
      textTransform:"uppercase",letterSpacing:".1em",marginBottom:8,marginTop:4,
      fontFamily:F.body}}>
      {children}
    </div>
  );
}

// -- API KEY CONFIG --
function ApiKeyConfig({ color }) {
  const [key, setKey] = useState(() => localStorage.getItem("eleven_api_key") || "");
  const [saved, setSaved] = useState(!!localStorage.getItem("eleven_api_key"));
  const [show, setShow] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  function save() {
    const k = key.trim();
    if (!k) return;
    localStorage.setItem("eleven_api_key", k);
    setSaved(true);
    setTestResult(null);
  }

  function clear() {
    localStorage.removeItem("eleven_api_key");
    setKey(""); setSaved(false); setTestResult(null);
  }

  async function testVoice() {
    const k = key.trim() || localStorage.getItem("eleven_api_key") || "";
    if (!k) return;
    setTesting(true); setTestResult(null);
    try {
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/pMsXgVXv3BLzUgSXRplE/stream`,
        {
          method: "POST",
          headers: { "xi-api-key": k, "Content-Type": "application/json", "Accept": "audio/mpeg" },
          body: JSON.stringify({
            text: "Hola, soy Martita. Acá estoy siempre para vos.",
            model_id: "eleven_multilingual_v2",
            voice_settings: { stability:0.25, similarity_boost:0.90, style:0.75, use_speaker_boost:true }
          })
        }
      );
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.playbackRate = 0.88;
        audio.play();
        audio.onended = () => URL.revokeObjectURL(url);
        setTestResult("ok");
      } else {
        setTestResult("error");
      }
    } catch(e) {
      setTestResult("error");
    }
    setTesting(false);
  }

  return (
    <div style={{...S.cardBox, marginTop:0}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        <div style={{width:36,height:36,borderRadius:8,background:"#EFF6FF",border:`1px solid #DBEAFE`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
          </svg>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:".9rem",fontWeight:700,color:C.text}}>Voz de Martita · ElevenLabs</div>
          <div style={{fontSize:".72rem",color:C.textSoft,fontWeight:500,marginTop:1}}>
            {saved ? "✓ API key configurada · Voz: Paola (latina)" : "Sin configurar — usando voz del navegador"}
          </div>
        </div>
        {saved && (
          <div style={{background:C.successL,color:C.success,borderRadius:6,padding:"3px 8px",fontSize:".68rem",fontWeight:700}}>
            Activa
          </div>
        )}
      </div>

      {/* Instrucciones */}
      <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:8,padding:"12px 14px",marginBottom:14}}>
        <div style={{fontSize:".82rem",fontWeight:700,color:"#92400E",marginBottom:6}}>
          Cómo conseguir la API key gratis
        </div>
        <div style={{fontSize:".78rem",color:"#78350F",fontWeight:500,lineHeight:1.7}}>
          1. Entrá a <strong>elevenlabs.io</strong>{"\n"}
          2. Creá una cuenta gratuita con tu email{"\n"}
          3. Andá a <strong>Profile → API Key</strong>{"\n"}
          4. Copiá la key y pegala abajo{"\n"}
          El plan gratuito da <strong>10.000 caracteres/mes</strong> — suficiente para uso diario de Norma.
        </div>
      </div>

      {/* Input */}
      <div style={S.fg}>
        <label style={S.lbl}>API Key de ElevenLabs</label>
        <div style={{display:"flex",gap:8}}>
          <input
            value={key}
            onChange={e => { setKey(e.target.value); setSaved(false); setTestResult(null); }}
            placeholder="sk_xxxxxxxxxxxxxxxxxxxxxxxx"
            type={show ? "text" : "password"}
            style={{...S.inp, flex:1, fontFamily:"monospace", fontSize:".85rem", letterSpacing:".04em"}}
          />
          <button onClick={() => setShow(!show)} style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:8,padding:"0 12px",cursor:"pointer",color:C.textSoft,fontSize:".8rem",flexShrink:0}}>
            {show ? "Ocultar" : "Ver"}
          </button>
        </div>
      </div>

      {/* Botones */}
      <div style={{display:"flex",gap:8}}>
        <button
          onClick={save}
          disabled={!key.trim() || saved}
          style={{flex:1,background:(!key.trim()||saved)?C.border:color,color:(!key.trim()||saved)?C.textSoft:"white",border:"none",borderRadius:8,padding:"10px",fontFamily:"inherit",fontSize:".88rem",fontWeight:600,cursor:(!key.trim()||saved)?"default":"pointer"}}
        >
          {saved ? "✓ Guardada" : "Guardar"}
        </button>
        <button
          onClick={testVoice}
          disabled={testing || (!key.trim() && !saved)}
          style={{flex:1,background:C.bg,border:`1.5px solid ${C.border}`,color:C.textMed,borderRadius:8,padding:"10px",fontFamily:"inherit",fontSize:".88rem",fontWeight:600,cursor:"pointer"}}
        >
          {testing ? "Probando…" : "▶ Escuchar voz"}
        </button>
        {saved && (
          <button onClick={clear} style={{background:"none",border:`1.5px solid ${C.border}`,color:C.danger,borderRadius:8,padding:"10px 12px",fontFamily:"inherit",fontSize:".88rem",fontWeight:600,cursor:"pointer"}}>
            ×
          </button>
        )}
      </div>

      {testResult === "ok" && (
        <div style={{marginTop:10,padding:"8px 12px",background:C.successL,borderRadius:8,fontSize:".8rem",color:C.success,fontWeight:600}}>
          ✓ Voz funcionando — ¡Martita ya suena como Paola!
        </div>
      )}
      {testResult === "error" && (
        <div style={{marginTop:10,padding:"8px 12px",background:C.dangerL,borderRadius:8,fontSize:".8rem",color:C.danger,fontWeight:600}}>
          API key incorrecta o sin créditos. Verificá en elevenlabs.io
        </div>
      )}
    </div>
  );
}
