(function ($) {
    var timeout = 1000;
    var petitpierreCount = 9;

    QUnit.module('jQuery#metagridClient', {
        beforeEach: function () {
            this.elems = $('#qunit-fixture').children('.success');
        }
    });

    QUnit.test('is chainable', function (assert) {
        assert.strictEqual(this.elems.metagridClient({projectSlug: 'dodis'}), this.elems, 'should be chainable');
    });

    QUnit.test('async call', function (assert) {
        var done = assert.async();
        this.elems.metagridClient({projectSlug: 'dodis'});
        setTimeout(function () {
            assert.equal($('#qunit-fixture .blue-box a').attr('href'), 'http://metagrid.ch');
            assert.equal($('#qunit-fixture .metagrid-link').length, petitpierreCount);
            done();
        }, timeout);
    });

    QUnit.test('without include',  function (assert) {
        var done = assert.async();

        this.elems.metagridClient({
            projectSlug: 'dodis',
            includeDescription: false
        });

        setTimeout(function () {
            assert.ok($('#qunit-fixture :not(.blue-box)'));
            assert.equal($('#qunit-fixture  .metagrid-link').length, petitpierreCount);
            assert.equal($('#qunit-fixture  .metagrid-link:first').attr('href'), 'https://hls-dhs-dss.ch/de/articles/004647/');
            done();
        }, timeout);

    });

    QUnit.test('new template',  function (assert) {
        var done = assert.async();
        this.elems.metagridClient({
            projectSlug: 'dodis',
            includeDescription: true,
            template: $('<div><span>metagrid</span><span id="metagrid-links"></span></div>')
        });

        setTimeout(function () {
            //
            assert.ok($('#qunit-fixture :not(.blue-box)'));
            assert.equal($('#qunit-fixture  span:first').text(), 'metagrid');
            done();
        }, timeout);

    });

    QUnit.test('load indirectly',  function (assert) {
        var done = assert.async();
        var bag =   $('<div/>');
        bag.data({'element-kind': 'person', 'element-id': 5, 'element-lang' : 'de'}).metagridClient({projectSlug: 'dodis'});
        setTimeout(function () {
            assert.ok(bag.find('#metagrid-links').length);
            assert.equal(bag.find('.metagrid-link').length, petitpierreCount);
            done();
        }, timeout);

    });
    QUnit.test('remote data',  function (assert) {
        var done = assert.async();
        this.elems.metagridClient({
            projectSlug: 'dodis',
            includeDescription: true,
            template: $('<div><span>metagrid</span><span id="metagrid-links"></span></div>')
        });
        var elem = this.elems;
        setTimeout(function () {
            //
            var mock = JSON.parse('{"HLS":{"url":"https://hls-dhs-dss.ch/de/articles/004647/","short_description":"Historisches Lexikon der Schweiz","long_description":"Historisches Lexikon der Schweiz"},"Lonsea":{"url":"http://www.lonsea.de/pub/person/13800","short_description":"Lonsea","long_description":"League of Nations Search Engine"},"GND":{"url":"http://d-nb.info/gnd/124769942","short_description":"Gemeinsame Normdatei (GND)","long_description":"Gemeinsame Normdatei (GND)"},"Elites suisses":{"url":"https://www2.unil.ch/elitessuisses/index.php?page=detailPerso\u0026idIdentite=50020","short_description":"Schweizerische Eliten im 20. Jahrhundert","long_description":"Schweizerische Eliten im 20. Jahrhundert"},"Helveticat":{"url":"https://www.helveticat.ch/discovery/search?query=lds50,contains,124769942\u0026vid=41SNL_51_INST:helveticat","short_description":"Helveticat","long_description":"Helveticat"},"VIAF":{"url":"http://viaf.org/viaf/69869999","short_description":"Virtual International Authority File (VIAF)","long_description":"Virtual International Authority File (VIAF)"},"Huygens":{"url":"http://resources.huygens.knaw.nl/europeseintegratie/en/persoon/5148","short_description":"Huygens ING","long_description":"Huygens ING"},"BSG":{"url":"https://www.bsg.nb.admin.ch/discovery/search?query=lds50,contains,124769942\u0026vid=41SNL_54_INST:bsg","short_description":"BSG","long_description":"Bibliographie der Schweizergeschichte"},"parl.ch":{"url":"https://www.parlament.ch/de/biografie?CouncillorId=2914","short_description":"Members of the Swiss parliament","long_description":"Members of the Swiss National Council and the Council of States since 1848"}}');
            assert.deepEqual(elem.metagridClient('getData'), mock, "Not the same data in mock and object");
            done();
        }, timeout);
    });

    QUnit.test('fail to load remote data', function (assert) {
        var done = assert.async();
        $('#qunit-fixture').children('.failure').metagridClient({projectSlug: 'dodis'});
        setTimeout(function () {
            assert.ok($('#qunit-fixture :not(.blue-box)'));
            done();
        }, 4000);
    });

}(jQuery));
