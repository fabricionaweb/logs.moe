# logs.moe

Share encrypted logs without leaving terminal.

This is _yet_ another pastebin alternative. Working as side project, I want to test an idea using
[SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) API.

## How it works

To create:

1. An endpoint `POST /` is listen to form-data and will accept the field name `data` containg file or text.

   - Limited to 20MiB request size

1. It will generate a random [IV](https://en.wikipedia.org/wiki/Initialization_vector), uuid, and then encrypt the
   content using [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt) native api
   (AES-GCM algorithm).

   - The generated IV, uuid and encrypted content will be stored in a database
   - Private key is not stored

1. Returns the url (including the private key) to share.

To open:

1. An endpoint `GET /{uuid}#{key}` will render a HTML page containg the IV that is required to decrypt the content.

   1. The private key should be also present in the URL hash `#{key}` and it is only accessible to the browser using
      javascript. The server will not know about it.

   1. This page have a small amount of javascript. It will request to another endpoint `GET /data/{uuid}` for the
      encrypted file.

1. Having everything it will now proceed to decrypt (only in the browser) and render the result if successful.
