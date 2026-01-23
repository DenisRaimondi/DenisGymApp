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
        // Bottone INIZIA - mostra selezione giorno
        document.getElementById('btn-start')?.addEventListener('click', () => {
            this.showDaySelection();
        });

        // Bottone indietro dalla selezione giorno
        document.getElementById('btn-back-select')?.addEventListener('click', () => {
            this.showView('home-view');
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
            this.adjustWeight(-1);
        });

        document.getElementById('weight-plus')?.addEventListener('click', () => {
            this.adjustWeight(1);
        });

        // Bottone aiuto (video tutorial)
        document.getElementById('btn-help')?.addEventListener('click', () => {
            this.showExerciseHelp();
        });

        // Skip timer
        document.getElementById('btn-skip-timer')?.addEventListener('click', () => {
            Timer.skip();
        });

        // Navigation prev/next
        document.getElementById('btn-prev')?.addEventListener('click', () => {
            this.goToPrevExercise();
        });

        document.getElementById('btn-next')?.addEventListener('click', () => {
            this.goToNextExercise();
        });

        // Torna alla home
        document.getElementById('btn-home')?.addEventListener('click', async () => {
            await this.updateHome();
            this.showView('home-view');
        });
    },

    async showDaySelection() {
        const container = document.getElementById('day-buttons');
        const suggestedId = await Storage.getNextSchedaId(this.schede);

        container.innerHTML = this.schede.map(scheda => `
            <button class="btn-day ${scheda.id === suggestedId ? 'suggested' : ''}" data-id="${scheda.id}">
                <div class="btn-day-name">${scheda.nome}</div>
                <div class="btn-day-desc">${scheda.descrizione}</div>
            </button>
        `).join('');

        // Bind click events
        container.querySelectorAll('.btn-day').forEach(btn => {
            btn.addEventListener('click', () => {
                const schedaId = btn.dataset.id;
                this.startWorkout(schedaId);
            });
        });

        this.showView('select-day-view');
    },

    async startWorkout(schedaId) {
        this.currentScheda = this.schede.find(s => s.id === schedaId);
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
        this.updateNavButtons();

        // Progressive Overload check
        await this.checkAndShowOverloadHint(exercise.id);
    },

    async checkAndShowOverloadHint(exerciseId) {
        const hintEl = document.getElementById('progressive-overload-hint');
        const messageEl = document.getElementById('overload-message');

        if (!hintEl) return;

        // Determina incremento in base al gruppo muscolare
        const exercise = this.currentScheda.esercizi[this.currentExerciseIndex];
        const increment = this.getIncrementForExercise(exercise);

        // Controlla se è ora di aumentare (3 sessioni consecutive)
        const result = await Storage.checkProgressiveOverload(exerciseId, 3, increment);

        if (result.shouldIncrease) {
            messageEl.textContent = `${result.consecutiveSessions}x stesso peso → prova ${result.suggestedWeight} kg!`;
            hintEl.classList.remove('hidden');
        } else {
            hintEl.classList.add('hidden');
        }
    },

    // Incrementi differenziati per tipo di esercizio
    getIncrementForExercise(exercise) {
        const compoundGroups = ['petto', 'schiena', 'gambe', 'glutei'];
        const gruppo = exercise.gruppo?.toLowerCase() || '';

        // Esercizi compound (grandi): +5 kg
        // Esercizi isolamento (piccoli): +2 kg
        return compoundGroups.includes(gruppo) ? 5 : 2;
    },

    updateNavButtons() {
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        const total = this.currentScheda.esercizi.length;

        if (btnPrev) {
            btnPrev.disabled = this.currentExerciseIndex === 0;
        }
        if (btnNext) {
            btnNext.disabled = this.currentExerciseIndex === total - 1;
        }
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

    async goToPrevExercise() {
        if (this.currentExerciseIndex > 0) {
            this.currentExerciseIndex--;
            await this.showExercise();
        }
    },

    async goToNextExercise() {
        if (this.currentExerciseIndex < this.currentScheda.esercizi.length - 1) {
            this.currentExerciseIndex++;
            await this.showExercise();
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
