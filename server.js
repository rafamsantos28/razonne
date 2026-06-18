// server.js
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

// Substitui pela tua Chave Secreta de Testes do Stripe
const stripe = new Stripe('sk_test_51N...teu_token_secreto'); 
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.post('/criar-sessao-checkout', async (req, res) => {
    const { email, priceId } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            customer_email: email,
            line_items: [{
                price: priceId, // ID do Preço Premium do teu painel Stripe
                quantity: 1,
            }],
            // Aplica o cupão de 100% para ocultar o formulário do cartão de crédito
            discounts: [{
                coupon: 'RAZONNE100', // Criar este ID de cupão com 100% de desconto no Stripe
            }],
            success_url: 'http://localhost:5500/catalogo.html?success=true',
            cancel_url: 'http://localhost:5500/index.html?cancel=true',
        });

        res.status(200).json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor Razonne+ a correr na porta ${PORT}`));
