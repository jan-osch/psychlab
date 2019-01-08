import XLSX from 'xlsx';
import React from 'react';

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

    XLSX.writeFile(wb, `wyniki.xlsx`);
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

    XLSX.writeFile(wb, `wyniki.xlsx`);
};