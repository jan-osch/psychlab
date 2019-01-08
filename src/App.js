import React, {Component} from 'react';
import './App.css';
import Picker, {PICKER_NODES} from './components/Picker/Picker';

const getRandomDuration = ({low = 500, high = 4000} = {}) => Math.round(Math.random() * (high - low)) + low;
const getRandomSide = (properties) => Math.random() > 0.5
    ? {type: PICKER_NODES.LEFT, keyCode: 90, ...properties}
    : {type: PICKER_NODES.RIGHT, keyCode: 191, ...properties};

const generateTasks = n => {
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

const generateHaloTasks = n => {
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
        result.push(getRandomSide({wait: totalTime, halo, haloDuration, postHaloDuration, waitForClue }))
    }

    return result;
};

const PICKER_PATH = [
    {
        type: PICKER_NODES.TEXT,
        value: [
            'Naciśnij "/" gdy w ramce po prawej stronie pojawi się znak "X"',
            'Gdy znak X pojawi się po lewej stronie naciśnij "Z"',
            'Odpowiedz najszybciej jak potrafisz.',
            'Aby kontyunować naciśnij dowolny przycisk',
            'Aby zakończyć i przejść do wyników naciśnij "ESC"'
        ],
        anyKey: true,
    },
    {
        type: PICKER_NODES.TEXT,
        value: 'Zadanie zacznie się za 2 sekundy',
        duration: 2000,
    },
    ...generateTasks(10),
    {
        type: PICKER_NODES.RESULT
    }
];

const PICKER_WITH_HALO = [
    {
        type: PICKER_NODES.TEXT,
        value: [
            'Gdy znak X pojawi się po prawej stronie naciśnij "/"',
            'Gdy znak X pojawi się po lewej stronie naciśnij "Z"',
            'Wskazówka która pojawi się przed zadaniem nie ma charakteru informacyjnego',
            'Odpowiedz najszybciej jak potrafisz.',
            'Aby kontyunować naciśnij dowolny przycisk',
            'Aby zakończyć i przejść do wyników naciśnij "ESC"'
        ],
        anyKey: true,
    },
    {
        type: PICKER_NODES.TEXT,
        value: 'Zadanie zacznie się za 2 sekundy',
        duration: 2000,
    },
    ...generateHaloTasks(10),
    {
        type: PICKER_NODES.RESULT
    }
];

const OPTIONS = [
    {
        title: 'Picker',
        component: <Picker path={PICKER_PATH}/>
    },

    {
        title: 'Halo',
        component: <Picker path={PICKER_WITH_HALO} halo/>
    }
];


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null
        }
        this.selectTask = this.selectTask.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    selectTask(index) {
        this.setState({selected: index})
    }

    goBack() {
        this.setState({selected: null})
    }

    render() {
        if (this.state.selected === null) {
            return (
                <div className="App">
                    {OPTIONS.map(({title}, index) =>
                        <div onClick={() => this.selectTask(index)} key={title}> {title}
                        </div>
                    )}
                </div>
            )
        }
        const Current = OPTIONS[this.state.selected].component;

        return (
            <div className="App">
                <button onClick={this.goBack}>Go back</button>
                {Current}
            </div>
        );
    }
}

export default App;
