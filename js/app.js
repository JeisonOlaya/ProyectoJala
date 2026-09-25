/**
 * app.js — Lógica de la aplicación SpotiMath
 * -------------------------------------------------------
 * 1) Autenticación local (registro/login) persistida en localStorage.
 * 2) Fase 1: selección de géneros y artistas.
 * 3) Fase 2: Dashboard matemático — conjuntos, diagrama de Venn interactivo
 *    y analizador de propiedades de relaciones (reflexiva, simétrica,
 *    antisimétrica, transitiva).
 *
 * NOTA ACADÉMICA: el login usa localStorage con fines demostrativos para
 * esta actividad de Matemáticas Discretas. No es un mecanismo de
 * autenticación seguro para producción (las contraseñas no se cifran).
 */

// ---------- Estado global de la aplicación ----------
const state = {
  usuarioActual: null,
  generosSeleccionados: new Set(),   // ids de género
  artistasSeleccionados: new Set(),  // claves "generoId::nombreArtista"
  vennModo: 'generos'                // 'generos' | 'artistas'
};

// ========================================================
// 1. AUTENTICACIÓN (localStorage)
// ========================================================
const USERS_KEY = 'spotimath_users';
const SESSION_KEY = 'spotimath_session';

const obtenerUsuarios = () => JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
const guardarUsuarios = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

function initAuth() {
  document.getElementById('tabLogin').addEventListener('click', () => cambiarTabAuth('login'));
  document.getElementById('tabRegister').addEventListener('click', () => cambiarTabAuth('register'));

  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    const users = obtenerUsuarios();
    const errorEl = document.getElementById('loginError');
    if (users[user] !== undefined && users[user] === pass) {
      errorEl.classList.add('d-none');
      iniciarSesion(user);
    } else {
      errorEl.textContent = 'Usuario o contraseña incorrectos.';
      errorEl.classList.remove('d-none');
    }
  });

  document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('regUser').value.trim();
    const pass = document.getElementById('regPass').value;
    const users = obtenerUsuarios();
    const errorEl = document.getElementById('registerError');
    if (!user || !pass) {
      errorEl.textContent = 'Completa usuario y contraseña.';
      errorEl.classList.remove('d-none');
      return;
    }
    if (users[user] !== undefined) {
      errorEl.textContent = 'Ese usuario ya existe. Inicia sesión.';
      errorEl.classList.remove('d-none');
      return;
    }
    users[user] = pass;
    guardarUsuarios(users);
    errorEl.classList.add('d-none');
    iniciarSesion(user);
  });

  const sesionActiva = localStorage.getItem(SESSION_KEY);
  if (sesionActiva) iniciarSesion(sesionActiva);
}

function cambiarTabAuth(tab) {
  document.getElementById('loginForm').classList.toggle('d-none', tab !== 'login');
  document.getElementById('registerForm').classList.toggle('d-none', tab !== 'register');
  document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
  document.getElementById('tabRegister').classList.toggle('active', tab === 'register');
}

function iniciarSesion(usuario) {
  state.usuarioActual = usuario;
  localStorage.setItem(SESSION_KEY, usuario);
  document.getElementById('authScreen').classList.add('d-none');
  document.getElementById('appScreen').classList.remove('d-none');
  document.getElementById('nombreUsuario').textContent = usuario;
  renderGeneros();
}

function cerrarSesion() {
  state.usuarioActual = null;
  state.generosSeleccionados.clear();
  state.artistasSeleccionados.clear();
  localStorage.removeItem(SESSION_KEY);
  document.getElementById('appScreen').classList.add('d-none');
  document.getElementById('authScreen').classList.remove('d-none');
  document.getElementById('selectionPhase').classList.remove('d-none');
  document.getElementById('dashboardPhase').classList.add('d-none');
  document.getElementById('artistasContenedor').innerHTML = '';
  document.getElementById('btnFinalizar').classList.add('d-none');
  document.getElementById('loginForm').reset();
  document.getElementById('loginError').classList.add('d-none');
}

// ========================================================
// 2. FASE 1 — SELECCIÓN MUSICAL
// ========================================================
function renderGeneros() {
  const cont = document.getElementById('generosGrid');
  cont.innerHTML = GENEROS.map(g => `
    <div class="genero-card" data-id="${g.id}" style="--accent:${g.color}">
      <div class="genero-icono">${g.icono}</div>
      <div class="genero-nombre">${g.nombre}</div>
    </div>`).join('');

  cont.querySelectorAll('.genero-card').forEach(card => {
    card.addEventListener('click', () => toggleGenero(card.dataset.id));
  });
}

