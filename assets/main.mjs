import hljs from "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/es/highlight.min.js";
import { decrypt } from "./subtle.mjs";

/**
 * @param  {string}     contentType
 * @param  {Uint8Array} iv
 * @return {Promise<void>}
 */
export const init = async (contentType, iv) => {
  const uuid = location.pathname.slice(1);
  const [k, language] = location.hash.slice(1).split(".");
  const preElement = document.createElement("pre");
  let childElement = document.createElement("code");

  try {
    const response = await fetch(`/data/${uuid}`);
    const encrypted = await response.arrayBuffer();
    const buffer = await decrypt(iv, k, encrypted);

    if (contentType.startsWith("image/")) {
      childElement = Object.assign(document.createElement("img"), {
        src: URL.createObjectURL(new Blob([buffer])),
      });
    } else {
      childElement.textContent = new TextDecoder().decode(buffer) || "empty 👀";
    }
  } catch (err) {
    console.error(err);
    childElement.textContent = "failed 💀";
  } finally {
    preElement.appendChild(childElement);
    document.body.innerHTML = "";
    document.body.appendChild(preElement);
  }

  if (childElement.tagName.toLowerCase() !== "code") {
    return;
  }

  if (language) {
    hljs.configure({ languages: [language] });
  }

  // do not call highlight.js if contents is too big
  if (preElement.textContent.length < 1_000_000) {
    hljs.highlightAll();
  }

  addLineNumbers(preElement);
};

/**
 * @param  {Element} blockElement
 * @return {void}
 */
const addLineNumbers = (blockElement) => {
  const { height } = blockElement.getClientRects()[0];
  const { lineHeight } = getComputedStyle(blockElement);
  const totalLines = parseInt(height / parseFloat(lineHeight));
  const listElement = document.createElement("ol");

  for (let i = 1; i < totalLines; i++) {
    listElement.appendChild(
      Object.assign(document.createElement("li"), { id: `L${i}` }),
    );
  }

  blockElement.insertBefore(listElement, blockElement.firstChild);
};
