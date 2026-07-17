/** Schema 3.0 fortune engine. */
const FortuneEngine = {
  systems: null,
  fortuneData: {},

  async init() {
    if (!Array.isArray(window.FORTUNE_SYSTEMS)) {
      throw new Error('Missing official fortune catalog');
    }
    this.systems = window.FORTUNE_SYSTEMS;
    for (const system of this.systems) {
      this.loadFortuneData(system.systemId);
    }
    return this.systems;
  },

  getSystems() {
    return this.systems || [];
  },

  getSystemInfo(systemId) {
    return this.getSystems().find(system => system.systemId === systemId);
  },

  loadFortuneData(systemId) {
    if (this.fortuneData[systemId]) return this.fortuneData[systemId];
    const system = this.getSystemInfo(systemId);
    if (!system) throw new Error('Unknown official system: ' + systemId);
    const items = window[system.globalName];
    if (!Array.isArray(items) || items.length !== system.total) {
      throw new Error('Missing official data for ' + systemId);
    }
    const data = { systemId, name: system.name, items };
    this.fortuneData[systemId] = data;
    return data;
  },

  toDisplayFortune(item) {
    const domainNames = {
      overall: '總論',
      career: '事業',
      financial: '求財',
      relationship: '感情',
      marriage: '婚姻',
      medical: '健康',
      home: '家宅',
      exam: '考試',
      legal: '官司',
      travel: '出行',
      lost_property: '失物',
      interpersonal: '人際',
      spiritual: '修心建議',
      pregnancy: '求子／生育'
    };
    const categoryReadings = {};
    const insufficientDomains = [];
    const semanticReadings = window.SEMANTIC_READINGS?.[`${item.systemId}:${item.no}`] || {};
    for (const [key, domain] of Object.entries(item.modernDomains || {})) {
      const name = domainNames[key] || key;
      if (semanticReadings[key]) {
        categoryReadings[name] = semanticReadings[key];
      } else if (domain.inferenceLevel === 'insufficient' || !domain.text) {
        insufficientDomains.push(name);
      } else {
        categoryReadings[name] = domain.text;
      }
    }
    const warningText = (item.warningCodes || [])
      .map(code => window.SAFETY_WARNINGS && window.SAFETY_WARNINGS[code])
      .filter(Boolean);

    return Object.assign({}, item, {
      level: item.level?.raw || '未標',
      poem: item.originalText?.normalizedLines || [],
      story: item.story?.title || '',
      storyDetail: item.story?.laterDevelopment || '',
      classicMeaning: item.traditionalText?.raw || item.traditionalText?.summary || '',
      traditionalAvailability: item.traditionalText?.availability || '',
      traditionalSections: item.traditionalText?.sections || {},
      plainMeaning: item.plainMeaning?.text || '',
      categoryReadings,
      insufficientDomains,
      actionAdvice: item.actionAdvice || [],
      warnings: warningText
    });
  },

  async drawFortune(systemId) {
    const data = this.loadFortuneData(systemId);
    const index = RandomEngine.drawByThousandMode(data.items.length);
    return this.toDisplayFortune(data.items[index]);
  }
};

window.FortuneEngine = FortuneEngine;
