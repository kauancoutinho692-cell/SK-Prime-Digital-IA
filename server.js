import express from "express";
import OpenAI from "openai";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// 🔐 OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🧠 PILAR 1 — CÉREBRO DA IA
const systemPrompt = `
Você é a IA oficial da SK Prime Digital.
Você funciona como um assistente completo, igual ao ChatGPT.
Você ajuda clientes, ajuda o dono do projeto e ajuda qualquer pessoa.
Você responde qualquer assunto.
Você explica de forma simples, passo a passo.
Você cria textos, ideias, códigos e soluções.
Você fala português do Brasil.
Você conversa de forma humana, educada e natural.
Você não se limita a vendas.
Você só fala de vendas quando pedirem.
Você nunca repete respostas.
Você se adapta ao contexto da conversa.
`;

// 🧠 PILAR 3 — MEMÓRIA (HISTÓRICO)
let conversationHistory = [];

// 🧹 Limite de memória (anti-travamento)
const MAX_HISTORY = 10;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  // Salva mensagem do usuário
  conversationHistory.push({
    role: "user",
    content: userMessage
  });

  // Limita o tamanho da memória
  if (conversationHistory.length > MAX_HISTORY) {
    conversationHistory.shift();
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory
      ]
    });

    const aiReply = completion.choices[0].message.content;

    // Salva resposta da IA
    conversationHistory.push({
      role: "assistant",
      content: aiReply
    });

    // Limita de novo
    if (conversationHistory.length > MAX_HISTORY) {
      conversationHistory.shift();
    }

    res.json({ reply: aiReply });

  } catch (error) {
    res.json({
      reply: "Tive um problema agora 😥 tenta de novo."
    });
  }
});

app.listen(3000, () => {
  console.log("IA SK Prime Digital com MEMÓRIA rodando 🚀");
});
