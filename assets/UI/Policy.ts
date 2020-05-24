import { icon } from "./UIHelper";
import { POLICIES } from "../Script/World";
import { G } from "../Script/Global";

export function Policy(): m.Component {
    return {
        view: () => {
            const w = G.sim.world;
            return m(
                "div.modal",
                m("div.panel", [
                    m("div.header", [
                        "Policy Center",
                        m("div.close", { onclick: () => cc.goto("/main") }, icon("close")),
                    ]),
                    m("div.scrollable", [
                        m(
                            "div",
                            POLICIES.map((policy) =>
                                m(
                                    "div.policy",
                                    {
                                        class: policy.isActive(w) ? "green" : "",
                                        title: policy.isActive(w)
                                            ? "This policy is active, click to deactivate"
                                            : "Activate this policy",
                                        onclick: policy.toggle.bind(null, w),
                                    },
                                    policy.name
                                )
                            )
                        ),
                    ]),
                ])
            );
        },
    };
}
