// Mocha globals
/* global describe it */

'use strict'


var expect = require( 'chai' ).expect

var sourcetrace = require('./index')


describe( 'sourcetrace', function () {


	it( 'should work', function () {

		var source =
			'function a() {\n' +
			'    return 1 + 2;\n' +
			'}\n' +
			' \n' +
			'function color() {\n' +
			'    somethingElse();\n' +
			'    return "orange";\n' +
			'}\n'

		expect( sourcetrace( '"orange"', source ) ).to.deep.equal( [ [ 5, 7 ] ] )

	} )


	it( 'should fail on syntax error', function () {

		function fail() {
			sourcetrace( '"cutoff', '' )
		}

		expect( fail ).to.throw( Error )

	} )


} )
