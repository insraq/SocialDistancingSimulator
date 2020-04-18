const modalNode = document.createElement("div");
const toastNode = document.createElement("div");

export let tabHeight = cc.view.getFrameSize().height * 100 / cc.winSize.height;

document.body.appendChild(modalNode);
document.body.appendChild(toastNode);

const empty: m.Component = { view: () => "" };

export function StartUI() {

    m.route(modalNode, "/main", {
        "/main": empty,
    });

    cc.goto("/main");
}

let toastTimeoutId: number = null;

export function showToast(text: string) {
    if (toastTimeoutId) {
        clearTimeout(toastTimeoutId);
        toastNode.innerHTML = "";
    }
    toastNode.innerHTML = `<div class="toast" style="bottom:${tabHeight}px">${text}</div>`;
    toastTimeoutId = setTimeout(() => {
        toastNode.innerHTML = "";
        toastTimeoutId = null;
    }, 3500);
}