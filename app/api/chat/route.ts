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

    // Genera una risposta personalizzata con Claude
    const suggestionPrompt = `Richiesta legale dell'utente: "${message}"

Contesto identificato:
- Tipo di causa: ${analysis.tipo_causa || 'non specificato'}
- Area legale: ${analysis.specializzazione_necessaria || 'non specificata'}
- Urgenza: ${analysis.urgenza || 'media'}

COMPITO:
Scrivi una risposta di 80-120 parole che:
1. Riconosce empaticamente la situazione
2. Spiega brevemente l'area legale coinvolta
3. Suggerisci 2-3 azioni pratiche immediate (documenti da raccogliere, aspetti da verificare)
4. Concludi: "Per assistenza professionale su questo caso, contatta direttamente l'avvocato tramite i contatti indicati sotto."

⚠️ DIVIETI ASSOLUTI - NON DEVI MAI:
- Nominare avvocati specifici o studi legali
- Inventare nomi di professionisti
- Suggerire di cercare altri professionisti
- Menzionare "database", "ricerca", "altri studi"
- Creare liste di professionisti consigliati

Scrivi SOLO consigli generici pratici. Italiano professionale ma accessibile.`;

    const suggestionMessage = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: 'Sei un assistente che fornisce informazioni legali generiche. NON suggerire mai nomi di avvocati o studi legali specifici. Dai solo consigli pratici generali.',
      messages: [
        {
          role: 'user',
          content: suggestionPrompt,
        },
      ],
    });

    let suggestions = suggestionMessage.content[0].type === 'text'
      ? suggestionMessage.content[0].text
      : '';

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
