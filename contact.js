(() => {
 const form=document.querySelector('#commercial-form');
 if(!form)return;
 const fields=document.querySelector('#commercial-fields');
 const status=document.querySelector('#contact-status');
 const submit=document.querySelector('#contact-submit');
 const plan=document.querySelector('#contact-plan');
 const period=document.querySelector('#contact-period');
 const reason=document.querySelector('#contact-reason');
 const plans=['Esencial','Profesional','Empresa'];
 const reasons=['Solicitar una presentación','Solicitar acceso a la demo','Consultar un plan'];
 const params=new URLSearchParams(location.search);
 if(plans.includes(params.get('plan'))){plan.value=params.get('plan');reason.value='Consultar un plan';}
 if(['monthly','annual'].includes(params.get('period'))&&period)period.value=params.get('period');
 if(params.get('solicitud')==='demo')reason.value='Solicitar acceso a la demo';
 document.querySelectorAll('.plan-link').forEach(link=>{
  const selected=link.dataset.plan;
  if(!plans.includes(selected))return;
  link.href='#contacto';
  link.addEventListener('click',()=>{plan.value=selected;reason.value='Consultar un plan';if(period)period.value=link.dataset.billingPeriod||'monthly';document.querySelector('#contact-name').focus({preventScroll:true});});
 });
 let pending=false;
 let submissionKey='';
 let lastPayload='';
 function message(text,error=false){status.textContent=text;status.classList.toggle('error',error);status.classList.toggle('success',!error&&!!text);}
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(pending||!form.reportValidity())return;
  const config=window.LEAH_CONTACT;
  if(!config?.endpoint||!config.publicKey){message('No pudimos preparar el envío. Escríbenos a isaacsoluction@gmail.com.',true);return;}
  const data=new FormData(form);
  const value=name=>String(data.get(name)||'').trim();
  if(value('website')){message('Gracias. Recibimos tu consulta.');form.reset();return;}
  if(!reasons.includes(value('reason'))||!['Por definir',...plans].includes(value('plan'))||!['monthly','annual'].includes(value('billing_interval'))){message('Revisa el tipo de consulta, plan y forma de pago.',true);return;}
  const payloadFields={
   name:value('name'),email:value('email'),phone:value('phone'),company:value('company'),sector:value('sector'),plan:value('plan'),consent:'accepted',
   message:['Solicitud comercial LEAH',`Motivo: ${value('reason')}`,`Empresa: ${value('company')}`,`Sector: ${value('sector')}`,`Plan: ${value('plan')}`,`Forma de pago solicitada: ${value('billing_interval')==='annual'?'Anual prepago':'Mensual'}`,`Equipo: ${value('team')}`,'',value('message')].join('\n')
  };
  if(!payloadFields.name||!payloadFields.email||!payloadFields.phone||!payloadFields.company||!payloadFields.sector||!value('team')||!value('message')||data.get('consent')!=='on'){
   message('Completa los campos obligatorios y acepta el consentimiento.',true);return;
  }
  if(payloadFields.message.length>2000){message('Reduce un poco el mensaje para poder enviarlo.',true);return;}
  const fingerprint=JSON.stringify(payloadFields);
  if(fingerprint!==lastPayload||!submissionKey){submissionKey=crypto.randomUUID();lastPayload=fingerprint;}
  pending=true;fields.disabled=true;submit.textContent='Enviando consulta…';message('Estamos guardando tu consulta.');
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),25000);
  try{
   const response=await fetch(config.endpoint,{method:'POST',headers:{'Content-Type':'application/json','apikey':config.publicKey},body:JSON.stringify({kind:'contact',websiteSlug:config.websiteSlug,pageSlug:config.pageSlug,formId:config.formId,submissionKey,website:'',fields:payloadFields}),signal:controller.signal});
   let result;try{result=await response.json()}catch{throw Error('Respuesta no válida del servicio. Inténtalo nuevamente o escríbenos por correo.');}
   if(!response.ok||result?.ok!==true){
    const text=response.status===429?'Se alcanzó temporalmente el límite de envíos. Espera unos minutos antes de reintentar.':response.status>=500?'El servicio no pudo guardar tu consulta. Puedes reintentar o escribirnos por correo.':typeof result?.error==='string'?result.error.slice(0,220):'No pudimos guardar la consulta. Revisa los datos e inténtalo nuevamente.';
    throw Error(text);
   }
   message('Gracias. Tu consulta quedó registrada. Te contactaremos para coordinar el siguiente paso.');
   document.dispatchEvent(new Event('leah:commercial-success'));
   form.reset();submissionKey='';lastPayload='';status.focus({preventScroll:true});
  }catch(error){
   message(error?.name==='AbortError'?'El envío está tardando más de lo esperado. Reintenta con los mismos datos para confirmar la solicitud sin duplicarla.':error instanceof TypeError?'No se pudo conectar. Comprueba tu conexión e inténtalo de nuevo, o escríbenos a isaacsoluction@gmail.com.':error.message||'No pudimos completar el envío. Inténtalo de nuevo.',true);
  }finally{clearTimeout(timer);pending=false;fields.disabled=false;submit.replaceChildren(document.createTextNode('Enviar mi consulta '));const arrow=document.createElement('span');arrow.setAttribute('aria-hidden','true');arrow.textContent='↗';submit.append(arrow);}
 });
})();


