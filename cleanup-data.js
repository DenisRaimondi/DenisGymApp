// Script da eseguire nella console del browser su https://denis-gym-app.web.app
// Dopo aver fatto login, apri DevTools (F12) > Console e incolla questo codice

(async function cleanupTestData() {
    const CUTOFF_DATE = '2026-01-21';

    if (!window.firebaseDb || !window.currentUser) {
        console.error('Devi essere loggato!');
        return;
    }

    const { doc, getDoc, setDoc } = window.firebaseModules;
    const docRef = doc(window.firebaseDb, 'gymapp', window.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        console.log('Nessun dato trovato');
        return;
    }

    const data = docSnap.data();
    let changes = [];

    // Pulisci history (sessioni di allenamento)
    if (data.history && Array.isArray(data.history)) {
        const originalCount = data.history.length;
        data.history = data.history.filter(session => {
            const sessionDate = session.data?.split('T')[0];
            return sessionDate >= CUTOFF_DATE;
        });
        const removed = originalCount - data.history.length;
        if (removed > 0) changes.push(`${removed} sessioni rimosse da history`);
    }

    // Pulisci weights (storico pesi)
    if (data.weights) {
        for (const exerciseId of Object.keys(data.weights)) {
            const exerciseData = data.weights[exerciseId];
            if (exerciseData.storico && Array.isArray(exerciseData.storico)) {
                const originalCount = exerciseData.storico.length;
                exerciseData.storico = exerciseData.storico.filter(entry => {
                    return entry.data >= CUTOFF_DATE;
                });
                const removed = originalCount - exerciseData.storico.length;
                if (removed > 0) {
                    changes.push(`${removed} entries rimosse da ${exerciseId}`);
                    // Aggiorna 'ultimo' peso
                    if (exerciseData.storico.length === 0) {
                        exerciseData.ultimo = 0;
                    } else {
                        exerciseData.ultimo = exerciseData.storico[exerciseData.storico.length - 1].peso;
                    }
                }
            }
        }
    }

    // NON toccare data.schede

    if (changes.length > 0) {
        await setDoc(docRef, data);
        console.log('✅ Pulizia completata:');
        changes.forEach(c => console.log('  -', c));
        console.log('\n⚠️ Ricarica la pagina per vedere le modifiche');
    } else {
        console.log('Nessun dato da rimuovere');
    }
})();
