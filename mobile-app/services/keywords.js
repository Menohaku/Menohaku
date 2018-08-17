import axios from 'axios'

const URL = 'https://api.hel.fi/linkedevents/v1/keyword/'


export default async function getKeyWords(str) {
    const wordList = str.split(' ')
    const keywords = await Promise.all(wordList.map(async (word) => {
        try {
            const result = await axios.get(URL, { params: { text: word } })
            return result.data.data.map((k) => k.id)
        } catch (error) {
            return []
        }
    }))

    return keywords
}

