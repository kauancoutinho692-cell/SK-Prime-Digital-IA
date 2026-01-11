import express from "express";
import OpenAI from "openai";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const systemPrompt = `
Você é a IA oficial da SK Prime Digital.
Você funciona como um assistente completo, igual ao ChatGPT.
Você ajuda clientes e também ajuda o dono do projeto.
Você explica qualquer assunto de forma simples.
Você cria textos, ideias, respostas e soluções.
Você conversa de forma humana e natural.
Você não se limita a vendas.
Você só fala de vendas quando pedirem.
Você nunca repete respostas.
Você se adapta ao assunto da conversa.
`;

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {
    res.status(500).json({ reply: "Erro na IA" });
  }
});

app.listen(3000, () => {
  console.log("IA rodando");
});
