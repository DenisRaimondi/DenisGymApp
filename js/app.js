// App principale - Zero Sbatti Edition
const App = {
    currentScheda: null,
    currentExerciseIndex: 0,
    currentSeries: 1,
    currentWeight: 0,
    exerciseWeights: {},

    init() {
        this.updateHome();
        this.bindEvents();
        this.registerServiceWorker();
    },

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(() => {});
        }
    },

    // Aggiorna la home con la prossima scheda
    updateHome() {
        const nextSchedaId = Storage.getNextSchedaId(SCHEDE);
        const nextScheda = SCHEDE.find(s => s.id === nextSchedaId);

        document.getElementById('next-workout-label').textContent = `Oggi: ${nextScheda.nome}`;

        const total = Storage.getTotalWorkouts();
        document.getElementById('stats-label').textContent =
            total === 0 ? 'Primo allenamento!' :
            total === 1 ? '1 allenamento completato' :
            `${total} allenamenti completati`;
    },

    bindEvents() {
        // Bottone INIZIA
        document.getElementById('btn-start').addEventListener('click', () => {
            this.startWorkout();
        });

        // Bottone indietro
        document.getElementById('btn-back').addEventListener('click', () => {
            if (confirm('Abbandonare?')) {
                this.showView('home-view');
            }
        });

        // Bottone FATTO
        document.getElementById('btn-done').addEventListener('click', () => {
            this.completeSeries();
        });

        // Controlli peso
        document.getElementById('weight-minus').addEventListener('click', () => {
            this.adjustWeight(-2.5);
        });

        document.getElementById('weight-plus').addEventListener('click', () => {
            this.adjustWeight(2.5);
        });

        // Skip timer
        document.getElementById('btn-skip-timer').addEventListener('click', () => {
            Timer.skip();
        });

        // Torna alla home
        document.getElementById('btn-home').addEventListener('click', () => {
            this.updateHome();
            this.showView('home-view');
        });
    },

    // Inizia allenamento (auto-seleziona scheda)
    startWorkout() {
        const nextSchedaId = Storage.getNextSchedaId(SCHEDE);
        this.currentScheda = SCHEDE.find(s => s.id === nextSchedaId);
        this.currentExerciseIndex = 0;
        this.exerciseWeights = {};

        this.showExercise();
        this.showView('workout-view');
    },

    // Mostra esercizio corrente
    showExercise() {
        const exercise = this.currentScheda.esercizi[this.currentExerciseIndex];
        const total = this.currentScheda.esercizi.length;

        // Info esercizio
        document.getElementById('exercise-name').textContent = exercise.nome;
        document.getElementById('exercise-reps').textContent =
            `${exercise.serie} x ${exercise.ripetizioni}`;
        document.getElementById('exercise-counter').textContent =
            `${this.currentExerciseIndex + 1}/${total}`;

        // Reset serie
        this.currentSeries = 1;
        document.getElementById('series-current').textContent = this.currentSeries;
        document.getElementById('series-total').textContent = exercise.serie;

        // Peso (usa ultimo o 0)
        const lastWeight = Storage.getLastWeight(exercise.id);
        this.currentWeight = lastWeight !== null ? lastWeight : 0;
        this.updateWeightDisplay();
    },

    // Aggiorna display peso
    updateWeightDisplay() {
        document.getElementById('weight-value').textContent = `${this.currentWeight} kg`;
    },

    // Modifica peso
    adjustWeight(delta) {
        this.currentWeight = Math.max(0, this.currentWeight + delta);
        this.updateWeightDisplay();
    },

    // Completa una serie
    completeSeries() {
        const exercise = this.currentScheda.esercizi[this.currentExerciseIndex];

        // Salva peso
        if (this.currentWeight > 0) {
            Storage.saveWeight(exercise.id, this.currentWeight);
            this.exerciseWeights[exercise.id] = {
                nome: exercise.nome,
                peso: this.currentWeight
            };
        }

        // Prossima serie o prossimo esercizio
        if (this.currentSeries < exercise.serie) {
            // Avvia timer recupero
            this.startTimer(exercise.recupero, () => {
                this.currentSeries++;
                document.getElementById('series-current').textContent = this.currentSeries;
            });
        } else {
            // Prossimo esercizio o fine
            this.nextExercise();
        }
    },

    // Prossimo esercizio
    nextExercise() {
        if (this.currentExerciseIndex < this.currentScheda.esercizi.length - 1) {
            this.currentExerciseIndex++;
            this.showExercise();
        } else {
            this.completeWorkout();
        }
    },

    // Avvia timer recupero
    startTimer(seconds, onComplete) {
        const timerView = document.getElementById('timer-view');
        const timerDisplay = document.getElementById('timer-display');

        timerView.classList.add('active');

        Timer.start(
            seconds,
            (remaining) => {
                timerDisplay.textContent = remaining;
                if (remaining <= 5) {
                    timerDisplay.classList.add('warning');
                } else {
                    timerDisplay.classList.remove('warning');
                }
            },
            () => {
                timerView.classList.remove('active');
                timerDisplay.classList.remove('warning');
                if (onComplete) onComplete();
            }
        );
    },

    // Completa allenamento
    completeWorkout() {
        Storage.saveWorkoutSession(this.currentScheda, this.exerciseWeights);

        const summary = document.getElementById('workout-summary');
        const exerciseCount = Object.keys(this.exerciseWeights).length;

        summary.innerHTML = `
            <p>${this.currentScheda.nome}</p>
            <p>${exerciseCount} esercizi completati</p>
        `;

        this.showView('complete-view');
    },

    showView(viewId) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(viewId).classList.add('active');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
