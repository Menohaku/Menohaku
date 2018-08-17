const dateRanges = [
    {
        value: 'thisWeek',
        patterns: [
            'viikon',
            'tämän viikon',
            'tällä viikolla',
            'kuluvan viikon',
            'kuluvalla viikolla',
            'tältä viikolta',
            'kuluvalta viikolta'
        ]
    },
    {
        value: 'nextWeek',
        patterns: [
            'ensi viikolla',
            'seuraavalla viikolla',
            'ensi viikon',
            'seuraavan viikon'
        ]
    },
    {
        value: 'nextMonth',
        patterns: [
            'ensi kuussa',
            'ensi kuun',
            'seuraavan kuun',
            'ensi kuukauden',
            'seuraavan kuukauden'
        ]
    },
    {
        value: 'thisMonth',
        patterns: [
            'tässä kuussa',
            'tämän kuun',
            'kuluvan kuun',
            'kuluvan kuukauden',
            'tämän kuukauden',
            'kuun',
            'kuukauden'
        ]
    },
    {
        value: 'january',
        patterns: [
            'tammikuu'
        ]
    },
    {
        value: 'february',
        patterns: [
            'helmikuu'
        ]
    },
    {
        value: 'march',
        patterns: [
            'maaliskuu'
        ]
    },
    {
        value: 'april',
        patterns: [
            'huhtikuu'
        ]
    },
    {
        value: 'may',
        patterns: [
            'toukokuu'
        ]
    },
    {
        value: 'june',
        patterns: [
            'kesäkuu'
        ]
    },
    {
        value: 'july',
        patterns: [
            'heinäkuu'
        ]
    }, {
        value: 'august',
        patterns: [
            'elokuu'
        ]
    },
    {
        value: 'september',
        patterns: [
            'syyskuu'
        ]
    },
    {
        value: 'october',
        patterns: [
            'lokakuu'
        ]
    },
    {
        value: 'november',
        patterns: [
            'marraskuu'
        ]
    },
    {
        value: 'december',
        patterns: [
            'joulukuu'
        ]
    },
    {
        value: 'today',
        patterns: [
            'tänään'
        ]
    },
    {
        value: 'tomorrow',
        patterns: [
            'huomenna',
            'huomisen'
        ]
    },
    {
        value: 'theDayAfterTomorrow',
        patterns: [
            'ylihuomenna'
        ]
    },
    {
        value: 'morning',
        patterns: [
            'aamusta',
            'aamulla'
        ]
    },
    {
        value: 'evening',
        patterns: [
            'illalla',
            'ilta',
            'illasta'
        ]
    },
    {
        value: 'morning',
        patterns: [
            'aamusta',
            'aamulla',
            'aamupäivä',
            'aamu'
        ]
    },
    {
        value: 'day',
        patterns: [
            'päivällä'
        ]
    },
    {
        value: 'night',
        patterns: [
            'yöllä'
        ]
    },
    {
        value: 'weekend',
        patterns: [
            'viikonloppu'
        ]
    }
]

export function dateRangeSearch(s) {
    const foundDates = []
    if (s) {
        const str = s.toLowerCase()
        dateRanges.forEach((el) => {
            el.patterns.some((pattern) => {
                const re = new RegExp(pattern)
                const range = str.match(re)
                if (range) {
                    return foundDates.push(el.value)
                }
                return undefined
            })
        })
    }
    return foundDates
}

export function createDateRange(value) {
    const currentDate = new Date()
    switch (value) {
        case 'thisMonth': {
            const start = new Date()
            let end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
            end -= 1
            return {
                start,
                end: new Date(end)
            }
        }
        case 'nextMonth': {
            const start = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
            let end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2)
            end -= 1
            return {
                start,
                end: new Date(end)
            }
        }
        case 'thisWeek': {
            const start = new Date()
            let end = new Date(currentDate.setDate((currentDate.getDate() - currentDate.getDay()) + 7))
            end -= 1
            return {
                start,
                end: new Date(end)
            }
        }
        case 'nextWeek': {
            const start = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
            let end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2)
            end -= 1
            return {
                start,
                end: new Date(end)
            }
        }

        case 'today': {
            const start = new Date()
            const end = new Date()
            end.setHours(23, 59, 59, 999)
            return {
                start: new Date(start),
                end: new Date(end)
            }
        }
        case 'tomorrow': {
            const today = new Date()
            const start = new Date()
            start.setDate(today.getDate() + 1)
            const end = new Date()
            end.setDate(start.getDate())
            end.setHours(23, 59, 59, 999)
            return {
                start: new Date(start),
                end: new Date(end)
            }
        }
        case 'theDayAfterTomorrow': {
            const today = new Date()
            const start = new Date()
            start.setDate(today.getDate() + 2)
            const end = new Date()
            end.setDate(start.getDate())
            end.setHours(23, 59, 59, 999)
            return {
                start: new Date(start),
                end: new Date(end)
            }
        }

        default: {
            return null
        }
    }
}
