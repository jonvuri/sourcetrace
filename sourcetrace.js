'use strict'


var esprima = require( 'esprima' )
var walk = require( 'esprima-walk' ).walkAddParent
var _ = require( 'lodash' )

var makeObjectMatcher = require( './make-object-matcher' )


var cache = {}



function getTrace( node ) {

	var result = []

	while ( node && node.type !== 'Program' ) {

		result.unshift( node.loc.start.line )

		node = node.parent

	}

	return _.uniq( result, true )

}


function parseSearch( search ) {

	search = esprima.parse( search ).body

	if ( search.length < 1 ) {
		throw new Error( 'Empty search' )
	}

	if ( search.length > 1 ) {
		throw new Error( 'Can only search for one node at a time' )
	}

	search = search[0]

	if ( search.type === 'ExpressionStatement' ) {
		search = search.expression
	}

	return search

}


exports = module.exports = function sourcetrace( search, source ) {

	var parsed
	var match
	var result = []


	if ( typeof search === 'string' ) {
		search = parseSearch( search )
	}

	match = makeObjectMatcher( search )


	parsed = cache[ source ]

	if ( !parsed ) {
		cache[ source ] = parsed = esprima.parse( source, { loc: true } )
	}


	walk( parsed, function ( node ) {

		if ( match( node ) ) {
			result.push( getTrace( node ) )
		}

	})


	return result

}
