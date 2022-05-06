import { CharacterStream } from '../src/character-stream';

describe('characterStream', () => { // {{{

	it('should return the current character', () => { // {{{
		const cs = new CharacterStream('some test');

		expect(cs.ch).toBe('s');
	}); // }}}

	it('should indicate end of input', () => { // {{{
		const cs = new CharacterStream('');

		expect(cs.eoi).toBeTruthy();
	}); // }}}

	it('should return the current line', () => { // {{{
		const cs = new CharacterStream('a');

		expect(cs.line).toBe(1);
	}); // }}}

	it('should return the current column', () => { // {{{
		const cs = new CharacterStream('a');

		expect(cs.column).toBe(1);
	}); // }}}

	it('should return the current character offset', () => { // {{{
		const cs = new CharacterStream('a');

		expect(cs.offset).toBe(0);
	}); // }}}

	it('should return the current position', () => { // {{{
		const cs = new CharacterStream('a');

		expect(cs.pos).toStrictEqual({
			line: 1,
			column: 1,
			char: 0,
		});
	}); // }}}

	it('should return if the expected character is met', () => { // {{{
		const cs = new CharacterStream('a');

		expect(() => cs.expect('a')).not.toThrow();
	}); // }}}

	it('should fail if the expected character is not met', () => { // {{{
		const cs = new CharacterStream('a');

		expect(() => cs.expect('b')).toThrow('Unexpected character');
	}); // }}}

	it('should increment column and offset on read', () => { // {{{
		const cs = new CharacterStream('abc');
		cs.next();

		expect(cs.line).toBe(1);
		expect(cs.column).toBe(2);
		expect(cs.offset).toBe(1);
	}); // }}}

	it('should increment line and offset on read newline', () => { // {{{
		const cs = new CharacterStream('\nbc');
		cs.next();

		expect(cs.line).toBe(2);
		expect(cs.column).toBe(1);
		expect(cs.offset).toBe(1);
	}); // }}}

	it('should throw if multiple characters could not be accepted', () => { // {{{
		const cs = new CharacterStream('abc');

		expect(() => cs.accept('abd')).toThrow('Unexpected character');
	}); // }}}

	it('should skip if possible', () => { // {{{
		const cs = new CharacterStream('abc');

		expect(cs.skip('a')).toBeTruthy();
		expect(cs.ch).toBe('b');
	}); // }}}

	it('should not skip if not possible', () => { // {{{
		const cs = new CharacterStream('abc');

		expect(cs.skip('b')).toBeFalsy();
		expect(cs.ch).toBe('a');
	}); // }}}

}); // }}}
