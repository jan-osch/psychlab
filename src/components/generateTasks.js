import {Constants as PICKER_NODES} from './constants';

const getRandomDuration = ({low = 500, high = 4000} = {}) => Math.round(Math.random() * (high - low)) + low;
const getRandomSide = (properties) => Math.random() > 0.5
    ? {type: PICKER_NODES.LEFT, keyCode: 90, ...properties}
    : {type: PICKER_NODES.RIGHT, keyCode: 191, ...properties};

export const generateDondersTasks = n => {
    const result = [];

    for (let i = 0; i < n; i++) {
        const randomDuration = getRandomDuration();
        result.push({
            type: PICKER_NODES.EMPTY,
            duration: randomDuration
        });
        result.push(getRandomSide({wait: randomDuration}))
    }

    return result;
};

export const generateClueTasks = n => {
    const result = [];

    for (let i = 0; i < n; i++) {
        const waitForClue = getRandomDuration();
        let totalTime = waitForClue;
        result.push({
            type: PICKER_NODES.EMPTY,
            duration: totalTime
        });
        const haloDuration = getRandomDuration({low: 0, high: 600});
        totalTime += haloDuration;

        const halo = Math.random() > 0.5 ? 'right' : 'left';
        result.push({
            type: PICKER_NODES.EMPTY,
            duration: haloDuration,
            halo: halo
        });
        const postHaloDuration = getRandomDuration({low: 0, high: 1000});
        result.push({
            type: PICKER_NODES.EMPTY,
            duration: postHaloDuration
        });
        totalTime += postHaloDuration;
        result.push(getRandomSide({wait: totalTime, halo, haloDuration, postHaloDuration, waitForClue}))
    }

    return result;
};

const getRandomDigit = () => Math.floor(Math.random() * 10);

export const generateMemoryCases = n => {
    const results = [];

    for (let i = 0; i < n; i++) {

        const waitForGroup = getRandomDuration();
        results.push({
            type: PICKER_NODES.EMPTY,
            duration: waitForGroup,
        });

        const group = [getRandomDigit(), getRandomDigit(), getRandomDigit(), getRandomDigit()];
        const groupDuration = getRandomDuration({low: 100, high: 2000});
        results.push(
            {
                type: PICKER_NODES.GROUP,
                group: group,
                duration: groupDuration,
            }
        );
        const waitAfterGroup = getRandomDuration();
        results.push(
            {
                type: PICKER_NODES.EMPTY,
                duration: waitAfterGroup,
            }
        );

        const test = getRandomDigit();
        const present = group.includes(test);
        results.push({
            type: PICKER_NODES.TEST,
            test,
            keyCode: present ? 191 : 90,
            groupDuration,
            waitAfterGroup,
            waitForGroup,
            totalWait: groupDuration + waitForGroup + waitAfterGroup,
        });
    }

    return results;
};