function toggleGenero(id) {
  const card = document.querySelector(`.genero-card[data-id="${id}"]`);
  if (state.generosSeleccionados.has(id)) {
    state.generosSeleccionados.delete(id);
    card.classList.remove('selected');
    const panel = document.getElementById(`artistas-${id}`);
    if (panel) panel.remove();
    [...state.artistasSeleccionados].forEach(k => {
      if (k.startsWith(id + '::')) state.artistasSeleccionados.delete(k);
    });
  } else {
    state.generosSeleccionados.add(id);
    card.classList.add('selected');
    renderArtistasDeGenero(id);
  }
  actualizarBotonFinalizar();
}

function renderArtistasDeGenero(generoId) {
  const genero = GENEROS.find(g => g.id === generoId);
  const wrapper = document.createElement('div');
  wrapper.id = `artistas-${generoId}`;
  wrapper.className = 'artistas-panel';
  wrapper.innerHTML = `
    <div class="artistas-titulo" style="color:${genero.color}">${genero.icono} Artistas de ${genero.nombre}</div>
    <div class="artistas-chips">
      ${genero.artistas.map(a => `<button type="button" class="chip" data-genero="${generoId}" data-artista="${a}">${a}</button>`).join('')}
    </div>`;
  document.getElementById('artistasContenedor').appendChild(wrapper);
  wrapper.querySelectorAll('.chip').forEach(chip => chip.addEventListener('click', () => toggleArtista(chip)));
}

function toggleArtista(chip) {
  const key = `${chip.dataset.genero}::${chip.dataset.artista}`;
  if (state.artistasSeleccionados.has(key)) {
    state.artistasSeleccionados.delete(key);
    chip.classList.remove('selected');
  } else {
    state.artistasSeleccionados.add(key);
    chip.classList.add('selected');
  }
  actualizarBotonFinalizar();
}

function actualizarBotonFinalizar() {
  document.getElementById('btnFinalizar').classList.toggle('d-none', state.generosSeleccionados.size === 0);
}

function finalizarSeleccion() {
  const fase1 = document.getElementById('selectionPhase');
  fase1.classList.add('fade-out');
  setTimeout(() => {
    fase1.classList.add('d-none');
    fase1.classList.remove('fade-out');
    const fase2 = document.getElementById('dashboardPhase');
    fase2.classList.remove('d-none');
    fase2.classList.add('fade-in');
    renderDashboard();
  }, 250);
}

function volverASeleccion() {
  document.getElementById('dashboardPhase').classList.add('d-none');
  document.getElementById('selectionPhase').classList.remove('d-none', 'fade-out');
}

// ========================================================
// 3. FASE 2 — DASHBOARD MATEMÁTICO
// ========================================================
function renderDashboard() {
  renderResumenConjuntos();
  cambiarModoVenn('generos');
  renderRelaciones();
}

// -- Operaciones genéricas de teoría de conjuntos --
const union = (a, b) => new Set([...a, ...b]);
const interseccion = (a, b) => new Set([...a].filter(x => b.has(x)));
const diferencia = (a, b) => new Set([...a].filter(x => !b.has(x)));
const complemento = (a, universo) => new Set([...universo].filter(x => !a.has(x)));

function getConjuntosVenn() {
  if (state.vennModo === 'generos') {
    return {
      A: new Set(state.generosSeleccionados),
      B: new Set(GENEROS_TENDENCIA),
      universo: new Set(GENEROS.map(g => g.id)),
      etiqueta: id => GENEROS.find(g => g.id === id)?.nombre || id,
      nombreA: 'Tus Géneros', nombreB: 'Tendencia Global'
    };
  }
  return {
    A: new Set([...state.artistasSeleccionados].map(k => k.split('::')[1])),
    B: new Set(ARTISTAS_DESTACADOS),
    universo: new Set(GENEROS.flatMap(g => g.artistas)),
    etiqueta: x => x,
    nombreA: 'Tus Artistas', nombreB: 'Destacados'
  };
}

