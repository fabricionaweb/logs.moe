# logs.moe

Share encrypted logs without leaving terminal.

This is _yet_ another pastebin alternative. Working as side project, I want to test an idea using
[SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) API. Made using Deno to have everything
(or almost) built-in was also fun.

## How it works

To create:

1. An endpoint `POST /` is listen to form-data and will accept the field name `data` containg file or text.

   - Limited to 21MiB request size (not file size, we advertise 20MiB so 1MiB as margin) and have no conditions for the
     file format (people could always trick it anyways).

1. It will generate a random [IV](https://en.wikipedia.org/wiki/Initialization_vector), uuid, and than encrypt the
   content using [SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt) native api
   (AES-GCM algorithm).

   - The generated IV and uuid will be stored in a [Deno KV](https://docs.deno.com/deploy/kv/manual) database.
   - The encrypted content will be saved as file in disk.
   - Private key is not stored.

1. Prints the url (including the private key) to share and decrypt that file.

To retrieve:

1. An endpoint `GET /{uuid}#{key}` will render a HTML page containg the IV that pairs to and it is needed to decrypt the
   content.

   1. The private key should be also present in the URL hash `#{key}` and it is only accessible to the browser using
      javascript. The server cant know about it.

   1. This page have a small amount of javascript. It will request to another endpoint `GET /data/{uuid}` for the
      encrypted file.

1. Combining IV, Private Key and the encrypted file, it will proceed to decrypt (in the browser) and prints to the body
   if successful.

To clean:

1. Using [Deno cron](https://docs.deno.com/deploy/kv/manual/cron), it periodically (every midnight) iterates over the
   encrypted files seeking for files that have exceed time to living (7d).

1. Delete the files and remove from KV.
