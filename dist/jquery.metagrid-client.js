/*! metagrid-client - v0.1.0 - 2016-09-07
* Copyright (c) 2016 ; Licensed MIT */
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
                        var link = $('<a>').attr({
                            'class': 'metagrid-link',
                            target: '_blank',
                            href: value.url
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

            if($('#metagrid-links', settings.template).length <= 0){
                $.error('The template needs to define an entry point with id #metagrid-links.');
                return false;

            }

            return this.each(function () {
                // Do something to each selected element.
                var $that = $(this);
                var entityKind = $that.data("element-kind");
                var entityId = $that.data("element-id");
                var language = $that.data("language");
                // fallback to browser
                if(language === null) {
                    language = $('html').attr('lang');
                }

                // exclude this
                if (entityId && entityKind ) {
                    if( typeof settings.entitySlugTransformer === 'function') {
                        entityKind = settings.entitySlugTransformer(entityKind);
                    }
                    var success = false;
                    $.getJSON(settings.apiUrl + settings.projectSlug + separator + entityKind + separator +
                        entityId + '.json?lang=' + language + '&include=' + settings.includeDescription +'&jsoncallback=?', function (data) {
                        // handle errors
                        success = true;
                        clearTimeout(timeout);

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
                    });

                    /**
                     * Check if after 5s the server doesn't answer and handle error
                     * @type {number}
                     */
                    var timeout = setTimeout(function() {
                        if (!success && settings.debug) {
                            console.log("metagrid-client: No concordance for the resource found or a error in the communication with the server");
                        }
                    }, 5000);
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