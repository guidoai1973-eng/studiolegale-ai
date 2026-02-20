// Database studi legali (in-memory - migrabile a SQLite)

export interface StudioLegale {
  id: number;
  nome: string;
  citta: string;
  provincia: string;
  specializzazioni: string[];
  rating: number;
  bio: string;
  telefono: string;
  email: string;
  sito_web: string;
}

export const studiLegali: StudioLegale[] = [
  {
    id: 1,
    nome: "Studio Legale Rossi & Associati",
    citta: "Milano",
    provincia: "MI",
    specializzazioni: ["Diritto Civile", "Diritto Commerciale", "Contrattualistica"],
    rating: 4.8,
    bio: "Studio con oltre 30 anni di esperienza nel diritto civile e commerciale. Team di 12 avvocati specializzati.",
    telefono: "+39 02 1234567",
    email: "info@studiorossi.it",
    sito_web: "https://studiorossi.it"
  },
  {
    id: 2,
    nome: "Avvocato Mario Bianchi",
    citta: "Milano",
    provincia: "MI",
    specializzazioni: ["Diritto del Lavoro", "Licenziamenti", "Mobbing"],
    rating: 4.9,
    bio: "Specialista in diritto del lavoro con focus su contenziosi e vertenze sindacali. 15 anni di esperienza.",
    telefono: "+39 02 7654321",
    email: "m.bianchi@avvocatobianchi.it",
    sito_web: "https://mariobianchi.legal"
  },
  {
    id: 3,
    nome: "Studio Legale Verdi",
    citta: "Roma",
    provincia: "RM",
    specializzazioni: ["Diritto Penale", "Difesa Penale", "Reati Economici"],
    rating: 4.7,
    bio: "Studio penalistico di riferimento a Roma. Esperienza in reati economici e difesa d'ufficio.",
    telefono: "+39 06 9876543",
    email: "contatti@studioverdi.com",
    sito_web: "https://studioverdi.com"
  },
  {
    id: 4,
    nome: "Avvocato Laura Neri",
    citta: "Roma",
    provincia: "RM",
    specializzazioni: ["Diritto di Famiglia", "Divorzi", "Affidamento Minori"],
    rating: 5.0,
    bio: "Esperta in diritto di famiglia e tutela dei minori. Approccio empatico e professionale.",
    telefono: "+39 06 5551234",
    email: "laura.neri@avvocatoneri.it",
    sito_web: "https://lauraneri.legal"
  },
  {
    id: 5,
    nome: "Studio Legale Ferrari & Partners",
    citta: "Milano",
    provincia: "MI",
    specializzazioni: ["Diritto Immobiliare", "Compravendite", "Locazioni"],
    rating: 4.6,
    bio: "Studio specializzato in diritto immobiliare e urbanistica. Assistenza completa per transazioni.",
    telefono: "+39 02 4445566",
    email: "info@studioferrari.legal",
    sito_web: "https://ferraripartners.it"
  },
  {
    id: 6,
    nome: "Avvocato Giuseppe Conti",
    citta: "Napoli",
    provincia: "NA",
    specializzazioni: ["Diritto Penale", "Diritto Processuale", "Ricorsi"],
    rating: 4.5,
    bio: "Penalista con esperienza ventennale in tribunale. Specializzato in ricorsi e appelli.",
    telefono: "+39 081 2223344",
    email: "g.conti@avvocatoconti.it",
    sito_web: "https://giuseppeconti.legal"
  },
  {
    id: 7,
    nome: "Studio Legale Greco",
    citta: "Napoli",
    provincia: "NA",
    specializzazioni: ["Diritto Civile", "Risarcimento Danni", "Responsabilità Civile"],
    rating: 4.7,
    bio: "Studio focalizzato su risarcimento danni e responsabilità civile. Assistenza personalizzata.",
    telefono: "+39 081 7778899",
    email: "studio@grecolegale.it",
    sito_web: "https://studiogreco.com"
  },
  {
    id: 8,
    nome: "Avvocato Francesca Marino",
    citta: "Torino",
    provincia: "TO",
    specializzazioni: ["Diritto del Lavoro", "Contratti di Lavoro", "Infortuni"],
    rating: 4.8,
    bio: "Specialista in diritto del lavoro e infortuni sul lavoro. Assistenza ai lavoratori.",
    telefono: "+39 011 5556677",
    email: "f.marino@studiomarino.it",
    sito_web: "https://francescamarino.legal"
  },
  {
    id: 9,
    nome: "Studio Legale Romano & Soci",
    citta: "Roma",
    provincia: "RM",
    specializzazioni: ["Diritto Commerciale", "Società", "Contratti Internazionali"],
    rating: 4.9,
    bio: "Studio boutique specializzato in diritto societario e contrattualistica internazionale.",
    telefono: "+39 06 3334455",
    email: "info@romanoesoci.com",
    sito_web: "https://romanoesoci.it"
  },
  {
    id: 10,
    nome: "Avvocato Paolo Colombo",
    citta: "Milano",
    provincia: "MI",
    specializzazioni: ["Diritto Tributario", "Fiscale", "Contenzioso Tributario"],
    rating: 4.7,
    bio: "Tributarista con esperienza in contenzioso con Agenzia delle Entrate. Consulenza fiscale.",
    telefono: "+39 02 6667788",
    email: "p.colombo@colombotax.it",
    sito_web: "https://paolocolombo.legal"
  },
  {
    id: 11,
    nome: "Studio Legale De Luca",
    citta: "Napoli",
    provincia: "NA",
    specializzazioni: ["Diritto di Famiglia", "Separazioni", "Successioni"],
    rating: 4.6,
    bio: "Studio di famiglia con esperienza in separazioni consensuali e successioni ereditarie.",
    telefono: "+39 081 9998877",
    email: "studio@delucalegale.it",
    sito_web: "https://studiodeluca.legal"
  },
  {
    id: 12,
    nome: "Avvocato Elena Russo",
    citta: "Torino",
    provincia: "TO",
    specializzazioni: ["Diritto Penale", "Diritto Minorile", "Tutela Vittime"],
    rating: 5.0,
    bio: "Penalista specializzata in diritto minorile e tutela delle vittime di reato.",
    telefono: "+39 011 4443322",
    email: "e.russo@avvocatorusso.it",
    sito_web: "https://elenarusso.legal"
  },
  {
    id: 13,
    nome: "Studio Legale Galli",
    citta: "Milano",
    provincia: "MI",
    specializzazioni: ["Diritto Sanitario", "Malasanità", "Responsabilità Medica"],
    rating: 4.8,
    bio: "Studio specializzato in errori medici e responsabilità sanitaria. Tutela dei pazienti.",
    telefono: "+39 02 1112233",
    email: "info@studiogalli.it",
    sito_web: "https://gallilegale.it"
  },
  {
    id: 14,
    nome: "Avvocato Marco Esposito",
    citta: "Roma",
    provincia: "RM",
    specializzazioni: ["Diritto Amministrativo", "Appalti", "Urbanistica"],
    rating: 4.6,
    bio: "Esperto in diritto amministrativo e contenzioso con la PA. Consulenza su appalti pubblici.",
    telefono: "+39 06 2221133",
    email: "m.esposito@espositoavvocato.it",
    sito_web: "https://marcoesposito.legal"
  },
  {
    id: 15,
    nome: "Studio Legale Fontana",
    citta: "Torino",
    provincia: "TO",
    specializzazioni: ["Diritto delle Assicurazioni", "Sinistri", "RC Auto"],
    rating: 4.5,
    bio: "Studio focalizzato su diritto assicurativo e liquidazione sinistri. Assistenza rapida.",
    telefono: "+39 011 7776655",
    email: "studio@fontanalegale.com",
    sito_web: "https://studiofontana.it"
  },
  {
    id: 16,
    nome: "Avvocato Sara Lombardi",
    citta: "Milano",
    provincia: "MI",
    specializzazioni: ["Diritto Bancario", "Mutui", "Usura Bancaria"],
    rating: 4.9,
    bio: "Specialista in diritto bancario e tutela dei consumatori. Recupero da usura bancaria.",
    telefono: "+39 02 8889977",
    email: "s.lombardi@lombardilegal.it",
    sito_web: "https://saralombardi.legal"
  },
  {
    id: 17,
    nome: "Studio Legale Ricci",
    citta: "Roma",
    provincia: "RM",
    specializzazioni: ["Diritto dello Sport", "Contratti Sportivi", "Tesseramenti"],
    rating: 4.7,
    bio: "Studio boutique specializzato in diritto sportivo. Assistenza atleti e società.",
    telefono: "+39 06 5554433",
    email: "info@riccilegale.com",
    sito_web: "https://studioricci.legal"
  },
  {
    id: 18,
    nome: "Avvocato Roberto Moretti",
    citta: "Napoli",
    provincia: "NA",
    specializzazioni: ["Diritto del Consumo", "Class Action", "Truffe"],
    rating: 4.8,
    bio: "Difensore dei diritti dei consumatori. Esperienza in class action e contratti vessatori.",
    telefono: "+39 081 3332211",
    email: "r.moretti@morettiavvocato.it",
    sito_web: "https://robertomoretti.legal"
  },
  {
    id: 19,
    nome: "Studio Legale Martini & Co.",
    citta: "Torino",
    provincia: "TO",
    specializzazioni: ["Diritto dell'Energia", "Rinnovabili", "Regolamentazione"],
    rating: 4.6,
    bio: "Studio all'avanguardia nel diritto dell'energia e sostenibilità. Consulenza normativa.",
    telefono: "+39 011 6665544",
    email: "info@martinico.legal",
    sito_web: "https://martinico.it"
  },
  {
    id: 20,
    nome: "Avvocato Giulia Ferrari",
    citta: "Milano",
    provincia: "MI",
    specializzazioni: ["Diritto della Privacy", "GDPR", "Data Protection"],
    rating: 5.0,
    bio: "Esperta in privacy e protezione dati. DPO certificata. Consulenza GDPR per aziende.",
    telefono: "+39 02 9998866",
    email: "g.ferrari@ferrariprivacy.it",
    sito_web: "https://giuliaferrari.legal"
  }
];

// Funzione di ricerca studi legali
export function searchStudios(filters: {
  specializzazione?: string;
  citta?: string;
  minRating?: number;
}): StudioLegale[] {
  return studiLegali.filter(studio => {
    if (filters.specializzazione) {
      const hasSpec = studio.specializzazioni.some(spec => 
        spec.toLowerCase().includes(filters.specializzazione!.toLowerCase()) ||
        filters.specializzazione!.toLowerCase().includes(spec.toLowerCase())
      );
      if (!hasSpec) return false;
    }
    
    if (filters.citta) {
      if (studio.citta.toLowerCase() !== filters.citta.toLowerCase()) {
        return false;
      }
    }
    
    if (filters.minRating) {
      if (studio.rating < filters.minRating) {
        return false;
      }
    }
    
    return true;
  });
}

export function getStudioById(id: number): StudioLegale | undefined {
  return studiLegali.find(studio => studio.id === id);
}