function renderResumenConjuntos() {
  const genA = state.generosSeleccionados;
  const genB = new Set(GENEROS_TENDENCIA);
  const artA = new Set([...state.artistasSeleccionados].map(k => k.split('::')[1]));
  const artB = new Set(ARTISTAS_DESTACADOS);

  document.getElementById('conjuntosResumen').innerHTML = `
    <div class="set-card">
      <h4>Conjunto A — Géneros</h4>
      <p class="set-def">A = { géneros que seleccionaste }</p>
      <p class="set-count">|A| = ${genA.size}</p>
      <p class="set-items">${[...genA].map(id => GENEROS.find(g => g.id === id).nombre).join(', ') || '∅'}</p>
    </div>
    <div class="set-card">
      <h4>Conjunto B — Géneros</h4>
      <p class="set-def">B = { géneros en tendencia global }</p>
      <p class="set-count">|B| = ${genB.size}</p>
      <p class="set-items">${[...genB].map(id => GENEROS.find(g => g.id === id).nombre).join(', ')}</p>
    </div>
    <div class="set-card">
      <h4>Conjunto A — Artistas</h4>
      <p class="set-def">A = { artistas que seleccionaste }</p>
      <p class="set-count">|A| = ${artA.size}</p>
    </div>
    <div class="set-card">
      <h4>Conjunto B — Artistas</h4>
      <p class="set-def">B = { artistas destacados del catálogo }</p>
      <p class="set-count">|B| = ${artB.size}</p>
    </div>`;
}

function cambiarModoVenn(modo) {
  state.vennModo = modo;
  document.getElementById('vennTabGeneros').classList.toggle('active', modo === 'generos');
  document.getElementById('vennTabArtistas').classList.toggle('active', modo === 'artistas');
  const { nombreA, nombreB } = getConjuntosVenn();
  document.getElementById('vennLabelA').textContent = nombreA;
  document.getElementById('vennLabelB').textContent = nombreB;
  document.getElementById('vennResultado').innerHTML = '<p class="hint">Elige una operación para resaltar la región y ver sus elementos exactos.</p>';
  limpiarRegionesVenn();
}

function limpiarRegionesVenn() {
  document.querySelectorAll('#vennSvg .region').forEach(r => r.classList.remove('activa'));
  document.querySelectorAll('.venn-btn').forEach(b => b.classList.remove('active'));
}

function operarVenn(op) {
  limpiarRegionesVenn();
  document.querySelector(`.venn-btn[data-op="${op}"]`).classList.add('active');

  const { A, B, universo, etiqueta } = getConjuntosVenn();
  let resultado, idsRegion = [];
  switch (op) {
    case 'A':      resultado = A;                    idsRegion = ['regionA']; break;
    case 'B':      resultado = B;                    idsRegion = ['regionB']; break;
    case 'union':  resultado = union(A, B);           idsRegion = ['regionA', 'regionB']; break;
    case 'inter':  resultado = interseccion(A, B);    idsRegion = ['regionInter']; break;
    case 'difAB':  resultado = diferencia(A, B);      idsRegion = ['regionOnlyA']; break;
    case 'difBA':  resultado = diferencia(B, A);      idsRegion = ['regionOnlyB']; break;
    case 'compA':  resultado = complemento(A, universo); idsRegion = ['regionFueraA']; break;
  }
  idsRegion.forEach(id => document.getElementById(id)?.classList.add('activa'));

  const lista = [...resultado].map(etiqueta).sort();
  document.getElementById('vennResultado').innerHTML = `
    <p class="resultado-formula">${etiquetaFormula(op)} &nbsp;→&nbsp; |resultado| = ${resultado.size}</p>
    <div class="resultado-lista">${lista.length ? lista.map(x => `<span class="tag">${x}</span>`).join('') : '<em>∅ (conjunto vacío)</em>'}</div>`;
}

function etiquetaFormula(op) {
  return {
    A: 'A', B: 'B', union: 'A ∪ B', inter: 'A ∩ B',
    difAB: 'A − B', difBA: 'B − A', compA: 'Aᶜ (complemento de A respecto al universo U)'
  }[op];
}

// ========================================================
// 4. ANALIZADOR DE RELACIONES
// ========================================================
const nombreGenero = (id) => GENEROS.find(g => g.id === id)?.nombre || id;
const existePar = (pares, x, y) => pares.some(([a, b]) => a === x && b === y);

