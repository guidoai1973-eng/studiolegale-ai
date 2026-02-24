'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface TemplateConfig {
  id: string;
  nome: string;
  descrizione: string;
  icon: string;
  fields: FormField[];
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'email' | 'date' | 'number' | 'select';
  placeholder?: string;
  required: boolean;
  options?: string[];
}

const templateConfigs: Record<string, TemplateConfig> = {
  'contratto-affitto': {
    id: 'contratto-affitto',
    nome: 'Contratto di Affitto',
    descrizione: 'Contratto di locazione ad uso abitativo',
    icon: '🏠',
    fields: [
      { id: 'locatore_nome', label: 'Nome Locatore', type: 'text', placeholder: 'Mario Rossi', required: true },
      { id: 'locatore_cf', label: 'Codice Fiscale Locatore', type: 'text', required: true },
      { id: 'conduttore_nome', label: 'Nome Conduttore', type: 'text', placeholder: 'Luigi Bianchi', required: true },
      { id: 'conduttore_cf', label: 'Codice Fiscale Conduttore', type: 'text', required: true },
      { id: 'indirizzo_immobile', label: 'Indirizzo Immobile', type: 'text', placeholder: 'Via Roma 123, Milano', required: true },
      { id: 'canone_mensile', label: 'Canone Mensile (€)', type: 'number', placeholder: '800', required: true },
      { id: 'durata_anni', label: 'Durata (anni)', type: 'select', required: true, options: ['4', '6', '3+2'] },
      { id: 'data_inizio', label: 'Data Inizio Locazione', type: 'date', required: true },
      { id: 'cauzione', label: 'Cauzione (mensilità)', type: 'number', placeholder: '2', required: true },
      { id: 'note_aggiuntive', label: 'Note Aggiuntive', type: 'textarea', placeholder: 'Eventuali clausole specifiche...', required: false }
    ]
  },
  'nda': {
    id: 'nda',
    nome: 'Accordo di Non Divulgazione (NDA)',
    descrizione: 'Protezione informazioni confidenziali',
    icon: '🤐',
    fields: [
      { id: 'parte_divulgante', label: 'Parte Divulgante (nome società/persona)', type: 'text', required: true },
      { id: 'parte_ricevente', label: 'Parte Ricevente (nome società/persona)', type: 'text', required: true },
      { id: 'scopo', label: 'Scopo della divulgazione', type: 'textarea', placeholder: 'Es: valutazione opportunità commerciale...', required: true },
      { id: 'durata_anni', label: 'Durata vincolo (anni)', type: 'number', placeholder: '5', required: true },
      { id: 'tipo', label: 'Tipo di NDA', type: 'select', required: true, options: ['Unilaterale', 'Bilaterale', 'Multilaterale'] },
      { id: 'penale', label: 'Penale per violazione (€)', type: 'number', placeholder: '10000', required: false },
      { id: 'foro_competente', label: 'Foro Competente', type: 'text', placeholder: 'Milano', required: true }
    ]
  },
  'privacy-policy': {
    id: 'privacy-policy',
    nome: 'Privacy Policy GDPR',
    descrizione: 'Informativa privacy conforme GDPR',
    icon: '🔒',
    fields: [
      { id: 'titolare_nome', label: 'Nome Titolare del Trattamento', type: 'text', required: true },
      { id: 'titolare_piva', label: 'P.IVA/CF Titolare', type: 'text', required: true },
      { id: 'titolare_indirizzo', label: 'Indirizzo Titolare', type: 'text', required: true },
      { id: 'titolare_email', label: 'Email Contatto', type: 'email', required: true },
      { id: 'sito_web', label: 'URL Sito Web', type: 'text', placeholder: 'https://esempio.it', required: true },
      { id: 'tipo_servizio', label: 'Tipo di Servizio/Attività', type: 'textarea', placeholder: 'Es: e-commerce, blog, SaaS...', required: true },
      { id: 'dati_raccolti', label: 'Tipologie di Dati Raccolti', type: 'textarea', placeholder: 'Es: nome, email, indirizzo IP...', required: true },
      { id: 'finalita', label: 'Finalità del Trattamento', type: 'textarea', placeholder: 'Es: erogazione servizi, marketing...', required: true },
      { id: 'usa_cookie', label: 'Utilizza Cookie?', type: 'select', required: true, options: ['Sì', 'No'] },
      { id: 'usa_analytics', label: 'Utilizza Analytics (Google/altro)?', type: 'select', required: true, options: ['Sì', 'No'] }
    ]
  },
  'prestazione-occasionale': {
    id: 'prestazione-occasionale',
    nome: 'Contratto Prestazione Occasionale',
    descrizione: 'Contratto collaborazione autonoma',
    icon: '💼',
    fields: [
      { id: 'committente_nome', label: 'Nome Committente', type: 'text', required: true },
      { id: 'committente_piva', label: 'P.IVA Committente', type: 'text', required: true },
      { id: 'prestatore_nome', label: 'Nome Prestatore', type: 'text', required: true },
      { id: 'prestatore_cf', label: 'Codice Fiscale Prestatore', type: 'text', required: true },
      { id: 'oggetto_prestazione', label: 'Oggetto della Prestazione', type: 'textarea', placeholder: 'Descrivi l\'attività da svolgere...', required: true },
      { id: 'compenso', label: 'Compenso Lordo (€)', type: 'number', placeholder: '1000', required: true },
      { id: 'data_inizio', label: 'Data Inizio', type: 'date', required: true },
      { id: 'data_fine', label: 'Data Fine/Consegna', type: 'date', required: true },
      { id: 'modalita_pagamento', label: 'Modalità di Pagamento', type: 'select', required: true, options: ['Bonifico', 'Assegno', 'Contanti'] }
    ]
  },
  'diffida': {
    id: 'diffida',
    nome: 'Lettera di Diffida',
    descrizione: 'Diffida formale per inadempimento',
    icon: '⚠️',
    fields: [
      { id: 'mittente_nome', label: 'Nome Mittente', type: 'text', required: true },
      { id: 'mittente_indirizzo', label: 'Indirizzo Mittente', type: 'text', required: true },
      { id: 'destinatario_nome', label: 'Nome Destinatario', type: 'text', required: true },
      { id: 'destinatario_indirizzo', label: 'Indirizzo Destinatario', type: 'text', required: true },
      { id: 'oggetto_controversia', label: 'Oggetto della Controversia', type: 'textarea', placeholder: 'Descrivi l\'inadempimento o la violazione...', required: true },
      { id: 'riferimento_contratto', label: 'Riferimento Contratto (se presente)', type: 'text', required: false },
      { id: 'richiesta', label: 'Richiesta Specifica', type: 'textarea', placeholder: 'Es: pagamento fattura n. XXX, restituzione beni, ecc.', required: true },
      { id: 'termine_giorni', label: 'Termine per Adempiere (giorni)', type: 'number', placeholder: '15', required: true }
    ]
  },
  'recesso': {
    id: 'recesso',
    nome: 'Comunicazione di Recesso',
    descrizione: 'Recesso da contratto',
    icon: '🚪',
    fields: [
      { id: 'recedente_nome', label: 'Nome di chi Recede', type: 'text', required: true },
      { id: 'controparte_nome', label: 'Nome Controparte', type: 'text', required: true },
      { id: 'tipo_contratto', label: 'Tipo di Contratto', type: 'text', placeholder: 'Es: fornitura servizi, locazione...', required: true },
      { id: 'data_contratto', label: 'Data Stipula Contratto', type: 'date', required: true },
      { id: 'motivo_recesso', label: 'Motivo del Recesso', type: 'textarea', placeholder: 'Indica il motivo del recesso...', required: true },
      { id: 'data_effetto', label: 'Data Effetto Recesso', type: 'date', required: true },
      { id: 'clausola_riferimento', label: 'Clausola Contrattuale di Riferimento', type: 'text', placeholder: 'Art. X del contratto', required: false }
    ]
  },
  'gdpr-compliance': {
    id: 'gdpr-compliance',
    nome: 'Kit GDPR Compliance',
    descrizione: 'Documentazione completa GDPR',
    icon: '🛡️',
    fields: [
      { id: 'azienda_nome', label: 'Ragione Sociale', type: 'text', required: true },
      { id: 'azienda_piva', label: 'P.IVA', type: 'text', required: true },
      { id: 'azienda_sede', label: 'Sede Legale', type: 'text', required: true },
      { id: 'dpo_presente', label: 'Hai un DPO (Data Protection Officer)?', type: 'select', required: true, options: ['Sì', 'No'] },
      { id: 'dpo_email', label: 'Email DPO (se presente)', type: 'email', required: false },
      { id: 'tipo_attivita', label: 'Tipo Attività', type: 'textarea', required: true },
      { id: 'trattamenti_speciali', label: 'Trattamenti Categorie Particolari (es: dati sanitari)', type: 'select', required: true, options: ['Sì', 'No'] },
      { id: 'paesi_extra_ue', label: 'Trasferimenti dati Extra-UE?', type: 'select', required: true, options: ['Sì', 'No'] }
    ]
  },
  'consulenza': {
    id: 'consulenza',
    nome: 'Contratto di Consulenza',
    descrizione: 'Contratto servizi di consulenza professionale',
    icon: '📊',
    fields: [
      { id: 'cliente_nome', label: 'Nome Cliente', type: 'text', required: true },
      { id: 'cliente_piva', label: 'P.IVA Cliente', type: 'text', required: true },
      { id: 'consulente_nome', label: 'Nome Consulente', type: 'text', required: true },
      { id: 'consulente_piva', label: 'P.IVA Consulente', type: 'text', required: true },
      { id: 'oggetto_consulenza', label: 'Oggetto della Consulenza', type: 'textarea', placeholder: 'Descrivi i servizi di consulenza...', required: true },
      { id: 'compenso_tipo', label: 'Tipo Compenso', type: 'select', required: true, options: ['Forfettario', 'Orario', 'A giornata'] },
      { id: 'importo_compenso', label: 'Importo (€)', type: 'number', required: true },
      { id: 'durata_incarico', label: 'Durata Incarico', type: 'text', placeholder: 'Es: 6 mesi, fino a progetto concluso...', required: true },
      { id: 'proprieta_intellettuale', label: 'Proprietà Intellettuale dei Deliverable', type: 'select', required: true, options: ['Cliente', 'Consulente', 'Condivisa'] }
    ]
  },
  'liberatoria': {
    id: 'liberatoria',
    nome: 'Liberatoria Uso Immagini',
    descrizione: 'Autorizzazione uso immagini/video',
    icon: '📸',
    fields: [
      { id: 'interessato_nome', label: 'Nome dell\'Interessato', type: 'text', required: true },
      { id: 'interessato_cf', label: 'Codice Fiscale Interessato', type: 'text', required: true },
      { id: 'minorenne', label: 'L\'interessato è minorenne?', type: 'select', required: true, options: ['No', 'Sì'] },
      { id: 'genitore_nome', label: 'Nome Genitore/Tutore (se minorenne)', type: 'text', required: false },
      { id: 'beneficiario_nome', label: 'Nome Beneficiario Liberatoria', type: 'text', required: true },
      { id: 'tipo_contenuto', label: 'Tipo Contenuto', type: 'select', required: true, options: ['Foto', 'Video', 'Foto e Video'] },
      { id: 'finalita_utilizzo', label: 'Finalità di Utilizzo', type: 'textarea', placeholder: 'Es: campagna marketing, sito web, social media...', required: true },
      { id: 'durata_autorizzazione', label: 'Durata Autorizzazione', type: 'select', required: true, options: ['Illimitata', '1 anno', '2 anni', '5 anni'] },
      { id: 'compenso', label: 'È previsto un compenso?', type: 'select', required: true, options: ['No', 'Sì'] },
      { id: 'importo_compenso', label: 'Importo Compenso (€) se previsto', type: 'number', required: false }
    ]
  },
  'separazione-beni': {
    id: 'separazione-beni',
    nome: 'Convenzione Separazione Beni',
    descrizione: 'Accordo regime patrimoniale',
    icon: '💍',
    fields: [
      { id: 'coniuge1_nome', label: 'Nome Primo Coniuge', type: 'text', required: true },
      { id: 'coniuge1_cf', label: 'Codice Fiscale Primo Coniuge', type: 'text', required: true },
      { id: 'coniuge1_nato', label: 'Nato a', type: 'text', required: true },
      { id: 'coniuge1_data_nascita', label: 'Data Nascita Primo Coniuge', type: 'date', required: true },
      { id: 'coniuge2_nome', label: 'Nome Secondo Coniuge', type: 'text', required: true },
      { id: 'coniuge2_cf', label: 'Codice Fiscale Secondo Coniuge', type: 'text', required: true },
      { id: 'coniuge2_nato', label: 'Nato a', type: 'text', required: true },
      { id: 'coniuge2_data_nascita', label: 'Data Nascita Secondo Coniuge', type: 'date', required: true },
      { id: 'data_matrimonio', label: 'Data Matrimonio (o prevista)', type: 'date', required: true },
      { id: 'comune_matrimonio', label: 'Comune Matrimonio', type: 'text', required: true }
    ]
  }
};

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const template = templateConfigs[slug];
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Template non trovato</h1>
          <Link href="/templates">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              ← Torna ai Template
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    const missingFields = template.fields
      .filter(f => f.required && !formData[f.id])
      .map(f => f.label);

    if (missingFields.length > 0) {
      setError(`Campi obbligatori mancanti: ${missingFields.join(', ')}`);
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: template.id,
          formData,
          userEmail: 'user@example.com' // TODO: Get from auth
        })
      });

      if (!response.ok) {
        throw new Error('Errore nella generazione del documento');
      }

      const data = await response.json();
      
      // Redirect to payment or download
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/templates">
            <div className="cursor-pointer">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ← Template
              </h1>
            </div>
          </Link>
        </div>
      </header>

      {/* Form */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{template.icon}</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">{template.nome}</h2>
          <p className="text-xl text-gray-600">{template.descrizione}</p>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-8">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Documento informativo:</strong> non costituisce consulenza legale personalizzata. 
            Verrà generato con watermark "Documento informativo - non consulenza legale".
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            {template.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required={field.required}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Seleziona...</option>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-3xl font-bold text-purple-600">€9.90</p>
                <p className="text-sm text-gray-600">Pagamento sicuro con Stripe</p>
              </div>
              <button
                type="submit"
                disabled={isGenerating}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generazione in corso...' : 'Genera Documento →'}
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Riceverai il documento in formato PDF e DOCX via email dopo il pagamento
            </p>
          </div>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="border-t border-gray-700 pt-8">
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h4 className="text-white font-bold mb-3 text-lg">📋 Disclaimer Legale</h4>
              <p className="text-sm leading-relaxed text-gray-300">
                I documenti generati hanno esclusivo valore informativo. NON costituiscono consulenza legale 
                né sostituiscono l'assistenza di un avvocato. Utilizzo a esclusivo rischio dell'utente.
              </p>
            </div>
            <div className="text-center">
              <p>© 2026 StudioLegale-AI.it - Avv. Guido Motti</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
