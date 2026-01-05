// Storage helper per localStorage
const Storage = {
    KEYS: {
        WEIGHTS: 'gymapp_weights',
        HISTORY: 'gymapp_history'
    },

    // Salva i pesi per un esercizio
    saveWeight(exerciseId, weight) {
        const weights = this.getAllWeights();
        const today = new Date().toISOString().split('T')[0];

        if (!weights[exerciseId]) {
            weights[exerciseId] = {
                ultimo: weight,
                storico: []
            };
        }

        weights[exerciseId].ultimo = weight;
        weights[exerciseId].storico.push({
            data: today,
            peso: weight
        });

        // Mantieni solo gli ultimi 30 record
        if (weights[exerciseId].storico.length > 30) {
            weights[exerciseId].storico = weights[exerciseId].storico.slice(-30);
        }

        localStorage.setItem(this.KEYS.WEIGHTS, JSON.stringify(weights));
    },

    // Ottieni l'ultimo peso per un esercizio
    getLastWeight(exerciseId) {
        const weights = this.getAllWeights();
        return weights[exerciseId]?.ultimo || null;
    },

    // Ottieni tutti i pesi
    getAllWeights() {
        const data = localStorage.getItem(this.KEYS.WEIGHTS);
        return data ? JSON.parse(data) : {};
    },

    // Ottieni lo storico di un esercizio
    getWeightHistory(exerciseId) {
        const weights = this.getAllWeights();
        return weights[exerciseId]?.storico || [];
    },

    // Salva una sessione di allenamento
    saveWorkoutSession(scheda, exerciseWeights) {
        const history = this.getWorkoutHistory();
        const session = {
            data: new Date().toISOString(),
            schedaId: scheda.id,
            schedaNome: scheda.nome,
            esercizi: exerciseWeights
        };

        history.push(session);

        // Mantieni solo le ultime 50 sessioni
        if (history.length > 50) {
            history.shift();
        }

        localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history));
    },

    // Ottieni lo storico degli allenamenti
    getWorkoutHistory() {
        const data = localStorage.getItem(this.KEYS.HISTORY);
        return data ? JSON.parse(data) : [];
    },

    // Conta gli allenamenti totali
    getTotalWorkouts() {
        return this.getWorkoutHistory().length;
    },

    // Ottieni l'ultima scheda fatta
    getLastSchedaId() {
        const history = this.getWorkoutHistory();
        if (history.length === 0) return null;
        return history[history.length - 1].schedaId;
    },

    // Ottieni la prossima scheda da fare (alterna)
    getNextSchedaId(schede) {
        const lastId = this.getLastSchedaId();
        if (!lastId) return schede[0].id;

        const lastIndex = schede.findIndex(s => s.id === lastId);
        const nextIndex = (lastIndex + 1) % schede.length;
        return schede[nextIndex].id;
    }
};
