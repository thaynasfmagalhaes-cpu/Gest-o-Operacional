import {parseTagAnswer,parseEquipmentAnswer,parseVisionAnswer} from './tag-vision.js';

function answerText(response){
  const content=response?.choices?.[0]?.message?.content;
  return String(response?.answer??response?.response??response?.result?.answer??(typeof content==='string'?content:'')??'');
}

export async function recognizePhoto(ai,image,catalog){
  const moondream='@cf/moondream/moondream3.1-9B-A2B';
  const [tagResult,equipmentResult]=await Promise.allSettled([
    ai.run(moondream,{task:'query',image,question:'Read only the asset identification code printed on a physical sticker attached to the equipment. Reply with the exact letters and digits from the sticker, or NONE if no code is readable. No explanation, no guesses.',stream:false,reasoning:false,temperature:0,max_tokens:80}),
    ai.run(moondream,{task:'query',image,question:`What kind of industrial equipment is shown? Reply with only one matching catalog name or NONE: ${catalog.join(', ')}. A handheld angle grinder is an Esmerilhadeira.`,stream:false,reasoning:false,temperature:0,max_tokens:80})
  ]);
  let tag=tagResult.status==='fulfilled'?parseTagAnswer(answerText(tagResult.value)):'',equipamento=equipmentResult.status==='fulfilled'?parseEquipmentAnswer(answerText(equipmentResult.value),catalog):'';
  let origem='leitura inicial';
  if(!tag||!equipamento){
    try{
      const response=await ai.run('@cf/qwen/qwen3.8-27b',{messages:[{role:'user',content:[{type:'text',text:`Read the exact asset code on the physical tag attached to this equipment and identify the equipment type. Reply as JSON with keys "tag" and "equipamento". Use an empty string if not clearly visible. Choose equipment from: ${catalog.join(', ')}. An angle grinder is Esmerilhadeira. Never guess a code.`},{type:'image_url',image_url:{url:image}}]}],stream:false,reasoning_effort:'low',max_completion_tokens:180});
      const fallback=parseVisionAnswer(answerText(response),catalog);
      tag=tag||fallback.tag;equipamento=equipamento||fallback.equipamento;origem='leitura ampliada';
    }catch(error){console.error('Falha na leitura ampliada da foto:',error);origem='leitura inicial indisponível'}
  }
  return {tag,equipamento,origem,aviso:tag||equipamento?'Confira os dados encontrados na foto.':'Nenhuma TAG ou equipamento pôde ser identificado na foto.'};
}
