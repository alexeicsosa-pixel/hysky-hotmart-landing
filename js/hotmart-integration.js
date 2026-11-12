document.addEventListener('DOMContentLoaded', () => {
  // Cargar el script y los estilos oficiales del widget de Hotmart de forma asíncrona
  const script = document.createElement('script');
  script.src = 'https://static.hotmart.com/checkout/widget.min.js';
  script.async = true;
  document.head.appendChild(script);

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'https://static.hotmart.com/css/hotmart-fb.min.css';
  document.head.appendChild(link);

  // Vincular los clics de los botones de pago al disparador del modal
  const buttons = document.querySelectorAll('.btn-hotmart-pay');
  const trigger = document.getElementById('hotmart_checkout_trigger');

  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      let rawUrl = btn.getAttribute('data-checkout-url');

      // Asegurar que use checkoutMode=6 para abrir en modal dentro de la web
      let finalUrl = rawUrl;
      if (!finalUrl.includes('checkoutMode=')) {
        finalUrl += (finalUrl.includes('?') ? '&' : '?') + 'checkoutMode=6';
      }

      // Actualizar enlace del disparador oculto y ejecutar apertura
      trigger.setAttribute('href', finalUrl);
      trigger.click();
    });
  });
});
