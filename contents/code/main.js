
function getPosition(workspace, client, xOffset, width) {
    const maxArea = workspace.clientArea(KWin.MaximizeArea, client);

    const position = [
        maxArea.x + xOffset,
        maxArea.y,
        width,
        maxArea.height,
    ];

    return position;
}

function setSlot(workspace, client, slot) {
    if (!client.moveable || !client.resizeable) {
        return;
    }

    client.setMaximize(false, false);

    const slot1Width = 999;
    const slot2Width = 1818;
    const slot3Width = 1023;

    const position = (function () {
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

    const jetbrainsIdes = [
        'jetbrains-webstorm',
        'jetbrains-rider',
        'jetbrains-clion',
        'jetbrains-datagrip',
        'jetbrains-rubymine',
    ];

    const layoutSlots = [
        {
            match: (client) => {

                // Video players
                if (['mpv'].includes((client.resourceClass || '').toString())) {
                    return true;
                }

                // YouTube Chrome window
                if ((client.resourceClass || '').toString() === 'google-chrome' && (client.caption || '').toString().endsWith(' - YouTube - Google Chrome')) {
                    return true;
                }

                // YouTube Firefox window
                if ((client.resourceClass || '').toString() === 'firefox' && (client.caption || '').toString().endsWith(' - YouTube — Mozilla Firefox')) {
                    return true;
                }

                return false;
            },
            slot: 'special-0',
        },
        {
            match: (client) => {

                // Discord
                if (['discord'].includes((client.resourceClass || '').toString())) {
                    return true;
                }

                // Chrome DevTools
                if ((client.resourceClass || '').toString() === 'google-chrome' && (client.caption || '').toString().startsWith('DevTools - ')) {
                    return true;
                }

                // JetBrains Run/Cover windows
                if (jetbrainsIdes.includes((client.resourceClass || '').toString()) && (
                    (client.caption || '').toString().startsWith('Run - ') || (client.caption || '').toString().startsWith('Cover - ') || (client.caption || '').toString().startsWith('Debug - ')
                )) {
                    return true;
                }

                return false;
            },
            slot: 1,
        },
        {
            match: (client) => [
                'konsole',
                'google-chrome',
                'gitkraken',
                'dolphin',
                'wine',
                'discover',
                'systemsettings',
                'virt-manager',
                'org.remmina.remmina'
            ].includes((client.resourceClass || '').toString()),
            slot: 2,
        },
        {
            match: (client) => ['deluge-gtk'].includes((client.resourceClass || '').toString()),
            slot: 3,
        },
        {
            match: (client) => [ 'code', ...jetbrainsIdes ].includes((client.resourceClass || '').toString()),
            slot: 4,
        },
        {
            match: () => true,
            slot: 2,
        }
    ];

    const allClients = workspace.clientList();

    for (const client of allClients) {

        // Skip all the plasma stuff
        if (client.resourceClass == 'plasmashell') {
            continue;
        }

        console.log('CLIENT => resourceClass:', client.resourceClass.toString(), '| caption:', (client.caption || '').toString());

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
