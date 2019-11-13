function attachEvents() {
    const mainDiv = document.getElementById('content');

    const messagesTextarea = document.getElementById('messages'); 
    const authorInput = document.getElementById('author');
    const contentInput = document.getElementById('content');
    const submitBtn = document.getElementById('submit');
    const refreshBtn = document.getElementById('refresh');

    submitBtn.addEventListener('click', submitMsg);
    refreshBtn.addEventListener('click', refreshMsg);

    function submitMsg() {
        const author = authorInput.value;
        const content = contentInput.value;

        const headers = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author, content })
        }

        fetch(`https://rest-messanger.firebaseio.com/messanger.json`, headers)
            .then(() => {
                messagesTextarea.innerText = '';
                authorInput.value = '';
                contentInput.value = '';
                refreshMsg();
            })
            .catch(handleError);
    }

    function refreshMsg() {
        messagesTextarea.innerText = '';

        fetch(`https://rest-messanger.firebaseio.com/messanger.json`)
            .then((res) => res.json())
            .then(d => {
                Object.entries(d)
                    .forEach(([id, msg]) => {
                        const { author, content } = msg;

                        const li = createLi(author, content);
                        messagesTextarea.append(li.textContent + '\n');
                    })
            })
            .catch(handleError);
    }

    function handleError() {
        messagesTextarea.innerText = 'An error occured';
    }

    function createLi(author, content) {
        const li = document.createElement('li');
        li.textContent = `${author}: ${content}`;
        return li;
    }

    return {
        submitMsg,
        refreshMsg
    }
}

let result = attachEvents();
