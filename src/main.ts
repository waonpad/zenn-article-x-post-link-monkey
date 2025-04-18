/**
 * 拡張機能を有効にするURLの正規表現
 *
 * Zennの記事ページ、本のトップページ、スクラップのページに対応
 */
const matchRegexp = /^https:\/\/zenn.dev\/[^\/]+\/(articles|books|scraps)\/[^\/]+$/;

/**
 * 現在のURL
 */
let currentUrl: string | undefined = undefined;
/**
 * イベントリスナーが登録されているかどうか
 */
let isEventListening = false;

/**
 * 最初に押すキー
 */
const firstKeyCode = "MetaRight";
/**
 * 最初に押すキーが押されているかどうか
 */
let isFirstKeyDown = false;
/**
 * 2つ目に押すキー (処理を実行するキー)
 */
const secondKeyCode = "KeyB";

/**
 * メインの処理
 */
const action = () => {
  const elements = document.querySelectorAll<HTMLAnchorElement>(
    "a[class*='ProfileCard_twitterLink__l4sOK'], a[class*='SidebarUserBio_twitterLink__yGgDq']",
  );

  // Xアカウントリンクは記事の下とサイドバーに2つある可能性がある

  // Xアカウントが紐つけられていない場合
  // TODO: 紐つけられているが要素を取得できていない可能性があるため定期的に確認する
  if (elements.length === 0) {
    return;
  }

  const element = elements[0];
  // hrefの最後のパスがXアカウント名
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const authorXId = element.href.split("/").pop()!;

  // from:idでそのユーザーの投稿を検索する
  const xSearchQuery = `${currentUrl} from:${authorXId}`;
  // Xの検索結果ページのURL
  const xSearchUrl = `https://x.com/search?q=${encodeURIComponent(xSearchQuery)}`;
  // 新しいタブで検索結果ページを開く
  window.open(xSearchUrl, "_blank");
};

/**
 * 1つ目のキーが押されている時に2つ目のキーが押された場合にメインの処理を実行する
 */
const keyDownListener = (event: KeyboardEvent) => {
  // 1つ目のキーが押された場合、フラグを立てて終了
  if (event.code === firstKeyCode) {
    isFirstKeyDown = true;

    return;
  }

  // 2つ目のキーが押されて、1つ目のキーが押されている場合
  if (event.code === secondKeyCode && isFirstKeyDown) {
    // メインの処理を実行
    action();
  }
};

/**
 * 1つ目のキーが離された場合、フラグを下げる
 */
const keyUpListener = (event: KeyboardEvent) => {
  if (event.code === firstKeyCode) {
    isFirstKeyDown = false;
  }
};

/**
 * イベントリスナーを登録したり削除したりする
 */
const manageEventListeners = ({ url }: { url: string }) => {
  // URLが変わっていない場合は何もしない
  if (currentUrl === url) return;

  // URLを更新
  currentUrl = url;

  // 新しいURLが条件マッチしない場合
  if (!url.match(matchRegexp)) {
    // イベントリスナーが登録されている場合は削除する
    if (isEventListening) {
      window.removeEventListener("keydown", keyDownListener);
      window.removeEventListener("keyup", keyUpListener);
      isEventListening = false;
    }

    return;
  }

  // 新しいURLが条件マッチする場合

  // イベントリスナーが登録されていない場合は登録する
  if (!isEventListening) {
    window.addEventListener("keydown", keyDownListener);
    window.addEventListener("keyup", keyUpListener);
    isEventListening = true;
  }
};

/**
 * イベントリスナーを管理する関数を実行するかどうかはMutationObserverで監視した結果で判断する
 */
const observerCallback = ((mutations: MutationRecord[]) => {
  const addedNodes = mutations.flatMap((mutation) => Array.from(mutation.addedNodes));

  /**
   * head > link[rel="canonical"] の要素
   */
  const changeTarget = addedNodes.find((node) => {
    if (node instanceof HTMLLinkElement) {
      return node.rel === "canonical";
    }

    return false;
  }) as HTMLLinkElement | undefined;

  if (!changeTarget) return;

  manageEventListeners({ url: changeTarget.href });
}) satisfies MutationCallback;

/**
 * 監視の開始とイベントリスナーの管理初期化
 */
const init = () => {
  const observer = new MutationObserver(observerCallback);
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const targetNode = document.querySelector<HTMLHeadElement>("head")!;
  observer.observe(targetNode, { childList: true, subtree: true });

  // 初回実行は手動で行う
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  manageEventListeners({ url: document.querySelector<HTMLLinkElement>("link[rel='canonical']")!.href });
};

init();
