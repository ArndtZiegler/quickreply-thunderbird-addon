const replyText = document.querySelector('#replyText');
document.querySelector('#replyTextLabel').textContent = browser.i18n.getMessage('replyTextLabel');

function storeSettings()
{
    browser.storage.local.set({
        quickReply_v1: {
            replyText: replyText.value
        }
    });
}

function updateUI(settings) 
{
    replyText.value = settings.quickReply_v1.replyText || '';
}

function onError(error)
{
    console.error(error);
}

browser.storage.local.get().then(updateUI, onError);
replyText.addEventListener('blur', storeSettings);
