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
      active.classList.remove('tilt-live');
    }
    active=null;origin=null;pressed=false;
  }
  function draw(){
    frame=0;
    if(!active||!point||!origin)return;
    const x=Math.max(-1,Math.min(1,(point.x-origin.left)/origin.width*2-1));
    const y=Math.max(-1,Math.min(1,(point.y-origin.top)/origin.height*2-1));
    const depth=pressed?-3:8;
    active.style.transform=`perspective(650px) translate3d(${(x*2.5).toFixed(2)}px,${(y*2.5).toFixed(2)}px,${depth}px) rotateX(${(-y*7).toFixed(2)}deg) rotateY(${(x*9).toFixed(2)}deg) scale(${pressed?.975:1})`;
    if(!active.classList.contains('notification-button'))active.style.boxShadow=`${(-x*6).toFixed(1)}px ${(9-y*4).toFixed(1)}px 20px rgba(4,52,75,.21), inset ${(x*2).toFixed(1)}px ${(y*2).toFixed(1)}px 4px rgba(255,255,255,.23)`;
  }
  function track(event){
    if(!finePointer.matches||reducedMotion.matches||event.pointerType!=='mouse')return;
    const element=event.target.closest(selector);
    if(!eligible(element)){if(active)clear();return}
    if(active!==element){clear();active=element;origin=element.getBoundingClientRect();if(!origin.width||!origin.height){clear();return}element.style.transition='transform 55ms linear, box-shadow 90ms linear';element.classList.add('tilt-live')}
    point={x:event.clientX,y:event.clientY};
    if(!frame)frame=requestAnimationFrame(draw);
  }
  document.addEventListener('pointermove',track,{passive:true});
  document.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'&&active&&active.contains(event.target)){pressed=true;point={x:event.clientX,y:event.clientY};if(!frame)frame=requestAnimationFrame(draw)}});
  document.addEventListener('pointerup',()=>{if(active){pressed=false;if(!frame)frame=requestAnimationFrame(draw)}});
  document.addEventListener('pointercancel',clear);
  window.addEventListener('blur',clear);
  reducedMotion.addEventListener('change',clear);
  finePointer.addEventListener('change',clear);
})();
