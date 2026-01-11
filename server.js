const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const memoria = {};

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function texto(t) {
  return t.toLowerCase().trim();
}

async function responder(userId, msg) {
  msg = texto(msg);

  if (!memoria[userId]) {
    memoria[userId] = { etapa: 0 };
  }

  const user = memoria[userId];

  // ETAPA 0 – CHEGOU AGORA
  if (user.etapa === 0) {
    user.etapa = 1;
    return "Oi 👋 tudo bem? Como posso te ajudar hoje?";
  }

  // ETAPA 1 – CONVERSA NORMAL
  if (user.etapa === 1) {

    if (msg === "oi" || msg === "olá" || msg === "ola") {
      return random([
        "Oi 😄 tudo certo?",
        "Fala comigo 😊",
        "Oi! Como posso ajudar?"
      ]);
    }

    if (msg.includes("dinheiro") || msg.includes("renda")) {
      user.etapa = 2;
      return "Entendi 👀 você quer ganhar dinheiro no digital?";
    }

    return random([
      "Entendi 🤔 me explica melhor",
      "Certo, pode continuar",
      "Tô te ouvindo 👀"
    ]);
  }

  // ETAPA 2 – INTERESSE
  if (user.etapa === 2) {

    if (msg.includes("sim")) {
      user.etapa = 3;
      return "Perfeito 🔥 vou te mostrar como funciona";
    }

    if (msg.includes("não")) {
      return "Sem problema 😊 se mudar de ideia, me chama";
    }

    return "É pra renda extra ou principal?";
  }

  // ETAPA 3 – OFERTA
  if (user.etapa === 3) {
    user.etapa = 4;
    return "Aqui está o link com tudo explicado 👇\nhttps://SEULINKAQUI";
  }

  // FINAL
  return "Se precisar de ajuda, é só falar 😉";
}

app.post("/chat", async (req, res) => {
  const { userId, message } = req.body;

  const resposta = await responder(
    userId || "anonimo",
    message
  );

  res.json({ reply: resposta });
});

app.listen(3000, () => {
  console.log("IA FUNCIONANDO NA PORTA 3000");
});
