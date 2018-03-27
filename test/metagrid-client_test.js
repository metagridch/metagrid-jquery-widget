(function ($) {
    QUnit.module('jQuery#metagridClient', {
        beforeEach: function () {
            this.elems = $('#qunit-fixture').children('.success').metagridClient({projectSlug: 'dds'});
        }
    });

    QUnit.test('is chainable', function (assert) {
        assert.strictEqual(this.elems.metagridClient({projectSlug: 'dds'}), this.elems, 'should be chainable');
    });

    QUnit.test('async call', function (assert) {
        var done = assert.async();
        setTimeout(function () {
            assert.equal($('#qunit-fixture .blue-box a').attr('href'), 'http://metagrid.ch');
            assert.equal($('#qunit-fixture .metagrid-link').length, 6);
            done();
        }, 5000);
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
        }, 1000);

    });

    QUnit.test('load indirectly',  function (assert) {
        var done = assert.async();
        var bag =   $('<div/>');
        bag.data({'element-kind': 'person', 'element-id':5}).metagridClient({projectSlug: 'dds'});
        setTimeout(function () {
            assert.ok(bag.find('#metagrid-links').length);
            assert.equal(bag.find('.metagrid-link').length, 6);
            done();
        }, 1000);

    });
    QUnit.test('remote data',  function (assert) {
        var done = assert.async();
        this.elems.metagridClient({
            projectSlug: 'dds',
            includeDescription: true,
            template: $('<div><span>metagrid</span><span id="metagrid-links"></span></div>')
        });
        var elem = this.elems;
        setTimeout(function () {
            //
            var mock = JSON.parse('{\n' +
                '        "HLS": {\n' +
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
                '            "url": "http:\\/\\/www.helveticat.ch\\/search\\/query?theme=Helveticat&match_1=PHRASE&field_1=authid&term_1=4605046",\n' +
                '            "short_description": "Helveticat",\n' +
                '            "long_description": "Helveticat"\n' +
                '        },\n' +
                '        "Huygens": {\n' +
                '            "url": "http:\\/\\/resources.huygens.knaw.nl\\/europeseintegratie\\/en\\/persoon\\/5148",\n' +
                '            "short_description": "Huygens ING",\n' +
                '            "long_description": "Huygens ING"\n' +
                '        },\n' +
                '        "BSG": {\n' +
                '            "url": "http:\\/\\/www.bsg.nb.admin.ch\\/search\\/query?match_1=PHRASE&field_1=authid&term_1=103283&theme=BSG&locale=de",\n' +
                '            "short_description": "BSG",\n' +
                '            "long_description": "Bibliographie zur Schweizergeschichte"\n' +
                '        }\n' +
                '    }');
            assert.deepEqual(elem.metagridClient('getData'), mock, "Not the same data in mock and object");
            done();
        }, 1000);
    });

    QUnit.test('fail to load remote data', function (assert) {
        var done = assert.async();
        $('#qunit-fixture').children('.failure').metagridClient({projectSlug: 'dds'});
        setTimeout(function () {
            assert.ok($('#qunit-fixture :not(.blue-box)'));
            done();
        }, 5000);
    });

}(jQuery));
