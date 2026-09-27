import {parseTagAnswer,parseEquipmentAnswer,parseVisionAnswer} from './tag-vision.js';

function answerText(response){
  const content=response?.choices?.[0]?.message?.content;
  return String(response?.answer??response?.response??response?.result?.answer??(typeof content==='string'?content:'')??'');
}

export async function recognizePhoto(ai,image,catalog){
  let tag='',equipamento='',origem='leitura principal';
  try{
    const response=await ai.run('@cf/qwen/qwen3.8-27b',{messages:[{role:'user',content:[{type:'text',text:`Read the exact asset code on the physical tag attached to this equipment and identify the equipment type. Reply as JSON with keys "tag" and "equipamento". Use an empty string if not clearly visible. Choose equipment from: ${catalog.join(', ')}. An angle grinder is Esmerilhadeira. Never guess a code.`},{type:'image_url',image_url:{url:image}}]}],stream:false,reasoning_effort:'low',max_completion_tokens:130});
    const found=parseVisionAnswer(answerText(response),catalog);
    tag=found.tag;equipamento=found.equipamento;
  }catch(error){console.error('Falha na leitura principal da foto:',error)}
  if(!tag||!equipamento){
    const model='@cf/moondream/moondream3.1-9B-A2B',requests=[];
    if(!tag)requests.push(ai.run(model,{task:'query',image,question:'Read only the asset identification code printed on a physical sticker attached to the equipment. Reply with the exact letters and digits from the sticker, or NONE if no code is readable. No explanation, no guesses.',stream:false,reasoning:false,temperature:0,max_tokens:80}).then(response=>({field:'tag',value:parseTagAnswer(answerText(response))})));
    if(!equipamento)requests.push(ai.run(model,{task:'query',image,question:`What kind of industrial equipment is shown? Reply with only one matching catalog name or NONE: ${catalog.join(', ')}. A handheld angle grinder is an Esmerilhadeira.`,stream:false,reasoning:false,temperature:0,max_tokens:80}).then(response=>({field:'equipamento',value:parseEquipmentAnswer(answerText(response),catalog)})));
    const results=await Promise.allSettled(requests);
    for(const item of results)if(item.status==='fulfilled'){if(item.value.field==='tag')tag=item.value.value||tag;else equipamento=item.value.value||equipamento}
    origem='leitura complementar';
  }
  return {tag,equipamento,origem,aviso:tag||equipamento?'Confira os dados encontrados na foto.':'Nenhuma TAG ou equipamento pôde ser identificado na foto.'};
}
