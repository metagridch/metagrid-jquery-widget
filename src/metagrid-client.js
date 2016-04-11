/*
 * 
 * 
 *
 * Copyright (c) 2016 
 * Licensed under the MIT license.
 */
(function ($) {
    /**
     * Options for the plugin
     */
    var settings;

    /**
     * Separator for urls
     * @type {string}
     */
    var separator = "/";

    var methods = {
        init: function (options) {

            settings = $.extend({
                projectSlug: '',
                requestOnLoad: true,
                apiUrl: 'https://api.metagrid.ch/widget/',
                includeDescription: false,
                entitySlugTransformer: function (slug) {return slug;},
                template: '<div class="row">' +
                            '<div class="span8">' +
                                '<div class="blue-box">' +
                                    '<b>Links <a href="http://metagrid.ch" target="_blank">Metagrid.ch</a>:</b><span id="metagrid-links"></span>' +
                                '</div>' +
                            '</div>' +
                        '</div>'
            }, options);

            // check for project slug
            if(settings.projectSlug === ''){
                $.error('You need to declare a projectSlug for the MetagridClient ');
                return false;
            }

            return this.each(function () {
                // Do something to each selected element.
                var $that = $(this);
                var entityKind = $that.attr("data-element-kind");
                var entityId = $that.attr("data-element-id");
                var language = $that.attr("data-language");
                // fallback to browser
                if(language === null) {
                    language = $('html').attr('lang');
                }

                // exclude this
                if (entityId && entityKind ) {
                    if( typeof settings.entitySlugTransformer === 'function') {
                        entityKind = settings.entitySlugTransformer(entityKind);
                    }
                    $.getJSON(settings.apiUrl + settings.projectSlug + separator + entityKind + separator +
                        entityId + '.json?lang=' + language + '&include=' + settings.includeDescription +'&jsoncallback=?', function (data) {

                        if (data[0]) {
                            // render template
                            $that.html(settings.template);
                            $that.data('data', data[0]);
                            var linksContainer = $('<span />');
                            $.each(data[0], function (index, value) {
                                $('<a>').attr({
                                    'class': 'metagrid-link',
                                    target: '_blank',
                                    title: value.short_description,
                                    href: value.url
                                }).text(index).appendTo(linksContainer);
                            });
                            $that.append(linksContainer);
                        }
                    },
                    function () {
                        $.error("There was an error in the communication with the server.");
                    });
                }
            });
        },
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