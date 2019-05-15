$("#searchButton").on("click", function(e) {
    let product = searchBar.value;
    let url = window.location.href;
    let target = url.split('/');
    if (target[target.length - 1].includes('prod_book')) {
        window.location.href = `http://localhost:3000/proware/book_search?product=${product}`;
    } else if (target[target.length - 1].includes('prod_proware')) {
        window.location.href = `http://localhost:3000/proware/proware_search?product=${product}`
    } else if (target[target.length - 1].includes('prod_uniform')) {
        window.location.href = `http://localhost:3000/proware/uniform_search?product=${product}`
    }
});

$('#searchBar').keypress(function(e) {
    var key = e.which;
    if (key == 13) // the enter key code
    {
        searchButton.click();
        return false;
    }
});

const searchProduct = (num) => {
    let url = new URL(window.location.href);
    let url2 = window.location.href;
    let target = url2.split('/');
    let params = new URLSearchParams(url.search.slice(1));
    if (params.has('page')) {
        params.set('page', num);
        if (target[target.length - 1].includes('book_search')) {
            window.history.replaceState({}, '', '/proware/book_search?' + params);
            let newUrl = new URL(window.location.href);
            window.location.href = newUrl;
        } else if (target[target.length - 1].includes('proware_search')) {
            window.history.replaceState({}, '', '/proware/proware_search?' + params);
            let newUrl = new URL(window.location.href);
            window.location.href = newUrl;
        } else if (target[target.length - 1].includes('uniform_search')) {
            window.history.replaceState({}, '', '/proware/uniform_search?' + params);
            let newUrl = new URL(window.location.href);
            window.location.href = newUrl;
        }
    } else {
        window.location.href = url + '&page=' + num;
    }
}