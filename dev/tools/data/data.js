const headerOffset = 65

const tocLinks = document.querySelectorAll('.tocLink');
tocLinks.forEach(elem => {
    elem.style.cursor = 'pointer';
    elem.addEventListener('click', function (e) {
        let elemID = e.target.getAttribute('val');
        let element = document.getElementById(elemID);
        let elementPosition = element.getBoundingClientRect().top;
        let offsetPosition = elementPosition + window.scrollY - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
        
    })
})

const baseURL = window.location.href.split('#')[0];
const dataURL = baseURL+'data/d3/dataUpdates.js';

fetch(dataURL)
    .then(response => response.json())
    .then(data => {
        for(var i = 0; i < data.length; i++){
            let linkDIV = document.querySelector(`.dataDwnld-${data[i].id}`)
            linkDIV.innerHTML = `
                <div class="right dl">
                    <div class="noLink">Access via: </div><a class="dlLink" target="_blank" href="${data[i].ckan}" data-toggle="tooltip" title="${data[i].name}">Data Center</a>
                </div>`
        }      
        $('[data-toggle="tooltip"]').tooltip(); 
    })