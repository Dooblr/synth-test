import { HStack, VStack } from '@chakra-ui/react';
import { Button, Container, MantineProvider, Radio, Slider, Text } from '@mantine/core';
import { useState } from 'react';
import './App.scss';

let actx = new AudioContext()
let out = actx.destination

let oscNode = actx.createOscillator()
let gainNode = actx.createGain()
let filterNode = actx.createBiquadFilter()

function App() {

  // Osc
  const [freq,setFreq] = useState(440)
  const [gain,setGain] = useState(0.1)
  const [waveForm,setWaveform] = useState('sine' as OscillatorType)

  // Filter
  const [filterFreq,setFilterFreq] = useState(1000.0)
  const [filterKnob,setFilterKnob] = useState(1.0)
  const [filterQ,setFilterQ] = useState(1.0)
  const [filterType,setFilterType] = useState('lowpass')
  const [filterGain,setFilterGain] = useState(1.0)

  // Osc handlers
  function startOsc(){
    // Stop previous osc
    oscNode.disconnect()
    // create osc node
    oscNode = actx.createOscillator()

    // set freq
    oscNode.frequency.value = freq
    oscNode.type = waveForm
    gainNode.gain.value = gain
    
    // connections
    oscNode.connect(filterNode)
    filterNode.connect(gainNode)
    gainNode.connect(out)
    
    // run osc
    oscNode.start()
  }

  function changeWaveform(oscType:OscillatorType){
    setWaveform(oscType)
    oscNode.type = oscType
  }

  // Filter handlers
  function changeFilter(value:number){
    console.log(value)
    setFilterFreq(value)
    filterNode.frequency.value = value
  }

  function changeResonance(value:number){
    setFilterQ(value)
    filterNode.Q.value = value
  }

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <div id='app-container'>

        <Container className='main-container'>
          
          <Text className='text'>Synth</Text>
          
          <br/>
          

          <HStack>
            <Button onClick={()=>{startOsc()}}>Start</Button>
            <Button onClick={()=>{oscNode.stop()}}>Stop</Button>
          </HStack>
          
          <br/><br/>

          <HStack>

            <VStack>
              <Text className='text-label'>Freq.</Text>
              <Slider
                className='slider-parameter'
                value={freq}
                onChange={(value:number)=>{
                  setFreq(value)
                  oscNode.frequency.value = value
                }}
                min={100}
                max={5000}
                label={(value) => value}
                step={1}/>

              <br/>

              <Text className='text-label'>Gain</Text>
              <Slider
                className='slider-parameter'
                value={gain}
                onChange={(value:number)=>{
                  setGain(value)
                  gainNode.gain.value = value
                }}
                min={0.0}
                max={0.5}
                label={(value) => value.toFixed(2)}
                step={0.01}/>

              <br/>

              <Text className='text-label'>Waveform</Text>
              <Radio.Group
                value={waveForm}
                onChange={changeWaveform}
                name="waveform"
                className='radio-waveform'
              >
                <Radio value="sine" label="Sine" />
                <Radio value="triangle" label="Triangle" />
                <Radio value="sawtooth" label="Saw" />
                <Radio value="square" label="Square" />
              </Radio.Group>
            </VStack>

            <VStack>

              {/* <ExpoStepSlider
                steps={[20, 60, 100, 150, 300, 500, 1000, 2000, 4000, 8000, 16000, 20000]}
                min={1}
                max={20000}
                value={filterFreq}
                setValue={setFilterFreq}
              /> */}

              <Text className='text-label'>Filter</Text>
              <Slider
                className='slider-parameter'
                value={filterKnob}
                onChange={(value:number)=>{
                  let scaledValue = (Math.exp(Math.log(20) + (value * (Math.log(20000) - Math.log(20)))))
                  scaledValue = Math.round(scaledValue)
                  changeFilter(scaledValue)
                  setFilterKnob(value)
                }}
                min={0.0}
                max={1.0}
                label={(value) => value}
                step={0.01}
                scale={(value:number)=>(Math.exp(Math.log(20) + (value * (Math.log(20000) - Math.log(20)))))}
              />

              <br/>

              <Text className='text-label'>Resonance</Text>
              <Slider
                className='slider-parameter'
                value={filterQ}
                onChange={(value:number)=>{
                  changeResonance(value)
                }}
                min={1}
                max={10}
                label={(value) => value}
                step={1}/>
            </VStack>


          </HStack>
          
          {/* Oscillator */}
          
          

          <br/>

          {/* Filter */}

          

          {/* <Slider
            // value={attackTime}
            // onChange={setAttackTime}
            min={0.0}
            max={1.0}
            label={(value) => value.toFixed(1)}
            step={0.1}
          />

          <br/>

          <Slider
            // value={releaseTime}
            // onChange={setReleaseTime}
            min={0.0}
            max={1.0}
            label={(value) => value.toFixed(1)}
            step={0.1}
          /> */}


        </Container>
        
        


      </div>
    </MantineProvider>
  )
}

export default App

// export interface ExpoStepSliderState {
//   sliderValue: number;
// }

// export function ExpoStepSlider({min,max,steps, value, setValue}:any) {
//   const [points, sliderTransform] = scaleTransform(min, max, steps);
//   console.log(points);

//   return (
//     <div >
//       <div>output: {sliderTransform(value)}</div>
//       <Slider
//         value={value}
//         onChange={(e) => setValue(e)}
//         min={0}
//         max={points}
//       />
//     </div>
//   );
// };

// function scaleTransform(min: number, max: number, intervals: number[]): [number, (input: number) => number] {

//   //determine how many "points" we need
//   let distributions = intervals.length;
//   let descretePoints = Math.ceil(
//     (max - min) / intervals.reduce((total, step) => total + step / distributions, 0)
//   );

//   return [
//     descretePoints,
//     (input: number) => {
//       let stepTransforms = intervals.map((s, i) => {
//         let setCount = Math.min(Math.ceil(input - (descretePoints * i / distributions)), Math.round(descretePoints / distributions));
//         return setCount > 0 ? setCount * s : 0;
//       });

//       let lastStep = 0;
//       let out = Math.round(stepTransforms.reduce((total, num, i) => {
//         if (num) {
//           lastStep = i;
//         }
//         return total + num;
//       })) + min;

//       let currentUnit = intervals[lastStep];
//       return Math.min(
//         Math.round((out / currentUnit)) * currentUnit,  //round to nearest step
//         max
//       );
//     }
//   ]
// }


