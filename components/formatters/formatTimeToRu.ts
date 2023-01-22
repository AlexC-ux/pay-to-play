export function FormatDateToRu(time: Date) {
    return `${time.getDate() < 10 ? `0${time.getDate()}` : time.getDate()}.${time.getMonth() + 1 < 10 ? `0${time.getMonth() + 1}` : time.getMonth() + 1}.${time.getFullYear()} ${time.getHours() < 10 ? `0${time.getHours()}` : time.getHours()}:${time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()}`
}