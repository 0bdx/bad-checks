import equal from './private-methods/equal.js';
import throws from './private-methods/throws.js';

/**
 * foo() unit tests.
 * 
 * @typedef {import('./foo').default} foo
 * 
 * @param   {foo}  f  foo()
 * @return  {void}
 * @throws  Throws an `Error` if a test fails
 */
export default function fooTest(f) {

    // Arguments are incorrect types.
    // @ts-expect-error
    throws(()=>f(),
        `Error: foo(): msg is type 'undefined' not 'string'`);
    // @ts-expect-error
    throws(()=>f(true),
        `Error: foo(): msg is type 'boolean' not 'string'`);

    // Ok.
    equal(f(''),
            'foo(): ');
    equal(f('Ok'),
            'foo(): Ok');
}
