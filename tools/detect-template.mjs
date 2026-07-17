import { loadOfficial, writeJson, finish } from './lib.mjs';

const official=loadOfficial();
const errors=[];
const normalize=text=>String(text||'').replace(/[「」『』“”"'，。！？；：、\s\d]/g,'').toLowerCase();
const grams=(text,n)=>{const value=normalize(text);const set=new Set();for(let i=0;i<=value.length-n;i++)set.add(value.slice(i,i+n));return set;};
const jaccard=(a,b)=>{if(!a.size&&!b.size)return 1;let hit=0;for(const value of a)if(b.has(value))hit++;return hit/(a.size+b.size-hit);};
const records=[];
for(const {system,items} of official)for(const item of items)for(const [domain,reading] of Object.entries(item.modernDomains||{}))if(reading.text&&reading.inferenceLevel!=='insufficient')records.push({systemId:system.systemId,no:item.no,domain,text:reading.text,norm:normalize(reading.text)});
const exact=new Map();
const sentences=new Map();
for(const record of records){
  const key=record.norm;
  if(key)(exact.get(key)||exact.set(key,[]).get(key)).push(record);
  for(const sentence of String(record.text).split(/[。！？!?]/).map(normalize).filter(value=>value.length>=12))(sentences.get(sentence)||sentences.set(sentence,[]).get(sentence)).push(record);
}
const exactDuplicates=[...exact.entries()].filter(([,rows])=>rows.length>1).map(([text,rows])=>({text,count:rows.length,records:rows.map(row=>row.systemId+'#'+row.no+'/'+row.domain)}));
for(const duplicate of exactDuplicates)errors.push('Exact normalized duplicate across '+duplicate.count+' readings.');
const repeatedSentences=[];
for(const [sentence,rows] of sentences){
  const lots=new Set(rows.map(row=>row.systemId+'#'+row.no));
  if(lots.size>=10){
    repeatedSentences.push({sentence,lotCount:lots.size});
    errors.push('Sentence pattern occurs across '+lots.size+' lots.');
  }
}
const similarity=[];
for(let i=0;i<records.length;i++)for(let j=i+1;j<records.length;j++){
  const a=records[i],b=records[j];
  const sameLot=a.systemId===b.systemId&&a.no===b.no;
  const sameDomain=a.domain===b.domain&&!(a.systemId===b.systemId&&a.no===b.no);
  if(!sameLot&&!sameDomain)continue;
  const score=(jaccard(grams(a.text,3),grams(b.text,3))+jaccard(grams(a.text,5),grams(b.text,5)))/2;
  const threshold=sameLot?.72:.80;
  if(score>threshold){
    similarity.push({a:a.systemId+'#'+a.no+'/'+a.domain,b:b.systemId+'#'+b.no+'/'+b.domain,score:Number(score.toFixed(4)),threshold});
    errors.push('Similarity threshold exceeded: '+similarity.at(-1).a+' <> '+similarity.at(-1).b);
  }
}
const report={status:errors.length?'FAIL':'PASS',errors,eligibleReadingCount:records.length,insufficientReadings:official.reduce((sum,x)=>sum+x.items.reduce((n,item)=>n+Object.values(item.modernDomains||{}).filter(r=>r.inferenceLevel==='insufficient').length,0),0),exactDuplicates,repeatedSentences,similarity};
writeJson('template-similarity.json',report);
finish(report);
