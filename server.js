const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

/* =========================
   MEMÓRIA DA CONVERSA
========================= */
const memoria = {};

/* =========================
   FUNÇÕES ÚTEIS
========================= */
function respostaAleatoria(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function normalizar(texto) {
  return texto.toLowerCase();
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* =========================
   IA PRINCIPAL
========================= */
async function responderIA(userId, mensagem) {
  mensagem = normalizar(mensagem);

  if (!memoria[userId]) {
    memoria[userId] = { etapa: "inicio" };
  }

  const estado = memoria[userId];

  /* ===== ETAPA INICIAL ===== */
  if (estado.etapa === "inicio") {
    estado.etapa = "qualificacao";

    return respostaAleatoria([
      "Oi 😄 tudo bem?",
      "E aí! Como posso te ajudar hoje?",
      "Olá 👋 posso te explicar algo rapidinho?"
    ]);
  }

  /* ===== QUALIFICAÇÃO ===== */
  if (estado.etapa === "qualificacao") {

    if (
      mensagem.includes("sim") ||
      mensagem.includes("quero") ||
      mensagem.includes("claro")
    ) {
      estado.etapa = "interesse";

      return respostaAleatoria([
        "Perfeito 🔥 deixa eu te explicar rapidinho",
        "Show! Vou te explicar de forma simples 😉",
        "Boa! Presta atenção que é bem fácil"
      ]);
    }

    if (
      mensagem.includes("não") ||
      mensagem.includes("agora não")
    ) {
      return respostaAleatoria([
        "Sem problemas 😄 se mudar de ideia, me chama",
        "Tranquilo! Estarei por aqui 👋"
      ]);
    }

    if (
      mensagem.includes("ajuda") ||
      mensagem.includes("como funciona") ||
      mensagem.includes("explica")
    ) {
      estado.etapa = "interesse";

      return "Claro 😊 vou te explicar de forma simples, sem enrolação.";
    }

    return respostaAleatoria([
      "Você quer entender como funciona?",
      "Posso te explicar em 1 minutinho 😄",
      "Quer que eu te explique direitinho?"
    ]);
  }

  /* ===== INTERESSE ===== */
  if (estado.etapa === "interesse") {
    estado.etapa = "oferta";

    return respostaAleatoria([
      "Funciona assim 👇 você aprende a ganhar dinheiro no digital mesmo começando do zero.",
      "É um método simples, pensado pra quem nunca trabalhou no digital.",
      "Mesmo sem experiência, dá pra começar e evoluir."
    ]);
  }

  /* ===== OFERTA ===== */
  if (estado.etapa === "oferta") {
    estado.etapa = "fechamento";

    return respostaAleatoria([
      "Se fizer sentido pra você, esse link explica tudo melhor 👇\nhttps://SEULINKAQUI",
      "Aqui está o link com todos os detalhes 👇\nhttps://SEULINKAQUI",
      "Nesse link você consegue ver tudo certinho 👇\nhttps://SEULINKAQUI"
    ]);
  }

  /* ===== PÓS LINK ===== */
  if (estado.etapa === "fechamento") {
    return respostaAleatoria([
      "Se tiver qualquer dúvida, pode me perguntar 😉",
      "Fica à vontade pra perguntar qualquer coisa",
      "Estou aqui se precisar de ajuda 😄"
    ]);
  }

  return "Estou aqui 😊";
}

/* =========================
   ROTA DA IA
========================= */
app.post("/chat", async (req, res) => {
  const { userId, message } = req.body;

  await delay(Math.floor(Math.random() * 2000) + 1000);

  const resposta = await responderIA(userId, message);

  res.json({ reply: resposta });
});

/* =========================
   SERVIDOR
========================= */
app.listen(3000, () => {
  console.log("🤖 IA humana rodando na porta 3000");
});
