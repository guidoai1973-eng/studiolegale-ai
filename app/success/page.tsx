'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [parere, setParere] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (sessionId) {
      // In produzione, verifica pagamento e genera PDF
      // Per ora simuliamo successo
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Generazione parere legale in corso...</p>
          <p className="text-sm text-gray-500 mt-2">Questo richiederà circa 30 secondi</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Errore</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Torna alla Home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="text-green-600 text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pagamento Completato!</h1>
            <p className="text-gray-600">Il tuo parere legale dettagliato è stato generato</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="font-bold text-lg text-gray-900 mb-2">📧 Email inviata</h2>
              <p className="text-gray-700">
                Ti abbiamo inviato il parere legale completo in formato PDF all'indirizzo email fornito.
                Controlla anche la cartella spam se non lo trovi.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 mb-6">
              <h2 className="font-bold text-lg text-gray-900 mb-2">📄 Cosa include il parere:</h2>
              <ul className="text-gray-700 space-y-2">
                <li>✅ Inquadramento giuridico completo</li>
                <li>✅ Analisi dettagliata del caso</li>
                <li>✅ Strategie consigliate</li>
                <li>✅ Passi successivi da intraprendere</li>
                <li>✅ Lista domande per l'avvocato</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6">
              <h2 className="font-bold text-lg text-gray-900 mb-3">💼 Hai bisogno di supporto legale personalizzato?</h2>
              <p className="text-gray-700 mb-4">
                Per una consulenza approfondita con un avvocato:
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📧</span>
                <div>
                  <a
                    href="mailto:guido.motti@gmail.com"
                    className="text-purple-600 font-semibold hover:underline text-lg"
                  >
                    guido.motti@gmail.com
                  </a>
                  <p className="text-sm text-gray-600">Risposta entro 24 ore</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/"
              className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
            >
              Analizza un Altro Caso
            </a>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Session ID: {sessionId}</p>
        </div>
      </div>
    </main>
  );
}

// Wrap with Suspense to fix Next.js useSearchParams() SSR error
export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Caricamento...</p>
        </div>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
