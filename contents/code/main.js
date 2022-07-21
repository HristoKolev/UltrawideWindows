
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

    const layoutSlots = [
        {
            match: (cl) => (cl.resourceClass || '').toString() === 'mpv' || ((cl.resourceClass || '').toString() === 'google-chrome' && (cl.caption || '').toString().endsWith(' - YouTube - Google Chrome')),
            slot: 'special-0',
        },
        {
            match: (cl) => ['discord'].includes((cl.resourceClass || '').toString()),
            slot: 1,
        },
        {
            match: (cl) => [
                'konsole',
                'google-chrome',
                'gitkraken',
                'dolphin',
                'wine',
                'discover',
                'systemsettings',
                'virt-manager',
                'org.remmina.remmina'
            ].includes((cl.resourceClass || '').toString()),
            slot: 2,
        },
        {
            match: (cl) => ['deluge-gtk'].includes((cl.resourceClass || '').toString()),
            slot: 3,
        },
        {
            match: (cl) => [
                'code',
                'jetbrains-webstorm',
                'jetbrains-rider',
                'jetbrains-clion',
                'jetbrains-datagrip'
            ].includes((cl.resourceClass || '').toString()),
            slot: 4,
        },
        {
            match: () => true,
            slot: 2,
        }
    ];

    var allClients = workspace.clientList();

    for (const client of allClients) {

        // Skip all the plasma stuff
        if (client.resourceClass == 'plasmashell') {
            continue;
        }

        for (const layoutSlot of layoutSlots) {
            if (layoutSlot.match(client)) {

                if (layoutSlot.slot === 'special-0') {
                    workspace.sendClientToScreen(client, 1);
                    client.setMaximize(true,true);
                } else {
                    workspace.sendClientToScreen(client, 0);
                    setSlot(workspace, client, layoutSlot.slot);
                }

                break;
            }
        }
    }
});
