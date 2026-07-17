/** Local state with legacy system-id migration. */
const State = {
  STORAGE_KEY: 'fortuneApp',
  defaultState: { isUnlocked:false, successiveHolyCount:0, lastCupResult:null, lastTarot:null, selectedFortuneSystem:null },
  migrate(value) {
    if (!value || typeof value !== 'object') return value;
    if (Array.isArray(value)) return value.map(item => this.migrate(item));
    const result = {};
    for (const [key, item] of Object.entries(value)) result[key] = this.migrate(item);
    for (const key of ['systemId','selectedFortuneSystem','fortuneSystem']) {
      if (result[key] === 'zhusheng_99') result[key] = 'zhusheng_30';
    }
    return result;
  },
  load() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const migrated = this.migrate(parsed);
        if (JSON.stringify(parsed) !== JSON.stringify(migrated)) localStorage.setItem(this.STORAGE_KEY, JSON.stringify(migrated));
        return Object.assign({}, this.defaultState, migrated);
      }
    } catch (error) { console.error('Failed to load state:', error); }
    return Object.assign({}, this.defaultState);
  },
  save(state) { try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.migrate(state))); } catch (error) { console.error('Failed to save state:', error); } },
  update(partial) { const state=Object.assign({},this.load(),partial); this.save(state); return state; },
  reset() { this.save(this.defaultState); return Object.assign({},this.defaultState); },
  handleCupResult(result) { const state=this.load(); state.successiveHolyCount=result==='holy'?state.successiveHolyCount+1:0; state.lastCupResult=result; if(state.successiveHolyCount>=3)state.isUnlocked=true; this.save(state); return state; },
  isUnlocked() { return this.load().isUnlocked; }
};
window.State = State;
