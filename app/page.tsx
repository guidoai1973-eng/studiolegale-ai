'use client';

import { useState } from 'react';

interface StudioLegale {
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

interface Message {
  role: 'user' | 'assistant';
  content: string;
  studios?: StudioLegale[];
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Aggiungi messaggio utente
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Errore nella risposta del server');
      }

      const data = await response.json();
      
      // Salva conversationId per messaggi successivi
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      // Aggiungi risposta AI
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.suggestions || 'Mi dispiace, non sono riuscito a elaborare la tua richiesta.',
          studios: data.matched_studios,
        },
      ]);
    } catch (error) {
      console.error('Errore:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Si è verificato un errore. Riprova tra qualche istante.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              StudioLegale-AI.it
            </h1>
            <p className="text-gray-600 mt-1">Assistente legale intelligente</p>
          </div>
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Accedi
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">
            🤖 Powered by Claude AI
          </div>
          <h2 className="text-6xl font-bold text-gray-900 mb-6">
            Studio Legale<br />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Avv. Guido Motti
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            L'intelligenza artificiale analizza il tuo problema legale e ti fornisce 
            una prima valutazione utile. Assistenza professionale garantita.
          </p>
        </div>

        {/* AI Chat Interface */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
              <h3 className="text-2xl font-bold">Inizia la Conversazione</h3>
              <p className="text-purple-100 mt-2">
                Raccontami il tuo problema legale in linguaggio naturale
              </p>
            </div>

            {/* Chat Area */}
            <div className="p-8 min-h-[400px] max-h-[600px] overflow-y-auto bg-gray-50">
              {/* Welcome Message */}
              {messages.length === 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm mb-4 max-w-2xl">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
                      AI
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed">
                        Ciao! Sono l'assistente AI dello Studio Legale dell'Avv. Guido Motti. Descrivimi la tua situazione legale 
                        e ti fornirò una prima analisi utile. Ad esempio:
                      </p>
                      <ul className="mt-4 space-y-2 text-gray-600 text-sm">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          "Ho bisogno di un avvocato per un divorzio a Milano"
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          "Sono stato licenziato ingiustamente"
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          "Ho subito un incidente stradale e ho bisogno di assistenza"
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              {messages.map((message, index) => (
                <div key={index} className="mb-4">
                  {message.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-4 max-w-2xl">
                        <p className="leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="bg-white rounded-lg p-6 shadow-sm max-w-2xl">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                            AI
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      </div>

{/* Tutti i clienti vengono indirizzati a Guido Motti via email */}
                    </div>
                  )}
                </div>
              ))}

              {/* Loading */}
              {isLoading && (
                <div className="bg-white rounded-lg p-6 shadow-sm max-w-2xl">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
                      AI
                    </div>
                    <div className="flex-1">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t">
              <form onSubmit={handleSubmit} className="flex space-x-4">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Descrivi la tua situazione legale..."
                  disabled={isLoading}
                  className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg disabled:bg-gray-100"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Invio...' : 'Analizza'}
                </button>
              </form>
              <p className="text-xs text-gray-500 text-center">
                🔒 Le tue informazioni sono protette e confidenziali
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Analisi AI</h3>
            <p className="text-gray-600">
              L'AI comprende il tuo problema e identifica la specializzazione necessaria
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚖️</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Assistenza Professionale</h3>
            <p className="text-gray-600">
              Consulenza legale diretta con l'Avv. Guido Motti per il tuo caso specifico
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⏰</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Risposta Rapida</h3>
            <p className="text-gray-600">
              Parere legale dettagliato entro 24 ore dalla richiesta
            </p>
          </div>
        </div>
      </section>

      {/* CTA per Studi */}
      <section className="bg-gradient-to-r from-purple-900 to-blue-900 text-white py-16 mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Partner Studio Legale?</h3>
          <p className="text-xl mb-8 text-purple-100">
            Ricevi lead qualificati e pre-analizzati dall'AI
          </p>
          <button className="bg-white text-purple-900 font-semibold px-8 py-4 rounded-lg hover:bg-purple-50 transition-colors">
            Diventa Partner →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2026 StudioLegale-AI.it - Tutti i diritti riservati</p>
          <div className="mt-4 space-x-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Termini & Condizioni</a>
            <a href="#" className="hover:text-white">Come Funziona l'AI</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
