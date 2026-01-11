const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const memoria = {};

// util
function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function norm(t) {
  return t.toLowerCase().trim();
}
function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function ia(userId, msg) {
  msg = norm(msg);

  if (!memoria[userId]) {
    memoria[userId] = { etapa: "inicio" };
  }

  const m = memoria[userId];

  /* ========= INÍCIO ========= */
  if (m.etapa === "inicio") {
    m.etapa = "conversa";

    return rand([
      "Oi 😄 tudo bem?",
      "E aí 👋 como posso te ajudar?",
      "Fala comigo 😊"
    ]);
  }

  /* ========= CONVERSA HUMANA ========= */
  if (m.etapa === "conversa") {

    if (msg === "oi" || msg === "olá" || msg === "ola") {
      return rand([
        "Tudo certo 😄 e você?",
        "Oi! Como posso te ajudar?",
        "Fala 😄 no que posso te ajudar?"
      ]);
    }

    if (
      msg.includes("ganhar dinheiro") ||
      msg.includes("renda") ||
      msg.includes("trabalhar")
    ) {
      m.etapa = "interesse";
      return "Entendi 👀 quer ganhar dinheiro no digital, certo?";
    }

    if (msg.includes("ajuda")) {
      return "Claro 😊 me conta o que você precisa";
    }

    return rand([
      "Entendi 🤔 me explica melhor",
      "Certo… pode continuar",
      "Tô te acompanhando 👀"
    ]);
  }

  /* ========= INTERESSE ========= */
  if (m.etapa === "interesse") {

    if (msg.includes("sim") || msg.includes("quero")) {
      m.etapa = "oferta";
      return "Perfeito 🔥 vou te explicar rapidinho";
    }

    if (msg.includes("não")) {
      return "Tranquilo 😊 se mudar de ideia, me chama";
    }

    return "Você quer aprender isso pra renda extra ou principal?";
  }

  /* ========= OFERTA ========= */
  if (m.etapa === "oferta") {
    m.etapa = "final";

    return rand([
      "Aqui está o link com tudo explicado 👇\nhttps://SEULINKAQUI",
      "Nesse link você vê como funciona passo a passo 👇\nhttps://SEULINKAQUI"
    ]);
  }

  /* ========= FINAL ========= */
  return rand([
    "Se tiver dúvida, fala comigo 😉",
    "Tô aqui se precisar 😄",
    "Pode perguntar sem medo"
  ]);
}

/* ========= ROTA ========= */
app.post("/chat", async (req, res) => {
  const { userId, message } = req.body;

  await delay(Math.random() * 2000 + 800);

  const reply = await ia(userId || "anonimo", message);
  res.json({ reply });
});

app.listen(3000, () => {
  console.log("🔥 IA HUMANA ONLINE - PORTA 3000");
});
