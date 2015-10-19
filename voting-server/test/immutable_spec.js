import {expect} from 'chai';
import {List, Map} from 'immutable';


describe('immutability', () => {
	describe('a number', () => {
		function increment(currentState) {
			return currentState + 1;
		}

		it('is immutable', () => {
			let state = 42;
			let nextState = increment(state);

			expect(nextState).to.equal(43);
			expect(state).to.equal(42);
		});
	});

	describe('A List', () => {
		function addMovie(currentState, movie) {
			return currentState.push(movie);
		}

		it('is immutable', () => {
			let state = List.of('Dumb and Dumber', 'The Cable Guy');
			let nextState = addMovie(state, 'The Truman Show');

			expect(nextState).to.equal(List.of(
				'Dumb and Dumber',
				'The Cable Guy',
				'The Truman Show'
			));

			expect(state).to.equal(List.of(
				'Dumb and Dumber',
				'The Cable Guy'
			));

		});
	});

	describe('A Tree', () => {
		function addMovie(currentState, movie) {
			return currentState.update('movies', movies => movies.push(movie));
		}

		it('is immutable', () => {
			let state = Map({
				movies: List.of(
					'Dumb and Dumber',
					'Eternal Sunshine of the Spotless Mind'
				)
			});

			let nextState = addMovie(state, 'The Truman Show');

			expect(nextState).to.equal(Map({
				movies: List.of(
					'Dumb and Dumber',
					'Eternal Sunshine of the Spotless Mind',
					'The Truman Show'
				)
			}));

			expect(state).to.equal(Map({
				movies: List.of(
					'Dumb and Dumber',
					'Eternal Sunshine of the Spotless Mind'
				)
			}));
		});
	});
});