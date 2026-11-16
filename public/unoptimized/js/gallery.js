var galleryItems = [
    { id: 1, title: 'Service Worker Cache', category: 'Caching', file: 'gallery-1.png', desc: 'Caching static assets for instantaneous repeat visits.' },
    { id: 2, title: 'Asset Minification', category: 'Minification', file: 'gallery-2.png', desc: 'Compressing CSS and JavaScript to reduce transfer payload.' },
    { id: 3, title: 'Lazy Loading Observer', category: 'Lazy Loading', file: 'gallery-3.jpg', desc: 'Loading images on demand as they enter the viewport.' }
];

function renderGallery(targetElementId) {
    var container = document.getElementById(targetElementId);
    if (!container) {
        return;
    }

    var htmlBuffer = '';
    for (var i = 0; i < galleryItems.length; i++) {
        var item = galleryItems[i];
        htmlBuffer += '<article class="card">';
        htmlBuffer += '  <div class="card-image-wrap">';
        htmlBuffer += '    <img src="images/' + item.file + '" alt="' + item.title + '" />';
        htmlBuffer += '  </div>';
        htmlBuffer += '  <div class="card-body">';
        htmlBuffer += '    <span class="card-tag">' + item.category + '</span>';
        htmlBuffer += '    <h3 class="card-title">' + item.title + '</h3>';
        htmlBuffer += '    <p class="card-text">' + item.desc + '</p>';
        htmlBuffer += '  </div>';
        htmlBuffer += '</article>';
    }

    container.innerHTML = htmlBuffer;
}

window.Gallery = {
    items: galleryItems,
    render: renderGallery
};
