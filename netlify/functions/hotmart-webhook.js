const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);

    // Verificamos si el evento es de compra aprobada en Hotmart
    if (body.event === 'PURCHASE_APPROVED') {
      const buyer = body.data.buyer;
      const purchase = body.data.purchase;
      const product = body.data.product;

      const customerEmail = buyer.email;
      const customerName = buyer.name || 'Cliente';
      const productName = product.name;
      const amount = purchase.price.value;
      const currency = purchase.price.currency_code;
      const transactionId = purchase.transaction;

      // Generamos una licencia única temporal o código de acceso
      const licenseKey = `HYSKY-${Math.random().toString(36).substring(2, 10).toUpperCase()}-2026`;

      // 1. Enviar correo con la licencia al cliente
      await resend.emails.send({
        from: 'HySky SaaS <onboarding@resend.dev>',
        to: customerEmail,
        subject: `Tu Licencia de Acceso - ${productName}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #0056b3;">¡Gracias por tu compra, ${customerName}!</h2>
            <p>Tu pago por <strong>${amount} ${currency}</strong> para el producto <em>${productName}</em> ha sido procesado con éxito.</p>
            
            <div style="background-color: #f4f6f8; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #555;">Tu Clave / Licencia de Acceso:</p>
              <p style="font-size: 18px; font-weight: bold; color: #0f172a; margin: 5px 0 0 0;">${licenseKey}</p>
            </div>

            <p style="font-size: 13px; color: #d9534f;">
              ⏱️ Recuerda que la activación completa y el soporte técnico asociado cuentan con un plazo máximo de entrega de 24 horas.
            </p>
            <p>Puedes iniciar sesión en tu panel de usuario para ver tu historial de compras.</p>
          </div>
        `
      });

      // 2. Notificación interna a tu empresa
      await resend.emails.send({
        from: 'HySky SaaS <onboarding@resend.dev>',
        to: 'hyskysoftwaresaas@gmail.com',
        subject: `🚨 Nueva Venta Aprobada: ${productName} (${amount} ${currency})`,
        html: `<h3>Nueva venta registrada en Hotmart</h3><p>Comprador: ${customerName} (${customerEmail})</p><p>ID Transacción: ${transactionId}</p>`
      });
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
