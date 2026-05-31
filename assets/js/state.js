/**
 * 狀態管理 - 使用 LocalStorage
 */
const State = {
    STORAGE_KEY: 'fortuneApp',

    defaultState: {
        isUnlocked: false,
        successiveHolyCount: 0,
        lastCupResult: null,
        lastFortune: null,
        lastTarot: null
    },

    /**
     * 載入狀態
     */
    load() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                return { ...this.defaultState, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.error('Failed to load state:', e);
        }
        return { ...this.defaultState };
    },

    /**
     * 儲存狀態
     */
    save(state) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('Failed to save state:', e);
        }
    },

    /**
     * 更新狀態
     */
    update(partial) {
        const state = this.load();
        const newState = { ...state, ...partial };
        this.save(newState);
        return newState;
    },

    /**
     * 重置狀態
     */
    reset() {
        this.save(this.defaultState);
        return { ...this.defaultState };
    },

    /**
     * 處理擲筊結果
     */
    handleCupResult(result) {
        const state = this.load();
        
        if (result === "holy") {
            state.successiveHolyCount++;
        } else {
            state.successiveHolyCount = 0;
        }

        state.lastCupResult = result;

        if (state.successiveHolyCount >= 3) {
            state.isUnlocked = true;
        }

        this.save(state);
        return state;
    },

    /**
     * 檢查是否已解鎖
     */
    isUnlocked() {
        const state = this.load();
        return state.isUnlocked;
    }
};

// 匯出
window.State = State;
