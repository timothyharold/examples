import moment from 'moment'

// a version of formatting the date with methods - Utilities.formatDateToString(<stringOrNumber>)

const defaultDateFormat = 'MMMM Do YYYY, h:mm:ss a'

const formatDateToString = (value, dateFormatStr) => formatDate(checkValue(value), checkFormatString(dateFormatStr))

const formatDate = (value, dateFormatStr) => moment(value).format(dateFormatStr)

const checkValue = value => ((!value && typeof value !== 'number' && typeof value !== 'string') ? 'Invalid input value' : ((typeof value === 'string') ? value : ((String(value).length < 11) ? (value * 1000) : value)))

const checkFormatString = str => (typeof str === 'undefined') ? defaultDateFormat : str

export default {
  formatDateToString
}
