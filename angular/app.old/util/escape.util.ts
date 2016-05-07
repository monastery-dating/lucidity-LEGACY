
/* From Twitter's Hogan.js */

const rAmp = /&/g
const	rLt = /</g
const	rGt = />/g
const	rApos =/\'/g
const	rQuot = /\"/g
const	hChars =/[&<>\"\']/

export const escape = function
( str: string ) : string {

	return hChars.test ( str )
		? str
			.replace( rAmp, '&amp;' )
			.replace( rLt, '&lt;' )
			.replace( rGt, '&gt;' )
			.replace( rApos, '&#39;' )
			.replace( rQuot, '&quot;' )
		: str
}
