const isMenuAllyControl = (element: HTMLElement): boolean => {
  if (element.dataset.menuallyControl === undefined) {
    return false;
  } else {
    return true;
  }
};

const characterRegex = /[aA-zZ]/;

const returnKeyIfAlphabeticalKey = (key: string): null | string => {
  if (characterRegex.test(key)) {
    return key;
  } else {
    return null;
  }
};

const handleAlphabeticalKey = (key: string, itemList: HTMLElement[]): void => {
  const matchingArray = key.match(characterRegex);

  if (matchingArray !== null) {
    const pressedCharacter = matchingArray[0].toLowerCase();

    const matchingMenuItem = itemList.filter(item => {
      return item.textContent
        ?.trim()
        .toLowerCase()
        .startsWith(pressedCharacter);
    });

    if (matchingMenuItem.length !== 0) {
      matchingMenuItem[0].focus();
    }
  }
};

/**
 @description Handles keypress events within a tab trap.
 @param event - The keypress event.
 @param lastFocusedElement - The last focused element.
 @param itemList - NodeList of elements in the tab trap.
 @param pattern - Design pattern for the menu to create.
 @param mirrorArrowBtn - If the arrow buttons should be mirrored. Has no effect if pattern is set to `menu`.
 */
const handleKeyPress = (
  event: KeyboardEvent,
  lastFocusedElement: HTMLElement,
  itemList: HTMLElement[],
  pattern: 'menubar' | 'disclosure' | undefined,
  mirrorArrowBtn: boolean | undefined,
): void => {
  const listLength = itemList.length;
  const firstTabStopIndex = 0;
  const lastTabStopIndex = listLength - 1;
  const initPattern = pattern;

  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  const currentActiveIndex = Array.from(itemList).indexOf(
    document.activeElement as HTMLElement,
  );

  if (initPattern === undefined || initPattern === 'disclosure') {
    switch (event.key) {
      case ' ':
        lastFocusedElement.setAttribute('aria-expanded', 'false');
        lastFocusedElement.focus();
        (document.activeElement as HTMLElement)?.click();
        break;

      case 'Escape':
        // Should close the menu and focus on the toggle button
        lastFocusedElement.setAttribute('aria-expanded', 'false');
        lastFocusedElement.focus();
        break;

      case 'Home':
        itemList[0].focus();
        break;

      case 'End':
        itemList[itemList.length - 1].focus();
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        if (mirrorArrowBtn === true || mirrorArrowBtn === undefined) {
          // Functionality for both ArrowUp and ArrowLeft when mirrorArrowBtn is true
          if (currentActiveIndex === firstTabStopIndex) {
            itemList[lastTabStopIndex].focus();
          } else {
            itemList[currentActiveIndex - 1].focus();
          }
        } else if (event.key === 'ArrowUp') {
          // Functionality for ArrowUp only when mirrorArrowBtn is false
          if (currentActiveIndex === firstTabStopIndex) {
            itemList[lastTabStopIndex].focus();
          } else {
            itemList[currentActiveIndex - 1].focus();
          }
        } else {
          // No action needed for ArrowLeft when mirrorArrowBtn is false
          return;
        }
        break;

      case 'ArrowDown':
      case 'ArrowRight':
        if (mirrorArrowBtn === true || mirrorArrowBtn === undefined) {
          // Functionality for both ArrowUp and ArrowLeft when mirrorArrowBtn is true
          if (isMenuAllyControl(document.activeElement as HTMLElement)) {
            // if the focused element is a registered MenuAlly control, simulate a click event and open the submenu
            (document.activeElement as HTMLElement).click();
          } else {
            // move focus to the next menuitem
            if (currentActiveIndex === lastTabStopIndex) {
              itemList[firstTabStopIndex].focus();
            } else {
              itemList[currentActiveIndex + 1].focus();
            }
          }
        } else if (event.key === 'ArrowDown') {
          // Functionality for ArrowDown only when mirrorArrowBtn is false
          if (isMenuAllyControl(document.activeElement as HTMLElement)) {
            // if the focused element is a registered MenuAlly control, simulate a click event and open the submenu
            (document.activeElement as HTMLElement).click();
          } else {
            // move focus to the next menuitem
            if (currentActiveIndex === lastTabStopIndex) {
              // if the active element is the last menuitem return to the first menuitem on keypress
              itemList[firstTabStopIndex].focus();
            } else {
              // select the next menuitem on keypress
              itemList[currentActiveIndex + 1].focus();
            }
          }
        } else {
          // No action needed for ArrowRight when mirrorArrowBtn is false
          return;
        }
        break;

      default:
        break;
    }
  }

  if (initPattern === 'menubar') {
    switch (event.key) {
      case ' ':
        lastFocusedElement.setAttribute('aria-expanded', 'false');
        lastFocusedElement.focus();
        (document.activeElement as HTMLElement)?.click();
        break;

      case 'ArrowRight':
        if (currentActiveIndex === lastTabStopIndex) {
          itemList[firstTabStopIndex].focus();
        } else {
          itemList[currentActiveIndex + 1].focus();
        }
        break;

      case 'ArrowLeft':
        if (currentActiveIndex === firstTabStopIndex) {
          itemList[lastTabStopIndex].focus();
        } else {
          itemList[currentActiveIndex - 1].focus();
        }
        break;

      case 'ArrowDown':
        if (isMenuAllyControl(document.activeElement as HTMLElement)) {
          (document.activeElement as HTMLElement).click();
        } else {
          return;
        }
        break;

      case 'ArrowUp':
        if (isMenuAllyControl(document.activeElement as HTMLElement)) {
          (document.activeElement as HTMLElement).click();
        } else {
          return;
        }
        break;

      case 'Home':
        itemList[0].focus();
        break;

      case 'End':
        itemList[itemList.length - 1].focus();
        break;

      // FIX: Fix default behaviour of running automatically on press of each character key
      case returnKeyIfAlphabeticalKey(event.key):
        handleAlphabeticalKey(event.key, itemList);
        break;

      default:
        break;
    }
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
};

export default handleKeyPress;
