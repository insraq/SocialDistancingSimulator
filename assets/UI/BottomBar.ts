import { G } from "../Script/Global";

export function BottomBar(): m.Component {
    return {
        view: () => {
            return m("div.bottom-bar", [
                m("div.pointer", { onclick: () => cc.goto("/policy") }, [
                    m("img", { src: G.res.policyImg }),
                    m("div", "Policy"),
                ]),
                m("div", [m("img", { src: G.res.inspectImg }), m("div", "Inspect")]),
                m("div", [m("img", { src: G.res.labImg }), m("div", "Lab")]),
                m("div", [m("img", { src: G.res.hospitalImg }), m("div", "Health")]),
            ]);
        },
    };
}
