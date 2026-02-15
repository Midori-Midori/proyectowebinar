
const STORAGE_KEY = 'webinar_registros';

// funcion para obtener los registros del localStorage
function getRegistros() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

//función para guardar los registros en el localStorage
function saveRegistros(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

//funcion para validar los campos
function validarCampo(input, mensaje) {
  if (!input.value.trim()) {
    mostrarError(input, mensaje);
    return false;
  }
  limpiarError(input);
  return true;
}

function validarEmail(input) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(input.value.trim())) {
    mostrarError(input, 'Ingresa un correo válido');
    return false;
  }
  limpiarError(input);
  return true;
}

function mostrarError(input, msg) {
  input.classList.add('input-error');
  let err = input.parentElement.querySelector('.field-error');
  if (!err) {
    err = document.createElement('span');
    err.className = 'field-error';
    input.parentElement.appendChild(err);
  }
  err.textContent = msg;
}

function limpiarError(input) {
  input.classList.remove('input-error');
  const err = input.parentElement.querySelector('.field-error');
  if (err) err.remove();
}

//funcion de verificacion de correo duplicado
function correoExiste(correo) {
  return getRegistros().some(r => r.correo.toLowerCase() === correo.toLowerCase());
}

//mensaje de éxito después de registrar un nuevo usuario
function mostrarExito() {
  const form = document.getElementById('form-registro');
  const success = document.getElementById('success-msg');
  form.style.display    = 'none';
  success.style.display = 'flex';
}

//funcion de registro
function registrar() {
  const nombre    = document.getElementById('nombre');
  const apPaterno = document.getElementById('ap-paterno');
  const apMaterno = document.getElementById('ap-materno');
  const correo    = document.getElementById('correo');
  const telefono  = document.getElementById('telefono');

  // Limpiar errores previos
  [nombre, apPaterno, apMaterno, correo, telefono].forEach(limpiarError);

  // Validaciones
  const ok = [
    validarCampo(nombre,    'El nombre es requerido'),
    validarCampo(apPaterno, 'El apellido paterno es requerido'),
    validarCampo(apMaterno, 'El apellido materno es requerido'),
    validarEmail(correo),
    validarCampo(telefono,  'El teléfono es requerido'),
  ].every(Boolean);

  if (!ok) return;

  // Correo duplicado
  if (correoExiste(correo.value.trim())) {
    mostrarError(correo, 'Este correo ya está registrado');
    return;
  }

  // Construir registro
  const registros = getRegistros();
  const nuevo = {
    id:         Date.now(),
    nombre:     nombre.value.trim(),
    apPaterno:  apPaterno.value.trim(),
    apMaterno:  apMaterno.value.trim(),
    correo:     correo.value.trim(),
    telefono:   telefono.value.trim(),
    fecha:      new Date().toISOString().slice(0, 10),
  };

  registros.push(nuevo);
  saveRegistros(registros);
  mostrarExito();
}

//funcion de limpiar formulario para nuevo registro
function nuevoRegistro() {
  const form    = document.getElementById('form-registro');
  const success = document.getElementById('success-msg');
  form.style.display    = '';
  success.style.display = 'none';
  ['nombre','ap-paterno','ap-materno','correo','telefono'].forEach(id => {
    const el = document.getElementById(id);
    el.value = '';
    limpiarError(el);
  });
}

//funcion para refrescar la tabla (simula una recarga de datos)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.btn-registro')
    .addEventListener('click', registrar);
});

//funcion para el botón de scroll to top
const scrollBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollBtn.classList.add('visible');
  } else {
    scrollBtn.classList.remove('visible');
  }
});
