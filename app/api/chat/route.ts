import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Você é ARIA (Artificial Recommendation & Intelligence Assistant), 
a assistente de IA do OrbitBook — a primeira plataforma de reservas de turismo espacial do mundo.

Seu papel é ajudar viajantes a:
- Descobrir e escolher destinos espaciais disponíveis na plataforma
- Entender o que está incluso em cada missão (duração, operadora, preço base)
- Planejar sua viagem espacial (datas, número de passageiros, orçamento)
- Responder dúvidas sobre o processo de reserva
- Recomendar destinos com base no perfil e preferências do viajante

Destinos disponíveis na plataforma OrbitBook:
- Voo Suborbital Aurora — Stellar Dynamics, 2 dias de treinamento, 90min de voo, 4min em microgravidade, a partir de $450.000
- Eclipse Solar Orbital — Stellar Dynamics, voo durante eclipse solar, 6min de eclipse visto do espaço, a partir de $650.000
- Estação Espacial (ISS) — Axiom Space, 14 dias, experiência completa em órbita, a partir de $550.000
- Circuito Lunar Artemis — SpaceX, 8 dias, passa a 100km da superfície lunar, máx 3 passageiros, a partir de $75.000.000
- Expedição Marte Pioneer — SpaceX, 2 anos, construção da base Mars Alpha, a partir de $250.000.000, janela nov/2028

Requisitos gerais:
- Voos suborbitais: 18+ anos, 1.52–1.93m, até 100kg, atestado médico
- Missões orbitais (ISS): 21+ anos, boa condição física, 14 dias de treinamento
- Missões lunares/Marte: avaliação médica e psicológica rigorosa, 30 dias a 1 ano de treinamento

Regras de comportamento:
- Seja entusiasmado e inspire o viajante, mas honesto sobre custos e riscos
- Para confirmar reservas, direcione para o botão "Reservar Agora" na página do destino
- Responda SEMPRE em português do Brasil
- Seja conciso mas completo — máximo 3 parágrafos por resposta
- Use emojis com moderação para deixar a conversa mais animada`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY não configurada no .env.local");
      return NextResponse.json({ error: "API key não configurada" }, { status: 500 });
    }

    // Monta o histórico no formato da API REST do Gemini
    // Remove mensagens de "assistant" do início (Gemini exige que comece com "user")
    const allMessages = messages.filter(
      (m: { role: string; content: string }) =>
        m.role === "user" || m.role === "assistant"
    );

    let startIndex = 0;
    while (startIndex < allMessages.length && allMessages[startIndex].role !== "user") {
      startIndex++;
    }

    const contents = allMessages.slice(startIndex).map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const body = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    };

    const model = "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      console.error("Gemini API error:", geminiResponse.status, errorData);
      return NextResponse.json(
        { error: `Erro da API Gemini: ${geminiResponse.status}` },
        { status: 500 }
      );
    }

    const data = await geminiResponse.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("Resposta inesperada do Gemini:", JSON.stringify(data));
      return NextResponse.json(
        { error: "Resposta inválida da API" },
        { status: 500 }
      );
    }

    const lastMessage = allMessages[allMessages.length - 1];
    const suggestions = generateSuggestions(lastMessage.content, text);

    return NextResponse.json({ content: text, suggestions });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erro interno:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}

function generateSuggestions(userMessage: string, aiResponse: string): string[] {
  const msg = (userMessage + " " + aiResponse).toLowerCase();

  if (msg.includes("lua") || msg.includes("lunar") || msg.includes("artemis")) {
    return ["Quais são os requisitos?", "Como é o treinamento?", "Ver calendário de missões"];
  }
  if (msg.includes("marte") || msg.includes("pioneer")) {
    return ["Quem pode se candidatar?", "Como funciona a seleção?", "Ver outros destinos"];
  }
  if (msg.includes("suborbital") || msg.includes("aurora") || msg.includes("eclipse")) {
    return ["Comparar as duas opções", "Como funciona o treinamento?", "Quero reservar"];
  }
  if (msg.includes("preço") || msg.includes("custo") || msg.includes("valor") || msg.includes("quanto")) {
    return ["Como funciona o pagamento?", "Qual a opção mais acessível?", "Ver todos os destinos"];
  }
  if (msg.includes("requisito") || msg.includes("físico") || msg.includes("saúde") || msg.includes("médico")) {
    return ["Tenho problema cardíaco, posso ir?", "Como é o exame médico?", "Requisitos da ISS"];
  }
  if (msg.includes("treinamento") || msg.includes("preparação")) {
    return ["Quanto tempo dura?", "Onde é feito o treinamento?", "É muito difícil?"];
  }

  return ["Quais destinos estão disponíveis?", "Qual é o mais acessível?", "Quais são os requisitos?"];
}