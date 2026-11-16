window.Gallery.render('gallery-grid');

window.addEventListener('load', function() {
    var timing = window.performance.timing;
    var loadTime = timing.loadEventEnd - timing.navigationStart;
    var metricDisplay = document.getElementById('load-time-metric');
    if (metricDisplay) {
        metricDisplay.innerText = loadTime + ' ms';
    }
});
