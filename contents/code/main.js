
function getPosition(workspace, client, xOffset, width) {
    var maxArea = workspace.clientArea(KWin.MaximizeArea, client);

    var position = [
        maxArea.x + xOffset,
        maxArea.y,
        width,
        maxArea.height,
    ];

    return position;
}

function setSlot(workspace, client, slot) {    
    if (client.moveable && client.resizeable) {

        client.setMaximize(false, false);

        var slot1Width = 999;
        var slot2Width = 1818;
        var slot3Width = 1023;

        var position = (function (){
            switch (slot) {
                case 1: {
                    return getPosition(workspace, client, 0, slot1Width);
                }
                case 2: {
                    return getPosition(workspace, client, slot1Width, slot2Width);
                }
                case 3: {
                    return getPosition(workspace, client, slot1Width + slot2Width, slot3Width);
                }
                case 4: {
                    return getPosition(workspace, client, slot1Width, slot2Width + slot3Width);
                }
                default: {
                    throw new Error('Unknown slot: ' + slot);
                }
            }
        })();

        client.frameGeometry = {
            x: position[0],
            y: position[1],
            width: position[2],
            height: position[3],
        };
    }
}

registerShortcut("MoveWindowToDownLeft2x2", "UltrawideWindows: Set window slot 1", "ctrl+Num+1", function () {
    setSlot(workspace, workspace.activeClient, 1);
});

registerShortcut("MoveWindowToDownCenter2x2", "UltrawideWindows: Set window slot 2", "ctrl+Num+2", function () {
    setSlot(workspace, workspace.activeClient, 2);
});

registerShortcut("MoveWindowToDownRight2x2", "UltrawideWindows: Set window slot 3", "ctrl+Num+3", function () {
    setSlot(workspace, workspace.activeClient, 3);
});

registerShortcut("MoveWindowToLeftHeight2x2", "UltrawideWindows: Set window slot 4", "ctrl+Num+4", function () {
    setSlot(workspace, workspace.activeClient, 4);
});

registerShortcut("MoveWindowToUpCenter2x2", "UltrawideWindows: Move Window right screen", "ctrl+Num+5", function () {
    const autoSlotMap = {
        'discord': 1,
        'deluge': 3,
        'gitkraken': 2,
        'dolphin': 2,
        'Google Chrome': 2,
        'konsole': 2,
        'system settings': 2,
        'visual studio code': 4,
    };

    const getAutoSlot = (client) => {
        const entry = Object.entries(autoSlotMap).find((x) => (client.caption || '').toLowerCase().endsWith(x[0].toLowerCase()));

        if (entry) {
        
            console.log('Found slot for: ' + client.caption, entry[1]);
            return entry[1];
        }

        console.log('No slot for: ' + client.caption);
        return 0;
    };

    var allClients = workspace.clientList();

    for (var i = 0; i < allClients.length; i += 1) {

        var client = allClients[i];

        if (Object.keys(autoSlotMap).find((x) => (client.caption || '').toLowerCase().endsWith(x.toLowerCase()))) {

            const isDedicatedYoutubeWindow = ((client.caption || '').toLowerCase().includes('youtube') && (client.caption || '').toLowerCase().includes('google chrome'));

            if (isDedicatedYoutubeWindow) {
                workspace.sendClientToScreen(client, 1);
                client.setMaximize(true,true)
                
            } else {
                workspace.sendClientToScreen(client, 0);

                const slot = getAutoSlot(client);

                if (slot) {
                    setSlot(workspace, client, slot);
                }
            }
        }
    }
});
