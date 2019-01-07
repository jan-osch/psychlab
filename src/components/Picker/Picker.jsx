import React from 'react'

import './picker.css'

const PICKER_NODES = {
    TEXT: 'TEXT',
    EMPTY: 'EMPTY',
    RIGHT: 'RIGHT',
    LEFT: 'LEFT',
    RESULT: 'RESULT'
};

const PICKER_PATH = [
    {
        type: PICKER_NODES.TEXT,
        value: ['Naciśnij "/" gdy w ramce po prawej stronie pojawi się znak "X"', 'Odpowiedz najszybciej jak potrafisz.', 'Aby kontyunować naciśnij dowolny przycisk'],
        anyKey: true,
    },
    {
        type: PICKER_NODES.TEXT,
        value: 'Zadanie zacznie się za 2 sekundy',
        duration: 2000,
    },
    {
        type: PICKER_NODES.EMPTY,
        duration: 1200
    },
    {
        type: PICKER_NODES.LEFT,
        keyCode: 90,
    },
    {
        type: PICKER_NODES.RIGHT,
        keyCode: 191,
    },
    {
        type: PICKER_NODES.EMPTY,
        duration: 1000
    },
    {
        type: PICKER_NODES.EMPTY,
        duration: 2200
    },
    {
        type: PICKER_NODES.LEFT,
        keyCode: 90,
    },
    {
        type: PICKER_NODES.RESULT
    }
];

const RESULTS = [];

class Picker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            time: null
        };
        this.onKeyDown = this.onKeyDown.bind(this);
        this.nextStep = this.nextStep.bind(this);
    }

    componentWillMount() {
        document.addEventListener('keydown', this.onKeyDown, false);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyDown, false);
    }

    nextStep() {
        this.setState({index: this.state.index + 1, stepStart: Date.now()}, () => {
            const currentStep = this.getCurrentStep();
            if (currentStep.duration) {
                setTimeout(this.nextStep, currentStep.duration);
            }
        })
    }


    onKeyDown(event) {
        console.log(event.keyCode);
        const currentStep = this.getCurrentStep();
        if (currentStep.anyKey) {
            this.nextStep()
        }
        if (currentStep.keyCode) {
            const result = {
                correct: currentStep.keyCode === event.keyCode,
                wait: this.getPreviousStep().duration,
                duration: Date.now() - this.state.stepStart
            };
            RESULTS.push(result);
            this.nextStep();
        }
    }

    renderStep() {
        const currentStep = this.getCurrentStep();
        switch (currentStep.type) {
            case PICKER_NODES.TEXT:
                return (
                    <div className='Text'>
                        {Array.isArray(currentStep.value) ? currentStep.value.map(element =>
                            (<p key={element}>{element}</p>)) : currentStep.value}
                    </div>);

            case PICKER_NODES.EMPTY:
                return (<div className="Shapes">[_]{'         '}[_]</div>);

            case PICKER_NODES.RIGHT:
                return (<div className="Shapes">[_]{'         '}[X]</div>);

            case PICKER_NODES.LEFT:
                return (<div className="Shapes">[X]{'         '}[_]</div>);

            case PICKER_NODES.RESULT:
                return (<div>{JSON.stringify(RESULTS, null, 2)}</div>);

            default:
                return null;
        }
    }

    getCurrentStep() {
        return PICKER_PATH[this.state.index];
    }

    getPreviousStep() {
        return PICKER_PATH[this.state.index - 1];
    }

    render() {
        return (
            <div className="Picker">
                {this.renderStep()}
            </div>
        )
    }
}

export default Picker;