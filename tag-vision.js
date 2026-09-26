export function normalizeTag(value){
  const raw=String(value??'').normalize('NFKC').toUpperCase().replace(/[–—−]/g,'-').replace(/\s+/g,'').trim();
  const match=raw.match(/^([A-Z]{1,12})-?(\d{1,15})$/);
  return match?`${match[1]}-${match[2]}`:'';
}

export function parseVisionAnswer(answer,catalog){
  const raw=String(answer??'').replace(/```(?:json)?/gi,'').trim();
  let result;
  try{const start=raw.indexOf('{'),end=raw.lastIndexOf('}');result=JSON.parse(raw.slice(start,end+1))}catch{return {tag:'',equipamento:'',aviso:'Não foi possível interpretar a foto. Preencha os campos manualmente.'}}
  const tag=normalizeTag(result.tag),type=String(result.equipamento??'').trim();
  const canonical=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  let equipment=catalog.find(name=>canonical(name)===canonical(type));
  if(!equipment&&/^(lixadeira|esmerilhadeira|rebarbadora)( angular)?$/i.test(type))equipment=catalog.find(name=>canonical(name)==='esmerilhadeira'||canonical(name)==='lixadeira');
  return {tag,equipamento:equipment||'',aviso:tag&&equipment?'Confira a TAG e o equipamento antes de criar.':'Confira a foto e complete os campos não identificados.'};
}
