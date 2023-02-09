import { useEffect } from 'react';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';

function Keyboard({startOsc, stopOsc}:any) {

  const firstNote = MidiNumbers.fromNote('c3');
  const lastNote = MidiNumbers.fromNote('d4');
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote: firstNote,
    lastNote: lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  });

  return ( 
    <>
      <Piano
        noteRange={{ first: firstNote, last: lastNote }}
        playNote={(midiNumber:any) => {
          startOsc(midiNumber)
        }}
        stopNote={(midiNumber:any) => {
          stopOsc()
        }}
        width={400}
        keyboardShortcuts={keyboardShortcuts}
      />
    </>
   )
}

export default Keyboard;