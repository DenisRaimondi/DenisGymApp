// Schede di allenamento predefinite
const SCHEDE = [
    {
        id: "full-body-1",
        nome: "Full Body A",
        descrizione: "Petto, Glutei, Bicipiti",
        esercizi: [
            {
                id: "panca-piana",
                nome: "Panca Piana",
                serie: 3,
                ripetizioni: "10",
                recupero: 90,
                gruppo: "petto"
            },
            {
                id: "squat",
                nome: "Squat / Goblet Squat",
                serie: 3,
                ripetizioni: "12",
                recupero: 90,
                gruppo: "gambe"
            },
            {
                id: "hip-thrust",
                nome: "Hip Thrust",
                serie: 3,
                ripetizioni: "12",
                recupero: 60,
                gruppo: "glutei"
            },
            {
                id: "alzate-laterali",
                nome: "Alzate Laterali",
                serie: 3,
                ripetizioni: "15",
                recupero: 60,
                gruppo: "spalle"
            },
            {
                id: "curl-manubri",
                nome: "Curl Manubri",
                serie: 3,
                ripetizioni: "12",
                recupero: 60,
                gruppo: "bicipiti"
            }
        ]
    },
    {
        id: "full-body-2",
        nome: "Full Body B",
        descrizione: "Spalle, Glutei, Tricipiti",
        esercizi: [
            {
                id: "shoulder-press",
                nome: "Shoulder Press",
                serie: 3,
                ripetizioni: "10",
                recupero: 90,
                gruppo: "spalle"
            },
            {
                id: "affondi",
                nome: "Affondi",
                serie: 3,
                ripetizioni: "10 per gamba",
                recupero: 90,
                gruppo: "gambe"
            },
            {
                id: "glute-bridge",
                nome: "Glute Bridge",
                serie: 3,
                ripetizioni: "15",
                recupero: 60,
                gruppo: "glutei"
            },
            {
                id: "panca-inclinata",
                nome: "Panca Inclinata Manubri",
                serie: 3,
                ripetizioni: "12",
                recupero: 60,
                gruppo: "petto"
            },
            {
                id: "french-press",
                nome: "French Press / Tricipiti",
                serie: 3,
                ripetizioni: "12",
                recupero: 60,
                gruppo: "tricipiti"
            }
        ]
    }
];
