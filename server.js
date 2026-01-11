import express from "express";
import OpenAI from "openai";
import cors from "cors";

const app = express();

/* ===============================
   PROTEÇÕES BÁSICAS (ANTI-TRAVA)
================================ */
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => {
  res.setTimeout(25000);
  next();
});

/* ===============================
   OPENAI
================================ */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/* ===============================
   PILAR 1 — CÉREBRO HARD
================================ */
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

/* ===============================
   PILAR 3 — MEMÓRIA
================================ */
let conversationHistory = [];
const MAX_HISTORY = 12;

/* ===============================
   PILAR 4 — CONTROLES
================================ */
let lastRequestTime = 0;
const COOLDOWN = 800;

/* ===============================
   ROTA PRINCIPAL DA IA
================================ */
app.post("/chat", async (req, res) => {
  const now = Date.now();

  // Anti-spam
  if (now - lastRequestTime < COOLDOWN) {
    return res.json({
      reply: "Calma 😅 me manda outra mensagem em alguns segundos."
    });
  }
  lastRequestTime = now;

  const userMessage = req.body.message;

  // Validação
  if (!userMessage || userMessage.length > 500) {
    return res.json({
      reply: "Pode escrever uma mensagem menor, por favor 🙂"
    });
  }

  // Salva mensagem do usuário
  conversationHistory.push({
    role: "user",
    content: userMessage
  });

  if (conversationHistory.length > MAX_HISTORY) {
    conversationHistory.shift();
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory
      ],
      timeout: 20000
    });

    const aiReply = completion.choices[0].message.content;

    // Salva resposta da IA
    conversationHistory.push({
      role: "assistant",
      content: aiReply
    });

    if (conversationHistory.length > MAX_HISTORY) {
      conversationHistory.shift();
    }

    res.json({ reply: aiReply });

  } catch (error) {
    console.error("Erro IA:", error.message);

    res.json({
      reply: "Tive um pequeno erro 🤔 tenta novamente em instantes."
    });
  }
});

/* ===============================
   ROTA DE TESTE
================================ */
app.get("/", (req, res) => {
  res.send("IA SK Prime Digital rodando 🔥");
});

/* ===============================
   START DO SERVIDOR
================================ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
