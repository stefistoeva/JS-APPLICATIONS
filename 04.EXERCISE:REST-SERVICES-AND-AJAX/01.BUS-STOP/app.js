function getInfo() {
    const stopIdInput = document.getElementById('stopId');
    const stopNameDiv = document.getElementById('stopName');
    const busContainer = document.getElementById('buses');

    const busesUrl = `https://judgetests.firebaseio.com/businfo/${stopIdInput.value}.json`;
   
    busContainer.innerHTML = '';
    stopNameDiv.innerHTML = '';
    fetch(busesUrl)
        .then(res => res.json())
        .then(handleSuccess)
        .catch(handleError)

    function handleSuccess(data) {
        const { name, buses } = data;
        stopNameDiv.textContent = name;
        Object.entries(buses)
            .forEach(( [busId, busTime] ) => {
                const li = document.createElement('li');
                li.textContent = `Bus ${busId} arrives in ${busTime} minutes.`;
                busContainer.appendChild(li);
            })
    }

    function handleError(err) {
        stopNameDiv.textContent = 'Error';
    }
}
