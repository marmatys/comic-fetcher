const nock = require('nock');
const fetch = require('../services/fetch');

describe('fetch', () => {
    afterEach(function () {
        nock.cleanAll();
    });

    it('get img url for dilbert', async () => {
        nock('http://dilbert.com')
            .get('/')
            .reply(200, '<img class="img-comic" src="//1"><img class="img-comic" src="//2">');

        const url = await fetch.getDilbertComicUrl();

        expect(url).toEqual('https://1');
    });

    it('get img url for garfield', async () => {
        nock('https://garfield.com')
            .get('/')
            .reply(200, '<img class="img-responsive" src="https://1">');

        const url = await fetch.getGarfieldComicUrl();

        expect(url).toEqual('https://1');
    });

    it('get img url for commitstrip', async () => {
        nock('http://www.commitstrip.com/en')
            .get('/')
            .reply(200, `
                <body>
                    <div class="excerpt"><a href="http://www.commitstrip.com/en/2017/10/18"></a></div>
                    <div class="excerpt"><a href="http://www.commitstrip.com/en/2017/10/01"></a></div>
                </body>
            `)
            .get('/2017/10/18')
            .reply(200, '<div class="entry-content"><p><img src="http://1.jpg"></p></div>');

        const url = await fetch.getCommitStripUrl();

        expect(url).toEqual('http://1.jpg');
    });

    it('get img url for xkcd', async () => {
        nock('https://xkcd.com')
            .get('/')
            .reply(200, '<div id="comic"> <img src="//digital_resource_lifespan.png"> </div>');

        const url = await fetch.getXKCDUrl();

        expect(url).toEqual('https://digital_resource_lifespan.png');
    });

    it('get img url for daily', async () => {
        nock('http://daily.art.pl')
            .get('/')
            .reply(200, `<div id="daily"> <img src="/img/1.png"> </div>`);

        const url = await fetch.getDailyUrl();

        expect(url).toEqual('http://daily.art.pl/img/1.png');
    });

    it('get img url for turnoff', async () => {
        nock('http://turnoff.us/')
            .get('/')
            .reply(200, `
                <body>
                    <article class="post-content">
                        <p><img src="/image/en/depressed-developer-22.png" alt="The Depressed Developer 22 geek comic"></p>
                    </article>
                </body>
            `);

        const url = await fetch.getTurnoffUrl();

        expect(url).toEqual('http://turnoff.us/image/en/depressed-developer-22.png');
    });
});
