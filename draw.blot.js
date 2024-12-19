// run in blot.hackclub.com
// DEFAULTS
const width = 125;
const height = 125;
setDocDimensions(width, height);

// CONSTANTS
const widthTile = 2.25;
const heightTile = 15;
const padding = 4;
// 52 weeks which means each tower can be 2.25cm wide lets say with abit of a gap
// starting with at 4cm padding on the left and right, and top and bottom
// 15cm height for each week (15 * 7 = 105cm, so theres like an extra 11 cm at the top)

// TOP TEXT
const finalLines = blotToolkit.text("GITHUB SKYLINES", [7, 110],3)

// DRAW THE BOTTOM LINE
const baseLine = [
    [4, 4],
    [width-4, 4]
]

// DATA INITIALIZATION (52 weeks, 7 days), example for OP (2024)

const data = [[1, 1, 1], [2, 1], [1], [1], [5], [9, 6], [1], [3, 1, 1], [1], [2, 1, 1], [2, 2], [1], [5, 1], [8, 2, 1], [4, 3, 2, 1, 1], [13, 8, 8, 4], [12, 3, 2, 1, 1, 1], [3, 2, 1], [6, 1], [], [2, 1, 1], [6, 1], [2], [5, 4, 1, 1], [5, 3, 2], [1, 1], [6, 3, 2], [], [1], [5, 4, 3, 2, 1, 1], [2, 2], [2, 1, 1, 1, 1], [2, 2, 1], [6, 3, 2], [1], [1], [3, 2, 1], [5, 3], [2, 1], [1, 1], [4, 1, 1], [2, 2], [3, 2], [16, 1], [4, 3, 1], [7, 5, 4, 2, 2, 1], [43, 5, 4, 1], [16, 7, 5, 3, 3, 3, 2], [10, 5, 4, 3, 2, 1], [3, 2, 2, 1], [11, 2, 1], []]

function getActivityLevel(week) { // Should normalize better somehow
    if (week.length === 0) return 0;
    const total = week.reduce((sum, val) => sum + val, 0);
    if (total <= 3) return 1;
    if (total <= 10) return 2;
    return 3;
}

function generateTower(startX, endX, height, activityLevel) {
    const baseHeight = padding;
    const segments = 3;
    const segmentHeight = (height - baseHeight) / segments;

    switch(activityLevel) {
        case 1: // Low activity - simple tower
            return [
                [startX, baseHeight],
                [startX + (widthTile * 0.2), baseHeight + segmentHeight],
                [startX, height],
                [endX, height],
                [endX - (widthTile * 0.2), baseHeight + segmentHeight],
                [endX, baseHeight]
            ];

        case 2: // Medium activity - stepped tower
            return [
                [startX, baseHeight],
                [startX + (widthTile * 0.3), baseHeight],
                [startX + (widthTile * 0.3), baseHeight + segmentHeight],
                [startX, baseHeight + (segmentHeight * 2)],
                [startX, height],
                [endX, height],
                [endX, baseHeight + (segmentHeight * 2)],
                [endX - (widthTile * 0.3), baseHeight + segmentHeight],
                [endX - (widthTile * 0.3), baseHeight],
                [endX, baseHeight]
            ];

        case 3: // High activity - complex tower
            return [
                [startX, baseHeight],
                [startX + (widthTile * 0.4), baseHeight],
                [startX + (widthTile * 0.2), baseHeight + segmentHeight],
                [startX + (widthTile * 0.4), baseHeight + (segmentHeight * 1.5)],
                [startX, baseHeight + (segmentHeight * 2)],
                [startX, height],
                [endX, height],
                [endX, baseHeight + (segmentHeight * 2)],
                [endX - (widthTile * 0.4), baseHeight + (segmentHeight * 1.5)],
                [endX - (widthTile * 0.2), baseHeight + segmentHeight],
                [endX - (widthTile * 0.4), baseHeight],
                [endX, baseHeight]
            ];

        default: // No activity
            return [];
    }
}
// Generate towers
data.forEach((week, index) => {
    if (week.length > 0) {
        const startX = padding + (index * widthTile);
        const endX = padding + ((index + 1) * widthTile);
        const towerHeight = week.length * heightTile;
        const activityLevel = getActivityLevel(week);

        const tower = generateTower(startX, endX, towerHeight, activityLevel);
        if (tower.length > 0) {
            finalLines.push(tower);
        }
    }
});

finalLines.push(baseLine)

// DRAW EVERYTHING
drawLines(finalLines)
