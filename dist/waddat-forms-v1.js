// Web3Forms access keys are public identifiers, not secret API credentials.
// Configure the access_key hidden input on each form before publishing.
(() => {
  const pending = new WeakSet();

  document.querySelectorAll('form[data-web3forms]').forEach((form) => {
    const button = form.querySelector('button[type="submit"]');
    const label = button.querySelector('[data-submit-label]');
    const status = form.querySelector('[data-form-status]');
    const originalLabel = label.textContent;

    const showStatus = (message, isError = false) => {
      status.textContent = message;
      status.style.color = isError ? '#ffb4b4' : '#ffffff';
      status.focus({ preventScroll: true });
    };

    // Capture the event before the inherited Webflow delegated form handler.
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (pending.has(form) || !form.reportValidity()) return;

      const payload = Object.fromEntries(new FormData(form));
      if (!payload.access_key || payload.access_key === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        showStatus('We couldn’t send your request. Please try again later.', true);
        return;
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
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok || result.success !== true) throw new Error('Submission failed');

        form.reset();
        showStatus(form.dataset.successMessage);
      } catch (error) {
        showStatus(
          error.name === 'AbortError'
            ? 'We couldn’t confirm your request was sent. Please check your connection and try again.'
            : 'We couldn’t send your request. Please try again in a moment.',
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
