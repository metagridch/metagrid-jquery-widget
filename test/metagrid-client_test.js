(function ($) {
    module('jQuery#metagridClient', {
        setup: function () {
            this.elems = $('#qunit-fixture').children().metagridClient({projectSlug: 'dds'});
        }
    });

    test('is chainable',1, function () {
        strictEqual(this.elems.metagridClient({projectSlug: 'dds'}), this.elems, 'should be chainable');
    });

    QUnit.asyncTest('async call', 2, function (assert) {
        // expect(2); // we have one async test to run

        var test = setTimeout(function () {
            assert.equal($('#qunit-fixture .blue-box a').attr('href'), 'http://metagrid.ch');
            assert.equal($('#qunit-fixture .metagrid-link').length, 4);
            start();
        }, 1000);
    });

    QUnit.asyncTest('new template', 2, function (assert) {
        // expect(2); // we have one async test to run
        this.elems.metagridClient({
            projectSlug: 'dds',
            includeDescription: true,
            template: '<div><span>metagrid</span></div>'
        });

        var test =  setTimeout(function () {
            //
            assert.ok($('#qunit-fixture :not(.blue-box)'));
            assert.equal($('#qunit-fixture  span:first').text(), 'metagrid');
            start();
        }, 1000);
    });

    QUnit.asyncTest('remote data', 1, function (assert) {
        // expect(2); // we have one async test to run
        this.elems.metagridClient({
            projectSlug: 'dds',
            includeDescription: true,
            template: '<div><span>metagrid</span></div>'
        });
        var elem = this.elems;
        var test = setTimeout(function () {
            //
            var mock = JSON.parse('{ "HLS": { "url": "http:\/\/www.hls-dhs-dss.ch\/textes\/d\/D4647.php", "short_description": "Historisches Lexikon der Schweiz", "long_description": null }, "GND": { "url": "http:\/\/d-nb.info\/gnd\/124769942", "short_description": "", "long_description": null }, "Elites suisses au XXe s.": { "url": "http:\/\/www2.unil.ch\/elitessuisses\/index.php?page=detailPerso&idIdentite=50020", "short_description": "", "long_description": null }, "Huygens ING": { "url": "http:\/\/resources.huygens.knaw.nl\/europeseintegratie\/en\/persoon\/5148", "short_description": "", "long_description": null } }');
            assert.deepEqual(elem.metagridClient('getData'), mock, "Not the same data in mock and object");
            start();
        }, 1000);
    });

}(jQuery));
