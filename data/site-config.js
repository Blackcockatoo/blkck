/* ─────────────────────────────────────────────────────────────────────────
   B$S site switches — the ONE place to plug in outside services.
   ───────────────────────────────────────────────────────────────────────── */
(function (root) {
  var config = {
    /* "Join the Civilian Signal" mailing list.
       Paste your provider's form endpoint into `action` and the form goes live everywhere
       (home, store, every world page). Examples:
         Buttondown:  'https://buttondown.com/api/emails/embed-subscribe/YOUR_USERNAME'
         Kit/ConvertKit: 'https://app.kit.com/forms/YOUR_FORM_ID/subscriptions'   (emailField: 'email_address')
         Mailchimp:   'https://XXXX.us21.list-manage.com/subscribe/post?u=…&id=…'  (emailField: 'EMAIL')
       Leave action '' and the form falls back to a pre-filled email to fallbackEmail. */
    signal: {
      action: '',
      emailField: 'email',
      hiddenFields: {},            // e.g. { tag: 'blkck2' } if your provider wants extras
      fallbackEmail: 'bluesssnakestudio@gmail.com'
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = config; else root.BSS_SITE_CONFIG = config;
})(typeof window !== 'undefined' ? window : this);
