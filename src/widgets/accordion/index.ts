import WidgetError from '../../utils/WidgetError';

type WidgetElements = {
  accordionTriggers: HTMLElement[] | null;
  accordionPanels: HTMLElement[] | null;
};

type AccordionInitOptions = {
  setAriaLabelledBy?: boolean; // if the aria-labelledby attribute should be set on initialization
  persistAccordionViewState?: boolean; // if one accordion panel MUST be open at all times
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

  init(options: AccordionInitOptions): void {
    const { accordionTriggers, accordionPanels } = this.getElements();

    let initOptions: AccordionInitOptions = {
      setAriaLabelledBy: true,
      persistAccordionViewState: false,
    };

    if (options !== undefined) {
      initOptions = options;
    }

    if (accordionTriggers !== null && accordionPanels !== null) {
      // Check if the accordionTriggers and accordionPanels are of the same length
      if (accordionTriggers.length === accordionPanels.length) {
        accordionTriggers.forEach(trigger => {
          const currentTriggerIndex = accordionTriggers.indexOf(trigger);
          trigger.setAttribute('aria-expanded', 'false');

          trigger.setAttribute(
            'aria-controls',
            accordionTriggers[currentTriggerIndex].id,
          );

          trigger.setAttribute(
            'data-widget-accordion-trigger',
            `${this.#accordionTriggers}`,
          );

          trigger.addEventListener('click', () => {
            if (trigger.getAttribute('aria-expanded') === 'true') {
              trigger.setAttribute('aria-expanded', 'false');

              // check to see if one accordion panel MUST be left open
              if (initOptions.persistAccordionViewState === true) {
                // if so, and the current open panel is the last one then open the first panel in the accordion
                if (currentTriggerIndex === accordionTriggers.length - 1) {
                  accordionTriggers[0].setAttribute('aria-expanded', 'true');
                  accordionTriggers[0].focus();
                } else {
                  // else open the next panel in the accordion
                  accordionTriggers[currentTriggerIndex + 1].setAttribute(
                    'aria-expanded',
                    'true',
                  );

                  accordionTriggers[currentTriggerIndex + 1].focus();
                }
              }
            } else {
              trigger.setAttribute('aria-expanded', 'true');
              const currentTrigger = trigger;

              // Set the aria-expanded attribute for every other trigger to false
              accordionTriggers.forEach(trigger => {
                if (trigger !== currentTrigger) {
                  trigger.setAttribute('aria-expanded', 'false');
                }
              });
            }
          });
        });

        accordionPanels.forEach(panel => {
          const currentPanelIndex = accordionPanels.indexOf(panel);
          panel.setAttribute('role', 'region');

          panel.setAttribute(
            'aria-controls',
            accordionPanels[currentPanelIndex].id,
          );

          panel.setAttribute(
            'data-widget-accordion-panel',
            `${this.#accordionPanels}`,
          );
        });

        if (initOptions.persistAccordionViewState === true) {
          // Display the first accordion on initialisation
          accordionTriggers[0].setAttribute('aria-expanded', 'true');
        }
      } else {
        // If the accordionTriggers and accordionPanels are NOT of the same length throw an error
        throw new WidgetError(
          'Initialization error: Discordant arrays found. The arrays for the accordionTriggers and accordionPanels must be of the same length',
        );
      }
    } else {
      throw new WidgetError(
        'Widget must be initiated with an accordionTriggers and an accordionPanel',
      );
    }
  }
}

export default AccordionWidget;
