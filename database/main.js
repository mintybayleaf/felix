import axios from "axios";



const DEFAULT_VERSION = "0.8.13"
const HOSTNAME = 'pf2etools.com'
const CONCURRENT_API_CALLS = 5

function createHeaders (type) {
   return { headers:
           {
               'Accept': '*/*',
               'Referer': `https://${HOSTNAME}/${type}.html`,
               'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0',
               'Host': HOSTNAME
           }
    }
}


async function get( {type, json = null} ) {
    let url = null
    try {
        if (!json) {
            url = new URL(`https://${HOSTNAME}/data/${type}/index.json?v=${DEFAULT_VERSION}`).toString();
        } else {
            url = new URL(`https://${HOSTNAME}/data/${type}/${json}?v=${DEFAULT_VERSION}`).toString();
        }
        const response = await axios.get(url, createHeaders(type));
        return response.data
    } catch(error) {
        console.error(`Error while fetching ${url}`);
    }
}

function partition(iterable, size = 10) {
    const array = Array.from(iterable);
    const chunks = []
    for (let index = 0; index < array.length; index += size) {
        const chunk = array.slice(index, index + size);
        chunks.push(chunk);
    }

    return chunks;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function* fetchByType(type, size = 10) {
    const index = await get({type});
    const batches = partition(Object.entries(index),  CONCURRENT_API_CALLS)

    for (const batch of batches) {
        const promises = batch.map(([_, json]) => get({type, json}))
        const resolvedPromises = await Promise.allSettled(promises)
        const values = resolvedPromises
            .filter(({status}) => status === 'fulfilled')
            .map(({value}) => value)
        yield values
        await sleep(1000)
    }
}

async function* fetchBatches(type, size) {
    let batch = []
    for await (const items of fetchByType(type, size)) {
        batch.push(...items)
        if (batch.length % size === 0) {
            yield batch
            batch = []
        }
    }

    yield batch
}

async function extract(producerFn, transformFn, consumerFn){
    for await (const batch of producerFn()) {
        consumerFn(batch.map(transformFn))
    }
}

async function ancestries() {
    const producerFn = () => fetchBatches('ancestries', 10)
    const consumerFn = console.log
    const transformFn = (item) => (item?.ancestry || item?.versatileHeritage).at(0)?.name
    await extract(producerFn, transformFn ,consumerFn)
}

await ancestries()