'use strict'


var esprima = require( 'esprima' )
var traverse = require( 'traverse' )
var _ = require( 'lodash' )

var util = require( 'util' )


var cache = {}


function stripLoc( node ) {

	return traverse( node ).map( function( node ) {

		if ( _.isObject( node ) && node.loc ) {
			this.update( _.omit( node, 'loc' ) )
		}

	} )

}


function getTrace( context ) {


	function tracer( context ) {

		if ( context.parent ) {

			if ( context.node.loc ) {
				return tracer( context.parent ).concat( context.node.loc.start.line )
			} else {
				return tracer( context.parent )
			}

		} else {

			return []

		}

	}


	return _.uniq( tracer( context ), true )

}


exports = module.exports = function sourcetrace( search, source ) {

	var parsed

	search = esprima.parse( search ).body[0].expression

	if ( search.type === 'ExpressionStatement' ) {
		search = search.expression
	}

	parsed = cache[ source ]

	if ( !parsed ) {
		cache[ source ] = parsed = esprima.parse( source, { loc: true } )
	}

	return traverse( parsed ).reduce( function ( result, node ) {

		if ( node && node.type === search.type && _.isEqual( stripLoc( node ) , search ) ) {
			result.push( getTrace( this ) )
		}

		return result

	}, [] )

}
