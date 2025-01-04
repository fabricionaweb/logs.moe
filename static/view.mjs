import hljs from "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/es/highlight.min.js";
import { decrypt } from "./subtle.mjs";

const parseUrl = () => {
  const uuid = location.pathname.slice(1);
  const [, k, ext, from, to] =
    location.hash.match(/([\w\-_]{22})\.?(\w+)?:?(\d+)?-?(\d+)?/) || [];

  return { uuid, k, ext, lines: [from, to] };
};

const addLineNumbers = (preElement) => {
  const { height } = preElement.getClientRects()[0];
  const { lineHeight } = getComputedStyle(preElement);
  const totalLines = parseInt(height / parseFloat(lineHeight));
  const listElement = document.createElement("ol");

  for (let i = 1; i < totalLines; i++) {
    const listItemElement = document.createElement("li");
    listItemElement.dataset.ln = i;
    listElement.appendChild(listItemElement);
  }

  listElement.addEventListener("click", ({ target, shiftKey }) => {
    const clicked = parseInt(target.dataset.ln);
    if (!clicked) {
      return;
    }

    const { k, ext, lines } = parseUrl();
    let [from, to = from] = lines;
    // swap if clicking on prior lines
    if (clicked < from) {
      from = clicked;
    } else {
      to = clicked;
    }

    location.hash = `${k}${ext ? `.${ext}` : ""}:${
      shiftKey && from ? `${from}-${to}` : clicked
    }`;
  });

  preElement.insertBefore(listElement, preElement.firstChild);
};

const selectLines = (preElement) => {
  const [start, total = start] = parseUrl().lines;
  if (!start) {
    return;
  }

  const markElement =
    document.querySelector("mark") || document.createElement("mark");
  markElement.style.setProperty("--top", start - 1);
  markElement.style.setProperty("--height", total - start + 1);

  preElement.appendChild(markElement);

  // scrollIntoView needs to defer
  setTimeout(() => markElement.scrollIntoView(), 200);
};

addEventListener("DOMContentLoaded", async () => {
  // delete noscript tag
  document.querySelector("noscript").remove();

  const { uuid, k, ext } = parseUrl();
  const preElement = document.createElement("pre");
  let childElement = document.createElement("code");

  try {
    const response = await fetch(`/data/${uuid}`);
    if (!response.ok) {
      throw response.status;
    }

    const iv = new Uint8Array(response.headers.get("X-IV")?.split(","));
    const cipherText = await response.arrayBuffer();
    const buffer = await decrypt(iv, k, cipherText);

    childElement.textContent = new TextDecoder().decode(buffer);
  } catch (err) {
    console.error(err);
    const mappedMessages = new Map([[404, "not found 🙈"]]);
    childElement.textContent = mappedMessages.get(err) || "failed 💀";
    return;
  } finally {
    preElement.appendChild(childElement);
    document.body.innerHTML = "";
    document.body.appendChild(preElement);
  }

  // force highlight.js instead of detect (default)
  if (ext) {
    hljs.configure({ languages: [ext] });
  }
  // do not call highlight.js if contents is too big
  if (preElement.textContent.length < 1_000_000) {
    hljs.highlightAll();
  }

  addLineNumbers(preElement);
  selectLines(preElement);

  addEventListener("hashchange", () => {
    selectLines(preElement);
  });
});
