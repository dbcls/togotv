// 動画でワークフローの「いいね」。
// 件数は Google Apps Script (GAS) の Web App に保存して全員で共有する（docs/workflow-likes-gas.md）。
// 誰が押したかは記録せず（ブラウザ内にも保存しない）、押された回数だけを数える。
// LIKES_ENDPOINT が空のあいだは件数を保存できないので、押しても数は表示しない。
export const LIKES_ENDPOINT = "https://script.google.com/a/macros/dbcls.rois.ac.jp/s/AKfycbzuLJMs71c_nX9hkDG7vaXEjq082kGRJPiGYA4_DRpPl0U5iwRsQh_4Wt7YLfII5ZaNAA/exec";

// 同じページにある複数のボタン（ページ上部と下部など）の件数をそろえるためのイベント
export const LIKE_EVENT = "togotv-workflow-like";
const TIMEOUT_MS = 6000;

// ルートのパス（/workflow-variant.html や /en/workflow-variant.html）から ID を作る
export function workflowId(path) {
  const name = String(path || "")
    .split("/")
    .pop()
    .replace(/\.html$/, "");
  return /^workflow-[a-z0-9-]+$/.test(name) ? name : "";
}

async function request(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, Object.assign({ signal: controller.signal }, options));
    return JSON.parse(await res.text());
  } finally {
    clearTimeout(timer);
  }
}

// 全ワークフローの件数 { "workflow-variant": 12, ... }。
// 1ページに複数のボタンがあっても通信は1回で済むよう、結果を共有する。
// fresh を true にすると、共有している結果を使わずに取り直す（件数を定期的に更新するとき用）
let countsPromise = null;
export function fetchLikeCounts(fresh = false) {
  if (!LIKES_ENDPOINT) return Promise.resolve({});
  if (fresh) countsPromise = null;
  if (!countsPromise) {
    countsPromise = request(`${LIKES_ENDPOINT}?action=list`)
      .then(json => (json && json.counts) || {})
      .catch(error => {
        console.log("workflow likes fetch error", error);
        countsPromise = null;
        return {};
      });
  }
  return countsPromise;
}

// いいねを1つ送る。誰が押したかは記録せず、押された回数だけを数える。
// サーバーが返した件数（取れなければ null）を返す
export async function addLike(id) {
  let count = null;
  if (LIKES_ENDPOINT) {
    try {
      // text/plain で送ると CORS のプリフライトが発生せず、GAS でそのまま受け取れる
      const json = await request(LIKES_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ id: id })
      });
      if (json && typeof json.count === "number") count = json.count;
    } catch (error) {
      console.log("workflow like post error", error);
    }
    countsPromise = null;
  }
  window.dispatchEvent(new CustomEvent(LIKE_EVENT, { detail: { id: id, count: count } }));
  return count;
}
