# Metagrid Client

> Get data from the metagrid Server and display them on your website


## Getting Started

Download the [production version][min] or the [development version][max].

[min]: dist/jquery.metagrid-client.min.js
[max]: src/jquery.metagrid-client.js


## Basic example

The plugin needs the following basic configuration. With this the person with the id 5 get loaded from the server and the div get replaced with the links
```html
<script src="jquery.js"></script>
<script src="dist/metagrid-client.min.js"></script>
<script>
  jQuery(function ($) {
    $('#metagridWidget').metagridClient({projectslug:'yourproject'});
  });
</script>

<div data-element-kind="person" data-element-id="5" id="metagridWidget"></div>

```

## Extended example

Use the url to load data form metagrid. If you have an url like http://www.example.ch/person/11.html, load all corresponding data form metagrid

```html
<script src="jquery.js"></script>
<script src="dist/metagrid-client.min.js"></script>
<script>
      jQuery(function ($) {
        // check for numeric identifiers
        var matches = window.location.href.match(/(\d+).html/);
        if(matches !== null){
            var id = matches[1];
            // call the plugin indirectly
            $('#metagridWidget').data({'element-kind':'person', 'element-id': id, 'language': 'de'}).metagridClient({
                projectSlug:'histoirerurale'
            });
        }
      });
</script>

```

In this example the plugins loads extended descriptions about the provider from the server. So you can display a description from the provider
```html
<script src="jquery.js"></script>
<script src="dist/metagrid-client.min.js"></script>
<script>
  jQuery(function ($) {
    $('#metagridWidget').metagridClient({
    projectslug:'yourproject',
    includeDescription: true
    });
  });
</script>

<div data-element-kind="person" data-element-id="5" id="metagridWidget"></div>

```

In this example the plugin uses a custom template to render the links. A template always needs an #metagrid-links id to place the links
```html
<script src="jquery.js"></script>
<script src="dist/metagrid-client.min.js"></script>
<script>
  jQuery(function ($) {
    $('#metagridWidget').metagridClient({
        projectslug:'yourproject',
        template: $('<div><span>metagrid</span><span id="metagrid-links"></span></div>')
    });
  });
</script>

<div data-element-kind="p" data-element-id="5" id="metagridWidget"></div>

```

In this example the plugin uses a custom renderer to modify the generation of the links. You should places the links to the entrypoint #metagrid-links
```html
<script src="jquery.js"></script>
<script src="dist/metagrid-client.min.js"></script>
<script>
  jQuery(function ($) {
    $('#metagridWidget').metagridClient({
    projectslug:'yourproject',
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
                // you always should use this entrypoint
                $('#metagrid-links', template).append(linksContainer);
                return template;
            }
        });
  });
</script>

<div data-element-kind="p" data-element-id="5" id="metagridWidget"></div>

```

In this example plugin uses a transformer to return the right resourcetype slug. This is useful if you automatically use the url to trigger the widget
```html
<script src="jquery.js"></script>
<script src="dist/metagrid-client.min.js"></script>
<script>
  jQuery(function ($) {
    $('#metagridWidget').metagridClient({
    projectslug:'yourproject',
    entitySlugTransformer: function(slug) {
        if(slug === 'P') return 'person';
        if(slug === 'R') return 'organization';
    });
  });
</script>

<div data-element-kind="p" data-element-id="5" id="metagridWidget"></div>

```
