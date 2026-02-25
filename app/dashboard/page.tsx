'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Purchase {
  id: string;
  date: string;
  type: 'template' | 'analisi' | 'bundle' | 'subscription';
  nome: string;
  prezzo: number;
  status: 'completed' | 'pending' | 'failed';
  downloadUrl?: string;
  pdfUrl?: string;
  docxUrl?: string;
}

export default function DashboardPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'templates' | 'analisi'>('all');

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    setIsLoading(true);
    try {
      // TODO: Implementare API per recuperare acquisti utente
      // Per ora mock data
      const mockPurchases: Purchase[] = [
        {
          id: '1',
          date: '2026-02-24',
          type: 'template',
          nome: 'Contratto di Affitto',
          prezzo: 9.90,
          status: 'completed',
          pdfUrl: '/downloads/contratto-affitto-123.pdf',
          docxUrl: '/downloads/contratto-affitto-123.docx'
        },
        {
          id: '2',
          date: '2026-02-23',
          type: 'analisi',
          nome: 'Analisi AI - Controversia Condominiale',
          prezzo: 50.00,
          status: 'completed',
          pdfUrl: '/downloads/analisi-123.pdf'
        },
        {
          id: '3',
          date: '2026-02-22',
          type: 'bundle',
          nome: 'Bundle 3 Template',
          prezzo: 24.90,
          status: 'completed'
        }
      ];
      
      setPurchases(mockPurchases);
    } catch (error) {
      console.error('Errore caricamento acquisti:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPurchases = purchases.filter(p => {
    if (activeTab === 'all') return true;
    if (activeTab === 'templates') return p.type === 'template' || p.type === 'bundle';
    if (activeTab === 'analisi') return p.type === 'analisi';
    return true;
  });

  const stats = {
    totalSpent: purchases.reduce((sum, p) => sum + p.prezzo, 0),
    templatesCount: purchases.filter(p => p.type === 'template' || p.type === 'bundle').length,
    analisiCount: purchases.filter(p => p.type === 'analisi').length
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
              <p className="text-gray-600 mt-1">Dashboard</p>
            </div>
          </Link>
          <div className="flex gap-4">
            <Link href="/templates">
              <button className="px-6 py-2 text-purple-600 hover:bg-purple-50 rounded-lg">
                Template
              </button>
            </Link>
            <Link href="/pricing">
              <button className="px-6 py-2 text-purple-600 hover:bg-purple-50 rounded-lg">
                Pricing
              </button>
            </Link>
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Profilo
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Benvenuto nella tua Dashboard
          </h2>
          <p className="text-xl text-gray-600">
            Gestisci i tuoi acquisti e scarica i documenti
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">💰</div>
              <div className="text-3xl font-bold text-purple-600">
                €{stats.totalSpent.toFixed(2)}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Spesa Totale</h3>
            <p className="text-gray-600">Investimento in servizi legali</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">📄</div>
              <div className="text-3xl font-bold text-blue-600">
                {stats.templatesCount}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Template Acquistati</h3>
            <p className="text-gray-600">Documenti generati</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">🤖</div>
              <div className="text-3xl font-bold text-green-600">
                {stats.analisiCount}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Analisi AI</h3>
            <p className="text-gray-600">Casi analizzati</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-xl p-8 mb-12 text-white">
          <h3 className="text-2xl font-bold mb-6">Azioni Rapide</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/templates">
              <button className="w-full bg-white text-purple-600 font-semibold py-4 rounded-lg hover:bg-purple-50 transition-colors">
                📄 Genera Template
              </button>
            </Link>
            <Link href="/">
              <button className="w-full bg-white text-purple-600 font-semibold py-4 rounded-lg hover:bg-purple-50 transition-colors">
                🤖 Richiedi Analisi AI
              </button>
            </Link>
            <Link href="/pricing">
              <button className="w-full bg-white text-purple-600 font-semibold py-4 rounded-lg hover:bg-purple-50 transition-colors">
                ⭐ Upgrade a Pro
              </button>
            </Link>
          </div>
        </div>

        {/* Purchases Section */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'all'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tutti ({purchases.length})
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'templates'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Template ({stats.templatesCount})
              </button>
              <button
                onClick={() => setActiveTab('analisi')}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'analisi'
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Analisi AI ({stats.analisiCount})
              </button>
            </div>
          </div>

          {/* Purchases List */}
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="text-gray-600 mt-4">Caricamento...</p>
              </div>
            ) : filteredPurchases.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Nessun acquisto
                </h3>
                <p className="text-gray-600 mb-6">
                  Non hai ancora effettuato acquisti. Inizia esplorando i nostri template!
                </p>
                <Link href="/templates">
                  <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Esplora Template
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPurchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="border-2 border-gray-200 rounded-lg p-6 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1 mb-4 md:mb-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">
                            {purchase.type === 'template' ? '📄' : 
                             purchase.type === 'analisi' ? '🤖' : 
                             purchase.type === 'bundle' ? '📦' : '⭐'}
                          </span>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">
                              {purchase.nome}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {new Date(purchase.date).toLocaleDateString('it-IT', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-xl font-bold text-purple-600">
                            €{purchase.prezzo.toFixed(2)}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              purchase.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : purchase.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {purchase.status === 'completed' ? '✓ Completato' :
                             purchase.status === 'pending' ? '⏳ In corso' : '✗ Fallito'}
                          </span>
                        </div>
                      </div>

                      {/* Download Buttons */}
                      {purchase.status === 'completed' && (
                        <div className="flex flex-col sm:flex-row gap-2">
                          {purchase.pdfUrl && (
                            <a href={purchase.pdfUrl} download>
                              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                📄 Scarica PDF
                              </button>
                            </a>
                          )}
                          {purchase.docxUrl && (
                            <a href={purchase.docxUrl} download>
                              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                📝 Scarica DOCX
                              </button>
                            </a>
                          )}
                          {!purchase.pdfUrl && !purchase.docxUrl && (
                            <button className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed">
                              Download non disponibile
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-xl p-8">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">💬</div>
            <div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">
                Hai bisogno di aiuto?
              </h3>
              <p className="text-blue-800 mb-4">
                Il nostro team di supporto è pronto ad assisterti per qualsiasi domanda 
                sui tuoi acquisti o sui servizi.
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  📧 Contatta Supporto
                </button>
                <button className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50">
                  📚 Centro Assistenza
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="border-t border-gray-700 pt-8">
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
