import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

if(Capacitor.isNativePlatform()){
  const cameraButton=document.querySelector('#takeEvidencePhoto');
  if(cameraButton){
    cameraButton.classList.remove('hidden');
    cameraButton.addEventListener('click',async()=>{
      cameraButton.disabled=true;
      try{
        const photo=await Camera.takePhoto({quality:85,saveToGallery:false});
        if(!photo.webPath)throw new Error('Não foi possível abrir a foto tirada.');
        const response=await fetch(photo.webPath);
        if(!response.ok)throw new Error('Não foi possível ler a foto tirada.');
        const blob=await response.blob();
        window.equipaQueueEvidence([new File([blob],`foto-${Date.now()}.jpg`,{type:blob.type||'image/jpeg'})]);
      }catch(error){if(!/cancel/i.test(error.message||''))alert(error.message||'Não foi possível usar a câmera.')}
      finally{cameraButton.disabled=false}
    });
  }
  document.addEventListener('click',event=>{
    if(event.target.closest('.button,.nav-item,.record-action,.auth-tab,.summary-card')){
      Haptics.impact({style:ImpactStyle.Light}).catch(()=>{});
    }
  });
}
