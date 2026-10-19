(function () {
  'use strict';

  function initForms() {
    // 1. Wholesale Form
    const wholesaleForms = document.querySelectorAll(
      '#wf-form-Wholesale-Form, form[name="wf-form-Wholesale-Form"]'
    );

    wholesaleForms.forEach(function (form) {
      if (form.dataset.waddatBound) return;
      form.dataset.waddatBound = 'true';

      // Ensure form doesn't carry inline blocking or Webflow action
      form.removeAttribute('onsubmit');
      form.removeAttribute('action');
      form.removeAttribute('method');

      // Re-enable submit button if it was disabled
      const submitBtn = form.querySelector('button, input[type="submit"], .button-wrapper');
      if (submitBtn) {
        submitBtn.removeAttribute('disabled');
        submitBtn.removeAttribute('aria-disabled');
        if (submitBtn.tagName === 'BUTTON') {
          submitBtn.setAttribute('type', 'submit');
        }
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        const nameInput = form.querySelector('#Wholesale-Name, [name="business_name"], [name="Business Name"], [name="name"]');
        const emailInput = form.querySelector('#Wholesale-Email, [name="email"], [name="Email"]');
        const messageInput = form.querySelector('#Wholesale-Message, [name="message"], [name="Message"]');

        const payload = {
          business_name: nameInput ? nameInput.value.trim() : '',
          email: emailInput ? emailInput.value.trim() : '',
          message: messageInput ? messageInput.value.trim() : ''
        };

        handleFormSubmit({
          form: form,
          endpoint: '/api/wholesale.php',
          payload: payload,
          successMessage: 'Thanks! We’ll be in touch about stocking Waddat.',
          errorMessage: 'Something went wrong. Please try again.'
        });
      }, true);
    });

    // 2. Newsletter Form
    const newsletterForms = document.querySelectorAll(
      '#wf-form-Newsletter-Form, form[name="wf-form-Newsletter-Form"]'
    );

    newsletterForms.forEach(function (form) {
      if (form.dataset.waddatBound) return;
      form.dataset.waddatBound = 'true';

      form.removeAttribute('onsubmit');
      form.removeAttribute('action');
      form.removeAttribute('method');

      const submitBtn = form.querySelector('button, input[type="submit"], .button-wrapper');
      if (submitBtn) {
        submitBtn.removeAttribute('disabled');
        submitBtn.removeAttribute('aria-disabled');
        if (submitBtn.tagName === 'BUTTON') {
          submitBtn.setAttribute('type', 'submit');
        } else if (submitBtn.tagName === 'A') {
          submitBtn.addEventListener('click', function (e) {
            e.preventDefault();
            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          });
        }
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        const nameInput = form.querySelector('#Newsletter-Name, #Name, [name="name"], [name="Name"]');
        const emailInput = form.querySelector('#Newsletter-Email, #Email, [name="email"], [name="Email"]');

        const payload = {
          name: nameInput ? nameInput.value.trim() : '',
          email: emailInput ? emailInput.value.trim() : ''
        };

        handleFormSubmit({
          form: form,
          endpoint: '/api/newsletter.php',
          payload: payload,
          successMessage: 'You’re in! Watch out for new flavours and promos.',
          errorMessage: 'Something went wrong. Please try again.'
        });
      }, true);
    });
  }

  function handleFormSubmit(opts) {
    const form = opts.form;
    const endpoint = opts.endpoint;
    const payload = opts.payload;
    const successMessage = opts.successMessage;
    const errorMessage = opts.errorMessage;

    const container = form.closest('.w-form') || form.parentElement;
    let doneEl = container ? container.querySelector('.w-form-done, .form_message-success') : null;
    let failEl = container ? container.querySelector('.w-form-fail, .form_message-error') : null;

    // Create status containers dynamically if absent
    if (!doneEl && container) {
      doneEl = document.createElement('div');
      doneEl.className = 'form_message-success w-form-done';
      doneEl.style.display = 'none';
      doneEl.innerHTML = '<div>' + escapeHtml(successMessage) + '</div>';
      container.appendChild(doneEl);
    }
    if (!failEl && container) {
      failEl = document.createElement('div');
      failEl.className = 'form_message-error w-form-fail';
      failEl.style.display = 'none';
      failEl.innerHTML = '<div>' + escapeHtml(errorMessage) + '</div>';
      container.appendChild(failEl);
    }

    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"], .button-wrapper, .button.is-form-submit');

    if (failEl) failEl.style.display = 'none';
    if (doneEl) doneEl.style.display = 'none';

    // Disable button to prevent double-sends
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.pointerEvents = 'none';
      submitBtn.style.opacity = '0.6';
    }

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        return res.json().then(
          function (json) {
            return { ok: res.ok, status: res.status, data: json };
          },
          function () {
            return { ok: res.ok, status: res.status, data: null };
          }
        );
      })
      .then(function (res) {
        if (res.ok && res.data && res.data.success !== false) {
          form.reset();
          form.style.display = 'none';
          if (doneEl) {
            const textTarget = doneEl.querySelector('div, p, span') || doneEl;
            textTarget.textContent = successMessage;
            doneEl.style.display = 'block';
          }
        } else {
          showFormError(failEl, errorMessage);
        }
      })
      .catch(function () {
        showFormError(failEl, errorMessage);
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.pointerEvents = '';
          submitBtn.style.opacity = '';
        }
      });
  }

  function showFormError(failEl, msg) {
    if (failEl) {
      const textTarget = failEl.querySelector('div, p, span') || failEl;
      textTarget.textContent = msg;
      failEl.style.display = 'block';
    } else {
      alert(msg);
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
  } else {
    initForms();
  }

  window.addEventListener('load', initForms);
})();
