'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Template {
  id: string;
  nome: string;
  descrizione: string;
  prezzo: number;
  icon: string;
  categoria: string;
}

const templates: Template[] = [
  {
    id: 'contratto-affitto',
    nome: 'Contratto di Affitto',
    descrizione: 'Contratto di locazione ad uso abitativo completo e conforme alla normativa vigente',
    prezzo: 9.90,
    icon: '🏠',
    categoria: 'Immobiliare'
  },
  {
    id: 'nda',
    nome: 'Accordo di Non Divulgazione (NDA)',
    descrizione: 'Protezione della confidenzialità delle informazioni sensibili',
    prezzo: 9.90,
    icon: '🤐',
    categoria: 'Business'
  },
  {
    id: 'privacy-policy',
    nome: 'Privacy Policy GDPR',
    descrizione: 'Informativa privacy conforme al GDPR per siti web e app',
    prezzo: 9.90,
    icon: '🔒',
    categoria: 'Privacy'
  },
  {
    id: 'prestazione-occasionale',
    nome: 'Contratto Prestazione Occasionale',
    descrizione: 'Contratto per collaborazioni occasionali e prestazioni autonome',
    prezzo: 9.90,
    icon: '💼',
    categoria: 'Lavoro'
  },
  {
    id: 'diffida',
    nome: 'Lettera di Diffida',
    descrizione: 'Diffida formale per inadempimenti contrattuali o violazioni',
    prezzo: 9.90,
    icon: '⚠️',
    categoria: 'Contenzioso'
  },
  {
    id: 'recesso',
    nome: 'Comunicazione di Recesso',
    descrizione: 'Recesso da contratto con motivazioni e termini',
    prezzo: 9.90,
    icon: '🚪',
    categoria: 'Contrattuale'
  },
  {
    id: 'gdpr-compliance',
    nome: 'Kit GDPR Compliance',
    descrizione: 'Documentazione completa per adeguamento GDPR (privacy policy, cookie policy, consensi)',
    prezzo: 9.90,
    icon: '🛡️',
    categoria: 'Privacy'
  },
  {
    id: 'consulenza',
    nome: 'Contratto di Consulenza',
    descrizione: 'Contratto professionale per servizi di consulenza e advisory',
    prezzo: 9.90,
    icon: '📊',
    categoria: 'Business'
  },
  {
    id: 'liberatoria',
    nome: 'Liberatoria Uso Immagini',
    descrizione: 'Autorizzazione per uso di immagini, video e contenuti',
    prezzo: 9.90,
    icon: '📸',
    categoria: 'Media'
  },
  {
    id: 'separazione-beni',
    nome: 'Convenzione Separazione Beni',
    descrizione: 'Accordo patrimoniale per regime di separazione dei beni',
    prezzo: 9.90,
    icon: '💍',
    categoria: 'Famiglia'
  }
];

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutti');

  const categories = ['Tutti', ...Array.from(new Set(templates.map(t => t.categoria)))];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.descrizione.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tutti' || template.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/">
            <div className="cursor-pointer">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                StudioLegale-AI.it
              </h1>
              <p className="text-gray-600 mt-1">Template Legali</p>
            </div>
          </Link>
          <div className="flex gap-4">
            <Link href="/pricing">
              <button className="px-6 py-2 text-purple-600 hover:bg-purple-50 rounded-lg">
                Pricing
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Dashboard
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Disclaimer Deontologico */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">⚖️</div>
            <div>
              <h3 className="text-xl font-bold text-yellow-900 mb-2">
                ⚠️ Avviso Importante - Disclaimer Deontologico
              </h3>
              <p className="text-yellow-800 leading-relaxed">
                I documenti generati da questo servizio hanno <strong>esclusivo valore informativo e divulgativo</strong>. 
                NON costituiscono consulenza legale personalizzata né possono sostituire l'assistenza di un professionista abilitato.
                Per situazioni specifiche, è indispensabile rivolgersi a un avvocato iscritto all'Ordine.
                L'utilizzo di questi template è a esclusivo rischio dell'utente.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Template Legali <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">AI-Powered</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Documenti legali personalizzati con l'intelligenza artificiale di Claude.
            Compila il form, l'AI genera il documento su misura per te.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Cerca template..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-6 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-6 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bundle Offer */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-xl p-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">🎁 Risparmia con il Bundle</h3>
                <p className="text-purple-100">3 template a scelta per €24.90 invece di €29.70</p>
              </div>
              <Link href="/pricing">
                <button className="mt-4 md:mt-0 px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-colors">
                  Scopri Offerte →
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="text-5xl mb-4">{template.icon}</div>
                <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full mb-3">
                  {template.categoria}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {template.nome}
                </h3>
                <p className="text-gray-600 mb-4 min-h-[60px]">
                  {template.descrizione}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-purple-600">
                    €{template.prezzo.toFixed(2)}
                  </div>
                  <Link href={`/templates/${template.id}`}>
                    <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow">
                      Genera →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">Nessun template trovato. Prova con un'altra ricerca.</p>
          </div>
        )}
      </section>

      {/* Footer con Disclaimer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="border-t border-gray-700 pt-8">
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h4 className="text-white font-bold mb-3 text-lg">📋 Disclaimer Legale Completo</h4>
              <p className="text-sm leading-relaxed text-gray-300">
                I documenti e i template forniti da StudioLegale-AI.it sono generati tramite intelligenza artificiale 
                e hanno <strong>esclusivo valore informativo e divulgativo</strong>. Questi materiali NON costituiscono 
                consulenza legale professionale, pareri legali vincolanti, né possono sostituire l'assistenza diretta 
                di un avvocato iscritto all'Ordine degli Avvocati. Ogni situazione legale è unica e richiede una 
                valutazione personalizzata da parte di un professionista abilitato. L'utilizzo dei template e delle 
                informazioni fornite è a esclusivo rischio e responsabilità dell'utente. StudioLegale-AI.it e 
                l'Avv. Guido Motti declinano ogni responsabilità per danni diretti, indiretti, consequenziali o 
                di qualsiasi altra natura derivanti dall'utilizzo dei documenti generati. Si raccomanda vivamente 
                di consultare un avvocato prima di utilizzare qualsiasi documento per scopi legali vincolanti.
              </p>
            </div>
            <div className="text-center">
              <p className="mb-4">© 2026 StudioLegale-AI.it - Avv. Guido Motti - Tutti i diritti riservati</p>
              <div className="space-x-6">
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Termini & Condizioni</a>
                <a href="#" className="hover:text-white">Cookie Policy</a>
                <a href="#" className="hover:text-white">Contatti</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
