type WidgetElements = {
  accordionTriggers: HTMLElement[] | null;
  accordionPanels: HTMLElement[] | null;
};

class AccordionWidget {
  readonly #accordionTriggers: string;
  readonly #accordionPanels: string;

  constructor(accordionTriggers: string, accordionPanel: string) {
    this.#accordionTriggers = accordionTriggers;
    this.#accordionPanels = accordionPanel;
  }

  getElements(): WidgetElements {
    const accordionTriggersList = document.querySelectorAll<HTMLElement>(
      `${this.#accordionTriggers}`,
    );

    const accordionPanelsList = document.querySelectorAll<HTMLElement>(
      `${this.#accordionPanels}`,
    );

    const accordionTriggers = Array.from(accordionTriggersList);
    const accordionPanels = Array.from(accordionPanelsList);

    return { accordionTriggers, accordionPanels };
  }

  init(): void {
    const { accordionTriggers, accordionPanels } = this.getElements();

    if (accordionTriggers !== null && accordionPanels !== null) {
      // Check if the accordionTriggers and accordionPanels are of the same length
      if (accordionTriggers.length === accordionPanels.length) {
        accordionTriggers.forEach(trigger => {
          const triggerIndex = accordionTriggers.indexOf(trigger);
          trigger.setAttribute('aria-expanded', 'false');

          trigger.setAttribute(
            'aria-controls',
            accordionTriggers[triggerIndex].id,
          );

          trigger.setAttribute(
            'data-widget-accordion-trigger',
            `${this.#accordionTriggers}`,
          );

          trigger.addEventListener('click', () => {
            if (trigger.getAttribute('aria-expanded') === 'true') {
              trigger.setAttribute('aria-expanded', 'false');
            } else {
              trigger.setAttribute('aria-expanded', 'true');
            }
          });
        });

        accordionPanels.forEach(panel => {
          const panelIndex = accordionPanels.indexOf(panel);
          panel.setAttribute('role', 'region');

          panel.setAttribute('aria-controls', accordionPanels[panelIndex].id);

          panel.setAttribute(
            'data-widget-accordion-panel',
            `${this.#accordionPanels}`,
          );
        });
      } else {
        // If not throw an error
        throw new Error(
          'Initialization error: Discordant arrays found. The arrays for the accordionTriggers and accordionPanels must be of the same length',
        );
      }
    } else {
      throw new Error(
        'Widget must be initiated with an accordionTriggers and an accordionPanel',
      );
    }
  }
}

export default AccordionWidget;
