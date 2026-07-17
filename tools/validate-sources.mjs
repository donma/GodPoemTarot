import { loadOfficial, readJson, writeJson, finish } from './lib.mjs';

const official=loadOfficial();
const sources=readJson('data/source-index.json').sources;
const errors=[];
const warnings=[];
const seen=new Set();
for(const source of sources){
  if(seen.has(source.sourceId))errors.push('Duplicate sourceId '+source.sourceId);
  seen.add(source.sourceId);
  for(const field of ['sourceId','title','type','authorityLevel','edition','url','accessedAt','contentHash','locatorPolicy'])if(source[field]==null||source[field]==='')errors.push(source.sourceId+' missing '+field);
  if(/ai_guide|chatgpt|codex|generated|unknown/i.test(source.sourceId))errors.push('Prohibited sourceId '+source.sourceId);
  if(!/^https:\/\//.test(source.url))errors.push(source.sourceId+' must use an HTTPS URL.');
  if(!/^sha256:[0-9a-f]{64}$/.test(source.contentHash))errors.push(source.sourceId+' has invalid contentHash.');
  if(!/lot|page|line|number/i.test(source.locatorPolicy))errors.push(source.sourceId+' has no per-record locator policy.');
}
for(const {system,items} of official){
  for(const item of items){
    const label=system.systemId+'#'+item.no;
    const refs=new Set([...(item.sourceRefs||[]),...(item.traditionalText?.sourceRefs||[]),...(item.story?.sourceRefs||[]),...(item.plainMeaning?.evidenceRefs||[])]);
    for(const ref of refs)if(!seen.has(ref))errors.push(label+' unresolved source '+ref);
    for(const locator of item.sourceLocators||[]){
      if(!seen.has(locator.sourceId))errors.push(label+' locator uses unresolved source '+locator.sourceId);
      if(!/^lot\/[1-9][0-9]*$/.test(locator.locator||''))errors.push(label+' has invalid locator '+locator.locator);
    }
  }
}
const report={status:errors.length?'FAIL':'PASS',errors,warnings,sourceCount:sources.length,recordCount:official.reduce((sum,x)=>sum+x.items.length,0)};
writeJson('source-validation.json',report);
finish(report);