function evaluarPropiedades(dominio, pares) {
  let reflexiva = { cumple: true, falla: null };
  for (const x of dominio) {
    if (!existePar(pares, x, x)) { reflexiva = { cumple: false, falla: x }; break; }
  }

  let simetrica = { cumple: true, falla: null };
  for (const [x, y] of pares) {
    if (!existePar(pares, y, x)) { simetrica = { cumple: false, falla: [x, y] }; break; }
  }

  let antisimetrica = { cumple: true, falla: null };
  for (const [x, y] of pares) {
    if (x !== y && existePar(pares, y, x)) { antisimetrica = { cumple: false, falla: [x, y] }; break; }
  }

  let transitiva = { cumple: true, falla: null };
  busqueda:
  for (const [x, y] of pares) {
    for (const [y2, z] of pares) {
      if (y === y2 && !existePar(pares, x, z)) { transitiva = { cumple: false, falla: [x, y, z] }; break busqueda; }
    }
  }

  return {
    reflexiva: {
      titulo: 'Reflexiva', cumple: dominio.length > 0 && reflexiva.cumple,
      definicion: '∀x ∈ A: (x, x) ∈ R',
      justificacion: dominio.length === 0 ? 'No hay elementos en el dominio A.' :
        reflexiva.cumple ? 'Todo elemento de A se relaciona consigo mismo.' :
        `Falta el par (${nombreGenero(reflexiva.falla)}, ${nombreGenero(reflexiva.falla)}) para cumplir la reflexividad.`
    },
    simetrica: {
      titulo: 'Simétrica', cumple: simetrica.cumple,
      definicion: '∀x,y ∈ A: (x,y) ∈ R ⇒ (y,x) ∈ R',
      justificacion: simetrica.cumple ? 'Por cada par (x,y) en R también está presente (y,x).' :
        `Existe (${nombreGenero(simetrica.falla[0])}, ${nombreGenero(simetrica.falla[1])}) pero falta (${nombreGenero(simetrica.falla[1])}, ${nombreGenero(simetrica.falla[0])}).`
    },
    antisimetrica: {
      titulo: 'Antisimétrica', cumple: antisimetrica.cumple,
      definicion: '∀x,y ∈ A: (x,y) ∈ R ∧ (y,x) ∈ R ⇒ x = y',
      justificacion: antisimetrica.cumple ? 'No existen pares simétricos con x ≠ y.' :
        `Existen (${nombreGenero(antisimetrica.falla[0])}, ${nombreGenero(antisimetrica.falla[1])}) y (${nombreGenero(antisimetrica.falla[1])}, ${nombreGenero(antisimetrica.falla[0])}) con elementos distintos, lo que rompe la antisimetría.`
    },
    transitiva: {
      titulo: 'Transitiva', cumple: transitiva.cumple,
      definicion: '∀x,y,z ∈ A: (x,y) ∈ R ∧ (y,z) ∈ R ⇒ (x,z) ∈ R',
      justificacion: transitiva.cumple ? 'Toda cadena (x,y),(y,z) tiene su correspondiente (x,z) en R.' :
        `Existen (${nombreGenero(transitiva.falla[0])}, ${nombreGenero(transitiva.falla[1])}) y (${nombreGenero(transitiva.falla[1])}, ${nombreGenero(transitiva.falla[2])}) pero falta (${nombreGenero(transitiva.falla[0])}, ${nombreGenero(transitiva.falla[2])}).`
    }
  };
}

function renderRelaciones() {
  const dominio = [...state.generosSeleccionados];
  const nombresDominio = dominio.map(nombreGenero);
  const pares = RELACION_INFLUENCIA.filter(([x, y]) => dominio.includes(x) && dominio.includes(y));

  document.getElementById('relacionDominio').innerHTML = dominio.length
    ? `R ⊆ A × A, con A = { ${nombresDominio.join(', ')} }.<br>Pares en R: ${pares.length ? pares.map(([x, y]) => `(${nombreGenero(x)}, ${nombreGenero(y)})`).join(', ') : '∅'}`
    : 'Selecciona al menos un género en la Fase 1 para analizar la relación de influencia musical.';

  const props = evaluarPropiedades(dominio, pares);
  document.getElementById('propiedadesGrid').innerHTML = Object.values(props).map(p => `
    <div class="prop-card">
      <div class="prop-header">
        <span class="prop-nombre">${p.titulo}</span>
        <span class="badge ${p.cumple ? 'badge-true' : 'badge-false'}">${p.cumple ? 'True' : 'False'}</span>
      </div>
      <button type="button" class="prop-toggle" onclick="this.nextElementSibling.classList.toggle('d-none')">Ver justificación</button>
      <div class="prop-justificacion d-none">
        <p><strong>Definición:</strong> ${p.definicion}</p>
        <p><strong>Justificación:</strong> ${p.justificacion}</p>
      </div>
    </div>`).join('');
}

// ========================================================
// 5. INICIALIZACIÓN
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  document.getElementById('btnFinalizar').addEventListener('click', finalizarSeleccion);
  document.getElementById('btnLogout').addEventListener('click', cerrarSesion);
  document.getElementById('btnVolver').addEventListener('click', volverASeleccion);
  document.getElementById('vennTabGeneros').addEventListener('click', () => cambiarModoVenn('generos'));
  document.getElementById('vennTabArtistas').addEventListener('click', () => cambiarModoVenn('artistas'));
  document.querySelectorAll('.venn-btn').forEach(b => b.addEventListener('click', () => operarVenn(b.dataset.op)));
});
