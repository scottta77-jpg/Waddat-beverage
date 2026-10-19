# Website forms

The homepage wholesale enquiry and newsletter signup forms are configured with the public Web3Forms access key supplied for Waddat Drinks Website.

## Publish updates

1. The existing GitHub workflow rebuilds `dist` when source changes land on `main`.
2. After the build finishes, open Krystal Git Version Control, update from remote, and deploy the latest commit.
3. Submit a test from each form and verify receipt in the receiving inbox, including spam.

Both forms stay on the current page. They show success only when Web3Forms returns success, preserve entered details on failure, and prevent duplicate requests while sending. A hidden `botcheck` field uses Web3Forms' built-in honeypot protection.

The email subjects distinguish wholesale enquiries from newsletter signups. The lowercase `email` field provides the visitor's reply-to address. Newsletter requests include explicit opt-in consent; Web3Forms emails the details but does not create or maintain a mailing list.

To change the receiving inbox, configure the intended destination in Web3Forms and update both hidden `access_key` values in `index.html` if a new key is issued. This is a public form identifier, not a secret account credential.

Build and simulated submission checks pass. Real inbox delivery must be confirmed after deployment; a successful API response does not prove inbox receipt.
