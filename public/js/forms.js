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
            var textTarget = doneEl.querySelector('div, p, span') || doneEl;
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
  } else {
    initForms();
  }

  window.addEventListener('load', initForms);
})();
