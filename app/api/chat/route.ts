import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Messaggio vuoto' },
        { status: 400 }
      );
    }

    // TEMPLATE FISSO - NO AI che inventa studi
    const suggestions = `Grazie per aver descritto la tua situazione.

**Ho analizzato la tua richiesta** e posso aiutarti a inquadrare meglio il problema.

**Consigli pratici immediati:**
• Raccogli tutta la documentazione rilevante (certificati, contratti, email, foto)
• Annota una cronologia degli eventi principali
• Prepara domande specifiche da porre durante la consulenza

**Per assistenza legale professionale su questo caso specifico**, contatta direttamente l'**Avv. Guido Motti** tramite i contatti indicati sotto.

---

⚖️ **Assistenza Legale Professionale - Avv. Guido Motti**

Per un parere approfondito sul tuo caso, contatta direttamente:

📧 **guido.motti@gmail.com**

✅ Parere legale dettagliato e personalizzato
✅ Analisi completa della situazione
✅ Possibilità di fissare appuntamento

💰 **€20 + IVA + 4% Cassa Avvocati**
⏰ **Risposta entro 24 ore**`;

    return NextResponse.json({
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
