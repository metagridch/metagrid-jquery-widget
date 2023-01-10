import jQuery from "./jquery.js";
import "@metagrid/jquery-metagrid-widget";

jQuery("document").ready(function ($) {
    $('#app').data({'element-kind':'person', 'element-id': "5", 'language': 'de'}).metagridClient({
        projectSlug:'dodis'
    });
});
