

const dataCache: Record<string, any> = {};


export async function fetchData<T>(service: () => Promise<T>, cacheKey: string, filterFunc?: (data: T) => T): Promise<T> {
    try {

        if (dataCache[cacheKey]) {

            return dataCache[cacheKey] as T;
        }

        const data = await service();     
        const filteredData = filterFunc ? filterFunc(data) : data;

        dataCache[cacheKey] = filteredData;

        return filteredData;
    } catch (error) {
        console.error(`Error fetching data for ${cacheKey}:`, error);
        return null as unknown as T;
    }
}

export function invalidateCache(cacheKey: string) {
    delete dataCache[cacheKey];
}
