type WidgetElements = {
  accordionTrigger: HTMLElement | null;
  accordionPanel: HTMLElement | null;
};

class AccordionWidget {
  readonly #accordionTrigger: string;
  readonly #accordionPanel: string;

  constructor(accordionTrigger: string, accordionPanel: string) {
    this.#accordionTrigger = accordionTrigger;
    this.#accordionPanel = accordionPanel;
  }

  getElements(): WidgetElements {
    const accordionTrigger = document.querySelector<HTMLElement>(
      `${this.#accordionTrigger}`,
    );

    const accordionPanel = document.querySelector<HTMLElement>(
      `${this.#accordionPanel}`,
    );

    return { accordionTrigger, accordionPanel };
  }

  init(): void {
    const { accordionTrigger, accordionPanel } = this.getElements();

    if (accordionTrigger !== null && accordionPanel !== null) {
      accordionTrigger.setAttribute('aria-expanded', 'false');

      accordionTrigger.setAttribute('aria-controls', accordionPanel.id);

      accordionTrigger.setAttribute(
        'data-widget-accordion-trigger',
        this.#accordionTrigger,
      );

      accordionPanel.setAttribute(
        'data-widget-accordion-panel',
        this.#accordionPanel,
      );

      accordionPanel.setAttribute('role', 'region');

      accordionTrigger.addEventListener('click', () => {
        if (accordionTrigger.getAttribute('aria-expanded') === 'true') {
          accordionTrigger.setAttribute('aria-expanded', 'false');
        } else {
          accordionTrigger.setAttribute('aria-expanded', 'true');
        }
      });
    } else {
      throw new Error(
        'Widget must be initiated with an accordionTrigger and an accordionPanel',
      );
    }
  }
}

export default AccordionWidget;
