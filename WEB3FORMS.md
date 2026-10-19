# Activate website forms

The homepage wholesale enquiry and newsletter request forms submit to Web3Forms.

1. Create a Web3Forms access key for the business inbox at https://web3forms.com/.
2. Replace both `YOUR_WEB3FORMS_ACCESS_KEY` values in `index.html` with that public access key. Do not use an account password or a secret API credential.
3. Run `npm run build`. The existing GitHub workflow also rebuilds `dist` when source changes land on `main`.
4. In Krystal Git Version Control, update from remote and deploy the latest commit after the build finishes.
5. Submit a test from each form and verify receipt in the destination inbox (including spam).

Both forms stay on the current page. They show success only when the provider returns success, preserve entered details on failure, and prevent duplicate requests while sending. A hidden `botcheck` field uses Web3Forms' built-in honeypot protection.

The email subjects distinguish wholesale enquiries from newsletter signups. The lowercase `email` field provides the visitor's reply-to address. Newsletter requests include explicit opt-in consent; Web3Forms emails the details but does not create or maintain a mailing list.

Without a configured access key, the forms display a generic failure message and do not send data. Keep the change in draft until the key is configured. Real inbox delivery remains unverified until a test is received.
