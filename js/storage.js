// Storage helper - Firestore
const Storage = {
    userId: null,

    setUser(uid) {
        this.userId = uid;
    },

    async loadData() {
        if (!this.userId || !window.firebaseDb) return null;

        const { doc, getDoc } = window.firebaseModules;
        const docRef = doc(window.firebaseDb, 'gymapp', this.userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        }
        return { weights: {}, history: [] };
    },

    async saveData(data) {
        if (!this.userId || !window.firebaseDb) return;

        const { doc, setDoc } = window.firebaseModules;
        const docRef = doc(window.firebaseDb, 'gymapp', this.userId);
        await setDoc(docRef, data);
    },

    // Cache locale per performance
    _cache: null,

    async getCache() {
        if (!this._cache) {
            this._cache = await this.loadData() || { weights: {}, history: [] };
        }
        return this._cache;
    },

    async saveWeight(exerciseId, weight) {
        const data = await this.getCache();
        const today = new Date().toISOString().split('T')[0];

        if (!data.weights[exerciseId]) {
            data.weights[exerciseId] = {
                ultimo: weight,
                storico: []
            };
        }

        data.weights[exerciseId].ultimo = weight;

        // Solo 1 entry per giorno - aggiorna se esiste, altrimenti aggiungi
        const storico = data.weights[exerciseId].storico;
        const todayIndex = storico.findIndex(entry => entry.data === today);

        if (todayIndex >= 0) {
            // Aggiorna entry esistente per oggi
            storico[todayIndex].peso = weight;
        } else {
            // Aggiungi nuova entry
            storico.push({
                data: today,
                peso: weight
            });
        }

        if (storico.length > 30) {
            data.weights[exerciseId].storico = storico.slice(-30);
        }

        this._cache = data;
        await this.saveData(data);
    },

    async getLastWeight(exerciseId) {
        const data = await this.getCache();
        return data.weights[exerciseId]?.ultimo || null;
    },

    // Progressive Overload: controlla se è ora di aumentare il peso
    // Ritorna { shouldIncrease: bool, currentWeight: number, suggestedWeight: number, consecutiveSessions: number }
    async checkProgressiveOverload(exerciseId, minSessions = 3, increment = 2.5) {
        const data = await this.getCache();
        const exerciseData = data.weights[exerciseId];

        if (!exerciseData || !exerciseData.storico || exerciseData.storico.length < minSessions) {
            return { shouldIncrease: false };
        }

        const storico = exerciseData.storico;
        const currentWeight = exerciseData.ultimo;

        // Conta sessioni consecutive con lo stesso peso (partendo dalla più recente)
        let consecutiveSessions = 0;
        for (let i = storico.length - 1; i >= 0; i--) {
            if (storico[i].peso === currentWeight) {
                consecutiveSessions++;
            } else {
                break;
            }
        }

        if (consecutiveSessions >= minSessions) {
            return {
                shouldIncrease: true,
                currentWeight: currentWeight,
                suggestedWeight: currentWeight + increment,
                consecutiveSessions: consecutiveSessions
            };
        }

        return { shouldIncrease: false, consecutiveSessions: consecutiveSessions };
    },

    async saveWorkoutSession(scheda, exerciseWeights) {
        const data = await this.getCache();

        const session = {
            data: new Date().toISOString(),
            schedaId: scheda.id,
            schedaNome: scheda.nome,
            esercizi: exerciseWeights
        };

        data.history.push(session);

        if (data.history.length > 50) {
            data.history.shift();
        }

        this._cache = data;
        await this.saveData(data);
    },

    async getWorkoutHistory() {
        const data = await this.getCache();
        return data.history || [];
    },

    async getTotalWorkouts() {
        const history = await this.getWorkoutHistory();
        return history.length;
    },

    async getLastSchedaId() {
        const history = await this.getWorkoutHistory();
        if (history.length === 0) return null;
        return history[history.length - 1].schedaId;
    },

    async getNextSchedaId(schede) {
        const lastId = await this.getLastSchedaId();
        if (!lastId) return schede[0].id;

        const lastIndex = schede.findIndex(s => s.id === lastId);
        const nextIndex = (lastIndex + 1) % schede.length;
        return schede[nextIndex].id;
    },

    clearCache() {
        this._cache = null;
        this._schedeCache = null;
    },

    // Gestione Schede
    _schedeCache: null,

    async getSchede() {
        if (this._schedeCache) return this._schedeCache;

        if (!this.userId || !window.firebaseDb) return null;

        const { doc, getDoc } = window.firebaseModules;
        const docRef = doc(window.firebaseDb, 'gymapp', this.userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().schede) {
            this._schedeCache = docSnap.data().schede;
            return this._schedeCache;
        }
        return null;
    },

    async saveSchede(schede) {
        if (!this.userId || !window.firebaseDb) return;

        const data = await this.getCache();
        data.schede = schede;
        this._schedeCache = schede;
        await this.saveData(data);
    },

    async initSchedeIfNeeded(defaultSchede) {
        const existing = await this.getSchede();
        if (!existing || existing.length === 0) {
            await this.saveSchede(defaultSchede);
            return defaultSchede;
        }
        return existing;
    }
};
