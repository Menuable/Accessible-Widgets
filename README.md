
# Accessible Widgets - Easy Plug-and-Play Accessibility Improvement For Your Web Widgets

## Table of Content

- [Accessible Widgets - Easy Plug-and-Play Accessibility Improvement For Your Web Widgets](#accessible-widgets---easy-plug-and-play-accessibility-improvement-for-your-web-widgets)
  - [Table of Content](#table-of-content)
  - [Getting Started ](#getting-started-)
    - [Using MenuWidget ](#using-menuwidget-)
      - [MenuWidget Init Options ](#menuwidget-init-options-)
  - [Roadmap ](#roadmap-)

Accessible Widgets is a plug-and-play utility package that allows developers easily improve the accessibility of their web widgets. With a start of 2 widgets to choose from, this package will automatically add AND update the necessary ARIA attributes for your widgets as well as handling the keyboard navigation automatically.

All widgets follow the keyboard navigation guidelines in the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/).

**Note:** This package has nothing to do with styling, it is purely focused on accessibility. 

## Getting Started <a name="introduction"></a>

First as with all NPM packages, install Accessible Widgets using your preferred package manager. This documentation will use NPM.

```bash
npm install accessible-widgets
```

After installing the package, next you to need to connect your HTML to the widget you want to use from the package.

### Using MenuWidget <a name="menuwidget"></a>

The **`MenuWidget`** class allows you improve the accessibility and keyboard navigation of menus in you web application. At its minimum, the MenuWidget requires a `menuControl` and a `menu` parameter both of which **must** be valid [CSS Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors). By convention the menuControl and menu parameters are CSS ID selectors like so:

```javascript
import { MenuWidget } from 'accessible-widgets';

// Register your elements with the package
const notificationMenuWidget = new MenuWidget(
  '#notificationbutton',
  '#notificationmenu',
);
```

When this is done, the package searches the DOM for the elements that meet satisfy those selectors and adds ARIA attrbutes to both element. It will also get all direct focusable descendants of the menu element and create a focus trap with those elements.

An optional third parameter `menuItems` may be passed. By convention this is a CSS class selector. When this is present, the package uses it to find all elements that meet that selector and creates a focus trap with those elements instead. This is useful for markup where the menuitems are not direct descendants of the menu element but nested several levels down. This is shown below:

```javascript
import { MenuWidget } from 'accessible-widgets';

// Register your elements with the package
const notificationMenuWidget = new MenuWidget(
  '#notificationbutton',
  '#notificationmenu',
  '.filter-btn, .check-btn',
);
```

After registering your elements with the package, you need to initialize the widget by calling the `init` method. The widget may be initialized with or without [options](#menuwidgetoptions), like so:

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

#### MenuWidget Init Options <a name="menuwidgetoptions"></a>

- `ariaExpanded - boolean`

  What the aria-expanded attribute should be set to on initialisation. Default value is set to true.

- `ariaLabel - string`

  What the aria-label attribute should be set to on initialisation. Recommended if the element has no visually persistent label.

- `ariaLabelledBy - string`

  What the aria-labelledby attribute should be set to on initialisation. Note that if set, it takes precedence over ariaLabel.

- `mirrorArrowBtn - boolean`

  If the keyboard arrow buttons should be mirrored, i.e. `ArrowDown` and `ArrowRight` keys share the same functionalities as does the `ArrowUp` and `ArrowLeft` keys. Default value is `true`. Also note that this option does nothing when the pattern option is set to type `menubar`

- `pattern - 'disclosure' | 'menubar'`

  The menu pattern to use on initialisation. Default value is `disclosure`. Please refer to the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/) to see how these types differ.

## Roadmap <a name="roadmap"></a>

Presently the package only has implementations for one widget. Work is ongoing to add another widget for accordions and that should be completed. Weekly releases can be expected until we complete all widgets.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
