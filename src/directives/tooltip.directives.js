import localizeFilter from "@/filters/localize.filter";

export default {
    bind(el, {value}) {
        M.Tooltip.init(el, {html: localizeFilter(value)})
    },
    unbind(el) {
        const t = M.Tooltip.getInstance(el)
        if (t && t.destroy) {
            t.destroy()
        }
    }
}