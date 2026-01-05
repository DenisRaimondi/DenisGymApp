// Timer per il recupero
const Timer = {
    intervalId: null,
    remainingSeconds: 0,
    onTick: null,
    onComplete: null,

    start(seconds, onTick, onComplete) {
        this.stop(); // Ferma timer precedente se esiste
        this.remainingSeconds = seconds;
        this.onTick = onTick;
        this.onComplete = onComplete;

        // Aggiorna subito
        if (this.onTick) {
            this.onTick(this.remainingSeconds);
        }

        this.intervalId = setInterval(() => {
            this.remainingSeconds--;

            if (this.onTick) {
                this.onTick(this.remainingSeconds);
            }

            if (this.remainingSeconds <= 0) {
                this.stop();
                this.playSound();
                this.vibrate();
                if (this.onComplete) {
                    this.onComplete();
                }
            }
        }, 1000);
    },

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    },

    skip() {
        this.stop();
        if (this.onComplete) {
            this.onComplete();
        }
    },

    // Suono di notifica (usa Web Audio API)
    playSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Crea un beep
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);

            // Secondo beep
            setTimeout(() => {
                const osc2 = audioContext.createOscillator();
                const gain2 = audioContext.createGain();

                osc2.connect(gain2);
                gain2.connect(audioContext.destination);

                osc2.frequency.value = 1000;
                osc2.type = 'sine';

                gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

                osc2.start(audioContext.currentTime);
                osc2.stop(audioContext.currentTime + 0.5);
            }, 200);

        } catch (e) {
            console.log('Audio non supportato:', e);
        }
    },

    // Vibrazione
    vibrate() {
        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
        }
    }
};
