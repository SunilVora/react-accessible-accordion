import * as React from 'react';
import {
    CONTEXT_KEY as ACCORDION_CONTEXT_KEY,
    getAccordionStore,
    Item,
} from '../AccordionContainer/AccordionContainer';
import * as propTypes from '../helpers/propTypes';
import {
    CONTEXT_KEY as ITEM_CONTEXT_KEY,
    getItemStore,
} from '../ItemContainer/ItemContainer';
import { default as AccordionItemHeading } from './AccordionItemHeading';

type AccordionItemHeadingWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
    hideBodyClassName: string;
};

type AccordionItemHeadingWrapperState = {};

type AccordionItemHeadingWrapperContext = {
    [ACCORDION_CONTEXT_KEY](): null;
    [ITEM_CONTEXT_KEY](): null;
};

export default class AccordionItemHeadingWrapper extends React.Component<
    AccordionItemHeadingWrapperProps
> {
    static contextTypes: AccordionItemHeadingWrapperContext = {
        [ACCORDION_CONTEXT_KEY]: propTypes.wildcard,
        [ITEM_CONTEXT_KEY]: propTypes.wildcard,
    };

    static defaultProps: AccordionItemHeadingWrapperProps = {
        className: 'accordion__heading',
        hideBodyClassName: '',
    };

    render(): JSX.Element {
        const accordionStore = getAccordionStore(this.context);

        if (!accordionStore) {
            // tslint:disable-next-line:no-console
            console.error(
                'AccordionItemHeading component cannot render because it has not been nested inside an Accordion component.',
            );

            return null;
        }

        const itemStore = getItemStore(this.context);

        if (!itemStore) {
            // tslint:disable-next-line:no-console
            console.error(
                'AccordionItemHeading component cannot render because it has not been nested inside an AccordionItem component.',
            );

            return null;
        }

        const { uuid } = itemStore;
        const { items } = accordionStore;
        const item = items.filter(
            (stateItem: Item) => stateItem.uuid === uuid,
        )[0];

        return (
            <AccordionItemHeading
                {...this.props}
                {...item}
                setExpanded={accordionStore.setExpanded}
                setFocusToHead={accordionStore.setFocusToHead}
                setFocusToTail={accordionStore.setFocusToTail}
                setFocusToPrevious={accordionStore.setFocusToPrevious}
                setFocusToNext={accordionStore.setFocusToNext}
                removeFocus={accordionStore.removeFocus}
            />
        );
    }
}
