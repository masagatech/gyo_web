var cssver = 23;

var conf = {
    link: [
        { rel: 'stylesheet', href: 'assets/css/bootstrap.css?v=' + cssver },
        { rel: 'stylesheet', href: 'assets/css/multi-select.css' },
        { rel: 'stylesheet', href: 'assets/css/waves.css' },
        { rel: 'stylesheet', href: 'assets/css/animate.css' },
        { rel: 'stylesheet', href: 'assets/css/morris.css' },
        { rel: 'stylesheet', href: 'assets/css/datatable.css?v=' + cssver },
        { rel: 'stylesheet', href: 'assets/css/style.css?v=' + cssver },
        { rel: 'stylesheet', href: 'assets/css/partial_style.css?v=' + cssver },
        { rel: 'stylesheet', href: 'assets/css/font-awesome.min.css' },
        { rel: 'stylesheet', href: 'assets/css/fullcalendar.min.css?v=' + cssver },
        { rel: 'stylesheet', href: 'assets/css/all-themes.css?v=' + cssver },

        // tags for favicons

        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/assets/img/fav.png' },
    ],
    meta: [
        { name: 'msapplication-TileColor', content: '#00bcd4' },
        { name: 'msapplication-TileImage', content: '/assets/img/fav.png', '=content': true },
        { name: 'theme-color', content: '#00bcd4' }
    ]
};

module.exports = conf;