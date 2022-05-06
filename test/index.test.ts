import * as fs from 'fs';
import * as path from 'path';

import { parseJSON } from '../src';

import type * as Types from '../src';

describe('jsonast', () => { // {{{

	it('should throw if dangling input found', () => { // {{{
		expect(() => parseJSON('a')).toThrow('Unexpected character');
	}); // }}}

	it('should accept plain object', () => { // {{{
		expect(parseJSON('{}')).toStrictEqual({
			type: 'object',
			pos: {
				start: {
					line: 1,
					column: 1,
					char: 0,
				},
				end: {
					line: 1,
					column: 3,
					char: 2,
				},
			},
		});
	}); // }}}

	it('should accept object with string member', () => { // {{{
		const expected: Types.JsonObject = {
			type: 'object',
			members: [
				{
					key: {
						type: 'string',
						value: 'key',
						pos: {
							start: {
								line: 1,
								column: 2,
								char: 1,
							},
							end: {
								line: 1,
								column: 7,
								char: 6,
							},
						},
					},
					value: {
						type: 'string',
						value: 'value',
						pos: {
							start: {
								line: 1,
								column: 8,
								char: 7,
							},
							end: {
								line: 1,
								column: 15,
								char: 14,
							},
						},
					},
				},
			],
			pos: {
				start: {
					line: 1,
					column: 1,
					char: 0,
				},
				end: {
					line: 1,
					column: 16,
					char: 15,
				},
			},
		};

		expect(parseJSON('{"key":"value"}')).toStrictEqual(expected);
	}); // }}}

	it('should accept object with string members', () => { // {{{
		const expected: Types.JsonObject = {
			type: 'object',
			members: [
				{
					key: {
						type: 'string',
						value: 'key',
						pos: {
							start: {
								line: 1,
								column: 2,
								char: 1,
							},
							end: {
								line: 1,
								column: 7,
								char: 6,
							},
						},
					},
					value: {
						type: 'string',
						value: 'value',
						pos: {
							start: {
								line: 1,
								column: 8,
								char: 7,
							},
							end: {
								line: 1,
								column: 15,
								char: 14,
							},
						},
					},
				},
				{
					key: {
						type: 'string',
						value: 'key2',
						pos: {
							start: {
								line: 1,
								column: 16,
								char: 15,
							},
							end: {
								line: 1,
								column: 22,
								char: 21,
							},
						},
					},
					value: {
						type: 'string',
						value: 'value2',
						pos: {
							start: {
								line: 1,
								column: 23,
								char: 22,
							},
							end: {
								line: 1,
								column: 31,
								char: 30,
							},
						},
					},
				},
			],
			pos: {
				start: {
					line: 1,
					column: 1,
					char: 0,
				},
				end: {
					line: 1,
					column: 32,
					char: 31,
				},
			},
		};

		expect(parseJSON('{"key":"value","key2":"value2"}')).toStrictEqual(expected);
	}); // }}}

	it('should accept plain array', () => { // {{{
		expect(parseJSON('[]')).toStrictEqual({
			type: 'array',
			pos: {
				start: {
					line: 1,
					column: 1,
					char: 0,
				},
				end: {
					line: 1,
					column: 3,
					char: 2,
				},
			},
		});
	}); // }}}

	it('should accept array with elements', () => { // {{{
		const expected: Types.JsonArray = {
			type: 'array',
			elements: [
				{
					type: 'number',
					value: -1,
					pos: {
						start: {
							line: 1,
							column: 2,
							char: 1,
						},
						end: {
							line: 1,
							column: 4,
							char: 3,
						},
					},
				},
				{
					type: 'number',
					value: 0,
					pos: {
						start: {
							line: 1,
							column: 5,
							char: 4,
						},
						end: {
							line: 1,
							column: 6,
							char: 5,
						},
					},
				},
				{
					type: 'number',
					value: 12.34e-56,
					pos: {
						start: {
							line: 1,
							column: 7,
							char: 6,
						},
						end: {
							line: 1,
							column: 16,
							char: 15,
						},
					},
				},
			],
			pos: {
				start: {
					line: 1,
					column: 1,
					char: 0,
				},
				end: {
					line: 1,
					column: 17,
					char: 16,
				},
			},
		};

		expect(parseJSON('[-1,0,12.34e-56]')).toStrictEqual(expected);
	}); // }}}

	it('should accept complex json', () => { // {{{
		const expected: Types.JsonObject = {
			type: 'object',
			pos: {
				start: {
					line: 1,
					column: 1,
					char: 0,
				},
				end: {
					line: 13,
					column: 2,
					char: 157,
				},
			},
			members: [{
				key: {
					type: 'string',
					value: 'array',
					pos: {
						start: {
							line: 2,
							column: 3,
							char: 4,
						},
						end: {
							line: 2,
							column: 10,
							char: 11,
						},
					},
				},
				value: {
					type: 'array',
					pos: {
						start: {
							line: 2,
							column: 12,
							char: 13,
						},
						end: {
							line: 12,
							column: 4,
							char: 155,
						},
					},
					elements: [{
						type: 'true',
						pos: {
							start: {
								line: 3,
								column: 5,
								char: 19,
							},
							end: {
								line: 3,
								column: 9,
								char: 23,
							},
						},
					},
					{
						type: 'false',
						pos: {
							start: {
								line: 4,
								column: 5,
								char: 29,
							},
							end: {
								line: 4,
								column: 10,
								char: 34,
							},
						},
					},
					{
						type: 'null',
						pos: {
							start: {
								line: 5,
								column: 5,
								char: 40,
							},
							end: {
								line: 5,
								column: 9,
								char: 44,
							},
						},
					},
					{
						type: 'object',
						pos: {
							start: {
								line: 6,
								column: 5,
								char: 50,
							},
							end: {
								line: 11,
								column: 6,
								char: 151,
							},
						},
						members: [{
							key: {
								type: 'string',
								value: 'object',
								pos: {
									start: {
										line: 7,
										column: 7,
										char: 58,
									},
									end: {
										line: 7,
										column: 15,
										char: 66,
									},
								},
							},
							value: {
								type: 'object',
								pos: {
									start: {
										line: 7,
										column: 17,
										char: 68,
									},
									end: {
										line: 7,
										column: 19,
										char: 70,
									},
								},
							},
						},
						{
							key: {
								type: 'string',
								value: 'boolean',
								pos: {
									start: {
										line: 8,
										column: 7,
										char: 78,
									},
									end: {
										line: 8,
										column: 16,
										char: 87,
									},
								},
							},
							value: {
								type: 'true',
								pos: {
									start: {
										line: 8,
										column: 18,
										char: 89,
									},
									end: {
										line: 8,
										column: 22,
										char: 93,
									},
								},
							},
						},
						{
							key: {
								type: 'string',
								value: 'undefined',
								pos: {
									start: {
										line: 9,
										column: 7,
										char: 101,
									},
									end: {
										line: 9,
										column: 18,
										char: 112,
									},
								},
							},
							value: {
								type: 'null',
								pos: {
									start: {
										line: 9,
										column: 20,
										char: 114,
									},
									end: {
										line: 9,
										column: 24,
										char: 118,
									},
								},
							},
						},
						{
							key: {
								type: 'string',
								value: 'number',
								pos: {
									start: {
										line: 10,
										column: 7,
										char: 126,
									},
									end: {
										line: 10,
										column: 15,
										char: 134,
									},
								},
							},
							value: {
								type: 'number',
								value: 1.234e-55,
								pos: {
									start: {
										line: 10,
										column: 17,
										char: 136,
									},
									end: {
										line: 10,
										column: 26,
										char: 145,
									},
								},
							},
						}],
					}],
				},
			}],
		};

		expect(
			parseJSON(fs.readFileSync(path.join(__dirname, 'fixtures/complex.json'), 'utf8')),
		).toStrictEqual(expected);
	}); // }}}

	it('should correct a missing comma in objects', () => { // {{{
		const actual = parseJSON<Types.JsonObject>('{"a": "b" "c": "d"}');

		expect(actual.members).toHaveLength(2);
	}); // }}}

	it('should correct a missing comma in arrays', () => { // {{{
		const actual = parseJSON<Types.JsonArray>('[0 1]');

		expect(actual.elements).toHaveLength(2);
	}); // }}}

	it('should not error when encountering escaped quotes', () => { // {{{
		const expected: Types.JsonArray = {
			type: 'array',
			elements: [
				{
					type: 'string',
					value: '"foo"',
					pos: {
						start: {
							line: 1,
							column: 2,
							char: 1,
						},
						end: {
							line: 1,
							column: 11,
							char: 10,
						},
					},
				},
			],
			pos: {
				start: {
					line: 1,
					column: 1,
					char: 0,
				},
				end: {
					line: 1,
					column: 12,
					char: 11,
				},
			},
		};

		expect(parseJSON(String.raw`["\"foo\""]`)).toStrictEqual(expected);
	}); // }}}

}); // }}}
