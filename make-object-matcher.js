'use strict'


var _ = require( 'lodash' )
var traverse = require( 'traverse' )



function filterLeafPaths( paths ) {

	function subPath( path ) {
		return function ( p ) {
			return _.isEqual( path, _.take( p, path.length ) )
		}
	}

	paths.sort( function ( a, b ) {
		return b.length - a.length
	} )

	return _.reduce( paths, function ( result, path ) {

		if ( !_.any( result, subPath( path ) ) ) {
			result.push( path )
		}
		
		return result

	}, [] )

}


exports = module.exports = function makeObjectMatcher( compareObject ) {

	var t = traverse( compareObject )

	var paths = filterLeafPaths( t.paths() )

	var pathslength = paths.length

	_.each( paths, function ( path ) {
		path.push( t.get( path ) )
	} )

	return function ( object ) {

		var i, j, path, len, key, value

		if ( !object ) {
			return false
		}

		for ( i = 0; i < pathslength; i += 1 ) {

			path = paths[ i ]

			value = object

			for ( j = 0, len = path.length - 1; j < len; j += 1 ) {

				key = path[ j ]

				if ( typeof value !== 'object' || !( key in value ) ) {
					return false
				}

				value = value[ key ]

			}

			if ( value !== path[ j ] ) {
				return false
			}

		}

		return true

	}

}
