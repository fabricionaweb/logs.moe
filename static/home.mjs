document.body.addEventListener("dragenter", () => {
  document.body.classList.add("dragging");
});

document.body.addEventListener("dragleave", (event) => {
  document.body.classList.toggle("dragging", event.relatedTarget);
});

document.body.addEventListener("dragover", (event) => {
  event.preventDefault();
});

document.body.addEventListener("drop", (event) => {
  event.preventDefault();
  document.body.classList.remove("dragging");
  create(event.dataTransfer.files[0]);
});

addEventListener("paste", (event) => {
  create(event.clipboardData.files[0] || event.clipboardData.getData("text"));
});

/**
 * @param  {File|string} data
 * @return {Promise<never>}
 */
const create = async (data) => {
  if (!data) {
    return;
  }

  const codeElement = document.querySelector("pre code");
  codeElement.textContent = "still sending 🚀";
  codeElement.classList.add("loading");

  try {
    const body =
      data instanceof File
        ? await data.arrayBuffer()
        : new TextEncoder().encode(data);

    const response = await fetch("/", {
      method: "POST",
      body,
    });
    const url = await response.text();

    if (!url || !response.ok) {
      throw response;
    }

    location.replace(url);
  } catch (err) {
    console.error(err);
    codeElement.textContent = "failed 💀";
    codeElement.classList.remove("loading");
  }
};
