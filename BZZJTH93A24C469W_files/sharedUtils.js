/**
 * Verifica se il browser è della famiglia di IE (IE o Edge)
 * Ritorna true se il browser è della famiglia di IE, false altrimenti
 */
function isIE() {
    const ua = window.navigator.userAgent;
    return (ua.indexOf('MSIE ') > -1) || (ua.indexOf('Trident/') > -1) || (ua.indexOf('Edge/') > -1);
}

// Indica il numero di refresh della sessione già eseguiti nella pagina
var refreshSessionCount = 0;

/**
 * Effettua in background il refresh della sessione ogni interval millisecondi per times volte
 */
function refreshSession(interval = 3000, times = 10){
	$.get('RefreshSession.do')
	.done(function() {
		refreshSessionCount++;
		if (refreshSessionCount <= times){
			setTimeout(function(){ refreshSession(interval) }, interval);
		}
	})
	.fail(function() {
		console.log("Error refreshing session");
	});
}