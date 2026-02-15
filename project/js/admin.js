const STORAGE_KEY = 'webinar_registros';

// funcion para obtener los registros del localStorage
function getRegistros() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveRegistros(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let registros    = [];
let deleteTarget = null;

//renderiza la tabla con los datos proporcionados, o muestra un estado vacío si no hay registros
function renderTable(data) {
  const tbody = document.getElementById('tabla-body');
  const empty = document.getElementById('empty-state');
  const table = document.getElementById('registros-table');

  tbody.innerHTML = '';

  if (data.length === 0) {
    table.style.display = 'none';
    empty.style.display = 'flex';
  } else {
    table.style.display = '';
    empty.style.display = 'none';

    data.forEach((r, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="td-num">${i + 1}</td>
        <td><span class="name-chip">${r.nombre}</span></td>
        <td>${r.apPaterno}</td>
        <td>${r.apMaterno}</td>
        <td><a class="email-link" href="mailto:${r.correo}">${r.correo}</a></td>
        <td>${r.telefono}</td>
        <td><span class="date-chip">${formatDate(r.fecha)}</span></td>
        <td>
          <button class="btn-icon btn-delete" title="Eliminar"
            onclick="openModal(${r.id}, '${r.nombre} ${r.apPaterno}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.2"
              stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById('total-count').textContent = registros.length;
}

function formatDate(d) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${parseInt(day)} ${meses[parseInt(m) - 1]} ${y}`;
}

//funcion para filtrar la tabla según el término de búsqueda
function filterTable() {
  const q = document.getElementById('search').value.toLowerCase();
  const filtered = registros.filter(r =>
    `${r.nombre} ${r.apPaterno} ${r.apMaterno} ${r.correo}`
      .toLowerCase().includes(q)
  );
  renderTable(filtered);
}

//funcion para refrescar la tabla (simula una recarga de datos)
function refreshTable() {
  const btn = document.querySelector('.btn-secondary');
  btn.classList.add('spinning');
  setTimeout(() => {
    registros = getRegistros();
    btn.classList.remove('spinning');
    document.getElementById('search').value = '';
    renderTable(registros);
    showToast('✅  Tabla actualizada');
  }, 700);
}

//función para abrir el modal de confirmación de eliminación
function openModal(id, nombre) {
  deleteTarget = id;
  document.getElementById('modal-nombre').textContent = nombre;
  document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
  deleteTarget = null;
}

function confirmDelete() {
  registros = registros.filter(r => r.id !== deleteTarget);
  saveRegistros(registros);
  closeModal();
  document.getElementById('search').value = '';
  renderTable(registros);
  showToast('🗑️  Registro eliminado');
}

//función exportar CSV
function exportCSV() {
  if (registros.length === 0) {
    showToast('No hay registros para exportar');
    return;
  }
  const headers = ['#','Nombre','Apellido Paterno','Apellido Materno','Correo','Teléfono','Fecha de Registro'];
  const rows = registros.map((r, i) =>
    [i + 1, r.nombre, r.apPaterno, r.apMaterno, r.correo, r.telefono, r.fecha].join(',')
  );
  const csv  = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `registros-webinar-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('CSV exportado correctamente');
}

//función para mostrar un mensaje tipo toast
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  registros = getRegistros();
  renderTable(registros);
});
