/* taken from https://locutus.io/php/strings/nl2br/ */
function nl2br (str, is_xhtml) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

browser.messageDisplayAction.onClicked.addListener(async (tab) => {
	browser.messageDisplay.getDisplayedMessage(tab.id).then(async (message) => {
		let mailTab = await browser.compose.beginReply(message.id);
		let details = await browser.compose.getComposeDetails(mailTab.id);

		let storage = await browser.storage.local.get().then((storage) => {
			let replyText = storage.quickReply_v1.replyText || '';

			if (details.isPlainText) {
				let body = details.plainTextBody;
				body = replyText + body;
				browser.compose.setComposeDetails(mailTab.id, { plainTextBody: body });
			} else {
				let document = new DOMParser().parseFromString(details.body, "text/html");
				let para = document.createElement("p");
				para.innerHTML = nl2br(replyText);
				document.body.prepend(para);
				let html = new XMLSerializer().serializeToString(document);
				browser.compose.setComposeDetails(mailTab.id, { body: html });
			}
		});
	});
});
