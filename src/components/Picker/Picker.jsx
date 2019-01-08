import React, {Fragment} from 'react'

import './picker.css'
import {generateClueReport, generatePickerReport} from '../excel';

export const PICKER_NODES = {
    TEXT: 'TEXT',
    EMPTY: 'EMPTY',
    RIGHT: 'RIGHT',
    LEFT: 'LEFT',
    RESULT: 'RESULT'
};

const RESULTS = [];

const Shapes = ({left, right, halo}) => (
    <div className="Shapes">
        <div className={halo === 'left' ? 'Halo' : 'Distance'}>
            <div className="Box">{left && <span>X</span>}</div>
        </div>
        <div className="Separator"/>
        <div className={halo === 'right' ? 'Halo' : 'Distance'}>
            <div className="Box">{right && <span>X</span>}</div>
        </div>
    </div>
);

class Picker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            time: null,
        };
        this.onKeyDown = this.onKeyDown.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.downloadResults = this.downloadResults.bind(this);
        this.timer = null;
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
                this.timer = setTimeout(this.nextStep, currentStep.duration);
            }
        })
    }


    onKeyDown(event) {
        const currentStep = this.getCurrentStep();
        if (event.keyCode === 27) {
            clearTimeout(this.timer);
            this.setState({index: this.props.path.length - 1});
            return;
        }

        if (currentStep.anyKey) {
            this.nextStep();
            return;
        }

        if (currentStep.keyCode) {
            const result = {
                ...currentStep,
                correct: currentStep.keyCode === event.keyCode,
                wait: currentStep.wait,
                duration: Date.now() - this.state.stepStart,
            };
            RESULTS.push(result);
            this.nextStep();
            return;
        }
    }

    downloadResults() {
        if (this.props.halo) {
            generateClueReport(RESULTS)
        } else {
            generatePickerReport(RESULTS)
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
                return (<Shapes halo={currentStep.halo}/>);

            case PICKER_NODES.RIGHT:
                return (<Shapes right/>);

            case PICKER_NODES.LEFT:
                return (<Shapes left/>);

            case PICKER_NODES.RESULT:
                return (
                    <div>
                        <table>
                            <tbody>
                            <tr>
                                <th>Zadanie</th>
                                <th>Odpowiedź poprawna</th>
                                <th>Czas oczekiwania</th>
                                <th>Czas reakcji</th>
                                {
                                    this.props.halo && (
                                        <Fragment>
                                            <th>Czas oczekiwania na wskazówkę</th>
                                            <th>Czas wskazówki</th>
                                            <th>Czas po wskazówce</th>
                                        </Fragment>)
                                }
                            </tr>

                            {
                                RESULTS.map((row, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{row.correct ? 'Tak' : 'Nie'}</td>
                                        <td>{row.wait + ' ms'}</td>
                                        <td>{row.duration + ' ms'}</td>

                                        {
                                            this.props.halo && (
                                                <Fragment>
                                                    <td>{row.waitForClue}</td>
                                                    <td>{row.haloDuration}</td>
                                                    <td>{row.postHaloDuration}</td>
                                                </Fragment>)
                                        }
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                        <button onClick={this.downloadResults}>Pobierz wyniki</button>
                    </div>
                );

            default:
                return null;
        }
    }

    getCurrentStep() {
        return this.props.path[this.state.index];
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