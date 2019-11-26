function toggle(cat) {
    cat.textContent = cat.textContent === 'Show status code' ? 'Hide status code' : 'Show status code';
    const statusElement = cat.parentNode.getElementsByClassName('status')[0];
    statusElement.style.display = statusElement.style.display === 'none' ? 'inline' : 'none';
}

(() => {
     renderCatTemplate();

     async function renderCatTemplate() {
         const singleCatSource = await fetch('http://127.0.0.1:5500/02.%20HTTP%20Status%20Cats/templates/cat.hbs')
            .then(res => res.text());

        Handlebars.registerPartial('cat', singleCatSource);
        
         const allCatsSource = await fetch('http://127.0.0.1:5500/02.%20HTTP%20Status%20Cats/templates/all-cats.hbs')
            .then(res => res.text());

        const template = Handlebars.compile(allCatsSource);
        const context = { cats: window.cats};
        const catsHtml = template(context);

        document.getElementById('allCats')
            .innerHTML = catsHtml;
     }
 
})()
