
import axios from 'axios'
import { dateRangeSearch, createDateRange } from '../utils/dateFinder'
import locationSearch from '../utils/locationFinder'
import frequentWords from '../assets/yleisetSanat.json'
import places from '../assets/places.json'


const wordSet = new Set(frequentWords)


const frequentWordsFilter = (word) => !wordSet.has(word)

const getLocation = async () => {
    console.log('Get location',navigator)
    return new Promise((resolve,reject)=>{
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null
                })
            },
            (error) => {
                console.log('reject', error)
                reject()
            }
        )
    })
}
const addLocations = (event) => {
    try {
        event.location = places[event.location['@id']]
    } catch (e) {
        console.log('error', e)
    }
    return (event)
}

const getData = async (question) => {
    let apiError = false
    let filteredQuestion = question.toLocaleLowerCase().split(' ').filter(frequentWordsFilter).join(' ')
    if (question === '') {
        return undefined
    }
    const msg = question.toLocaleLowerCase()
    let search = ''
    let division = ''
    let bbox = ''
    const foundDates = dateRangeSearch(msg)
    let events = []
    let longitude
    let latitude

    const { cities, nearMe } = locationSearch(msg)
    if (nearMe) {
        try {
            const { lat, long } = await getLocation()
            longitude = long
            latitude = lat
        } catch (error) {
            console.log('Error gps')
        }
        const eastwest = 30 / 120
        const northSouth = 30 / 240
        const west = longitude - eastwest
        const south = latitude - northSouth
        const east = longitude + eastwest
        const north = latitude + northSouth
        bbox = `&bbox=${west},${south},${east},${north}`
    }
    const dateRange = foundDates[0] && createDateRange(foundDates[0])
    let start = null
    let end = null
    if (dateRange && dateRange !== null) {
        search = `&start=${dateRange.start.toISOString().split('T')[0]}
        &end=${dateRange.end.toISOString().split('T')[0]}`
        start = dateRange.start.toISOString().split('T')[0]
        end = dateRange.end.toISOString().split('T')[0]
    }
    if (cities.length > 0) {
        division = `&division=${cities.join(',')}`
    }
    let reply
    try {
        reply = await axios.get(
            `https://api.hel.fi/linkedevents/v1/search/`,
            {
                params: {
                    q: filteredQuestion,
                    type: 'event',
                    page_size: 100,
                    start,
                    end
                }
            }
        )
    } catch (e) {
        apiError = true
        events = []
    } finally {
        if (!apiError) {
            events = reply.data.data
        }
    }
    const idSet = new Set(events.map((event) => event.id))
    while (!apiError && events.length < 5 && filteredQuestion.split(' ').length > 0 && filteredQuestion.length > 0) {
        console.log(filteredQuestion)
        try {
            reply = await axios.get(
                `https://api.hel.fi/linkedevents/v1/search/`,
                {
                    params: {
                        q: filteredQuestion,
                        type: 'event',
                        page_size: 100,
                        start,
                        end
                    }
                }
            )
        } catch (e) {
            apiError = true
        } finally {
            reply.data.data.forEach((element) => {
                if (!idSet.has(element.id)) {
                    idSet.add(element.id)
                    events.push(element)
                }
            })
            filteredQuestion = filteredQuestion.split(' ').slice(0, -1).join(' ')
        }
    }
    return (
        {
            error: apiError,
            searchResults: events.map(addLocations),
            eventCount: apiError ? 0 : reply.data.meta.count,
            msg: question,
            url: `https://api.hel.fi/linkedevents/v1/event/?include=location${search}${division}${bbox}`
        })
}

export default getData
