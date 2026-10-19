// FormSubmit delivers both forms to the recipient in each form's action URL.
(() => {
  const pending = new WeakSet();

  document.querySelectorAll('form[data-formsubmit]').forEach((form) => {
    const button = form.querySelector('button[type="submit"]');
    const label = button.querySelector('[data-submit-label]');
    const status = form.querySelector('[data-form-status]');
    const originalLabel = label.textContent;

    const showStatus = (message, isError = false) => {
      status.textContent = message;
      status.style.color = isError ? '#ffb4b4' : '#ffffff';
      status.focus({ preventScroll: true });
    };

    // Capture before the inherited Webflow delegated form handler.
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (pending.has(form) || !form.reportValidity()) return;

      const payload = Object.fromEntries(new FormData(form));
      if (payload._honey) return;
      payload._replyto = payload.email;
      if (payload.newsletter_consent) {
        payload.consent_recorded_at = new Date().toISOString();
      }

      pending.add(form);
      button.disabled = true;
      form.setAttribute('aria-busy', 'true');
      label.textContent = 'Sending…';
      status.textContent = 'Sending your request…';
      status.style.color = '#ffffff';

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      try {
        const endpoint = new URL(form.action);
        endpoint.pathname = `/ajax${endpoint.pathname}`;
        const response = await fetch(endpoint.href, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        const result = await response.json();
        // FormSubmit can return HTTP 200 with success: "false".
        // Activation is not confirmation that an enquiry reached the inbox.
        if (!response.ok || (result.success !== true && result.success !== 'true')
          || /activat/i.test(result.message || '')) {
          throw new Error('Submission not confirmed');
        }

        form.reset();
        showStatus(form.dataset.successMessage);
      } catch (error) {
        showStatus(
          error.name === 'AbortError'
            ? 'We couldn’t confirm your request was sent. Please email info@waddatbeverageltd.com if you need help.'
            : 'We couldn’t send your request. Please try again or email info@waddatbeverageltd.com.',
          true,
        );
      } finally {
        clearTimeout(timeout);
        pending.delete(form);
        button.disabled = false;
        form.removeAttribute('aria-busy');
        label.textContent = originalLabel;
      }
    }, true);
  });
})();
