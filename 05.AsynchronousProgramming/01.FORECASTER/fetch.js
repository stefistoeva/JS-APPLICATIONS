export function weather() {
    const baseUrl = 'https://judgetests.firebaseio.com/';

    return {
        locations: () => fetch(baseUrl + 'locations.json').then((r) => r.json()),
        today: (code) => fetch(baseUrl + `forecast/today/${code}.json`).then((r) => r.json()),
        upcoming: (code) => fetch(baseUrl + `forecast/upcoming/${code}.json`).then((r) => r.json())
    }
}