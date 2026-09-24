/* Movimento de perspectiva acompanha o cursor sobre ações do Equipa. */
(()=>{
  const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const selector='button:not(.sidebar-backdrop):not(.modal-backdrop):not(.admin-menu-backdrop), a.button, a.tab, [role="button"]';
  let active=null,origin=null,frame=0,point=null,pressed=false;
  const eligible=element=>element?.matches(selector)&&!element.disabled&&!element.closest('[inert]');
  function clear(){
    cancelAnimationFrame(frame);frame=0;point=null;
    if(active){
      active.style.transition='transform 300ms cubic-bezier(.2,.85,.25,1), box-shadow 300ms ease';
      active.style.removeProperty('transform');
      active.style.removeProperty('box-shadow');
      active.style.removeProperty('--bell-x');
      active.style.removeProperty('--bell-y');
      active.classList.remove('tilt-live');
    }
    active=null;origin=null;pressed=false;
  }
  function draw(){
    frame=0;
    if(!active||!point||!origin)return;
    const x=Math.max(-1,Math.min(1,(point.x-origin.left)/origin.width*2-1));
    const y=Math.max(-1,Math.min(1,(point.y-origin.top)/origin.height*2-1));
    const bell=active.classList.contains('notification-button');
    const depth=pressed?-5:bell?18:14;
    active.style.transform=`perspective(520px) translate3d(${(x*(bell?7:5)).toFixed(2)}px,${(y*(bell?7:5)).toFixed(2)}px,${depth}px) rotateX(${(-y*(bell?18:13)).toFixed(2)}deg) rotateY(${(x*(bell?22:17)).toFixed(2)}deg) scale(${pressed?.94:bell?1.07:1.035})`;
    if(bell){active.style.setProperty('--bell-x',`${(x*4).toFixed(2)}px`);active.style.setProperty('--bell-y',`${(y*3).toFixed(2)}px`)}
    else active.style.boxShadow=`${(-x*11).toFixed(1)}px ${(14-y*8).toFixed(1)}px 26px rgba(4,52,75,.26), inset ${(x*3).toFixed(1)}px ${(y*3).toFixed(1)}px 6px rgba(255,255,255,.3)`;
  }
  function track(event){
    if(!finePointer.matches||reducedMotion.matches||event.pointerType!=='mouse')return;
    const element=event.target.closest(selector);
    if(!eligible(element)){if(active)clear();return}
    if(active!==element){clear();active=element;origin=element.getBoundingClientRect();if(!origin.width||!origin.height){clear();return}element.style.transition='transform 35ms linear, box-shadow 55ms linear';element.classList.add('tilt-live')}
    point={x:event.clientX,y:event.clientY};
    if(!frame)frame=requestAnimationFrame(draw);
  }
  document.addEventListener('pointermove',track,{passive:true});
  document.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'&&active&&active.contains(event.target)){pressed=true;point={x:event.clientX,y:event.clientY};if(!frame)frame=requestAnimationFrame(draw)}});
  document.addEventListener('pointerup',()=>{if(active){pressed=false;if(!frame)frame=requestAnimationFrame(draw)}});
  document.addEventListener('pointercancel',clear);
  window.addEventListener('blur',clear);
  window.addEventListener('scroll',clear,{passive:true});
  reducedMotion.addEventListener('change',clear);
  finePointer.addEventListener('change',clear);

  // A iluminação das bordas dos cartões acompanha o ponteiro sem mover os campos internos.
  const cardSelector='.surface,.form-surface,.modal-card,.profile-card,.summary-card,.guardian-command,.guardian-kpis article,.dashboard-card,.equipment-card,.chart-surface,.history-surface,.guardian-panel,.login-card,.notification-panel,.record,.queue-item,.panel,.metrics article,.overview-box,.user-card,.reminder-card,.suggestion,.standard,.intro';
  let card=null,cardFrame=0,cardPoint=null;
  function clearCard(){
    cancelAnimationFrame(cardFrame);cardFrame=0;cardPoint=null;
    if(card){card.style.removeProperty('--card-shadow');card.style.removeProperty('--card-transform');card.classList.remove('edge-live')}
    card=null;
  }
  function drawCard(){
    cardFrame=0;
    if(!card||!cardPoint)return;
    const rect=card.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const x=Math.max(-1,Math.min(1,(cardPoint.x-rect.left)/rect.width*2-1));
    const y=Math.max(-1,Math.min(1,(cardPoint.y-rect.top)/rect.height*2-1));
    card.style.setProperty('--card-shadow',`${(-x*13).toFixed(1)}px ${(16-y*8).toFixed(1)}px 32px rgba(3,54,83,.27), inset ${(x*3).toFixed(1)}px ${(y*3).toFixed(1)}px 3px rgba(220,249,255,.72), inset ${(-x*4).toFixed(1)}px ${(-y*4).toFixed(1)}px 8px rgba(5,84,116,.23), 0 0 0 1px rgba(7,84,116,.28)`);
    if(rect.width<=480&&!card.matches('button,[role="button"]'))card.style.setProperty('--card-transform',`perspective(1000px) rotateX(${(-y*2.5).toFixed(2)}deg) rotateY(${(x*3).toFixed(2)}deg) translateZ(3px)`);
  }
  document.addEventListener('pointermove',event=>{
    if(!finePointer.matches||reducedMotion.matches||event.pointerType!=='mouse'){clearCard();return}
    const next=event.target.closest(cardSelector);
    if(next!==card){clearCard();card=next;if(card)card.classList.add('edge-live')}
    if(card){cardPoint={x:event.clientX,y:event.clientY};if(!cardFrame)cardFrame=requestAnimationFrame(drawCard)}
  },{passive:true});
  window.addEventListener('scroll',clearCard,{passive:true});
  window.addEventListener('blur',clearCard);
  reducedMotion.addEventListener('change',clearCard);

  // A logo do cabeçalho responde ao cursor sem interferir nos botões ou no menu.
  const logo=document.querySelector('.floating-logo');
  if(logo){
    let logoFrame=0,logoPoint=null;
    const resetLogo=()=>{cancelAnimationFrame(logoFrame);logoFrame=0;logoPoint=null;logo.style.removeProperty('transform');logo.classList.remove('logo-tilt-live')};
    logo.addEventListener('pointermove',event=>{
      if(!finePointer.matches||reducedMotion.matches||event.pointerType!=='mouse')return;
      logoPoint={x:event.clientX,y:event.clientY};
      if(logoFrame)return;
      logoFrame=requestAnimationFrame(()=>{
        logoFrame=0;
        const r=logo.getBoundingClientRect();
        const x=Math.max(-1,Math.min(1,(logoPoint.x-r.left)/r.width*2-1));
        const y=Math.max(-1,Math.min(1,(logoPoint.y-r.top)/r.height*2-1));
        logo.classList.add('logo-tilt-live');
        logo.style.transform=`perspective(600px) translate3d(${(x*8).toFixed(1)}px,${(y*6).toFixed(1)}px,18px) rotateX(${(-y*13).toFixed(1)}deg) rotateY(${(x*17).toFixed(1)}deg) scale(1.06)`;
      });
    },{passive:true});
    logo.addEventListener('pointerleave',resetLogo);
    window.addEventListener('blur',resetLogo);
    reducedMotion.addEventListener('change',resetLogo);
  }
})();
