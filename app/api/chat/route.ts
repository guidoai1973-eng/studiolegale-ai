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

---

⚖️ **Servizi di Assistenza Legale Disponibili**

StudioLegale-AI offre diversi servizi professionali per supportarti:

✅ **Analisi AI del caso** con report professionale completo
✅ **Template legali** personalizzabili per le tue esigenze
✅ **Bundle convenienza** per più documenti

👉 **[Scopri tutti i servizi e i prezzi](/pricing)**

Per assistenza personalizzata, contatta: **guido.motti@gmail.com**`;

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
