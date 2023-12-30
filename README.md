# Accessible Widgets - Easy Plug-and-Play Accessibility Improvement For Your Web Widgets

## Table of Content

- [Getting Started](#introduction)
  - [Using MenuWidget](#menuwidget)

Accessible Widgets is a plug-and-play utility package that allows developers easily improve the accessibility of their web widgets. With a start of 2 widgets to choose from, this package will automatically add AND update the necessary ARIA attributes for your widgets and handle the keyboard navigation also automatically.

## Getting Started <a name="introduction"></a>

First as with all NPM packages, install Accessible Widgets using your preferred package manager. This documentation will use NPM.

```bash
npm install accessible-widgets
```

After installing the package, next you to need to connect your HTML to the widget you want to use from the package.

### Using MenuWidget <a name="menuwidget"></a>

The **`MenuWidget`** class allows you improve the accessibility and keyboard navigation of menus in you web application. At its minimum, the MenuWidget requires a `**menuControl**` and a `**menu**` parameter both of which **MUST** be valid [CSS Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors). By convention the menuControl and menu parameters are CSS ID selectors like so:

```javascript
import { MenuWidget } from 'accessible-widgets';

// Register your elements with the package
const notificationMenuWidget = new MenuWidget(
  '#notificationbutton',
  '#notificationmenu',
);
```

When this is done, the package searches the DOM for the elements that meet satisfy those selectors and adds ARIA attrbutes to both element. It will also get all direct focusable descendants of the menu element and create a focus trap with those elements.

An optional third parameter `**menuItems**` may be passed. By convention this is a CSS class selector. When this is present, the package uses it to find all elements that meet that selector and creates a focus trap with those elements instead. This is useful for markup where the menuitems are not direct descendants of the menu element but nested several levels down. This is shown below:

```javascript
import { MenuWidget } from 'accessible-widgets';

// Register your elements with the package
const notificationMenuWidget = new MenuWidget(
  '#notificationbutton',
  '#notificationmenu',
  '.filter-btn, .check-btn',
);
```

After registering your elements with the package, next you need to intialise the widget by calling the init method. The widget may be initialised with or without options, like so:

```javascript
import { MenuWidget } from 'accessible-widgets';

// Register your elements with the package
const notificationMenuWidget = new MenuWidget(
  '#notificationbutton',
  '#notificationmenu',
  '.filter-btn, .check-btn',
);

const merchantProfileMenu = new MenuWidget(
  '#menubutton',
  '#merchantmenu',
  '.menuitem',
);

// Initialise the widget without options
notificationMenu.init();

// Initialise the widget with options
merchantProfileMenu.init({
  pattern: 'menubar',
});
```

### Using AccordionWidget

The **`AccordionWidget`** class allows you improve the accessibility and keyboard navigation of accordions in you web application. At its minimum, the AccordionWidget requires an `**accordionTrigger**` and an `**accordionPanel**` parameter both of which **MUST** be valid [CSS Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors). It follows the same convention as the MenuWidget:

```javascript
import { AccordionWidget } from 'accessible-widgets';

// Register your elements with the package
const notificationMenuWidget = new AccordionWidget(
  '#accordionTrigger',
  '#accordionPanel',
);
```

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
