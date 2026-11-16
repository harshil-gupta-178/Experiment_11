var galleryItems = [
    { id: 1, title: 'Edge CDN Network Nodes', category: 'Infrastructure', file: 'gallery-1.svg', desc: 'Global point-of-presence cache distribution ensuring millisecond latencies.' },
    { id: 2, title: 'Micro-Frontend Rendering', category: 'Architecture', file: 'gallery-2.svg', desc: 'Isolating front-end packages and components for modular team delivery.' },
    { id: 3, title: 'Asset Minification Pipeline', category: 'Build Systems', file: 'gallery-3.svg', desc: 'Compressing AST trees, stripping symbols and reducing bundle payloads.' },
    { id: 4, title: 'Service Worker Offline Cache', category: 'PWA', file: 'gallery-4.svg', desc: 'Intercepting fetch queries to serve pre-cached shell assets instantaneously.' },
    { id: 5, title: 'Intersection Observer Trigger', category: 'Browser APIs', file: 'gallery-5.svg', desc: 'Monitoring DOM visibility intersections to stream lazy-bound resources.' },
    { id: 6, title: 'Core Web Vitals Optimization', category: 'Performance', file: 'gallery-6.svg', desc: 'Fine-tuning Largest Contentful Paint, Cumulative Layout Shift, and INP.' },
    { id: 7, title: 'Browser Cache Hierarchy', category: 'HTTP Specs', file: 'gallery-7.svg', desc: 'Multi-tiered storage balancing memory cache, disk cache, and revalidation.' },
    { id: 8, title: 'HTTP/2 & HTTP/3 Multiplexing', category: 'Networking', file: 'gallery-8.svg', desc: 'Simultaneous binary frame transfers across a single persistent TCP/QUIC stream.' }
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
