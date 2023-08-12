const main = () => {
  const BUTTON_ID = "ext-circle-add-remove-button";

  const waitForElement = selector =>
    new Promise(resolve => {
      const element = document.querySelector(selector);
      if (element) {
        return resolve(element);
      }

      const observer = new MutationObserver(() => {
        const newElement = document.querySelector(selector);
        if (newElement) {
          resolve(newElement);
          observer.disconnect();
        }
      });

      observer.observe(document, { subtree: true, childList: true });
    });

  const createButton = () => {
    document.getElementById(BUTTON_ID)?.remove(); // Remove if already exists

    const button = document.createElement("div");
    button.id = BUTTON_ID;
    button.tabIndex = 0;
    button.className =
      "css-18t94o4 css-1dbjc4n r-1niwhzg r-sdzlij r-1phboty r-rs99b7 r-6gpygo r-1kb76zh r-2yi16 r-1qi8awa r-1ny4l3l r-o7ynqc r-6416eg r-lrvibr";

    const child = document.createElement("div");
    child.className =
      "css-901oao r-1awozwy r-6koalj r-18u37iz r-16y2uox r-37j5jr r-a023e6 r-b88u0q r-1777fci r-rjixqe r-bcqeeo r-q4m81j r-qvutc0";

    child.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03"><g><path d="M14 6c0 2.21-1.791 4-4 4S6 8.21 6 6s1.791-4 4-4 4 1.79 4 4zm-4 5c-2.352 0-4.373.85-5.863 2.44-1.477 1.58-2.366 3.8-2.632 6.46l-.11 1.1h17.21l-.11-1.1c-.266-2.66-1.155-4.88-2.632-6.46C14.373 11.85 12.352 11 10 11zm13.759-3.83c-.355-.69-1.059-1.13-1.84-1.17-.66-.03-1.347.22-1.918.79-.573-.57-1.259-.82-1.92-.79-.781.04-1.485.48-1.84 1.17-.358.71-.339 1.62.206 2.59.541.97 1.601 1.99 3.352 2.98l.202.12.201-.12c1.751-.99 2.811-2.01 3.352-2.98.544-.97.563-1.88.205-2.59z"></path></g></svg>';

    button.appendChild(child);
    return button;
  };

  const button = createButton();

  const addButton = async () => {
    const parent = await waitForElement(
      ".css-1dbjc4n.r-obd0qt.r-18u37iz.r-1w6e6rj.r-1h0z5md.r-dnmrzs"
    );

    parent?.insertBefore(button, parent.lastElementChild);
  };

  let username;
  const observer = new MutationObserver(() => {
    const newUsername = location.pathname.match(/\/[^\/]+/)?.[0];
    if (newUsername && username !== newUsername) {
      addButton();
      username = newUsername;
    }
  });

  observer.observe(reactRoot, {
    subtree: true,
    childList: true,
  });

  addButton();
};

const reactRoot = document.getElementById("react-root");
if (reactRoot) {
  main();
}