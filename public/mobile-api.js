/* O pacote nativo usa o mesmo backend da versão web. */
window.equipaApiUrl=function(path){
  const native=window.Capacitor?.isNativePlatform?.()||location.protocol==='capacitor:';
  return native?`https://gest-o-operacional.thaynas-f-magalhaes.workers.dev${path}`:path;
};
