import ChordSheetJS from 'chordsheetjs';


export const toChordPro = (lyrics: any) =>{
    const chordSheet = lyrics;
    const parser = new ChordSheetJS.ChordsOverWordsParser();
    const song = parser.parse(chordSheet);
    const proFormatter = new ChordSheetJS.ChordProFormatter();

    const disp = proFormatter.format(song);
    return disp;
};

export const toChordsOverWords = (lyrics: any) =>{
    const chordSheet = lyrics;
    const parserPro = new ChordSheetJS.ChordProParser();
    const songPro = parserPro.parse(chordSheet);
    const formatter = new ChordSheetJS.TextFormatter();
    const disp = formatter.format(songPro);
    return disp;
};

