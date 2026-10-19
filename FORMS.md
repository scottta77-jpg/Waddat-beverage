# Waddat website forms

Wholesale enquiries and newsletter signup requests on https://waddatdrinks.com/
use FormSubmit to email info@waddatbeverageltd.com. No SMTP credentials, Google
Workspace connection, API key or environment variables are required.

## Activate and verify delivery

1. Publish the current build to waddatdrinks.com.
2. Submit a clearly labelled setup test from the wholesale form. FormSubmit
   sends an activation request to info@waddatbeverageltd.com on first use.
3. Open that inbox, including Spam, and confirm the genuine FormSubmit
   activation email. If FormSubmit asks to confirm the other form, confirm it too.
4. Submit a fresh test from each form and verify that both emails actually
   arrive. Subjects are `Waddat | Wholesale Enquiry` and
   `Waddat | Newsletter Signup`. Reply-To is the visitor's email address.

An API acceptance or website success message does not prove inbox delivery.
Until activation, the site preserves entered details and shows an error if
FormSubmit reports activation is required. Check the receiving inbox to finish
setup; do not treat activation as a successful enquiry.

## Behavior and maintenance

Both forms submit through the documented AJAX endpoint and stay on the page.
They validate independently, prevent duplicate requests while pending, preserve
details on failure, and clear only after an explicit success response. A
30-second timeout releases the button without automatically retrying a request
that might already have been processed. The versioned script URL avoids reuse
of the old Web3Forms handler from browser caches.

AJAX uses `_captcha=false` with FormSubmit's documented `_honey` field. The
honeypot is checked locally and forwarded for service-side filtering. This is
basic spam protection; FormSubmit recommends its hosted CAPTCHA for stronger
protection, which changes the submission experience.

Newsletter requests include the explicit consent value and submission timestamp.
This collects signup requests by email; it does not automatically maintain a
mailing list, send newsletters, or manage unsubscribes.

To change the destination, update both form action URLs in `index.html` and
activate the new inbox. Keep `_url` aligned with the public website. Run
`npm run build` and publish `dist/`; this repository also tracks the built output
for its existing cPanel deployment. The removed Web3Forms handler and keys are
not used by these forms.

Provider documentation: https://formsubmit.co/documentation and
https://formsubmit.co/ajax-documentation.
