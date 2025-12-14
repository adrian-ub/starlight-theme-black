import { builtinI18nSchema } from '../schemas/i18n'

import en from './en.json'
import es from './es.json'

const i18n = builtinI18nSchema()

export default Object.fromEntries(
  Object.entries({
    en,
    es,
  }).map(([key, dict]) => [key, i18n.parse(dict)]),
)
