import XLSX from 'xlsx';

export const generatePickerReport = (rawResults) => {
    const results = rawResults.map((e, index) => ({
        ...e,
        index,
        keyCode: undefined,
        correct: e.correct ? 'Tak' : 'Nie',
        type: undefined,
    }));
    const excelHeader = {
        index: 'Zadanie',
        correct: 'Odpowiedź poprawna',
        wait: 'Czas oczekiwania',
        duration: 'Czas reakcji',
    };
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
        [excelHeader].concat(results),
        {header: ['index', 'correct', 'wait', 'duration'], skipHeader: true}
    );

    XLSX.utils.book_append_sheet(wb, ws, 'Result');

    XLSX.writeFile(wb, `wyniki_x_${new Date()}.xlsx`);
};

export const generateClueReport = (rawResults) => {
    const results = rawResults.map((e, index) => ({
        ...e,
        index,
        keyCode: undefined,
        correct: e.correct ? 'Tak' : 'Nie',
        type: undefined,
        halo: undefined,
    }));
    const excelHeader = {
        index: 'Zadanie',
        correct: 'Odpowiedź poprawna',
        wait: 'Czas oczekiwania',
        duration: 'Czas reakcji',
        waitForClue: 'Czas oczekiwania na wskazówkę',
        haloDuration: 'Czas wskazówki',
        postHaloDuration: 'Czas po wskazówce',
    };
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
        [excelHeader].concat(results),
        {
            header: ['index', 'correct', 'wait', 'duration', 'waitForClue', 'haloDuration', 'postHaloDuration'],
            skipHeader: true
        }
    );

    XLSX.utils.book_append_sheet(wb, ws, 'Result');

    XLSX.writeFile(wb, `wyniki_x_wskazówka_${new Date()}.xlsx`);
};

export const generateMemoryReport = (rawResults) => {
    const results = rawResults.map((e, index) => ({
        ...e,
        index,
        keyCode: undefined,
        correct: e.correct ? 'Tak' : 'Nie',
        type: undefined,
        test: undefined,
    }));
    const excelHeader = {
        index: 'Zadanie',
        correct: 'Odpowiedź poprawna',
        totalWait: 'Całkowity czas oczekiwania',
        groupDuration: 'Czas wyświetlania grupy',
        waitAfterGroup: 'Czas oczekiwania po grupie',
        waitForGroup: 'Czas oczekiwania na grupę',
        duration: 'Czas reakcji',
    };
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
        [excelHeader].concat(results),
        {
            header: ['index', 'correct', 'totalWait', 'waitForGroup', 'groupDuration', 'waitAfterGroup', 'duration'],
            skipHeader: true
        }
    );

    XLSX.utils.book_append_sheet(wb, ws, 'Result');

    XLSX.writeFile(wb, `wyniki_memory_${new Date()}.xlsx`);
};