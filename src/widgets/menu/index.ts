import handleKeyPress from './handleKeyPress';

type WidgetElements = {
  menuButton: HTMLElement | null;
  menuElement: HTMLElement | null;
  focusableMenuItems: HTMLElement[];
};

type MenuInitOptions = {
  mirrorArrowBtn?: boolean;
  pattern?: 'menubar' | 'disclosure';
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaExpanded?: boolean;
};

class MenuWidget {
  readonly #menuControl: string;
  readonly #menu: string;
  readonly #menuItems?: string;

  constructor(menuControl: string, menu: string, menuItems?: string) {
    this.#menuControl = menuControl;
    this.#menu = menu;
    this.#menuItems = menuItems;
  }

  getElements(): WidgetElements {
    const menuButton = document.querySelector<HTMLElement>(
      `${this.#menuControl}`,
    );
    const menuElement = document.querySelector<HTMLElement>(`${this.#menu}`);

    let focusableMenuItems: HTMLElement[];

    if (menuElement !== null && this.#menuItems === undefined) {
      const menuChildren = menuElement.childNodes as NodeListOf<HTMLElement>;

      const menuChildrenArray = Array.from(menuChildren);

      focusableMenuItems = menuChildrenArray.filter(child => {
        return (
          child instanceof HTMLAnchorElement ||
          child instanceof HTMLButtonElement ||
          child instanceof HTMLInputElement
        );
      });
    } else {
      focusableMenuItems = Array.from(
        document.querySelectorAll(`${this.#menuItems}`),
      );
    }

    return { menuButton, menuElement, focusableMenuItems };
  }

  init(options?: MenuInitOptions): void {
    const { menuButton, menuElement, focusableMenuItems } = this.getElements();
    let initOptions: MenuInitOptions = {
      ariaExpanded: false,
      ariaLabel: '',
      ariaLabelledBy: '',
      mirrorArrowBtn: true,
      pattern: 'disclosure',
    };

    if (options !== undefined) {
      initOptions = options;
    }

    if (menuButton !== null && menuElement !== null) {
      menuButton.setAttribute('data-menually-control', this.#menuControl); // add a data attribute to the menuButton to show it has been registered successfully

      menuElement.setAttribute('data-menually-menu', this.#menu); // add a data attribute to the menuElement to show it has been registered successfully

      /* ====================================
       Set necessary ARIA attributes on initialisation
      ==================================== */
      menuButton.setAttribute('aria-controls', menuElement.id); // set the aria-expanded attribute to false by default

      if (initOptions.ariaExpanded === true) {
        menuButton.setAttribute('aria-expanded', 'true');
      } else {
        menuButton.setAttribute('aria-expanded', 'false'); // set the aria-expanded attribute to false by default
      }

      if (
        initOptions.ariaLabel !== undefined &&
        initOptions.ariaLabel !== '' &&
        initOptions.ariaLabelledBy === undefined &&
        initOptions.ariaLabelledBy === ''
      ) {
        menuButton.setAttribute('aria-label', initOptions.ariaLabel);
      }

      if (
        initOptions.ariaLabelledBy !== '' &&
        initOptions.ariaLabelledBy !== undefined
      ) {
        menuButton.setAttribute('aria-labelledby', initOptions.ariaLabelledBy);
      }

      if (
        initOptions.pattern === 'disclosure' ||
        initOptions.pattern === undefined
      ) {
        menuElement.setAttribute('role', 'menu'); // set the role property to menu if the menu pattern is set to 'disclosure' or undefined.
      } else {
        menuElement.setAttribute('role', 'menubar'); // set the role property to menubar if the menu pattern is set to 'menubar'
      }
      /* ========================================
      End of setting ARIA attributes
      ======================================== */

      if (
        initOptions.pattern === 'menubar' &&
        initOptions.mirrorArrowBtn === true
      ) {
        console.warn(
          // Warn the developer that the mirrorArrowBtn property does nothing when the set pattern is 'menubar'
          'Property "mirrorArrowBtn" has no effect when initPattern is set to "menubar".',
        );
      }

      // Create tab trap when the menuButton is activated via mouse clicks or Enter key press
      menuButton.addEventListener('click', () => {
        if (menuButton.getAttribute('aria-expanded') === 'true') {
          menuButton.setAttribute('aria-expanded', 'false');
        } else {
          menuButton.setAttribute('aria-expanded', 'true');
        }

        if (focusableMenuItems.length === 0) {
          // No menuitems to iterate through to create the tab trap either because no direct focusable children exists or wrong CSS selector was passed.
          throw new Error(
            'Unable to create tab trap. No focusable element exists to create trap with',
          );
        } else {
          const lastFocusedElement = document.activeElement;

          // Prevent all menuitems from receiving focus via tab key press
          focusableMenuItems.forEach(menuitem => {
            menuitem.setAttribute('tabindex', '-1');
            menuitem.setAttribute('role', 'menuitem');
          });

          const firstTabStop = focusableMenuItems[0];
          firstTabStop.focus();

          focusableMenuItems.forEach(item => {
            item.addEventListener('keyup', event => {
              handleKeyPress(
                event,
                lastFocusedElement as HTMLElement,
                focusableMenuItems,
                initOptions.pattern,
                initOptions.mirrorArrowBtn,
              );
            });
          });
        }
      });
    } else {
      throw new Error(
        'Widget initialisation failed. Widget must be instantiated with a menu control and a menu!',
      );
    }
  }
}

export default MenuWidget;
