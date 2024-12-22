import hljs from "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.0/es/highlight.min.js"
import { decrypt } from "./subtle.mjs"

const parseUrl = () => {
  const uuid = location.pathname.slice(1)
  const [k, ...rest] = location.hash.slice(1).split(/(?=[:.])/)
  // only if I could work with RegEx
  const forcedLanguage = rest.find((str) => str.startsWith("."))?.slice(1)
  const selectedLines = rest.find((str) => str.startsWith(":"))?.slice(1)
    .split("-").map((i) => parseInt(i) || 0) || []

  return { uuid, k, forcedLanguage, selectedLines }
}

const addLineNumbers = (preElement) => {
  const { height } = preElement.getClientRects()[0]
  const { lineHeight } = getComputedStyle(preElement)
  const totalLines = parseInt(height / parseFloat(lineHeight))
  const listElement = document.createElement("ol")

  for (let i = 1; i < totalLines; i++) {
    const listItemElement = document.createElement("li")
    listItemElement.dataset.ln = i
    listElement.appendChild(listItemElement)
  }

  listElement.addEventListener("click", ({ target, shiftKey }) => {
    const clicked = parseInt(target.dataset.ln)
    const { k, forcedLanguage, selectedLines } = parseUrl()
    let [from, to = from] = selectedLines

    if (!clicked) {
      return
    }

    // swap if clicking on prior lines
    if (clicked < from) {
      from = clicked
    } else {
      to = clicked
    }

    location.hash = `${k}${forcedLanguage ? `.${forcedLanguage}` : ""}:${shiftKey && from ? `${from}-${to}` : clicked}`
  })

  preElement.insertBefore(listElement, preElement.firstChild)
}

const selectLines = (preElement) => {
  const [start, total = start] = parseUrl().selectedLines

  if (!start) {
    return
  }

  const markElement = document.querySelector("mark") || document.createElement("mark")
  markElement.style.setProperty("--top", start - 1)
  markElement.style.setProperty("--height", total - start + 1)

  preElement.appendChild(markElement)

  // scrollIntoView needs to defer
  setTimeout(() => markElement.scrollIntoView(), 200)
}

export const init = async (contentType, iv) => {
  const { uuid, k, forcedLanguage } = parseUrl()
  const preElement = document.createElement("pre")
  let childElement = document.createElement("code")

  try {
    const response = await fetch(`/data/${uuid}`)
    const encrypted = await response.arrayBuffer()
    const buffer = await decrypt(iv, k, encrypted)

    if (contentType.startsWith("image/")) {
      childElement = Object.assign(document.createElement("img"), {
        src: URL.createObjectURL(new Blob([buffer])),
      })
    } else if (contentType.startsWith("video/")) {
      childElement = Object.assign(document.createElement("video"), {
        src: URL.createObjectURL(new Blob([buffer])),
        controls: true,
      })
    } else if (contentType.startsWith("audio/")) {
      childElement = Object.assign(document.createElement("audio"), {
        src: URL.createObjectURL(new Blob([buffer])),
        controls: true,
      })
    } else {
      childElement.textContent = new TextDecoder().decode(buffer) || "empty 👀"
    }
  } catch (err) {
    console.error(err)
    childElement.textContent = "failed 💀"
    return
  } finally {
    preElement.appendChild(childElement)
    document.body.innerHTML = ""
    document.body.appendChild(preElement)
  }

  if (childElement.tagName.toLowerCase() !== "code") {
    return
  }

  if (forcedLanguage) {
    hljs.configure({ languages: [forcedLanguage] })
  }

  // do not call highlight.js if contents is too big
  if (preElement.textContent.length < 1_000_000) {
    hljs.highlightAll()
  }

  addLineNumbers(preElement)
  selectLines(preElement)
  addEventListener("hashchange", () => selectLines(preElement))
}
