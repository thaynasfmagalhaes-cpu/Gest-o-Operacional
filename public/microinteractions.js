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
})();
