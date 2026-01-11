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
