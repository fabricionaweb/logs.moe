document.body.addEventListener("dragenter", () => {
  document.body.classList.add("dragging")
})

document.body.addEventListener("dragleave", (event) => {
  document.body.classList.toggle("dragging", event.relatedTarget)
})

document.body.addEventListener("drop", async (event) => {
  event.preventDefault()
  document.body.classList.remove("dragging")
  const [file] = event.dataTransfer.files

  if (!file) {
    return
  }

  const codeElement = document.querySelector("pre code")
  codeElement.textContent = "still sending 🚀"
  codeElement.classList.add("loading")

  try {
    const body = new FormData()
    body.append("data", file)
    const response = await fetch("/", { method: "POST", body })
    const url = await response.text()

    if (!url || !response.ok) {
      throw "error"
    }

    location.assign(url)
  } catch (err) {
    console.error(err)
    codeElement.textContent = "failed 💀"
    codeElement.classList.remove("loading")
  }
})

document.body.addEventListener("dragover", (event) => {
  event.preventDefault()
})
