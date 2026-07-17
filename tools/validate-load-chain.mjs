import fs from 'node:fs';
import path from 'node:path';
import { root, loadCatalog, loadScript, writeJson, finish } from './lib.mjs';

const errors=[];
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script\s+src="([^"]+)"/g)].map(match=>match[1].split('?')[0]);
const catalog=loadCatalog();
const removed=['jiangdong-100-data.js','hongen-53-data.js','zhushengtang-64-data.js','xuanzhen-120-data.js','luzu-60-data.js','xuantian-49-data.js','poems_part1.ps1','zhusheng-30-new.js','sizhen-100-data.js','zhusheng-99-data.js'];
for(const name of removed){
  if(html.includes(name))errors.push('index.html still references removed file '+name);
  if(fs.existsSync(path.join(root,'assets/js',name)))errors.push('Removed file still exists '+name);
}
for(const system of catalog){
  if(!scripts.includes(system.dataFile))errors.push('HTML does not load '+system.dataFile);
  if(!fs.existsSync(path.join(root,system.dataFile)))errors.push('Missing official file '+system.dataFile);
  else{
    const data=loadScript(system.dataFile,[system.globalName])[system.globalName];
    if(!Array.isArray(data)||data.length!==system.total)errors.push(system.systemId+' global '+system.globalName+' missing or wrong count.');
  }
}
const officialDataScripts=scripts.filter(script=>/-data\.js$/.test(script));
const expectedDataScripts=catalog.map(system=>system.dataFile);
const supplementalDataScripts=['assets/js/semantic-readings-data.js'];
for(const script of officialDataScripts)if(!expectedDataScripts.includes(script)&&!supplementalDataScripts.includes(script))errors.push('Orphan data script loaded: '+script);
for(const required of ['assets/js/fortune-catalog.js','assets/js/safety-warnings.js',...supplementalDataScripts,'assets/js/fortune-engine.js'])if(!scripts.includes(required))errors.push('Missing required script '+required);
const indexOf=name=>scripts.indexOf(name);
if(indexOf('assets/js/fortune-catalog.js')>indexOf('assets/js/fortune-engine.js'))errors.push('Catalog must load before fortune engine.');
if(indexOf('assets/js/semantic-readings-data.js')>indexOf('assets/js/fortune-engine.js'))errors.push('Semantic readings must load before fortune engine.');
for(const system of catalog)if(indexOf(system.dataFile)>indexOf('assets/js/fortune-engine.js'))errors.push(system.dataFile+' must load before fortune engine.');
const engine=fs.readFileSync(path.join(root,'assets/js/fortune-engine.js'),'utf8');
for(const phrase of ['此籤詩文尚未建檔','資料載入中','請使用 HTTP 伺服器開啟','createPlaceholderFortune'])if(engine.includes(phrase))errors.push('Fortune engine contains prohibited fallback: '+phrase);
if(!engine.includes('Missing official data for '))errors.push('Fortune engine does not throw for missing official data.');
const oldIds=['zhusheng_99','luzu_60','xuantian_49','hongen_53','zhushengtang_64','xuanzhen_120'];
const activeFiles=['index.html','assets/js/fortune-catalog.js','assets/js/fortune-engine.js'];
for(const file of activeFiles){
  const text=fs.readFileSync(path.join(root,file),'utf8');
  for(const id of oldIds)if(text.includes(id))errors.push(file+' contains old systemId '+id);
}
const report={status:errors.length?'FAIL':'PASS',errors,scripts,officialSystems:catalog.map(system=>({systemId:system.systemId,dataFile:system.dataFile,globalName:system.globalName,total:system.total}))};
writeJson('load-chain-validation.json',report);
finish(report);
