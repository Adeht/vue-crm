import store from '../store'
import ru from '../locales/ru.json'
import ua from '../locales/ua.json'

const locales = {
    'ru-RU': ru,
    'uk-UA': ua
}

export default function localizeFilter(key) {
    const locale = store.getters.info.locale || 'ru-RU'
    return locales[locale][key] || `[Localize error]: key ${key} not found`
}