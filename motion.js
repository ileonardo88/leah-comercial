const preference = matchMedia('(prefers-reduced-motion: reduce)');
const ambient = [...document.querySelectorAll('[data-ambient]')];
const toggle = document.querySelector('#motion-toggle');
let motionPaused = preference.matches;
const mobileView=matchMedia('(max-width:700px)');
const heroFilm=document.querySelector('#hero-film');
function resizeFilm(){
 heroFilm.src=mobileView.matches?'./assets/leah-movil.mp4':'./assets/leah-bucle.mp4';
 heroFilm.poster=mobileView.matches?'./assets/movil-poster.jpg':'./assets/hero-poster.jpg';
 if(!motionPaused&&!document.hidden)heroFilm.play().catch(()=>{});
}
mobileView.addEventListener('change',resizeFilm);
resizeFilm();
function updateMotion() {
 document.body.classList.toggle('motion-paused',motionPaused);
 toggle.setAttribute('aria-pressed',String(motionPaused));
 toggle.textContent=motionPaused?'Reanudar animaciones ▷':'Pausar animaciones Ⅱ';
 ambient.forEach(video=>{if(motionPaused||document.hidden||document.querySelector('#film-dialog')?.open)video.pause();else video.play().catch(()=>{});});
}
toggle.addEventListener('click',()=>{motionPaused=!motionPaused;updateMotion();});
preference.addEventListener('change',event=>{motionPaused=event.matches;updateMotion();});
document.addEventListener('visibilitychange',updateMotion);
updateMotion();
const experienceData=[
 {file:'seguimiento',label:'CLIENTES Y SEGUIMIENTO',caption:'Consulta la etapa de tu oportunidad y continúa el seguimiento.',alt:'Fragmento real de clientes y seguimiento en la demo'},
 {file:'catalogo',label:'PRODUCTOS Y SERVICIOS',caption:'Consulta tu catálogo y la información de tus artículos.',alt:'Fragmento real del catálogo de productos y servicios de la demo'},
 {file:'cotizacion',label:'COTIZACIONES',caption:'Prepara los conceptos y revisa los detalles de tu propuesta.',alt:'Fragmento real de preparación de una cotización en la demo'}
];
const experienceTabs=[...document.querySelectorAll('[data-experience]')];
const panel=document.querySelector('#experience-panel');
const experienceVideo=document.querySelector('#experience-video');
function chooseExperience(index){
 const data=experienceData[index];
 experienceTabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
 panel.setAttribute('aria-labelledby',experienceTabs[index].id);
 document.querySelector('#experience-label').textContent=data.label;
 document.querySelector('#experience-caption').textContent=data.caption;
 experienceVideo.poster=`/assets/${data.file}-poster.jpg`;
 experienceVideo.src=`/assets/${data.file}.mp4`;
 experienceVideo.setAttribute('aria-label',data.alt);
 if(!motionPaused&&!document.hidden)experienceVideo.play().catch(()=>{});
 panel.classList.remove('changing');requestAnimationFrame(()=>panel.classList.add('changing'));
}
experienceTabs.forEach((tab,index)=>{
 tab.addEventListener('click',()=>chooseExperience(index));
 tab.addEventListener('keydown',event=>{let next;if(['ArrowDown','ArrowRight'].includes(event.key))next=(index+1)%3;if(['ArrowUp','ArrowLeft'].includes(event.key))next=(index+2)%3;if(event.key==='Home')next=0;if(event.key==='End')next=2;if(next!==undefined){event.preventDefault();chooseExperience(next);experienceTabs[next].focus();}});
});
if('IntersectionObserver' in window){
 document.body.classList.add('reveal-ready');
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}),{threshold:.09});
 document.querySelectorAll('.feature,.section-heading,.journey-grid article,.price-card,.contact-intro,.operation-board').forEach((el,i)=>{el.classList.add('reveal-item');el.style.setProperty('--reveal-delay',`${i%3*.07}s`);observer.observe(el);});
 const videoObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{const video=entry.target;if(!entry.isIntersecting)video.pause();else if(!motionPaused&&!document.hidden)video.play().catch(()=>{});}),{threshold:.1});
 ambient.forEach(video=>videoObserver.observe(video));
}
document.querySelectorAll('[data-sector]').forEach(tab=>tab.addEventListener('click',()=>{const el=document.querySelector('#industry-panel');el.classList.remove('sector-changing');requestAnimationFrame(()=>el.classList.add('sector-changing'));}));
const filmDialog=document.querySelector('#film-dialog');
const soundFilm=document.querySelector('#sound-film');
const openFilm=document.querySelector('#open-film');
openFilm.addEventListener('click',()=>{filmDialog.showModal();ambient.forEach(v=>v.pause());soundFilm.play().catch(()=>{});});
document.querySelector('#close-film').addEventListener('click',()=>filmDialog.close());
filmDialog.addEventListener('click',event=>{if(event.target===filmDialog){const bounds=filmDialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)filmDialog.close();}});
filmDialog.addEventListener('close',()=>{soundFilm.pause();updateMotion();openFilm.focus();});


