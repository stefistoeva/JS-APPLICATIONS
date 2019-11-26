function showInfo(monkey) {
    const statusElement = monkey.parentNode.getElementsByClassName('info')[0];
    console.log(statusElement);
    statusElement.style.display = 'inline';
}

(() => {
    renderMonkeyTemplate();

     async function renderMonkeyTemplate() {
        const monkeySource = await fetch('http://127.0.0.1:5500/03.%20Popular%20Monkeys/templates/all-monkeys.hbs')
            .then(res => res.text());

            const template = Handlebars.compile(monkeySource);
        const context = { monkeys: window.monkeys };
        const monkeysHtml = template(context);

        document.getElementById('allMonkeys')
            .innerHTML = monkeysHtml;
     }
})()