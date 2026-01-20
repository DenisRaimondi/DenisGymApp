// App principale - Zero Sbatti Edition + Firebase
const App = {
    currentScheda: null,
    currentExerciseIndex: 0,
    currentSeries: 1,
    currentWeight: 0,
    exerciseWeights: {},
    schede: [], // Caricate da Firestore

    init() {
        this.bindAuthEvents();
        this.bindEvents();
        this.registerServiceWorker();
    },

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(() => {});
        }
    },

    bindAuthEvents() {
        // Login button
        document.getElementById('btn-login')?.addEventListener('click', async () => {
            const password = document.getElementById('password-input').value;
            const messageEl = document.getElementById('login-message');

            if (!password) {
                messageEl.textContent = 'Inserisci la password';
                return;
            }

            if (password.length < 6) {
                messageEl.textContent = 'Password: minimo 6 caratteri';
                return;
            }

            messageEl.textContent = 'Accesso...';
            const result = await window.loginWithPassword(password);

            if (result.success) {
                messageEl.textContent = result.created ? 'Account creato!' : 'Accesso riuscito!';
            } else {
                messageEl.textContent = 'Errore: ' + result.error;
            }
        });

        // Enter key on password field
        document.getElementById('password-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('btn-login')?.click();
            }
        });

        // Auth state changes
        window.addEventListener('userLoggedIn', async () => {
            Storage.setUser(window.currentUser.uid);
            Storage.clearCache();
            // Carica schede da Firestore (o inizializza con default)
            this.schede = await Storage.initSchedeIfNeeded(SCHEDE_DEFAULT);
            await this.updateHome();
            this.showView('home-view');
        });

        window.addEventListener('userLoggedOut', () => {
            Storage.setUser(null);
            Storage.clearCache();
            this.showView('login-view');
        });
    },

    async updateHome() {
        const nextSchedaId = await Storage.getNextSchedaId(this.schede);
        const nextScheda = this.schede.find(s => s.id === nextSchedaId);

        document.getElementById('next-workout-label').textContent = `Oggi: ${nextScheda.nome}`;

        const total = await Storage.getTotalWorkouts();
        document.getElementById('stats-label').textContent =
            total === 0 ? 'Primo allenamento!' :
            total === 1 ? '1 allenamento completato' :
            `${total} allenamenti completati`;
    },

    bindEvents() {
        // Bottone INIZIA
        document.getElementById('btn-start')?.addEventListener('click', () => {
            this.startWorkout();
        });

        // Bottone indietro
        document.getElementById('btn-back')?.addEventListener('click', () => {
            if (confirm('Abbandonare?')) {
                this.showView('home-view');
            }
        });

        // Bottone FATTO
        document.getElementById('btn-done')?.addEventListener('click', () => {
            this.completeSeries();
        });

        // Controlli peso
        document.getElementById('weight-minus')?.addEventListener('click', () => {
            this.adjustWeight(-2.5);
        });

        document.getElementById('weight-plus')?.addEventListener('click', () => {
            this.adjustWeight(2.5);
        });

        // Bottone aiuto (video tutorial)
        document.getElementById('btn-help')?.addEventListener('click', () => {
            this.showExerciseHelp();
        });

        // Skip timer
        document.getElementById('btn-skip-timer')?.addEventListener('click', () => {
            Timer.skip();
        });

        // Torna alla home
        document.getElementById('btn-home')?.addEventListener('click', async () => {
            await this.updateHome();
            this.showView('home-view');
        });
    },

    async startWorkout() {
        const nextSchedaId = await Storage.getNextSchedaId(this.schede);
        this.currentScheda = this.schede.find(s => s.id === nextSchedaId);
        this.currentExerciseIndex = 0;
        this.exerciseWeights = {};

        await this.showExercise();
        this.showView('workout-view');
    },

    async showExercise() {
        const exercise = this.currentScheda.esercizi[this.currentExerciseIndex];
        const total = this.currentScheda.esercizi.length;

        document.getElementById('exercise-name').textContent = exercise.nome;
        document.getElementById('exercise-reps').textContent =
            `${exercise.serie} x ${exercise.ripetizioni}`;
        document.getElementById('exercise-counter').textContent =
            `${this.currentExerciseIndex + 1}/${total}`;

        this.currentSeries = 1;
        document.getElementById('series-current').textContent = this.currentSeries;
        document.getElementById('series-total').textContent = exercise.serie;

        const lastWeight = await Storage.getLastWeight(exercise.id);
        this.currentWeight = lastWeight !== null ? lastWeight : 0;
        this.updateWeightDisplay();
    },

    updateWeightDisplay() {
        document.getElementById('weight-value').textContent = `${this.currentWeight} kg`;
    },

    adjustWeight(delta) {
        this.currentWeight = Math.max(0, this.currentWeight + delta);
        this.updateWeightDisplay();
    },

    showExerciseHelp() {
        const exercise = this.currentScheda.esercizi[this.currentExerciseIndex];
        if (exercise.videoUrl) {
            window.open(exercise.videoUrl, '_blank');
        }
    },

    async completeSeries() {
        const exercise = this.currentScheda.esercizi[this.currentExerciseIndex];

        if (this.currentWeight > 0) {
            await Storage.saveWeight(exercise.id, this.currentWeight);
            this.exerciseWeights[exercise.id] = {
                nome: exercise.nome,
                peso: this.currentWeight
            };
        }

        if (this.currentSeries < exercise.serie) {
            this.startTimer(exercise.recupero, () => {
                this.currentSeries++;
                document.getElementById('series-current').textContent = this.currentSeries;
            });
        } else {
            await this.nextExercise();
        }
    },

    async nextExercise() {
        if (this.currentExerciseIndex < this.currentScheda.esercizi.length - 1) {
            this.currentExerciseIndex++;
            await this.showExercise();
        } else {
            await this.completeWorkout();
        }
    },

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

    async completeWorkout() {
        await Storage.saveWorkoutSession(this.currentScheda, this.exerciseWeights);

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
