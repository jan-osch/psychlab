import React from 'react'

import {Constants} from '../constants';
import './scanning.css'
import {generateMemoryReport} from '../excel';

let RESULTS = [];

class MemoryScanning extends React.Component {
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
        RESULTS = [];
        document.addEventListener('keydown', this.onKeyDown, false);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyDown, false);
        clearTimeout(this.timer)
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
        generateMemoryReport(RESULTS)
    }

    renderStep() {
        const currentStep = this.getCurrentStep();
        switch (currentStep.type) {
            case Constants.TEXT:
                return (
                    <div className='Text'>
                        {Array.isArray(currentStep.value) ? currentStep.value.map(element =>
                            (<p key={element}>{element}</p>)) : currentStep.value}
                    </div>);

            case Constants.EMPTY:
                return (<div className="Empty">+</div>)

            case Constants.GROUP:
                return (
                    <div className="Group">
                        {currentStep.group[0]}
                        <div className="GroupSeparator"/>
                        {currentStep.group[1]}
                        <div className="GroupSeparator"/>
                        {currentStep.group[2]}
                        <div className="GroupSeparator"/>
                        {currentStep.group[3]}
                    </div>);

            case Constants.TEST:
                return (
                    <div className="Test">
                        {currentStep.test}
                    </div>
                );

            case Constants.RESULT:
                return (
                    <div>
                        <table>
                            <tbody>
                            <tr>
                                <th>Zadanie</th>
                                <th>Odpowiedź poprawna</th>
                                <th>Całkowity Czas oczekiwania</th>
                                <th>Czas grupy</th>
                                <th>Czas oczekiwania po grupie</th>
                                <th>Czas reakcji</th>
                            </tr>

                            {
                                RESULTS.map((row, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{row.correct ? 'Tak' : 'Nie'}</td>
                                        <td>{row.totalWait + ' ms'}</td>
                                        <td>{row.groupDuration + ' ms'}</td>
                                        <td>{row.waitAfterGroup + ' ms'}</td>
                                        <th>{row.duration + ' ms'}</th>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                        <button
                            onClick={() => generateMemoryReport(RESULTS)}>
                            Pobierz wyniki
                        </button>
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
            <div className="Memory">
                {this.renderStep()}
            </div>
        )
    }
}

export default MemoryScanning;