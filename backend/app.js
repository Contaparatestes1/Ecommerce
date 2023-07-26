const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { db } = require("./firebaseConfig");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

app.get("/api/produtos", async (req, res) => {
  try {
    const produtosRef = db.collection("produtos");
    const snapshot = await produtosRef.get();
    const produtos = snapshot.docs.map((doc) => doc.data());
    res.json(produtos);
  } catch (err) {
    console.error("Erro ao obter produtos:", err);
    res.status(500).json({ error: "Erro ao obter produtos" });
  }
});

app.post("/api/carrinho", async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const carrinhoRef = db.collection("carrinho");
    await carrinhoRef.add({ productId, quantity });
    res.sendStatus(201);
  } catch (err) {
    console.error("Erro ao adicionar produto ao carrinho:", err);
    res.status(500).json({ error: "Erro ao adicionar produto ao carrinho" });
  }
});

app.put("/api/carrinho/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const carrinhoRef = db.collection("carrinho").doc(id);
    await carrinhoRef.update({ quantity });
    res.sendStatus(200);
  } catch (err) {
    console.error("Erro ao atualizar quantidade do produto no carrinho:", err);
    res
      .status(500)
      .json({ error: "Erro ao atualizar quantidade do produto no carrinho" });
  }
});

app.delete("/api/carrinho/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const carrinhoRef = db.collection("carrinho").doc(id);
    await carrinhoRef.delete();
    res.sendStatus(204);
  } catch (err) {
    console.error("Erro ao remover item do carrinho:", err);
    res.status(500).json({ error: "Erro ao remover item do carrinho" });
  }
});

const criarPedido = async (carrinhoData, valorTotalCompra) => {
  try {
    const pedidosRef = db.collection("Pedidos");

    const pedidosSnapshot = await pedidosRef.get();
    const numeroPedidos = pedidosSnapshot.size;
    const novoPedidoId = `Pedido ${numeroPedidos + 1}`;

    const pedidoData = {
      id: novoPedidoId,
      itensDoPedido: carrinhoData,
      valorTotal: valorTotalCompra,
      dataPedido: new Date(),
    };

    await pedidosRef.doc(novoPedidoId).set(pedidoData);

    return novoPedidoId;
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    throw new Error("Erro ao criar pedido");
  }
};

const criarVenda = async (carrinhoData, valorTotalCompra) => {
  try {
    const vendasRef = db.collection("Vendas");

    const vendasSnapshot = await vendasRef.get();
    const numeroVendas = vendasSnapshot.size;
    const novaVendaNumero = numeroVendas + 1;

    const vendaData = {
      id: novaVendaNumero,
      itensDaVenda: carrinhoData,
      totalAReceber: valorTotalCompra,
      dataVenda: new Date(),
    };

    await vendasRef.doc(`Venda ${novaVendaNumero}`).set(vendaData);

    return novaVendaNumero;
  } catch (error) {
    console.error("Erro ao criar venda:", error);
    throw new Error("Erro ao criar venda");
  }
};

app.post("/api/finalizar-compra", async (req, res) => {
  try {
    const carrinhoData = req.body;

    const valorTotalCompra = Object.values(carrinhoData).reduce(
      (total, item) => total + item.subtotal,
      0
    );

    const novoPedidoId = await criarPedido(carrinhoData, valorTotalCompra);
    const novaVendaNumero = await criarVenda(carrinhoData, valorTotalCompra);

    const carrinhoRef = db.collection("carrinho");
    const snapshot = await carrinhoRef.get();
    snapshot.forEach((doc) => doc.ref.delete());

    return res.status(200).json({
      message: "Parabéns: Você comprou com sucesso.",
      pedidoId: novoPedidoId,
      vendaNumero: novaVendaNumero,
    });
  } catch (error) {
    console.error("Erro ao finalizar compra:", error);
    return res.status(500).json({
      message: "Erro ao finalizar compra.",
    });
  }
});

app.get("/api/Pedidos", async (req, res) => {
  try {
    const pedidosRef = db.collection("Pedidos");
    const pedidosSnapshot = await pedidosRef.get();

    const pedidos = [];
    pedidosSnapshot.forEach((doc) => {
      pedidos.push(doc.data());
    });

    res.json(pedidos);
  } catch (error) {
    console.error("Erro ao obter pedidos:", error);
    res.status(500).json({ error: "Erro ao obter pedidos" });
  }
});

app.post("/api/enviar-email-confirmacao", async (req, res) => {
  try {
    const { email, cartItems, cartSubtotal } = req.body;

    const itemsWithSubtotal = cartItems.map((item) => ({
      ...item,
      subtotal: item.price * item.quantity,
    }));

    const emailData = {
      to: email,
      from: {
        name: "E-commerce",
        email: process.env.FROM_EMAIL,
      },
      subject: "Detalhes da compra",
      text: "Sua compra foi realizada com sucesso! Aqui estão os detalhes:",
      html: `<p>Sua compra foi realizada com sucesso! Aqui estão os detalhes:</p><ul>${
        itemsWithSubtotal
          ? itemsWithSubtotal
              .map(
                (item) =>
                  `<li>Produto: ${item.name || ""} - Preço: R$ ${
                    item.price ? item.price.toFixed(2) : ""
                  } - Quantidade: ${item.quantity || ""} - Subtotal: ${
                    item.subtotal ? item.subtotal.toFixed(2) : ""
                  }</li>`
              )
              .join("")
          : ""
      }</ul><p>Total: R$ ${cartSubtotal ? cartSubtotal.toFixed(2) : ""}</p>`,
    };

    await sgMail.send(emailData);
    console.log("E-mail enviado com sucesso!");

    res.status(200).json({ message: "E-mail enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error);
    res.status(500).json({ message: "Erro ao enviar o e-mail" });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
