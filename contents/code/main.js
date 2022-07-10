
function getPosition(workspace, client, xOffset, width) {
    var maxArea = workspace.clientArea(KWin.MaximizeArea, client);

    var position = [
        maxArea.x + xOffset,
        maxArea.y,
        width,
        maxArea.height,
    ];

    console.log('getPosition', position);

    return position;
}

function setSlot(workspace, slot) {
    var client = workspace.activeClient;
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
    setSlot(workspace, 1);
});

registerShortcut("MoveWindowToDownCenter2x2", "UltrawideWindows: Set window slot 2", "ctrl+Num+2", function () {
    setSlot(workspace, 2);
});

registerShortcut("MoveWindowToDownRight2x2", "UltrawideWindows: Set window slot 3", "ctrl+Num+3", function () {
    setSlot(workspace, 3);
});

registerShortcut("MoveWindowToLeftHeight2x2", "UltrawideWindows: Set window slot 4", "ctrl+Num+4", function () {
    setSlot(workspace, 4);
});
