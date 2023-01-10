[![Build Status](https://travis-ci.org/metagridch/metagrid-jquery-widget.svg?branch=master)](https://travis-ci.org/metagridch/metagrid-jquery-widget)

This is a small jquery-client to use the metagrid API in a frontend.
# Metagrid Client Features

*   Easy to use jquery-plugin to interact with metagrid API and to display a metagrid widget
*   Declarative approach to configure widget
*   Possibility to change the process of requesting data from the API
*   Change the template for the widget and the rendering of the links

## Getting Started

Download the [latest build](https://source.dodis.ch/metagrid/jquery-widget/-/jobs/artifacts/master/download?job=qunit) from the server.

If you wanna to use it with a build process as an es-modul, you can install it over npm. An example how to use the jquery plugin along with vite you can find in the examples. If you already use vite you may want to switch to the [modern-metagrid-widget](https://github.com/metagridch/modern-metagrid-widget)

```bash
npm install @metagrid/jquery-metagrid-widget
```

## Basic example
Include the Javascript into your html markup. The plugin needs the following basic configuration. With this declaration the person with the id 5 is loaded from the server and the div is replaced with the widget
```html
<script src="jquery.js"></script>
<script src="dist/metagrid-widget.min.js"></script>
<script>
  jQuery(function ($) {
    $('#metagridWidget').metagridClient({projectSlug:'yourproject'});
  });
</script>

<div data-element-kind="person" data-element-id="5" id="metagridWidget"></div>

```

## Extended example

Use the current url to load data form metagrid. If you have an person with id 11 on the url http://www.example.ch/person/11.html, load all corresponding data form metagrid

```html
<script src="jquery.js"></script>
<script src="dist/jquery.metagrid-widget.min.js"></script>
<script>
      jQuery(function ($) {
        // check for numeric identifiers
        var matches = window.location.href.match(/(\d+).html/);
        if(matches !== null){
            var id = matches[1];
            // call the plugin indirectly
            $('#metagridWidget').data({'element-kind':'person', 'element-id': id, 'language': 'de'}).metagridClient({
                projectSlug:'yourproject'
            });
        }
      });
</script>

```

In this example the plugins loads extended descriptions about the provider from the server. So you can display a provider description for each link.
```html
<script src="jquery.js"></script>
<script src="dist/jquery.metagrid-widget.min.js"></script>
<script>
  jQuery(function ($) {
    $('#metagridWidget').metagridClient({
    projectSlug:'yourproject',
    includeDescription: true
    });
  });
</script>

<div data-element-kind="person" data-element-id="5" id="metagridWidget"></div>

```

In this example the plugin uses a custom template to render the links. A template always needs an html-element with the id #metagrid-links to place the links
```html
<script src="jquery.js"></script>
<script src="dist/jquery.metagrid-widget.min.js"></script>
<script>
  jQuery(function ($) {
    $('#metagridWidget').metagridClient({
        projectSlug:'yourproject',
        template: $('<div><span>metagrid</span><span id="metagrid-links"></span></div>')
    });
  });
</script>

<div data-element-kind="p" data-element-id="5" id="metagridWidget"></div>

```

In this example the plugin uses a custom renderer to modify the generation of the links. You should append the links to the html-element with id #metagrid-links
```html
<script src="jquery.js"></script>
<script src="dist/jquery.metagrid-widget.min.js"></script>
<script>
  jQuery(function ($) {
    $('#metagridWidget').metagridClient({
    projectSlug:'yourproject',
    render: function (data, template) {
                var linksContainer = $('<span />');
                $.each(data, function (index, value) {
                    var link = $('<a>').attr({
                        'class': 'see-also-link',
                        href: value.url
                    }).text(index);
                    if(settings.includeDescription){
                        link.attr('title',  value.short_description);
                    }
                    link.appendTo(linksContainer);
                });
                // you always should use this entrypoint for the widget
                $('#metagrid-links', template).append(linksContainer);
                return template;
            }
        });
  });
</script>

<div data-element-kind="p" data-element-id="5" id="metagridWidget"></div>

```

In this example the plugin uses a transformer to return the correct slug for the resource type. This is useful if you automatically use the url to trigger the widget.
```html
<script src="jquery.js"></script>
<script src="dist/jquery.metagrid-widget.min.js"></script>
<script>
  jQuery(function ($) {
    $('#metagridWidget').metagridClient({
    projectSlug:'yourproject',
    entitySlugTransformer: function(slug) {
        if(slug === 'P') return 'person';
        if(slug === 'R') return 'organization';
    });
  });
</script>

<div data-element-kind="p" data-element-id="5" id="metagridWidget"></div>

```
In this example we use the widget several time on one page. The plugin uses the `#metarid-links` as a default placeholder for the links in the template. If you use the widget several time on the site this will cause issues. If you need several widget on one site you need to manage the placeholder in the `template` and the `render` option by yourself. Replace the default placeholder with a class.

```html
<script src="jquery.js"></script>
<script src="dist/jquery.metagrid-widget.min.js"></script>
<script>
  jQuery(function ($) {
    $('#metagridWidget').metagridClient({
        projectSlug:'yourproject',
        render: function (data, template) {
                var linksContainer = $('<span />');
                $.each(data, function (index, value) {
                    var link = $('<a>').attr({
                        'class': 'see-also-link',
                        href: value.url
                    }).text(index);
                    if(settings.includeDescription){
                        link.attr('title',  value.short_description);
                    }
                    link.appendTo(linksContainer);
                });
                // you always should use this entrypoint for the widget
                $('.metagrid-links', template).append(linksContainer);
                return template;
            },
        template: $('<div><span>metagrid</span><span class="metagrid-links"></span></div>')

        });
  });
```
__note:__ Because of backwards compatibility this is not the default behaviour

## Filter providers
Often you just want to display selected providers and not all of them. This should be done in the metagrid backend and not with javascript. In the backend you can select the providers you wish on your site. Then the api will just deliver the selected providers. Please contact [us](https://www.metagrid.ch/ueber-uns/) to get an account
