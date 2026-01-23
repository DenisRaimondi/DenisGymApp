// Schede di allenamento predefinite (usate solo al primo avvio)
// 3 giorni a settimana - Ottimizzato per V-Shape + Recupero 48h
const SCHEDE_DEFAULT = [
    {
        id: "full-body-1",
        nome: "Giorno 1",
        descrizione: "Push: Petto, Spalle, Glutei",
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
                id: "shoulder-press",
                nome: "Shoulder Press",
                serie: 3,
                ripetizioni: "10",
                recupero: 90,
                gruppo: "spalle",
                videoUrl: "https://www.youtube.com/results?search_query=shoulder+press+spalle+esecuzione+tutorial"
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
                id: "hip-thrust",
                nome: "Hip Thrust",
                serie: 3,
                ripetizioni: "12",
                recupero: 60,
                gruppo: "glutei",
                videoUrl: "https://www.youtube.com/results?search_query=hip+thrust+glutei+esecuzione+tutorial"
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
    },
    {
        id: "full-body-2",
        nome: "Giorno 2",
        descrizione: "Pull + Petto: Schiena, Gambe, Bicipiti",
        esercizi: [
            {
                id: "croci-cavi",
                nome: "Croci ai Cavi",
                serie: 3,
                ripetizioni: "12",
                recupero: 60,
                gruppo: "petto",
                videoUrl: "https://www.youtube.com/results?search_query=croci+ai+cavi+petto+esecuzione+tutorial"
            },
            {
                id: "lat-machine",
                nome: "Lat Machine",
                serie: 3,
                ripetizioni: "12",
                recupero: 90,
                gruppo: "schiena",
                videoUrl: "https://www.youtube.com/results?search_query=lat+machine+dorsali+esecuzione+tutorial"
            },
            {
                id: "rematore-manubri",
                nome: "Rematore con Manubri",
                serie: 3,
                ripetizioni: "10",
                recupero: 90,
                gruppo: "schiena",
                videoUrl: "https://www.youtube.com/results?search_query=rematore+manubri+schiena+esecuzione+tutorial"
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
                id: "face-pull",
                nome: "Face Pull",
                serie: 3,
                ripetizioni: "15",
                recupero: 60,
                gruppo: "spalle",
                videoUrl: "https://www.youtube.com/results?search_query=face+pull+deltoide+posteriore+esecuzione+tutorial"
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
        id: "full-body-3",
        nome: "Giorno 3",
        descrizione: "Mix: Petto, Spalle, Glutei",
        esercizi: [
            {
                id: "panca-inclinata",
                nome: "Panca Inclinata Manubri",
                serie: 3,
                ripetizioni: "12",
                recupero: 90,
                gruppo: "petto",
                videoUrl: "https://www.youtube.com/results?search_query=panca+inclinata+manubri+esecuzione+tutorial"
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
                id: "stacco-rumeno",
                nome: "Stacco Rumeno",
                serie: 3,
                ripetizioni: "10",
                recupero: 90,
                gruppo: "glutei",
                videoUrl: "https://www.youtube.com/results?search_query=stacco+rumeno+romanian+deadlift+esecuzione+tutorial"
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
                id: "plank",
                nome: "Plank",
                serie: 3,
                ripetizioni: "30-60 sec",
                recupero: 60,
                gruppo: "core",
                videoUrl: "https://www.youtube.com/results?search_query=plank+addominali+core+esecuzione+tutorial"
            }
        ]
    }
];
