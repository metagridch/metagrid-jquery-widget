(function ($) {
    module('jQuery#metagridClient', {
        setup: function () {
            this.elems = $('#qunit-fixture').children('.success').metagridClient({projectSlug: 'dds'});

        }
    });

    test('is chainable',1, function () {
        strictEqual(this.elems.metagridClient({projectSlug: 'dds'}), this.elems, 'should be chainable');
    });

    QUnit.asyncTest('async call', 2, function (assert) {
        // expect(2); // we have one async test to run

        setTimeout(function () {
            assert.equal($('#qunit-fixture .blue-box a').attr('href'), 'http://metagrid.ch');
            assert.equal($('#qunit-fixture .metagrid-link').length, 5);
            start();
        }, 1000);
    });

    QUnit.asyncTest('new template', 2, function (assert) {
        // expect(2); // we have one async test to run
        this.elems.metagridClient({
            projectSlug: 'dds',
            includeDescription: true,
            template: $('<div><span>metagrid</span><span id="metagrid-links"></span></div>')
        });

        setTimeout(function () {
            //
            assert.ok($('#qunit-fixture :not(.blue-box)'));
            assert.equal($('#qunit-fixture  span:first').text(), 'metagrid');
            start();
        }, 1000);

    });

    QUnit.asyncTest('load indirectly', 2, function (assert) {
        var bag =   $('<div/>');
        bag.data({'element-kind': 'person', 'element-id':5}).metagridClient({projectSlug: 'dds'});
        setTimeout(function () {
            console.log(bag.html());
            assert.ok(bag.find('#metagrid-links').length);
            assert.equal(bag.find('.metagrid-link').length, 5);
            start();
        }, 1000);

    });
    QUnit.asyncTest('remote data', 1, function (assert) {
        // expect(2); // we have one async test to run
        this.elems.metagridClient({
            projectSlug: 'dds',
            includeDescription: true,
            template: $('<div><span>metagrid</span><span id="metagrid-links"></span></div>')
        });
        var elem = this.elems;
        setTimeout(function () {
            //
            var mock = JSON.parse('{"HLS":{"url":"http:\/\/www.hls-dhs-dss.ch\/textes\/d\/D4647.php","short_description":"Historisches Lexikon der Schweiz","long_description":null},"Elites suisses au XXe s.":{"url":"http:\/\/www2.unil.ch\/elitessuisses\/index.php?page=detailPerso&idIdentite=50020","short_description":"","long_description":null},"BSG":{"url":"http:\/\/www.bsg.nb.admin.ch\/search\/query?match_1=PHRASE&field_1=authid&term_1=103283&theme=BSG&locale=de","short_description":"BSG","long_description":"Bibliographie der Schweizergeschichte"},"GND":{"url":"http:\/\/d-nb.info\/gnd\/124769942","short_description":"","long_description":null},"Huygens ING":{"url":"http:\/\/resources.huygens.knaw.nl\/europeseintegratie\/en\/persoon\/5148","short_description":"","long_description":null}    }');
            assert.deepEqual(elem.metagridClient('getData'), mock, "Not the same data in mock and object");
            start();
        }, 1000);
    });

    QUnit.asyncTest('fail to load remote data', 1, function (assert) {
        // expect(2); // we have one async test to run
        $('#qunit-fixture').children('.failure').metagridClient({projectSlug: 'dds'});
        setTimeout(function () {
            assert.ok($('#qunit-fixture :not(.blue-box)'));
            start();
        }, 5000);
    });

}(jQuery));
