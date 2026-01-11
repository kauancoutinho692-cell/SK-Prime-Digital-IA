import express from "express";
import OpenAI from "openai";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

/* ===============================
   CONFIG BÁSICA
================================ */
const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Timeout global (anti-trava)
app.use((req, res, next) => {
  res.setTimeout(25000);
  next();
});

/* ===============================
   PATH PARA FRONT-END
================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve index.html
app.use(express.static(__dirname));

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
Você NÃO é apenas para vendas.
Você ajuda em qualquer assunto.
Você explica de forma simples, passo a passo.
Você cria textos, ideias, códigos, estratégias e soluções.
Você fala português do Brasil.
Você conversa como humano.
Você se adapta à conversa.
Você nunca trava.
Você nunca repete respostas.
Você responde exatamente como o ChatGPT responderia.
`;

/* ===============================
   PILAR 3 — MEMÓRIA
================================ */
let conversationHistory = [];
const MAX_HISTORY = 12;

/* ===============================
   PILAR 4 — ANTI-TRAVAMENTO
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
      reply: "Calma 😅 espera um pouquinho antes de mandar outra mensagem."
    });
  }
  lastRequestTime = now;

  const userMessage = req.body.message;

  // Validação
  if (!userMessage || userMessage.length > 600) {
    return res.json({
      reply: "Escreve uma mensagem menor pra eu conseguir te ajudar melhor 🙂"
    });
  }

  // Salva mensagem do usuário
  conversationHistory.push({
    role: "user",
    content: userMessage
  });

  // Limita memória
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
      reply: "Tive um erro rápido aqui 🤖 tenta de novo."
    });
  }
});

/* ===============================
   ROTA TESTE
================================ */
app.get("/status", (req, res) => {
  res.json({ status: "IA SK Prime Digital ONLINE 🚀" });
});

/* ===============================
   START DO SERVIDOR
================================ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("IA SK Prime Digital rodando na porta", PORT);
});
