const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open);
});
nav.addEventListener('click', event => { if (event.target.closest('a')) { menuButton.setAttribute('aria-expanded','false'); nav.classList.remove('open'); } });
document.addEventListener('keydown', event => { if (event.key==='Escape' && menuButton.getAttribute('aria-expanded')==='true') { menuButton.setAttribute('aria-expanded','false'); nav.classList.remove('open'); menuButton.focus(); } });
const sectors = {
 tours: { label:'DE LA CONSULTA A LA RECOGIDA',title:'Cada reserva.\nCada pasajero.\nTodo bajo control.',description:'Organiza tarifas, salidas, cupos, reservas y recogidas. Asigna choferes a tus transfers y consulta los servicios de cada cliente.',features:['Disponibilidad y reservas desde la app','Asignación de chofer y seguimiento operativo','Reportes por cliente y rango de fechas'],link:'https://leah-demos.isaacsoluction.chatgpt.site',linkText:'Ver una web de ejemplo',board:'OPERACIÓN DEL DÍA',subtitle:'De la reserva al servicio',steps:[['Reserva recibida','Pasajeros y horario registrados'],['Salida confirmada','Cupos y recogida organizados'],['Equipo asignado','Chofer y vehículo en la operación'],['Venta y seguimiento','Facturación y reporte del cliente']] },
 property: { label:'DE LA PROPIEDAD AL CLIENTE',title:'Tu cartera organizada.\nTu próxima operación,\nmás cerca.',description:'Administra propiedades para venta y alquiler, muestra tu cartera en la web y acompaña cada oportunidad desde el CRM.',features:['Registro y administración de propiedades','Catálogo web conectado a tu cartera','Gestión de venta, alquiler y facturación'],link:'https://leah-demos.isaacsoluction.chatgpt.site',linkText:'Ver una web inmobiliaria',board:'TU CARTERA, CONECTADA',subtitle:'De la consulta a la operación',steps:[['Propiedad registrada','Información, precio y modalidad'],['Publicación en tu sitio','Catálogo conectado con el CRM'],['Oportunidad en seguimiento','Cliente e interés organizados'],['Venta o alquiler','Documentos y seguimiento de cobros']] },
 rental: { label:'DE TU FLOTA A CADA ALQUILER',title:'Más claridad\nsobre tu flota.\nMenos pendientes.',description:'Centraliza los vehículos, gestiona ventas y alquileres y da seguimiento a sus fechas y documentos desde el mismo espacio.',features:['Registro y administración de vehículos','Ventas y alquileres con facturación','Avisos de vencimiento y seguimiento'],link:'https://ileonardo88.github.io/?modulo=leads',linkText:'Explorar los módulos en la demo',board:'TU FLOTA EN ORDEN',subtitle:'Del vehículo a su siguiente alquiler',steps:[['Vehículo registrado','Datos de la unidad y modalidad'],['Cliente identificado','Información comercial disponible'],['Alquiler organizado','Fechas y documento de venta'],['Seguimiento del plazo','Vencimiento y saldo del cliente']] },
 retail: { label:'DEL CATÁLOGO A TU PRÓXIMA VENTA',title:'Tus productos.\nTus clientes.\nTu siguiente venta.',description:'Organiza productos y servicios, consulta existencias, prepara cotizaciones y conecta tu catálogo con una web editable.',features:['Catálogo y control de existencias','Cotizaciones, facturas y cobros','Importación, exportación y reportes'],link:'https://leah-demos.isaacsoluction.chatgpt.site',linkText:'Ver una tienda de ejemplo',board:'VENTAS CON SEGUIMIENTO',subtitle:'Del interés al cobro',steps:[['Catálogo actualizado','Productos, servicios y existencias'],['Consulta recibida','Información del cliente en el CRM'],['Propuesta preparada','Cotización y factura'],['Cobro registrado','Método de pago y saldo pendiente']] }
};
const tabs=[...document.querySelectorAll('[data-sector]')];
function setSector(tab){
 const data=sectors[tab.dataset.sector];
 tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});
 document.querySelector('#industry-panel').setAttribute('aria-labelledby',tab.id);
 document.querySelector('#industry-label').textContent=data.label;
 document.querySelector('#industry-title').replaceChildren(...data.title.split('\n').flatMap((line,i)=>i?[document.createElement('br'),document.createTextNode(line)]:[document.createTextNode(line)]));
 document.querySelector('#industry-description').textContent=data.description;
 document.querySelector('#industry-features').replaceChildren(...data.features.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
 const link=document.querySelector('#industry-link'); link.href=data.link;link.textContent=data.linkText+' ↗';
 document.querySelector('#board-label').textContent=data.board;document.querySelector('#board-subtitle').textContent=data.subtitle;
 document.querySelector('#board-steps').replaceChildren(...data.steps.map(([title,description],i)=>{const li=document.createElement('li');const n=document.createElement('span');n.textContent=String(i+1).padStart(2,'0');const div=document.createElement('div');const strong=document.createElement('strong');strong.textContent=title;const small=document.createElement('small');small.textContent=description;div.append(strong,small);const b=document.createElement('b');b.textContent=i===3?'↗':'✓';li.append(n,div,b);return li;}));
}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>setSector(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(i+1)%tabs.length;if(event.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();setSector(tabs[next]);tabs[next].focus();}});});
document.querySelector('#year').textContent=new Date().getFullYear();
const billingButtons=[...document.querySelectorAll('[data-billing]')];
const billingPeriod=document.querySelector('#contact-period');
const currencyAmount=value=>new Intl.NumberFormat('es-DO',{minimumFractionDigits:0,maximumFractionDigits:0}).format(Number(value));
function setBillingPeriod(period){
 const annual=period==='annual';
 billingButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.billing===period)));
 if(billingPeriod)billingPeriod.value=period;
 document.querySelectorAll('[data-price-card]').forEach(price=>{
  price.querySelector('[data-price-amount]').textContent=currencyAmount(annual?price.dataset.annual:price.dataset.monthly);
  price.querySelector('[data-price-unit]').textContent=annual?'/año':'/mes';
  const note=price.closest('.price-card').querySelector('[data-price-note]');
  note.textContent=annual?`Equivale a US$${price.dataset.equivalent}/mes. Ahorras US$${currencyAmount(price.dataset.savings)} al año.`:'Pago mensual, sin compromiso anual.';
  const link=price.closest('.price-card').querySelector('.plan-link');
  link.querySelector('[data-plan-label]').textContent=`Consultar ${link.dataset.plan}${annual?' anual':''}`;
  link.dataset.billingPeriod=period;
 });
 const summary=document.querySelector('#billing-summary');
 if(summary)summary.textContent=annual?'Pago anual por adelantado: 10 meses de precio por 12 meses de servicio. Se coordina con nuestro equipo; no hay cobros automáticos.':'Pago mensual por empresa. Consulta con nuestro equipo antes de contratar.';
}
billingButtons.forEach(button=>button.addEventListener('click',()=>setBillingPeriod(button.dataset.billing)));
setBillingPeriod('monthly');


