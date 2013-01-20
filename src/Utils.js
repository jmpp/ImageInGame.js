/**
 * @author : twitter@_jmpp / http://jmpp.fr
 **/

IIG.Utils = {

	/**
	 * int COUNT (Object obj)
	 * 	> Return the number of properties of a litteral object
	 **/
	count : function(obj) {
		
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;

	}

};