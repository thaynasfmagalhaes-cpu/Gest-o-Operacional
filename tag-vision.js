export function normalizeTag(value){
  const raw=String(value??'').normalize('NFKC').toUpperCase().replace(/[–—−]/g,'-').replace(/\s+/g,'').trim();
  const match=raw.match(/^([A-Z]{1,12})-?(\d{1,15})$/);
  return match?`${match[1]}-${match[2]}`:'';
}

export function parseVisionAnswer(answer,catalog){
  const raw=String(answer??'').replace(/```(?:json)?/gi,'').trim();
  let result={};
  try{const start=raw.indexOf('{'),end=raw.lastIndexOf('}');if(start>=0&&end>start)result=JSON.parse(raw.slice(start,end+1))}catch{}
  const taggedText=raw.match(/\b(?:tag|etiqueta|identifica[cç][aã]o)\s*[:=\-]\s*["'`]?([A-Z]{1,12}\s*[-–—]?\s*\d{1,15})\b/i)?.[1]||'';
  const isolatedTag=raw.match(/^\s*["'`]?([A-Z]{1,12}\s*[-–—]\s*\d{1,15})\b/i)?.[1]||'';
  const tag=normalizeTag(result.tag)||normalizeTag(taggedText)||normalizeTag(isolatedTag),type=String(result.equipamento??result.equipment??'').trim();
  const canonical=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  let equipment=catalog.find(name=>canonical(name)===canonical(type));
  if(!equipment&&/\b(lixadeira|esmerilhadeira|rebarbadora|angle grinder)\b/i.test(type||raw))equipment=catalog.find(name=>canonical(name)==='esmerilhadeira'||canonical(name)==='lixadeira');
  if(!equipment&&type)equipment=catalog.find(name=>canonical(type).includes(canonical(name))&&canonical(name).length>5);
  return {tag,equipamento:equipment||'',aviso:tag&&equipment?'Confira a TAG e o equipamento antes de criar.':'Confira a foto e complete os campos não identificados.'};
}

export function parseTagAnswer(answer){
  const raw=String(answer??'').trim();
  if(/^(none|nenhuma|ileg[ií]vel|n[aã]o (?:consigo|vis[ií]vel|identificada))/i.test(raw))return '';
  const hyphenated=raw.match(/\b([A-Z]{1,12}\s*[-–—]\s*\d{1,15})\b/i)?.[1];
  const standalone=raw.match(/^\s*["'`]?([A-Z]{1,12}\d{1,15})["'`]?\s*[.!]?\s*$/i)?.[1];
  const labeled=raw.match(/(?:tag|etiqueta|label)\s*(?:is|reads|:|=)?\s*["'`]?([A-Z]{1,12}\d{1,15})\b/i)?.[1];
  const candidate=hyphenated||standalone||labeled;
  return normalizeTag(candidate);
}

export function parseEquipmentAnswer(answer,catalog){
  const raw=String(answer??'').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  if(!raw||/^(none|nenhum|desconhecido|ilegivel)/.test(raw))return '';
  const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  if(/\b(lixadeira|esmerilhadeira|rebarbadora|angle grinder)\b/.test(raw))return catalog.find(name=>['esmerilhadeira','lixadeira'].includes(normalize(name)))||'';
  return catalog.find(name=>raw.includes(normalize(name)))||'';
}
