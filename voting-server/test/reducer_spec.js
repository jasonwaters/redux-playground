import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../src/reducer';

describe('reducer', () => {
	it('has an initial state', () => {
		const action = {type: 'SET_ENTRIES', entries: ['The Cable Guy']};
		const nextState = reducer(undefined, action);
		expect(nextState).to.equal(fromJS({
			entries: ['The Cable Guy']
		}));
	});

	it('handles SET_ENTRIES', () => {
		const initialState = Map();
		const action = {
			type: 'SET_ENTRIES',
			entries: ['Dumb and Dumber']
		};
		const nextState = reducer(initialState, action);

		expect(nextState).to.equal(fromJS({
			entries: ['Dumb and Dumber']
		}));
	});


	it('handles NEXT', () => {
		const initialState = fromJS({
			entries: ['Dumb and Dumber', 'The Cable Guy']
		});
		const action = {type: 'NEXT'};
		const nextState = reducer(initialState, action);

		expect(nextState).to.equal(fromJS({
			vote: {
				pair: ['Dumb and Dumber', 'The Cable Guy']
			},
			entries: []
		}));
	});

	it('handles VOTE', () => {
		const initialState = fromJS({
			vote: {
				pair: ['Dumb and Dumber', 'The Cable Guy']
			},
			entries: []
		});
		const action = {type:'VOTE', entry: 'Dumb and Dumber'}
		const nextState = reducer(initialState, action);

		expect(nextState).to.equal(fromJS({
			vote: {
				pair: ['Dumb and Dumber', 'The Cable Guy'],
				tally: {'Dumb and Dumber': 1}
			},
			entries: []
		}));
	});

	it('can be used with reduce', () => {
		const actions = [
			{type: 'SET_ENTRIES', entries: ['Dumb and Dumber', 'The Truman Show']},
			{type: 'NEXT'},
			{type: 'VOTE', 'entry': 'Dumb and Dumber'},
			{type: 'VOTE', 'entry': 'The Truman Show'},
			{type: 'VOTE', 'entry': 'Dumb and Dumber'},
			{type: 'NEXT'}
		];

		const finalState = actions.reduce(reducer, Map());

		expect(finalState).to.equal(fromJS({
			winner: 'Dumb and Dumber'
		}));
	});
});