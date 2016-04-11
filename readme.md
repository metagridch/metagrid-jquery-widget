# Metagrid Client

> Get data from the metagrid Server


## Getting Started

Download the [production version][min] or the [development version][max].

[min]: https://raw.githubusercontent.com//jquery-metagrid-client/master/dist/jquery.metagrid-client.min.js
[max]: https://raw.githubusercontent.com//jquery-metagrid-client/master/dist/jquery.metagrid-client.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/metagrid-client.min.js"></script>
<script>
  jQuery(function ($) {
    $('#metagridWidget').metagridClient();
  });
</script>

<div data-element-kind="person" data-element-id="5" id="metagridWidget"></div>

```


## License

MIT © 
