// Schede di allenamento predefinite (usate solo al primo avvio)
const SCHEDE_DEFAULT = [
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
                gruppo: "petto",
                videoUrl: "https://www.youtube.com/results?search_query=panca+piana+esecuzione+corretta+tutorial"
            },
            {
                id: "squat",
                nome: "Squat / Goblet Squat",
                serie: 3,
                ripetizioni: "12",
                recupero: 90,
                gruppo: "gambe",
                videoUrl: "https://www.youtube.com/results?search_query=squat+esecuzione+corretta+tutorial"
            },
            {
                id: "hip-thrust",
                nome: "Hip Thrust",
                serie: 3,
                ripetizioni: "12",
                recupero: 60,
                gruppo: "glutei",
                videoUrl: "https://www.youtube.com/results?search_query=hip+thrust+glutei+esecuzione+tutorial"
            },
            {
                id: "alzate-laterali",
                nome: "Alzate Laterali",
                serie: 3,
                ripetizioni: "15",
                recupero: 60,
                gruppo: "spalle",
                videoUrl: "https://www.youtube.com/results?search_query=alzate+laterali+spalle+esecuzione+tutorial"
            },
            {
                id: "curl-manubri",
                nome: "Curl Manubri",
                serie: 3,
                ripetizioni: "12",
                recupero: 60,
                gruppo: "bicipiti",
                videoUrl: "https://www.youtube.com/results?search_query=curl+manubri+bicipiti+esecuzione+tutorial"
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
                gruppo: "spalle",
                videoUrl: "https://www.youtube.com/results?search_query=shoulder+press+spalle+esecuzione+tutorial"
            },
            {
                id: "affondi",
                nome: "Affondi",
                serie: 3,
                ripetizioni: "10 per gamba",
                recupero: 90,
                gruppo: "gambe",
                videoUrl: "https://www.youtube.com/results?search_query=affondi+gambe+esecuzione+corretta+tutorial"
            },
            {
                id: "glute-bridge",
                nome: "Glute Bridge",
                serie: 3,
                ripetizioni: "15",
                recupero: 60,
                gruppo: "glutei",
                videoUrl: "https://www.youtube.com/results?search_query=glute+bridge+ponte+glutei+esecuzione+tutorial"
            },
            {
                id: "panca-inclinata",
                nome: "Panca Inclinata Manubri",
                serie: 3,
                ripetizioni: "12",
                recupero: 60,
                gruppo: "petto",
                videoUrl: "https://www.youtube.com/results?search_query=panca+inclinata+manubri+esecuzione+tutorial"
            },
            {
                id: "french-press",
                nome: "French Press / Tricipiti",
                serie: 3,
                ripetizioni: "12",
                recupero: 60,
                gruppo: "tricipiti",
                videoUrl: "https://www.youtube.com/results?search_query=french+press+tricipiti+esecuzione+tutorial"
            }
        ]
    }
];
