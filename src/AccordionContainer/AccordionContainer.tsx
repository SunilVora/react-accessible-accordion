// tslint:disable:max-classes-per-file

import * as React from 'react';
import { UUID } from '../ItemContainer/ItemContainer';

export type Item = {
    uuid: UUID;
    expanded: boolean;
    disabled: boolean;
};

export type ProviderState = {
    items: Item[];
};

export type ProviderProps = {
    accordion?: boolean;
    children?: React.ReactNode;
    items?: Item[];
    onChange?(args: UUID | UUID[]): void;
};

export type AccordionContainer = {
    accordion: boolean;
    items: Item[];
    addItem(item: Item): void;
    removeItem(uuid: UUID): void;
    setExpanded(uuid: UUID, expanded: boolean): void;
};

export type ConsumerProps = {
    children(
        container: { [P in keyof AccordionContainer]?: AccordionContainer[P] },
    ): React.ReactNode;
};

// Arbitrary, but ought to be unique to avoid context namespace clashes.
const CONTEXT_KEY = 'react-accessible-accordion@AccordionContainer';

export class Provider extends React.Component<ProviderProps, ProviderState> {
    static childContextTypes = {
        // Empty anonymous callback is a hacky 'wildcard' workaround for bypassing prop-types.
        [CONTEXT_KEY]: () => null,
    };

    state = {
        items: this.props.items || [],
    };

    getChildContext() {
        const context: AccordionContainer = {
            items: this.state.items,
            accordion: !!this.props.accordion,
            addItem: this.addItem,
            removeItem: this.removeItem,
            setExpanded: this.setExpanded,
        };

        return {
            [CONTEXT_KEY]: context,
        };
    }

    addItem = (newItem: Item) => {
        // Need to use callback style otherwise race-conditions are created by concurrent registrations.
        this.setState(state => {
            let items;

            if (state.items.some(item => item.uuid === newItem.uuid)) {
                // tslint:disable-next-line:no-console
                console.error(
                    `AccordionItem error: One item already has the uuid "${
                        newItem.uuid
                    }". Uuid property must be unique. See: https://github.com/springload/react-accessible-accordion#accordionitem`,
                );
            }
            if (this.props.accordion && newItem.expanded) {
                // If this is a true accordion and the new item is expanded, then the others must be closed.
                items = [
                    ...state.items.map(item => ({
                        ...item,
                        expanded: false,
                    })),
                    newItem,
                ];
            } else {
                items = [...state.items, newItem];
            }
            return {
                items,
            };
        });
    };

    removeItem = (key: UUID) =>
        this.setState(state => ({
            items: state.items.filter(item => item.uuid !== key),
        }));

    setExpanded = (key: UUID, expanded: boolean) =>
        this.setState(
            state => ({
                items: state.items.map(item => {
                    if (item.uuid === key) {
                        return {
                            ...item,
                            expanded,
                        };
                    }
                    if (this.props.accordion && expanded) {
                        // If this is an accordion, we might need to collapse the other expanded item.
                        return {
                            ...item,
                            expanded: false,
                        };
                    }
                    return item;
                }),
            }),
            () => {
                if (this.props.onChange) {
                    this.props.onChange(
                        this.props.accordion
                            ? key
                            : this.state.items
                                  .filter(item => item.expanded)
                                  .map(item => item.uuid),
                    );
                }
            },
        );

    render() {
        return this.props.children || null;
    }
}

/*
 * By explictly/strictly typing this, we don't need to do the same with
 * 'static contextTypes' declarations inside class definitions.
 */
export type ContextTypes = {
    [CONTEXT_KEY](): null;
};

export const contextTypes: ContextTypes = {
    // Empty anonymous callback is a hacky 'wildcard' workaround for bypassing prop-types.
    [CONTEXT_KEY]: () => null,
};

export class Consumer extends React.Component<ConsumerProps> {
    static contextTypes = contextTypes;

    render() {
        return this.props.children(this.context[CONTEXT_KEY]);
    }
}

export const getAccordionStore = (context): AccordionContainer | undefined =>
    context[CONTEXT_KEY];
