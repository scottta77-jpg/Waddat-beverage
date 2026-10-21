(function () {
  'use strict';

  // Web3Forms public access keys (designed for client-side API submission)
  var WHOLESALE_KEY = '9e75e3c3-e0ff-475b-9d68-67e621ced028';
  var NEWSLETTER_KEY = '39a22fee-235b-4cdf-b13e-b1cfb18175ff';
  var WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

  function initForms() {
    // 1. Wholesale Form
    var wholesaleForms = document.querySelectorAll(
      '#wf-form-Wholesale-Form, form[name="wf-form-Wholesale-Form"]'
    );

    wholesaleForms.forEach(function (form) {
      if (form.dataset.waddatBound) return;
      form.dataset.waddatBound = 'true';

      form.removeAttribute('onsubmit');
      form.removeAttribute('action');
      form.removeAttribute('method');

      var submitBtn = form.querySelector('button, input[type="submit"], .button-wrapper');
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

        var nameInput = form.querySelector('#Wholesale-Name, [name="business_name"], [name="Business Name"], [name="name"]');
        var emailInput = form.querySelector('#Wholesale-Email, [name="email"], [name="Email"]');
        var messageInput = form.querySelector('#Wholesale-Message, [name="message"], [name="Message"]');

        var businessName = nameInput ? nameInput.value.trim() : '';
        var email = emailInput ? emailInput.value.trim() : '';
        var message = messageInput ? messageInput.value.trim() : '';

        var payload = {
          access_key: WHOLESALE_KEY,
          subject: 'New Wholesale Enquiry: ' + businessName,
          from_name: 'Waddat Drinks Wholesale Enquiry',
          business_name: businessName,
          name: businessName,
          email: email,
          message: message
        };

        handleFormSubmit({
          form: form,
          endpoint: WEB3FORMS_ENDPOINT,
          payload: payload,
          fallbackEndpoint: '/api/wholesale.php',
          successMessage: 'Thanks! We’ll be in touch about stocking Waddat.',
          errorMessage: 'Something went wrong. Please try again.'
        });
      }, true);
    });

    // 2. Newsletter Form
    var newsletterForms = document.querySelectorAll(
      '#wf-form-Newsletter-Form, form[name="wf-form-Newsletter-Form"]'
    );

    newsletterForms.forEach(function (form) {
      if (form.dataset.waddatBound) return;
      form.dataset.waddatBound = 'true';

      form.removeAttribute('onsubmit');
      form.removeAttribute('action');
      form.removeAttribute('method');

      var submitBtn = form.querySelector('button, input[type="submit"], .button-wrapper');
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

        var nameInput = form.querySelector('#Newsletter-Name, #Name, [name="name"], [name="Name"]');
        var emailInput = form.querySelector('#Newsletter-Email, #Email, [name="email"], [name="Email"]');

        var name = nameInput ? nameInput.value.trim() : '';
        var email = emailInput ? emailInput.value.trim() : '';

        var payload = {
          access_key: NEWSLETTER_KEY,
          subject: 'New Newsletter Signup: ' + name,
          from_name: 'Waddat Drinks Newsletter Signup',
          name: name,
          email: email
        };

        handleFormSubmit({
          form: form,
          endpoint: WEB3FORMS_ENDPOINT,
          payload: payload,
          fallbackEndpoint: '/api/newsletter.php',
          successMessage: 'You’re in! Watch out for new flavours and promos.',
          errorMessage: 'Something went wrong. Please try again.'
        });
      }, true);
    });
  }

  function handleFormSubmit(opts) {
    var form = opts.form;
    var endpoint = opts.endpoint;
    var payload = opts.payload;
    var successMessage = opts.successMessage;
    var errorMessage = opts.errorMessage;

    var container = form.closest('.w-form') || form.parentElement;
    var doneEl = container ? container.querySelector('.w-form-done, .form_message-success') : null;
    var failEl = container ? container.querySelector('.w-form-fail, .form_message-error') : null;

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

    var submitBtn = form.querySelector('button[type="submit"], input[type="submit"], .button-wrapper, .button.is-form-submit');

    if (failEl) failEl.style.display = 'none';
    if (doneEl) doneEl.style.display = 'none';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.pointerEvents = 'none';
      submitBtn.style.opacity = '0.6';
    }

    function postJson(url, isFallback) {
      return fetch(url, {
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
              var textTarget = doneEl.querySelector('div, p, span') || doneEl;
              textTarget.textContent = successMessage;
              doneEl.style.display = 'block';
            }
          } else if (!isFallback && opts.fallbackEndpoint) {
            return postJson(opts.fallbackEndpoint, true);
          } else {
            showFormError(failEl, errorMessage);
          }
        })
        .catch(function () {
          if (!isFallback && opts.fallbackEndpoint) {
            return postJson(opts.fallbackEndpoint, true);
          }
          showFormError(failEl, errorMessage);
        });
    }

    postJson(endpoint, false).finally(function () {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.pointerEvents = '';
        submitBtn.style.opacity = '';
      }
    });
  }

  function showFormError(failEl, msg) {
    if (failEl) {
      var textTarget = failEl.querySelector('div, p, span') || failEl;
      textTarget.textContent = msg;
      failEl.style.display = 'block';
    } else {
      alert(msg);
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function initWhatsApp() {
    if (document.querySelector('.whatsapp-float')) return;
    var a = document.createElement('a');
    a.href = 'https://wa.me/447841907091';
    a.className = 'whatsapp-float';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', 'Chat with us on WhatsApp');
    a.title = 'Chat with us on WhatsApp';
    a.innerHTML = '<span class="whatsapp-tooltip">Chat with us</span>' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="currentColor" aria-hidden="true">' +
      '<path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>' +
      '</svg>';
    document.body.appendChild(a);
  }

  function start() {
    initForms();
    initWhatsApp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  window.addEventListener('load', start);
})();

