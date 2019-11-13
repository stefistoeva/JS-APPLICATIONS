function attachEvents() {
    const personInput = document.getElementById('person');
    const phoneInput = document.getElementById('phone'); 
    const phonebookContainer = document.getElementById('phonebook');
    
    function loadPhonebook() {

        fetch(`https://phonebook-nakov.firebaseio.com/phonebook.json`)
            .then(res => res.json())
            .then(data => {
                Object.entries(data)
                    .forEach(([ellId, phonebookData]) => {
                        const { phone, person } = phonebookData;
                        const li = document.createElement('li');
                        li.textContent = `${person}: ${phone}`;

                        const deleteBtn = document.createElement('button');
                        deleteBtn.setAttribute('data-target', ellId);
                        deleteBtn.addEventListener('click', deletePhonebook);
                        deleteBtn.textContent = 'Delete';

                        li.appendChild(deleteBtn);
                        phonebookContainer.appendChild(li);
                    })
            })
            .catch(handleError);
    }

    function createPhonebook() {
        const person = personInput.value;
        const phone = phoneInput.value;

        const headers = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({person, phone})
        }
        fetch(`https://phonebook-nakov.firebaseio.com/phonebook.json`, headers)
            .then(() => {
                phonebookContainer.innerHTML = '';
                personInput.value = '';
                phoneInput.value = '';

                loadPhonebook();
            })
            .catch(handleError);
    }

    function deletePhonebook() {
        const phonebookId = this.getAttribute('data-target');

        const headers = {
            method: 'DELETE'
        }

        fetch(`https://phonebook-nakov.firebaseio.com/phonebook/${phonebookId}.json`, headers)
            .then(() => {
                phonebookContainer.innerHTML = '';
                loadPhonebook();
            })
    }

    function handleError(err) {
        //todo
    }

    return {
        loadPhonebook,
        createPhonebook
    }
}

let result = attachEvents();
