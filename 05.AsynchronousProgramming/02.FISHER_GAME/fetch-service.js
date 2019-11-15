const catches = function () {
    const baseURL = 'https://fisher-game.firebaseio.com/catches/';
    
    const get = () => {
        return fetch(baseURL + '.json').then((r) => r.json());
    };

    const post = (data) => {
        return fetch(baseURL + '.json', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',

            }
        })
        .then((r) => r.json())
    };

    const put = (data) => {
        
    };

    const del = (id) => {
        return fetch(baseURL + `${id}.json`, {
            method: 'DELETE'
        })
        .catch(console.err);
    };

    return {
        get,
        post,
        put,
        del
    }
}();