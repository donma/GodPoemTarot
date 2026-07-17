import { loadOfficial, readJson, writeJson, writeText, finish } from './lib.mjs';

const official = loadOfficial();
const tarotRoot = readJson('data/tarot/tarot-cards.json');
const tarot = tarotRoot.items || tarotRoot.cards || tarotRoot;
const sourceIds = new Set(readJson('data/source-index.json').sources.map(source => source.sourceId));
const errors = [];
const warnings = [];
const expected = new Map([
  ['guanyin_100',100],['guandi_100',100],['liu_shi_jia_zi_60',60],
['sizhen_49',49],['futian_120',120],
  ['zhusheng_30',30],['baosheng_60',60],['tianhou_100',100]
]);
const requiredWarnings = ['medical','pregnancy','legal','financial','relationship_safety','travel_safety','lost_property_security'];
let reviewPending = 0;

if (official.length !== 8) errors.push('Official fortune catalog must contain 8 systems (619 lots).');
for (const [id,count] of expected) {
  const entry = official.find(({system}) => system.systemId === id);
  if (!entry) errors.push('Missing official system '+id);
  else if (entry.items.length !== count) errors.push(id+' expected '+count+' records, got '+entry.items.length);
}
for (const {system,items} of official) {
  const numbers = items.map(item => item.no);
  if (numbers.some((number,index) => number !== index+1)) errors.push(system.systemId+' lot numbers are not continuous.');
  for (const item of items) {
    const label = system.systemId+'#'+item.no;
    if (item.systemId !== system.systemId) errors.push(label+' has wrong systemId.');
    if (!item.editionId) errors.push(label+' has no editionId.');
    if (!item.originalText?.normalizedLines?.length || item.originalText.normalizedLines.some(line => !String(line).trim())) errors.push(label+' has empty original text.');
    if (!item.traditionalText) errors.push(label+' has no traditionalText.');
    else if (!item.traditionalText.raw && !item.traditionalText.summary && item.traditionalText.availability !== 'not_found_in_selected_edition') errors.push(label+' has unexplained missing traditional text.');
    if (!item.story?.type || !item.story?.reliabilityGrade) errors.push(label+' has incomplete story classification.');
    if (!item.plainMeaning || !Array.isArray(item.plainMeaning.evidenceRefs)) errors.push(label+' has no evidence-linked plain meaning.');
    for (const [domain,reading] of Object.entries(item.modernDomains || {})) {
      const validInsufficient = reading.inferenceLevel === 'insufficient' && reading.text == null;
      const validReading = reading.text && reading.evidenceRefs?.length;
      if (!validInsufficient && !validReading) errors.push(label+' '+domain+' has neither evidence nor insufficient status.');
    }
    for (const code of requiredWarnings) if (!item.warningCodes?.includes(code)) errors.push(label+' missing warning '+code);
    for (const ref of [...(item.sourceRefs||[]),...(item.traditionalText?.sourceRefs||[]),...(item.story?.sourceRefs||[]),...(item.plainMeaning?.evidenceRefs||[])]) {
      if (!sourceIds.has(ref)) errors.push(label+' has unresolved source '+ref);
      if (/ai_guide|chatgpt|codex|generated|unknown/i.test(ref)) errors.push(label+' has prohibited source '+ref);
    }
    if (!item.sourceLocators?.some(locator => locator.locator && sourceIds.has(locator.sourceId))) errors.push(label+' has no resolvable source locator.');
    if (item.authoring?.reviewStatus !== 'approved') reviewPending++;
    if (/招募|人才|接班|夥伴尋找/.test(String(item.modernDomains?.financial?.text||''))) errors.push(label+' financial domain contains recruitment semantics.');
    if (/尚未建檔|資料載入中/.test(JSON.stringify(item))) errors.push(label+' contains placeholder text.');
  }
}
const fortuneTotal = official.reduce((sum,entry) => sum+entry.items.length,0);
if (fortuneTotal !== 619) errors.push('Fortune total must be 619.');
if (!Array.isArray(tarot) || tarot.length !== 78) errors.push('Tarot total must be 78.');
if (fortuneTotal + (tarot.length||0) !== 697) errors.push('Grand total must be 697.');
if (reviewPending) warnings.push(reviewPending+' records remain draft and require documented human review before approval.');

const counts = {
  generatedAt: new Date().toISOString(),
  fortuneSystems: official.map(({system,items}) => ({systemId:system.systemId,count:items.length,editionId:system.editionId,status:system.status})),
  fortuneTotal,
  tarotCount: tarot.length,
  grandTotal: fortuneTotal+tarot.length
};
const report = {status:errors.length?'FAIL':'PASS', errors, warnings, reviewPending, counts};
writeJson('system-count-report.json',counts);
writeJson('content-validation.json',report);
writeText('content-validation.md','# Content validation\n\nStatus: **'+report.status+'**\n\n- Fortune systems: '+official.length+'\n- Fortune records: '+fortuneTotal+'\n- Tarot cards: '+tarot.length+'\n- Grand total: '+(fortuneTotal+tarot.length)+'\n- Human review pending: '+reviewPending+'\n- Errors: '+errors.length+'\n\n'+(warnings.length?'## Warnings\n\n'+warnings.map(x=>'- '+x).join('\n')+'\n':''));
finish(report);
