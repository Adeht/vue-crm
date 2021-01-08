import localizeFilter from "@/filters/localize.filter";

export default {
    'logout': localizeFilter('logout'),
    'login': localizeFilter('login'),
    '404': localizeFilter('404'),
    'auth/wrong-password': localizeFilter('auth/wrong-password'),
    'auth/user-not-found': localizeFilter('auth/user-not-found'),
    'auth/email-already-in-use': localizeFilter('auth/email-already-in-use')
}