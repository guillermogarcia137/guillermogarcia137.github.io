// Funciones locales de la portada: búsqueda, filtros y reloj. Sin API ni seguimiento.
(() => {
  const entrada = document.querySelector('#buscar-portada');
  const botones = [...document.querySelectorAll('.filtro')];
  const secciones = [...document.querySelectorAll('main section[data-categoria]')];
  const resultado = document.querySelector('#resultado');
  const vacio = document.querySelector('#sin-resultados');
  let categoria = 'todo';
  const normalizar = texto => texto.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  function filtrar() {
    const palabras = normalizar(entrada.value.trim()).split(/\s+/).filter(Boolean);
    let total = 0;
    for (const seccion of secciones) {
      const categoriaValida = categoria === 'todo' || seccion.dataset.categoria === categoria;
      const tarjetas = [...seccion.querySelectorAll('.tarjeta')];
      const coincide = texto => palabras.every(p => normalizar(texto).includes(p));
      if (tarjetas.length) {
        let visibles = 0;
        for (const tarjeta of tarjetas) {
          const mostrar = categoriaValida && coincide(seccion.querySelector('h2').textContent + ' ' + tarjeta.textContent);
          tarjeta.hidden = !mostrar;
          if (mostrar) visibles++;
        }
        // Los ejemplos desplegables y el catálogo siguen disponibles cuando no hay búsqueda.
        seccion.hidden = !(categoriaValida && (visibles || (!palabras.length)));
        total += visibles;
      } else {
        const mostrar = categoriaValida && coincide(seccion.textContent);
        seccion.hidden = !mostrar;
        if (mostrar) total++;
      }
    }
    const activo = categoria !== 'todo' || palabras.length > 0;
    resultado.textContent = activo ? total + (total === 1 ? ' resultado' : ' resultados') : 'Todos los accesos · busca por nombre o filtra por categoría';
    vacio.hidden = total !== 0;
  }
  function seleccionar(valor) {
    categoria = valor;
    for (const boton of botones) boton.setAttribute('aria-pressed',String(boton.dataset.filtro === valor));
    filtrar();
  }
  entrada.addEventListener('input',filtrar);
  botones.forEach(b => b.addEventListener('click',() => seleccionar(b.dataset.filtro)));
  document.querySelector('#limpiar-portada').addEventListener('click',() => { entrada.value=''; seleccionar('todo'); entrada.focus(); });
  document.querySelectorAll('.menu-navegacion nav a').forEach(a => a.addEventListener('click',() => { entrada.value=''; seleccionar('todo'); }));
  document.addEventListener('keydown',e => { if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) { e.preventDefault(); entrada.focus(); } });
  function reloj() {
    const ahora = new Date();
    document.querySelector('#hora').textContent = new Intl.DateTimeFormat('es-ES',{hour:'2-digit',minute:'2-digit'}).format(ahora);
    document.querySelector('#fecha').textContent = new Intl.DateTimeFormat('es-ES',{weekday:'long',day:'numeric',month:'long'}).format(ahora);
    document.querySelector('#saludo').textContent = ahora.getHours() < 12 ? 'Buenos días' : ahora.getHours() < 20 ? 'Buenas tardes' : 'Buenas noches';
  }
  reloj(); setInterval(reloj,15000); filtrar();
})();