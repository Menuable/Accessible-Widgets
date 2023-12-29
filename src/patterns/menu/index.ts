import handleKeyPress from './handleKeyPress.ts';

type Elements = {
  menuButton: HTMLElement | null;
  menuElement: HTMLElement | null;
  focusableMenuItems: HTMLElement[] | NodeListOf<HTMLElement>;
};

type MenuInitOptions = {
  mirrorArrowBtn?: boolean;
  pattern?: 'menubar' | 'disclosure';
  ariaLabel: string | null;
  ariaExpanded: boolean | null;
};

class AccessibleMenu {
  menuControl: string;
  menu: string;
  menuItems?: string;
  initOptions?: MenuInitOptions;

  constructor(
    menuControl: string,
    menu: string,
    menuItems?: string,
    initOptions?: MenuInitOptions,
  ) {
    this.menuControl = menuControl;
    this.menu = menu;
    this.menuItems = menuItems;
    this.initOptions = initOptions;
  }

  getElements(): Elements {
    const menuButton = document.querySelector<HTMLElement>(
      `${this.menuControl}`,
    );
    const menuElement = document.querySelector<HTMLElement>(`${this.menu}`);

    let focusableMenuItems: HTMLElement[] | NodeListOf<HTMLElement>;

    if (menuElement !== null && this.menuItems === undefined) {
      const menuChildren = Array.from(menuElement.children);

      focusableMenuItems = menuChildren.filter(child => {
        return (
          child instanceof HTMLAnchorElement ||
          child instanceof HTMLButtonElement ||
          child instanceof HTMLInputElement
        );
      }) as HTMLElement[];
    } else {
      focusableMenuItems = document.querySelectorAll(`${this.menuItems}`);
    }

    return { menuButton, menuElement, focusableMenuItems };
  }

  createTabTrap(): void {
    const { menuButton, menuElement, focusableMenuItems } = this.getElements();

    if (menuButton !== null && menuElement !== null) {
      if (this.initOptions?.ariaExpanded === true) {
        menuButton.setAttribute('aria-expanded', 'true');
      }

      menuButton.setAttribute('aria-expanded', 'false'); // set the aria-expanded attribute to false by default

      menuButton.setAttribute('data-menually-control', this.menuControl); // set the aria-expanded attribute to false by default

      menuElement.setAttribute('role', 'menu'); // set the role property to menu

      menuElement.setAttribute('data-menually-menu', this.menu); // set the role property to menu

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
                focusableMenuItems as HTMLElement[],
                this.initOptions?.pattern,
                this.initOptions?.mirrorArrowBtn,
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

export default AccessibleMenu;