import handleKeyPress from './handleKeyPress';

type WidgetElements = {
  menuButton: HTMLElement | null;
  menuElement: HTMLElement | null;
  focusableMenuItems: HTMLElement[];
};

type MenuInitOptions = {
  mirrorArrowBtn?: boolean;
  pattern?: 'menubar' | 'disclosure';
  ariaLabel: string | null;
  ariaExpanded: boolean | null;
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
      mirrorArrowBtn: true,
      pattern: 'disclosure',
    };

    if (options !== undefined) {
      initOptions = options;
    }

    if (menuButton !== null && menuElement !== null) {
      if (initOptions?.ariaExpanded === true) {
        menuButton.setAttribute('aria-expanded', 'true');
      }

      if (
        initOptions.pattern === 'menubar' &&
        initOptions.mirrorArrowBtn === true
      ) {
        console.warn(
          'Property "mirrorArrowBtn" has no effect when initPattern is set to "menubar".',
        );
      }

      menuButton.setAttribute('aria-expanded', 'false'); // set the aria-expanded attribute to false by default

      menuButton.setAttribute('data-menually-control', this.#menuControl); // set the aria-expanded attribute to false by default

      menuElement.setAttribute('role', 'menu'); // set the role property to menu

      menuElement.setAttribute('data-menually-menu', this.#menu); // set the role property to menu

      menuButton.addEventListener('click', () => {
        if (menuButton.getAttribute('aria-expanded') === 'true') {
          menuButton.setAttribute('aria-expanded', 'false');
        } else {
          menuButton.setAttribute('aria-expanded', 'true');
        }

        if (focusableMenuItems.length === 0) {
          throw new Error(
            'Unable to create tab trap. No focusable element was given and no direct children exist',
          );
        } else {
          const lastFocusedElement = document.activeElement;

          // Prevent all menuitems from receiving focus via tab key press
          focusableMenuItems.forEach(menuitem => {
            menuitem.setAttribute('tabindex', '-1');
          });

          const firstTabStop = focusableMenuItems[0];
          firstTabStop.focus();

          focusableMenuItems.forEach(item => {
            item.addEventListener('keyup', event => {
              handleKeyPress(
                event,
                lastFocusedElement as HTMLElement,
                focusableMenuItems,
                initOptions?.pattern,
                initOptions?.mirrorArrowBtn,
              );
            });
          });
        }
      });
    } else {
      throw new Error(
        'Widget must be instantiated with a menu control and a menu!',
      );
    }
  }
}

export default MenuWidget;
