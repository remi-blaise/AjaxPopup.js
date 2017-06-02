AjaxPopup.js
============

AjaxPopup.js is a jQuery plugin which allows you to focus on backend when you just want to display HTML requested by Ajax in a popup.

AjaxPopup.js is able to follow links and handle form submission.

Can be used with Symfony 3 or standalone.

An example application made with Symfony 3 is available [here](https://github.com/Zzortell/AjaxPopupExample).

## Installation

### Standalone installation

Download this folder: [src/Zz/AjaxPopupJsBundle/Resources/public/](https://github.com/Zzortell/AjaxPopup.js/tree/master/Resources/public).

Include jQuery in your project:
```html
<script
    src="https://code.jquery.com/jquery-3.2.1.min.js"
    integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
    crossorigin="anonymous"></script>
```

Include AjaxPopup.js:
```html
<script src=".../js/AjaxPopup.js"></script>
```

Include AjaxPopup.css:
```html
<link href=".../css/AjaxPopup.css" rel="stylesheet"/>
```

Don't forget to replace `...` by the installation folder.

### Symfony 3 installation

Download via Composer:
```bash
composer require zzortell/zz-ajaxpopupjs-bundle
```

Enable bundle in the kernel:
```php
class AppKernel extends Kernel
{
    public function registerBundles()
    {
        $bundles = [
            ...
            new Zz\AjaxPopupJsBundle\ZzAjaxPopupJsBundle(),
        ];

        ...
    }
}
```

Don't forget to install assets:
```bash
bin/console assets:install
# or
bin/console assets:install web --symlink --relative
```

Include jQuery in your project:
```html
<script
	src="https://code.jquery.com/jquery-3.2.1.min.js"
	integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
	crossorigin="anonymous"></script>
```

Include AjaxPopup.js:
```html
<script src="{{ asset('bundles/zzajaxpopupjs/js/AjaxPopup.js') }}"></script>
```

Include AjaxPopup.css:
```html
<link href="{{ asset('bundles/zzajaxpopupjs/css/AjaxPopup.css') }}" rel="stylesheet"/>
```

## Usage

Step 1: Make AjaxPopup.js handle the request of a popup.
```html
<script type="text/javascript">
    $(document).ready(function() {
        var popup = $.AjaxPopup({
            // This is default configuration

            "overlay_color": "rgba(0,0,0,0.2)",
            "loader_color": "#3498db", // blue
            "loader_circle_color": "#f3f3f3", // light grey
            "use_loader": true,
            "loader": null, // e.g. $("#loader"),

            "open_now": null, // put an url to open on document ready
            "buttons_selector": "button[ajax-url]",

            "follow_links": true,
            "control_forms": true,
            "control_buttons": true,
        });
    } );
</script>
```

Step 2: Enjoy!

When triggered (see triggering options below), AjaxPopup requests HTML via Ajax. When the new content is received, AjaxPopup checks for buttons, links and forms and handles them according to the given options.

The server HAS TO send 200 status. A 205 status can also be send to make reload the page (usefull for login for example).

Click on the overlay or press `Echap` to close the popup.


### Settings options
- overlay_color: Color of the overlay, by defaut transparent grey. Set opacity to 0 to not have overlay color.
- loader_color: Color of the default loader.
- loader_circle_color: Color of the circle of the default loader.
- use_loader: If set true, will display a loader waiting for the server response.
- loader: A jQuery element. If set null, the default loader is used.

### Triggering options
- open_now: Give an url to display the popup on document ready, or immediatly if modified using API.
- buttons_selector: A jQuery selector which can refers to buttons or other elements. Each of these elements has to have a `ajax-url` attribute. Cliking on these elements will display the popup. The jQuery selector can also refers to buttons inside the popup (for example, in a login form you can put a "Register" button to make AjaxPopup load a registration form).

### Behavior options
- follow_links: If set true, AjaxPopup will reload the content of the popup when the user click on a link inside the popup, with the given url. Will not follow the link if the specified `target` is not `_self`.
- control_forms: If set true, AjaxPopup will handle form submission inside the popup and reload the content of the popup with server's response.
- control_buttons: If set true, AjaxPopup will handle buttons inside the popup like ones outside.

### API
The object returned by $().AjaxPopup() has several methods:
```js
popup.display(url, method = 'GET', data = null);
popup.hide();
popup.hideAll(); // Hide all popups, not only this instance.
popup.getOptions();
popup.setOptions();
```

## Improve this library

This library is published under the [MIT license](https://github.com/Zzortell/AjaxPopup.js/blob/master/LICENSE).

If you find a bug, or if you want to propose a feature, please open an issue or post pull-request.

If you use this library, please let's me know!
