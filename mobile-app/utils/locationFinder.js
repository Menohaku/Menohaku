
const places = [
    {
        value: 'malmi',
        patterns: [
            'malmilla',
            'malmi'
        ]
    },
    {
        value: 'otaniemi',
        patterns: [
            'otaniemi',
            'otaniemessä'
        ]
    },
    {
        value: 'espoo',
        patterns: [
            'espoossa',
            'espoo'
        ]
    },
    {
        value: 'helsinki',
        patterns: [
            'helsingissä',
            'helsinki']
    },
    {
        value: 'vantaa',
        patterns: [
            'vantaa',
            'vantaalla'
        ]
    },
    {
        value: 'tapiola',
        patterns: [
            'tapiolassa',
            'tapiola'
        ]
    }

]

const nearMePatters = [
    'lähellä minua'
]
const searchCity = (str) => {
    if (!str) return { cities: [], nearMe: false }
    const cities = places.filter((place) => (place.patterns.some((pattern) => str.includes(pattern))))
    return cities
}

const searchNearMe = (str) => {
    return nearMePatters.some((p) => str.includes(p))
}
export default function locationSearch(str) {
    const cities = searchCity(str)
    const nearMe = searchNearMe(str)
    return { cities: cities.map((c) => c.value), nearMe }
}

