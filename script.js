const TEXT_SOURCE = "/4i18n/adsfeed.json";

const feedList = document.getElementById("feedList");
const loadError = document.getElementById("loadError");


function getValue(object, path) {
  return path
    .split(".")
    .reduce(
      (current, key) => current?.[key],
      object
    );
}


function applyStaticText(data) {
  const elements = document.querySelectorAll("[data-text]");

  elements.forEach((element) => {
    const path = element.dataset.text;
    const value = getValue(data, path);

    if (typeof value === "string") {
      element.textContent = value;
    }
  });
}


function createFeedCard(message, data) {
  const card = document.createElement("article");

  card.className = `feed-card ${message.type}`;
  card.dataset.messageId = message.id;


  const header = document.createElement("div");

  header.className = "card-header";


  const type = document.createElement("span");

  type.className = "card-type";

  type.textContent =
    data.types[message.type] ?? message.type;


  const time = document.createElement("span");

  time.className = "card-time";
  time.textContent = message.time;


  const title = document.createElement("h2");

  title.className = "card-title";
  title.textContent = message.title;


  const content = document.createElement("p");

  content.className = "card-message";
  content.textContent = message.message;


  header.append(type, time);

  card.append(
    header,
    title,
    content
  );

  return card;
}


function renderFeed(data) {
  const fragment = document.createDocumentFragment();

  data.messages.forEach((message) => {
    fragment.appendChild(
      createFeedCard(message, data)
    );
  });

  feedList.replaceChildren(fragment);
}


function showLoadError(data = null) {
  feedList.replaceChildren();

  loadError.hidden = false;

  if (data?.errors?.loadFailed) {
    loadError.textContent = data.errors.loadFailed;
  }
}


async function loadFeed() {
  try {
    const response = await fetch(
      TEXT_SOURCE,
      {
        cache: "no-cache"
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    document.title = data.page.title;

    applyStaticText(data);
    renderFeed(data);

    loadError.hidden = true;

  } catch (error) {
    console.error(error);

    showLoadError();
  }
}


loadFeed();
