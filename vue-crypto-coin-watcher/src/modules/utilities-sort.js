import moment from 'moment'

const sortProductByDisplayName = (a, b) => {
  // asc
  return a.display_name < b.display_name ? -1 : a.display_name > b.display_name ? 1 : 0
}

const sortSavedProductPrices = (a, b) => {
  // desc
  let ta = moment(a.time).valueOf()
  let tb = moment(b.time).valueOf()
  return ta > tb ? -1 : ta < tb ? 1 : 0
}

export default {
  sortProductByDisplayName,
  sortSavedProductPrices
}
