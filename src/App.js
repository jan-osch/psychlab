import React, {Component} from 'react';

import Picker from './components/Picker/Picker';
import {Constants as PICKER_NODES} from './components/constants';
import MemoryScanning from './components/MemoryScanning/MemoryScanning';
import {generateClueTasks, generateDondersTasks, generateMemoryCases} from './components/generateTasks';

import './App.css';

const PICKER_PATH = [
    {
        type: PICKER_NODES.TEXT,
        value: [
            'Naciśnij klawisz "/" jeżeli w ramce po prawej stronie pojawi się znak X',
            'Jeżeli znak X pojawi się po lewej stronie naciśnij klawisz "Z"',
            'Odpowiedz najszybciej jak potrafisz.',
            <br/>,
            'Aby kontyunować naciśnij dowolny przycisk.',
        ],
        anyKey: true,
    },
    {
        type: PICKER_NODES.TEXT,
        value: [
            'Zadanie zacznie się za 2 sekundy',
            <br/>,
            'Aby zakończyć i przejść do wyników w dowolnym momencie naciśnij "ESC"',
        ],
        duration: 2000,
    },
    ...generateDondersTasks(10),
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
            'Wskazówka która pojawi się przed zadaniem nie ma wpływu na pozycję znaku X',
            'Odpowiedz najszybciej jak potrafisz.',
            <br/>,
            'Aby kontyunować naciśnij dowolny przycisk.',
        ],
        anyKey: true,
    },
    {
        type: PICKER_NODES.TEXT,
        value: [
            'Zadanie zacznie się za 2 sekundy',
            <br/>,
            'Aby zakończyć i przejść do wyników w dowolnym momencie naciśnij "ESC"',
        ],
        duration: 2000,
    },
    ...generateClueTasks(10),
    {
        type: PICKER_NODES.RESULT
    }
];

const MEMORY_PATH = [
    {
        type: PICKER_NODES.TEXT,
        value: [
            'Na ekranie najpierw pojawi się grupa cyfr a następnie jedna testowa cyfra',
            'Naciśnij "/" jeżeli testowa cyfra była obecna grupie cyfr.',
            'Naciśnij "Z" jeżeli testowa cyfra nie była obecna w grupie cyfr',
            'Odpowiedz najszybciej jak potrafisz.',
            <br/>,
            'Aby kontyunować naciśnij dowolny przycisk.',
        ],
        anyKey: true
    },
    {
        type: PICKER_NODES.TEXT,
        value: [
            'Zadanie zacznie się za 2 sekundy',
            'Aby zakończyć i przejść do wyników w dowolnym momencie naciśnij "ESC"',
        ],
        duration: 2000,
    },
    ...generateMemoryCases(10),
    {type: PICKER_NODES.RESULT}
];

const OPTIONS = [
    {
        title: 'Donders',
        component: <Picker path={PICKER_PATH}/>
    },

    {
        title: 'Inhibition Of Return',
        component: <Picker path={PICKER_WITH_HALO} halo/>
    },

    {
        title: 'Memory scanning',
        component: <MemoryScanning path={MEMORY_PATH}/>
    }
];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null
        };
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
                        <div
                            className="Selector"
                            onClick={() => this.selectTask(index)} key={title}> {title}</div>
                    )}
                </div>
            )
        }
        const Current = OPTIONS[this.state.selected].component;

        return (
            <div className="App">
                <button onClick={this.goBack}>Powrót</button>
                {Current}
            </div>
        );
    }
}

export default App;
