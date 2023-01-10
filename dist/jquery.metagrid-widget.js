/*! @metagrid/jquery-metagrid-widget - v0.5.0 - 2023-01-10
* https://metagrid.ch
* Copyright (c) 2023; Licensed MIT */
(function ($) {
    /**
     * Options for the plugin
     */
    var settings;
    /**
     * Define the console
     * @type {Console}
     */
    var console = window.console;

    /**
     * Separator for urls
     * @type {string}
     */
    var separator = "/";

    var methods = {
        init: function (options) {

            settings = $.extend({
                /**
                 * project slug f.e. dds
                 * @type {string}
                 */
                projectSlug: '',
                /**
                 * the api endpoint
                 * @type {string}
                 **/
                apiUrl: 'https://api.metagrid.ch/widget/',
                /**
                 * a flag tht decides how much data should pulled from the server
                 */
                includeDescription: false,
                /**
                 * A entity to slug transformer. Is needed if you have some unusual entitySlugs like p = person
                 * @param slug
                 * @returns {string}
                 */
                entitySlugTransformer: function (slug) {return slug;},
                /**
                 * A flag to enter a debug mode
                 */
                debug: false,

                /**
                 * A template that get rendered and in which the links will be displayed. We need an entrypoint with id #metagrid-links
                 * @type {jQuery}
                 */
                template: $('<div class="row">' +
                                '<div class="span8">' +
                                    '<div class="blue-box">' +
                                        '<b>Links <a href="http://metagrid.ch" target="_blank">Metagrid.ch</a>:</b><span id="metagrid-links"></span>' +
                                    '</div>' +
                                '</div>' +
                            '</div>'),
                /**
                 * A function that renders the data
                 * @param data
                 * @param template
                 * @returns {jQuery}
                 */
                render: function (data, template) {
                    var linksContainer = $('<span />');
                    $.each(data, function (index, value) {
                        // check for the right url value
                        var url;
                        if(typeof data === "object" && data.url) {
                            url = data.url;
                        } else {
                            url = value;
                        }

                        var link = $('<a>').attr({
                            'class': 'metagrid-link',
                            target: '_blank',
                            href: url
                        }).text(index);
                        if(settings.includeDescription){
                            link.attr('title',  value.short_description);
                        }
                        link.appendTo(linksContainer);
                    });
                    $('#metagrid-links', template).append(linksContainer);
                    return template;
                }
            }, options);

            // check for project slug
            if(settings.projectSlug === ''){
                $.error('You need to declare a projectSlug for the MetagridClient ');
                return false;
            }

            return this.each(function () {
                // Do something to each selected element.
                var $that = $(this);
                var entityKind = $that.data("element-kind");
                var entityId = $that.data("element-id");
                var language = $that.data("language");
                // fallback to browser
                if(language === null || typeof language === "undefined") {
                    language = $('html').attr('lang') || 'de';
                }

                // exclude this
                if (entityId && entityKind ) {
                    if( typeof settings.entitySlugTransformer === 'function') {
                        entityKind = settings.entitySlugTransformer(entityKind);
                    }

                    $.getJSON(settings.apiUrl + settings.projectSlug + separator + entityKind + separator +
                        entityId + '.json?lang=' + language + '&include=' + settings.includeDescription, function (data) {
                        if (data[0]) {
                            if(settings.debug){
                                console.log(data);
                            }
                            $that.data('data', data[0]);

                            // render template
                            var linksContainer = settings.render(data[0], settings.template.clone());
                            $that.append(linksContainer);
                        }
                        else{
                            if(settings.debug) {
                                console.log("metagrid-client: No concordance for the resource found");
                            }
                        }
                    }, function(event, jqxhr) {
                        if (jqxhr.status !== 404) {
                            console.error("There was an error on metarid. The Server answered with "+jqxhr.status);
                        }
                    });
                }
            });
        },
        /**
         * get the server data associated with the object
         * @returns {array|object}
         */
        getData: function () {
            return $(this).data('data');
        }
    };
    /**
     * Declare plugin with methods
     * @param methodOrOptions
     * @returns {*}
     */
    $.fn.metagridClient = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "init"
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.metagridclient');
        }
    };
})(jQuery);
