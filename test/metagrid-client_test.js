(function ($) {
    var timeout = 500;
    QUnit.module('jQuery#metagridClient', {
        beforeEach: function () {
            this.elems = $('#qunit-fixture').children('.success').metagridClient({projectSlug: 'dodis'});
        }
    });

    QUnit.test('is chainable', function (assert) {
        assert.strictEqual(this.elems.metagridClient({projectSlug: 'dodis'}), this.elems, 'should be chainable');
    });

    QUnit.test('async call', function (assert) {
        var done = assert.async();
        setTimeout(function () {
            assert.equal($('#qunit-fixture .blue-box a').attr('href'), 'http://metagrid.ch');
            assert.equal($('#qunit-fixture .metagrid-link').length, 8);
            done();
        }, timeout);
    });

    QUnit.test('new template',  function (assert) {
        var done = assert.async();
        this.elems.metagridClient({
            projectSlug: 'dds',
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
            assert.equal(bag.find('.metagrid-link').length, 8);
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
            var mock = JSON.parse('{"HLS": {\n' +
              '            "url": "http:\\/\\/www.hls-dhs-dss.ch\\/textes\\/d\\/D4647.php",\n' +
              '            "short_description": "Historisches Lexikon der Schweiz",\n' +
              '            "long_description": "Historisches Lexikon der Schweiz"\n' +
              '        },\n' +
              '        "GND": {\n' +
              '            "url": "http:\\/\\/d-nb.info\\/gnd\\/124769942",\n' +
              '            "short_description": "Gemeinsame Normdatei (GND)",\n' +
              '            "long_description": "Gemeinsame Normdatei (GND)"\n' +
              '        },\n' +
              '        "Elites suisses": {\n' +
              '            "url": "http:\\/\\/www2.unil.ch\\/elitessuisses\\/index.php?page=detailPerso&idIdentite=50020",\n' +
              '            "short_description": "Schweizerische Eliten im 20. Jahrhundert",\n' +
              '            "long_description": "Schweizerische Eliten im 20. Jahrhundert"\n' +
              '        },\n' +
              '        "Helveticat": {\n' +
              '            "url": "https:\\/\\/nb-helveticat.primo.exlibrisgroup.com\\/discovery\\/search?query=lds49,contains,124769942&vid=41SNL_51_INST:helveticat",\n' +
              '            "short_description": "Helveticat",\n' +
              '            "long_description": "Helveticat"\n' +
              '        },\n' +
              '        "VIAF": {\n' +
              '            "url": "http:\\/\\/viaf.org\\/viaf\\/69869999",\n' +
              '            "short_description": "Virtual International Authority File (VIAF)",\n' +
              '            "long_description": "Virtual International Authority File (VIAF)"\n' +
              '        },\n' +
              '        "Huygens": {\n' +
              '            "url": "http:\\/\\/resources.huygens.knaw.nl\\/europeseintegratie\\/en\\/persoon\\/5148",\n' +
              '            "short_description": "Huygens ING",\n' +
              '            "long_description": "Huygens ING"\n' +
              '        },\n' +
              '        "BSG": {\n' +
              '            "url": "https:\\/\\/nb-bsg.primo.exlibrisgroup.com\\/discovery\\/search?query=lds49,contains,124769942&vid=41SNL_54_INST:bsg",\n' +
              '            "short_description": "BSG",\n' +
              '            "long_description": "Bibliographie zur Schweizergeschichte"\n' +
              '        },\n' +
              '        "parl.ch": {\n' +
              '            "url": "https:\\/\\/www.parlament.ch\\/de\\/biografie?CouncillorId=2914",\n' +
              '            "short_description": "Members of the Swiss parliament",\n' +
              '            "long_description": "Members of the Swiss National Council and the Council of States since 1848"\n' +
              '        }}\n');
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
