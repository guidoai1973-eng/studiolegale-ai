'use client';

import Link from 'next/link';
import { useState } from 'react';

interface PricingTier {
  id: string;
  nome: string;
  descrizione: string;
  prezzo: number;
  periodo?: string;
  features: string[];
  icon: string;
  popular?: boolean;
  cta: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'analisi-ai',
    nome: 'Analisi AI Professionale',
    descrizione: 'Analisi completa del tuo caso legale con accessori',
    prezzo: 50.00,
    icon: '🤖',
    features: [
      'Conversazione guidata con AI',
      'Analisi approfondita del caso',
      'Identificazione problematiche legali',
      'Suggerimenti normativi + giurisprudenza',
      'Report PDF dettagliato (10-15 pagine)',
      '✨ BONUS: 1 template gratuito a scelta',
      '✨ BONUS: Follow-up via email entro 7 giorni',
      'Risposta entro 2 ore',
      'Valida per 60 giorni'
    ],
    cta: 'Richiedi Analisi'
  },
  {
    id: 'template-singolo',
    nome: 'Template Singolo',
    descrizione: 'Un documento legale personalizzato',
    prezzo: 9.90,
    icon: '📄',
    features: [
      '1 template a scelta',
      'Personalizzazione con AI',
      'Formato PDF + DOCX',
      'Download immediato',
      'Supporto email',
      'Aggiornamenti normativi',
      'Garanzia soddisfatti o rimborsati'
    ],
    cta: 'Scegli Template'
  },
  {
    id: 'bundle-3',
    nome: 'Bundle 3 Template',
    descrizione: 'Risparmia con il pacchetto',
    prezzo: 24.90,
    icon: '📦',
    popular: true,
    features: [
      '3 template a scelta',
      'Risparmio di €4.80',
      'Personalizzazione illimitata',
      'PDF + DOCX + TXT',
      'Supporto prioritario',
      'Validi 90 giorni',
      'Bonus: 1 revisione gratuita'
    ],
    cta: 'Acquista Bundle'
  },
  {
    id: 'abbonamento',
    nome: 'Abbonamento Pro',
    descrizione: 'Soluzione completa per professionisti',
    prezzo: 29,
    periodo: 'mese',
    icon: '⭐',
    features: [
      'Template illimitati',
      'Analisi AI illimitate',
      'Accesso a tutti i template',
      'Aggiornamenti in tempo reale',
      'Supporto prioritario 24/7',
      'Consulenza email inclusa',
      'Dashboard avanzata',
      'API access (coming soon)'
    ],
    cta: 'Abbonati Ora'
  }
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleCheckout = async (tierId: string) => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: tierId,
          billingPeriod,
          quantity: 1
        })
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Errore checkout:', error);
      alert('Errore durante il checkout. Riprova.');
    }
  };

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
              <p className="text-gray-600 mt-1">Pricing</p>
            </div>
          </Link>
          <div className="flex gap-4">
            <Link href="/templates">
              <button className="px-6 py-2 text-purple-600 hover:bg-purple-50 rounded-lg">
                Template
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

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Prezzi <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Trasparenti</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Servizi legali potenziati dall'AI. Nessun costo nascosto, nessun abbonamento obbligatorio.
            Paga solo ciò di cui hai bisogno.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-lg">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensile
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-full transition-colors ${
                billingPeriod === 'yearly'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annuale
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="text-3xl">⚖️</div>
              <div>
                <h3 className="text-lg font-bold text-yellow-900 mb-2">
                  Avviso Deontologico
                </h3>
                <p className="text-yellow-800 text-sm">
                  Tutti i servizi offerti hanno <strong>valore informativo e divulgativo</strong>. 
                  Non costituiscono consulenza legale personalizzata. Per questioni specifiche, 
                  consultare sempre un avvocato abilitato.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-105 ${
                tier.popular ? 'ring-4 ring-purple-600' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                  PIÙ POPOLARE
                </div>
              )}

              <div className="p-8">
                <div className="text-6xl mb-4">{tier.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {tier.nome}
                </h3>
                <p className="text-gray-600 mb-6 min-h-[48px]">
                  {tier.descrizione}
                </p>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-purple-600">
                      €{tier.prezzo}
                    </span>
                    {tier.periodo && (
                      <span className="text-gray-600 ml-2">/{tier.periodo}</span>
                    )}
                  </div>
                  {tier.id === 'bundle-3' && (
                    <p className="text-sm text-green-600 font-semibold mt-2">
                      Risparmi €4.80 (€29.70 → €24.90)
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleCheckout(tier.id)}
                  className={`w-full py-4 rounded-xl font-bold transition-all mb-6 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {tier.cta}
                </button>

                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">
            Confronto Dettagliato
          </h3>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                    Funzionalità
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                    Analisi AI
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                    Template
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                    Bundle
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-purple-600">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Template disponibili</td>
                  <td className="px-6 py-4 text-center text-sm">-</td>
                  <td className="px-6 py-4 text-center text-sm">1</td>
                  <td className="px-6 py-4 text-center text-sm">3</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-purple-600">∞</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Analisi AI</td>
                  <td className="px-6 py-4 text-center text-sm">1</td>
                  <td className="px-6 py-4 text-center text-sm">-</td>
                  <td className="px-6 py-4 text-center text-sm">-</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-purple-600">∞</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Formati export</td>
                  <td className="px-6 py-4 text-center text-sm">PDF</td>
                  <td className="px-6 py-4 text-center text-sm">PDF + DOCX</td>
                  <td className="px-6 py-4 text-center text-sm">PDF + DOCX + TXT</td>
                  <td className="px-6 py-4 text-center text-sm">Tutti</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">Supporto</td>
                  <td className="px-6 py-4 text-center text-sm">Email</td>
                  <td className="px-6 py-4 text-center text-sm">Email</td>
                  <td className="px-6 py-4 text-center text-sm">Prioritario</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-purple-600">24/7</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">Dashboard avanzata</td>
                  <td className="px-6 py-4 text-center text-sm">-</td>
                  <td className="px-6 py-4 text-center text-sm">-</td>
                  <td className="px-6 py-4 text-center text-sm">-</td>
                  <td className="px-6 py-4 text-center text-sm">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-20">
          <h3 className="text-3xl font-bold text-center mb-12">
            Domande Frequenti
          </h3>
          <div className="space-y-6">
            <details className="bg-white rounded-lg shadow-lg p-6 cursor-pointer">
              <summary className="font-bold text-lg text-gray-900">
                I documenti generati sono validi legalmente?
              </summary>
              <p className="mt-4 text-gray-600">
                I documenti hanno valore informativo. Consigliamo sempre la revisione 
                da parte di un avvocato prima dell'utilizzo per scopi vincolanti.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-lg p-6 cursor-pointer">
              <summary className="font-bold text-lg text-gray-900">
                Posso modificare i template dopo averli scaricati?
              </summary>
              <p className="mt-4 text-gray-600">
                Sì, ricevi i documenti in formato DOCX modificabile. Puoi personalizzarli 
                ulteriormente con qualsiasi editor di testo.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-lg p-6 cursor-pointer">
              <summary className="font-bold text-lg text-gray-900">
                Posso disdire l'abbonamento in qualsiasi momento?
              </summary>
              <p className="mt-4 text-gray-600">
                Sì, puoi disdire in qualsiasi momento dal tuo dashboard. Non ci sono 
                vincoli contrattuali.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-lg p-6 cursor-pointer">
              <summary className="font-bold text-lg text-gray-900">
                Offrite garanzia soddisfatti o rimborsati?
              </summary>
              <p className="mt-4 text-gray-600">
                Sì, garanzia 14 giorni soddisfatti o rimborsati su tutti i prodotti.
              </p>
            </details>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-12 text-white">
            <h3 className="text-4xl font-bold mb-4">
              Pronto a Iniziare?
            </h3>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Genera il tuo primo documento legale in pochi minuti con l'AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/templates">
                <button className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-colors">
                  Esplora Template →
                </button>
              </Link>
              <Link href="/">
                <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
                  Richiedi Analisi AI
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="border-t border-gray-700 pt-8">
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h4 className="text-white font-bold mb-3 text-lg">📋 Disclaimer Legale</h4>
              <p className="text-sm leading-relaxed text-gray-300">
                I servizi offerti hanno esclusivo valore informativo e divulgativo. 
                Non costituiscono consulenza legale professionale né possono sostituire 
                l'assistenza di un avvocato abilitato. Utilizzo a esclusivo rischio dell'utente.
              </p>
            </div>
            <div className="text-center">
              <p className="mb-4">© 2026 StudioLegale-AI.it - Avv. Guido Motti</p>
              <div className="space-x-6">
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Termini & Condizioni</a>
                <a href="#" className="hover:text-white">Contatti</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
