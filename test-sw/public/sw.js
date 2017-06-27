importScripts('sw-toolbox.js');

toolbox.router.get('data/test.json', function(request, values) {
    let data = {
        data:"从SW来的问候"
    };
  return new Response(JSON.stringify(data));
});

toolbox.precache([
    'lib/jquery-1.12.4.min.js',
    'index.html',
    'css/index.css',
    'js/index.js'
]);