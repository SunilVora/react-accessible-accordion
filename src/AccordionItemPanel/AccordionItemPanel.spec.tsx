import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import {
    Item,
    Provider as AccordionProvider,
} from '../AccordionContainer/AccordionContainer';
import { Provider as ItemProvider } from '../ItemContainer/ItemContainer';
import { default as AccordionItemPanel } from './AccordionItemPanel.wrapper';

describe('AccordionItemPanel', () => {
    function mountItem(children: React.ReactNode): ReactWrapper {
        const item: Item = {
            uuid: 0,
            expanded: false,
            disabled: false,
            focus: false,
        };

        return mount(
            <AccordionProvider items={[item]}>
                <ItemProvider uuid={item.uuid}>{children}</ItemProvider>
            </AccordionProvider>,
        );
    }

    it('renders correctly with min params', () => {
        const wrapper = mountItem(
            <AccordionItemPanel>
                <div>Fake body</div>
            </AccordionItemPanel>,
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly with different className', () => {
        const className = 'className';
        const wrapper = mountItem(<AccordionItemPanel className={className} />);
        expect(wrapper.find('div').hasClass(className)).toEqual(true);
    });

    it('renders correctly with different hideBodyClassName', () => {
        const hideBodyClassName = 'hideBodyClassName';
        const wrapper = mountItem(
            <AccordionItemPanel hideBodyClassName={hideBodyClassName} />,
        );
        expect(wrapper.find('div').hasClass(hideBodyClassName)).toEqual(true);
    });

    it('respects arbitrary user-defined props', () => {
        const wrapper = mountItem(<AccordionItemPanel lang="en" />);
        const div = wrapper.find('div').getDOMNode();

        expect(div.getAttribute('lang')).toEqual('en');
    });

    it('does not render if no accordionStore found in context', () => {
        const wrapper = mount(
            <ItemProvider uuid="foo">
                <AccordionItemPanel>
                    <div data-enzyme={true}>Hello World</div>
                </AccordionItemPanel>
            </ItemProvider>,
        );

        expect(wrapper.find('div[data-enzyme]').length).toEqual(0);
    });

    it('does not render if no itemStore found in context', () => {
        const wrapper = mount(
            <AccordionProvider allowMultipleExpanded={false} items={[]}>
                <AccordionItemPanel>
                    <div data-enzyme={true}>Hello World</div>
                </AccordionItemPanel>
            </AccordionProvider>,
        );

        expect(wrapper.find('div[data-enzyme]').length).toEqual(0);
    });
});
