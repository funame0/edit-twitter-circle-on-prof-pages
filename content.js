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
  button.title = "Circle";
  button.setAttribute("aria-label", "Circle");
  button.setAttribute("role", "button");

  const child = document.createElement("div");
  child.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03"><g><path d="M14 6c0 2.21-1.791 4-4 4S6 8.21 6 6s1.791-4 4-4 4 1.79 4 4zm-4 5c-2.352 0-4.373.85-5.863 2.44-1.477 1.58-2.366 3.8-2.632 6.46l-.11 1.1h17.21l-.11-1.1c-.266-2.66-1.155-4.88-2.632-6.46C14.373 11.85 12.352 11 10 11zm13.759-3.83c-.355-.69-1.059-1.13-1.84-1.17-.66-.03-1.347.22-1.918.79-.573-.57-1.259-.82-1.92-.79-.781.04-1.485.48-1.84 1.17-.358.71-.339 1.62.206 2.59.541.97 1.601 1.99 3.352 2.98l.202.12.201-.12c1.751-.99 2.811-2.01 3.352-2.98.544-.97.563-1.88.205-2.59z"></path></g></svg>';

  button.appendChild(child);
  return button;
};

const addButton = async button => {
  const userActions = await waitForElement("[data-testid=userActions]");

  button.className = userActions.className;
  button.firstElementChild.className = userActions.firstElementChild.className;
  userActions.after(button);
};

const getCsrfToken = () => document.cookie.match(/(?<=ct0=)[^;]+/)?.[0];

const callAPI = async (url, options = {}) => {
  const bearerToken =
    "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs=1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";

  const ct0 = getCsrfToken();
  if (!ct0) return;

  const headers = {
    authorization: bearerToken,
    "x-csrf-token": ct0,
    "x-twitter-active-user": "yes",
    "x-twitter-auth-type": "OAuth2Session",
  };

  const response = await fetch(url, Object.assign({ headers }, options));

  return response.json();
};

const getTFLists = async () => {
  const endpoint =
    "https://twitter.com/i/api/graphql/QjN8ZdavFDqxUjNn3r9cig/AuthenticatedUserTFLists";

  const responseJson = await callAPI(endpoint);
  const TFLists = responseJson?.data?.authenticated_user_trusted_friends_lists;
  return TFLists;
};

const [addUserToTFList, removeUserFromTFList] = [
  ["kz2e24ykUcLEssPne7Df-Q", "TrustedFriendsAddRemoveButtonAddMutation"],
  ["Zv06okw7DQo4_O7nWyV-9g", "TrustedFriendsAddRemoveButtonRemoveMutation"],
].map(([queryId, endpoint]) => (userId, trustedFriendsId) => {
  const data = {
    features: {
      responsive_web_graphql_timeline_navigation_enabled: true,
    },
    queryId,
    variables: {
      trustedFriendsId,
      userId,
    },
  };

  const url = `https://twitter.com/i/api/graphql/${queryId}/${endpoint}`;

  return callAPI(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
});

const main = () => {
  const button = createButton();

  let username;
  const observer = new MutationObserver(() => {
    const newUsername = location.pathname.match(/\/[^\/]+/)?.[0];
    if (newUsername && username !== newUsername) {
      addButton(button);
      username = newUsername;
    }
  });

  observer.observe(reactRoot, {
    subtree: true,
    childList: true,
  });

  button.addEventListener("click", async () => {
    console.log(await getTFLists());
  });

  addButton(button);
};

const reactRoot = document.getElementById("react-root");
if (reactRoot) {
  main();
}
