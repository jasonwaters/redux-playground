import {List, Map} from 'immutable';
import {expect} from 'chai';

import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {
	describe('setEntries', () => {
		it('adds the entries to the state', () => {
			const state = Map();
			const entries = List.of(
				'Dumb and Dumber',
				'Eternal Sunshine of the Spotless Mind'
			);
			const nextState = setEntries(state, entries);

			expect(nextState).to.equal(Map({
				entries: List.of(
					'Dumb and Dumber',
					'Eternal Sunshine of the Spotless Mind'
				)
			}));
		});

		it('converts to immutable', () => {
			const state = Map();
			const entries = [
				'Dumb and Dumber',
				'Eternal Sunshine of the Spotless Mind'
			];
			const nextState = setEntries(state, entries);

			expect(nextState).to.equal(Map({
				entries: List.of(
					'Dumb and Dumber',
					'Eternal Sunshine of the Spotless Mind'
				)
			}));
		});
	});

	describe('next', () => {
		it('takes the next two entries under vote', () => {
			const state = Map({
				entries: List.of(
					'Dumb and Dumber',
					'The Cable Guy',
					'Eternal Sunshine of the Spotless Mind'
				)
			});

			const nextState = next(state);

			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of(
						'Dumb and Dumber',
						'The Cable Guy'
					)
				}),
				entries: List.of('Eternal Sunshine of the Spotless Mind')
			}));
		});

		it('puts winner of current vote back to entries', () => {
			const state = Map({
				vote: Map({
					pair: List.of(
						'Dumb and Dumber',
						'The Cable Guy'
					),
					tally: Map({
						'Dumb and Dumber': 4,
						'The Cable Guy': 2
					})
				}),
				entries: List.of(
					'Eternal Sunshine of the Spotless Mind',
					'Yes Man',
					'Bruce Almighty')
			});

			const nextState = next(state);

			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of(
						'Eternal Sunshine of the Spotless Mind',
						'Yes Man')
				}),
				entries: List.of(
					'Bruce Almighty',
					'Dumb and Dumber'
				)
			}));
		});

		it('puts both from tied vote back to entries', () => {
			const state = Map({
				vote: Map({
					pair: List.of(
						'Dumb and Dumber',
						'The Cable Guy'
					),
					tally: Map({
						'Dumb and Dumber': 4,
						'The Cable Guy': 4
					})
				}),
				entries: List.of(
					'Eternal Sunshine of the Spotless Mind',
					'Yes Man',
					'Bruce Almighty')
			});

			const nextState = next(state);

			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of(
						'Eternal Sunshine of the Spotless Mind',
						'Yes Man')
				}),
				entries: List.of(
					'Bruce Almighty',
					'Dumb and Dumber',
					'The Cable Guy'
				)
			}));
		});


		it('marks winner when just one entry left', () => {
			const state = Map({
				vote: Map({
					pair: List.of(
						'Dumb and Dumber',
						'The Cable Guy'
					),
					tally: Map({
						'Dumb and Dumber': 4,
						'The Cable Guy': 2
					})
				}),
				entries: List.of()
			});

			const nextState = next(state);

			expect(nextState).to.equal(Map({
				winner: 'Dumb and Dumber'
			}));
		});
	});

	describe('vote', () => {
		it('creates a tally for the voted entry', () => {
			const state = Map({
				vote: Map({
					pair: List.of(
						'Dumb and Dumber',
						'Eternal Sunshine of the Spotless Mind'
					),
					entries: List()
				})
			});
			const nextState = vote(state, 'Dumb and Dumber');

			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of(
						'Dumb and Dumber',
						'Eternal Sunshine of the Spotless Mind'
					),
					tally: Map({
						'Dumb and Dumber': 1
					}),
					entries: List()
				})
			}));
		});

		it('adds to existing tally for the voted entry', () => {
			const state = Map({
				vote: Map({
					pair: List.of(
						'Dumb and Dumber',
						'Eternal Sunshine of the Spotless Mind'
					),
					tally: Map({
						'Dumb and Dumber': 10
					}),
					entries: List()
				})
			});
			const nextState = vote(state, 'Dumb and Dumber');

			expect(nextState).to.equal(Map({
				vote: Map({
					pair: List.of(
						'Dumb and Dumber',
						'Eternal Sunshine of the Spotless Mind'
					),
					tally: Map({
						'Dumb and Dumber': 11
					}),
					entries: List()
				})
			}));
		});
	});
});