import moment from 'moment'
import ObjectId from '@/components/ObjectId'
import languages from '@/components/Languages'

const code = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5)
let detected = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage)
detected = detected.split('-')[0].toLowerCase()
const lang = languages[detected] ? detected : Object.keys(languages)[0]
moment.locale(lang)

export default {
  _id: ObjectId(),
  email: null,
  code: code,
  flag: '🇷🇪',
  country: '🇷🇪',
  lang: lang,
  elo: 1500,
  sound: true,
  moveSpeed: 250,
  pieces: 'cburnett',
  board: 'classic',
  observe: false,
  autoaccept: false,
  strongnotification: false,
  darkmode: false
}
