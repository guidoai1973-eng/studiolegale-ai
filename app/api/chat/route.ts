import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { searchStudios, StudioLegale } from '@/lib/db';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ChatRequest {
  message: string;
  conversationId?: string;
}

interface AnalysisResult {
  tipo_causa?: string;
  specializzazione_necessaria?: string;
  urgenza?: string;
  citta_preferita?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Messaggio vuoto' },
        { status: 400 }
      );
    }

    // Analizza la query dell'utente con Claude
    const analysisPrompt = `Analizza questa richiesta legale e estrai le seguenti informazioni in formato JSON:
- tipo_causa: il tipo di problema legale (es. "divorzio", "licenziamento", "incidente stradale", etc.)
- specializzazione_necessaria: l'area di specializzazione legale necessaria (es. "Diritto di Famiglia", "Diritto del Lavoro", "Diritto Penale", etc.)
- urgenza: livello di urgenza ("bassa", "media", "alta")
- citta_preferita: città menzionata o preferita dall'utente (se presente)

Richiesta utente: "${message}"

Rispondi SOLO con JSON valido, senza altre spiegazioni.`;

    const analysisMessage = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: 'Sei un assistente legale AI che analizza problemi legali e suggerisce studi appropriati. Rispondi sempre in JSON valido.',
      messages: [
        {
          role: 'user',
          content: analysisPrompt,
        },
      ],
    });

    // Estrai il JSON dalla risposta
    let analysis: AnalysisResult = {};
    const responseText = analysisMessage.content[0].type === 'text' 
      ? analysisMessage.content[0].text 
      : '';
    
    try {
      // Prova a parsare il JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Errore parsing JSON:', e);
    }

    // Genera SOLO consigli pratici con Claude (nessun testo libero per evitare invenzioni)
    const practicalAdvicePrompt = `Per questo caso legale: "${message}"
Area: ${analysis.specializzazione_necessaria || 'non specificata'}

Genera SOLO una lista di 3 azioni pratiche immediate (documentazione da raccogliere, aspetti da verificare).
Formato: lista puntata, una frase per punto.
NO introduzioni, NO nomi di avvocati, NO studi legali.`;

    const adviceMessage = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: 'Genera SOLO liste di azioni pratiche. NO nomi di professionisti.',
      messages: [
        {
          role: 'user',
          content: practicalAdvicePrompt,
        },
      ],
    });

    const practicalAdvice = adviceMessage.content[0].type === 'text'
      ? adviceMessage.content[0].text
      : '';

    // Template fisso per evitare che Claude inventi studi
    let suggestions = `Comprendo la tua situazione e sono qui per aiutarti.\n\n`;
    suggestions += `**Ho identificato che si tratta di:** ${analysis.specializzazione_necessaria || 'una questione legale'}\n\n`;
    suggestions += `**Consigli pratici immediati:**\n${practicalAdvice}\n\n`;
    suggestions += `Per assistenza legale professionale su questo caso specifico, contatta direttamente l'Avv. Guido Motti tramite i contatti indicati sotto.`;

    // Aggiungi footer con email per pareri approfonditi
    suggestions += '\n\n---\n\n⚖️ **Assistenza Legale Professionale - Avv. Guido Motti**\n\nPer un parere approfondito sul tuo caso, contatta direttamente:\n\n📧 **guido.motti@gmail.com**\n\n✅ Parere legale dettagliato e personalizzato\n✅ Analisi completa della situazione\n✅ Possibilità di fissare appuntamento\n\n💰 **€20 + IVA + 4% Cassa Avvocati**\n⏰ **Risposta entro 24 ore**';

    return NextResponse.json({
      analysis,
      suggestions,
      conversationId: body.conversationId || crypto.randomUUID(),
    });

  } catch (error: any) {
    console.error('Errore API chat:', error);
    return NextResponse.json(
      { 
        error: 'Errore durante l\'elaborazione della richiesta',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
