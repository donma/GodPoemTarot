/**
 * 亂數引擎 - 使用 Web Crypto API
 * 實作千數聚籤法
 */
const RandomEngine = {
    /**
     * 取得加密安全的隨機整數
     */
    getCryptoInt() {
        const arr = new Uint32Array(1);
        crypto.getRandomValues(arr);
        return arr[0];
    },

    /**
     * 千數聚籤法
     * @param {number} total - 總數 (例如 60 張籤就是 60)
     * @returns {number} - 抽中的 index (0-based)
     */
    drawByThousandMode(total) {
        while (true) {
            const counts = new Array(total).fill(0);

            for (let i = 0; i < 1000; i++) {
                const n = this.getCryptoInt();
                const index = n % total;
                counts[index]++;
            }

            const max = Math.max(...counts);
            const winners = [];

            for (let i = 0; i < counts.length; i++) {
                if (counts[i] === max) {
                    winners.push(i);
                }
            }

            if (winners.length === 1) {
                return winners[0];
            }
            // 如果並列第一，重來
        }
    },

    /**
     * 塔羅抽牌 (不重複)
     * @param {number} count - 要抽幾張
     * @param {number} total - 總牌數 (78)
     * @returns {Array<{index: number, isReversed: boolean}>}
     */
    drawTarotCards(count, total = 78) {
        const pool = Array.from({ length: total }, (_, i) => i);
        const results = [];

        for (let i = 0; i < count; i++) {
            const poolIndex = this.drawByThousandMode(pool.length);
            const cardIndex = pool[poolIndex];
            pool.splice(poolIndex, 1);

            // 正逆位判定: 0 = 正位, 1 = 逆位
            const isReversed = this.getCryptoInt() % 2 === 1;

            results.push({
                index: cardIndex,
                isReversed: isReversed
            });
        }

        return results;
    },

    /**
     * 擲筊
     * @returns {string} - "holy" (聖筊), "laugh" (笑筊), "yin" (陰筊)
     */
    throwCup() {
        const left = this.getCryptoInt() % 2;  // 0 = 平, 1 = 凸
        const right = this.getCryptoInt() % 2;

        if (left !== right) {
            return "holy";
        }

        if (left === 0 && right === 0) {
            return "laugh";
        }

        return "yin";
    }
};

// 匯出
window.RandomEngine = RandomEngine;
