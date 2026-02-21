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

    // Cerca studi legali nel database
    const matchedStudios: StudioLegale[] = searchStudios({
      specializzazione: analysis.specializzazione_necessaria,
      citta: analysis.citta_preferita,
      minRating: 4.5, // Solo studi con rating alto
    });

    // Genera una risposta personalizzata con Claude
    const suggestionPrompt = `L'utente ha questa richiesta legale: "${message}"

Abbiamo identificato:
- Tipo di causa: ${analysis.tipo_causa || 'non specificato'}
- Specializzazione necessaria: ${analysis.specializzazione_necessaria || 'non specificata'}
- Urgenza: ${analysis.urgenza || 'media'}
- Città preferita: ${analysis.citta_preferita || 'non specificata'}

${matchedStudios.length > 0 ? `Abbiamo trovato ${matchedStudios.length} studi legali che possono aiutare:

${matchedStudios.map((studio, idx) => 
  `${idx + 1}. ${studio.nome} - ${studio.citta}
   Specializzazioni: ${studio.specializzazioni.join(', ')}
   Rating: ${studio.rating}/5
   ${studio.bio}`
).join('\n\n')}` : 'Al momento non abbiamo studi legali nel database che corrispondono esattamente ai criteri.'}

Fornisci una risposta empatica e professionale all'utente:
1. Rassicura l'utente che può ricevere aiuto
2. Spiega brevemente il tipo di problema identificato
3. ${matchedStudios.length > 0 ? 'Presenta gli studi trovati evidenziando perché sono adatti' : 'Suggerisci di ampliare i criteri di ricerca o contattarci per assistenza'}
4. Se appropriato, fornisci consigli pratici immediati

Scrivi in tono cordiale ma professionale, in italiano.`;

    const suggestionMessage = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: 'Sei un assistente legale AI che analizza problemi legali e suggerisce studi appropriati. Sei empatico, professionale e fornisci informazioni chiare.',
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
    suggestions += '\n\n---\n\n💼 **Vuoi un Parere Legale Approfondito sul Tuo Caso?**\n\nContattami direttamente via email per ricevere:\n\n✅ **Parere legale dettagliato e personalizzato**\n✅ **Analisi completa della tua situazione**\n✅ **Possibilità di fissare un appuntamento**\n\n📧 **Email: guido.motti@gmail.com**\n\n💰 **Costo: €20 + IVA + 4% Cassa Avvocati**\n\n⏰ Risposta garantita entro 24 ore.';

    return NextResponse.json({
      analysis,
      matched_studios: matchedStudios,
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
