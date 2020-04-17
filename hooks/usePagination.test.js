/* eslint-disable no-unused-vars */
import React from 'react';
import { shallow } from 'enzyme';
import usePagination from './usePagination';

const HookWrapper = (props) => {
    // eslint-disable-next-line react/prop-types
    const hook = props.hook ? props.hook() : undefined;
    return <div hook={ hook } />;
};

const fetchFunction = jest.fn();

describe('usePagination', () => {
    it('does not fail when no values are passed in', () => {
        const wrapper = shallow(<HookWrapper hook={ () => usePagination() } />);
        const { hook } = wrapper.find('div').props();
        const [page, setPage, limit, setLimit, onClickNext, onClickPrevious] = hook;

        expect(page).toBe(1);
        expect(limit).toBe(25);
        expect(setLimit).toBeInstanceOf(Function);
        expect(onClickNext).toBeInstanceOf(Function);
        expect(onClickPrevious).toBeInstanceOf(Function);
    });

    it('does not fail when values are passed in', () => {
        const wrapper = shallow(
            <HookWrapper hook={ () => usePagination(25, 36, fetchFunction) } />
        );
        const { hook } = wrapper.find('div').props();
        const [page, setPage, limit, setLimit, onClickNext, onClickPrevious] = hook;

        expect(page).toBe(1);
        expect(limit).toBe(25);
        expect(setLimit).toBeInstanceOf(Function);
        expect(onClickNext).toBeInstanceOf(Function);
        expect(onClickPrevious).toBeInstanceOf(Function);
    });

    it('sets limit', () => {
        const wrapper = shallow(
            <HookWrapper hook={ () => usePagination(25, 100, fetchFunction) } />
        );
        let { hook } = wrapper.find('div').props();
        let [page, setPage, limit, setLimit, onClickNext, onClickPrevious] = hook;

        setLimit(10);

        ({ hook } = wrapper.find('div').props());
        [page, setPage, limit, setLimit, onClickNext, onClickPrevious] = hook;

        expect(limit).toBe(10);
    });

    it('increases page', () => {
        const wrapper = shallow(
            <HookWrapper hook={ () => usePagination(25, 100, fetchFunction) } />
        );
        let { hook } = wrapper.find('div').props();
        let [page, setPage, limit, setLimit, onClickNext, onClickPrevious] = hook;

        onClickNext();

        ({ hook } = wrapper.find('div').props());
        [page, setPage, limit, setLimit, onClickNext, onClickPrevious] = hook;

        expect(page).toBe(2);
    });

    it('decreases page', () => {
        const wrapper = shallow(
            <HookWrapper hook={ () => usePagination(25, 100, fetchFunction) } />
        );
        let { hook } = wrapper.find('div').props();
        let [page, setPage, limit, setLimit, onClickNext, onClickPrevious] = hook;

        onClickPrevious();

        ({ hook } = wrapper.find('div').props());
        [page, setPage, limit, setLimit, onClickNext, onClickPrevious] = hook;

        expect(page).toBe(0);
    });

    it('onClickPrevious does not fetch', () => {
        const wrapper = shallow(
            <HookWrapper hook={ () => usePagination(25, 100, fetchFunction) } />
        );
        let { hook } = wrapper.find('div').props();
        let [page, setPage, limit, setLimit, onClickNext, onClickPrevious] = hook;

        onClickPrevious();

        ({ hook } = wrapper.find('div').props());
        [page, setPage, limit, setLimit, onClickNext, onClickPrevious] = hook;

        expect(fetchFunction).toHaveBeenCalledTimes(0);
    });
});
