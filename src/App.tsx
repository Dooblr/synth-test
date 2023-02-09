import { HStack, VStack } from '@chakra-ui/react';
import { Badge, Button, Container, MantineProvider, Radio, Select, Slider, Text } from '@mantine/core';
import { useState } from 'react';
import './App.scss';
import Keyboard from './Keyboard';
import { mtof } from './utils';

let actx = new AudioContext()
let out = actx.destination

let oscNode = actx.createOscillator()
let gainNode = actx.createGain()
let filterNode = actx.createBiquadFilter()

function App() {

  // Osc
  const [oscFreq,setOscFreq] = useState(440)
  const [gain,setGain] = useState(0.1)
  const [waveForm,setWaveform] = useState('sine' as OscillatorType)

  // Filter ============================================================== //

  // frequency
  const [filterFreq,setFilterFreq] = useState(20000.0)
  const [filterKnob,setFilterKnob] = useState(1.0)

  // Q
  const [filterQ,setFilterQ] = useState(1.0)
  const [filterType,setFilterType] = useState('lowpass')
  const [filterGain,setFilterGain] = useState(1.0)

  // Osc handlers
  function startOsc(midiNote:number){

    // Stop previous osc
    oscNode.disconnect()

    // create osc node
    oscNode = actx.createOscillator()

    // convert midi input to freq
    const keyFreq = mtof(midiNote)

    // set freq
    oscNode.frequency.value = keyFreq
    oscNode.type = waveForm
    gainNode.gain.value = gain

    // set filer
    filterNode.frequency.value = filterFreq
    
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
    setFilterFreq(value)
    filterNode.frequency.value = value
  }

  function changeResonance(value:number){
    setFilterQ(value)
    filterNode.Q.value = value
  }

  function changeFilterType(value:BiquadFilterType){
    setFilterType(value)
    filterNode.type = value
  }

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }}>
      <div id='app-container'>

        <Container className='main-container'>
          
          <Text className='text'>Synth</Text>
          
          <br/>
          

          <HStack>
            <Button onClick={()=>{startOsc(64)}}>Start</Button>
            <Button onClick={()=>{oscNode.stop()}}>Stop</Button>
          </HStack>
          
          <br/><br/>

          <HStack spacing={30} alignItems={'top'}>

            {/* Oscillator */}
            <VStack>
              <Badge color='cyan' size='lg'>Freq.</Badge>
              <Slider
                className='slider-parameter'
                value={oscFreq}
                onChange={(value:number)=>{
                  setOscFreq(value)
                  oscNode.frequency.value = value
                }}
                min={100}
                max={5000}
                label={(value) => value.toFixed(1)}
                step={1}/>

              <br/>

              <Badge color='cyan' size='lg'>Gain</Badge>
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

              <Badge color='cyan' size='lg'>Waveform</Badge>
                <Select
                  value={waveForm}
                  onChange={changeWaveform}
                  className='dropdown-select'
                  data={[
                    { value: 'sine', label: 'Sine' },
                    { value: 'triangle', label: 'Triangle' },
                    { value: 'sawtooth', label: 'Saw' },
                    { value: 'square', label: 'Square' },
                  ]}
                />
            </VStack>

            <VStack>

              <Badge color='cyan' size='lg'>Filter</Badge>
              <Slider
                className='slider-parameter'
                value={filterKnob}
                onChange={(value:number)=>{
                  let scaledValue = (Math.exp(Math.log(20) + (value * (Math.log(20000) - Math.log(20)))))
                  // scaledValue = Math.round(scaledValue)
                  changeFilter(scaledValue)
                  setFilterKnob(value)
                }}
                min={0.0}
                max={1.0}
                label={(value) => value.toFixed(1)}
                step={0.01}
                scale={(value:number)=>(Math.exp(Math.log(20) + (value * (Math.log(20000) - Math.log(20)))))}
              />

              <br/>

              <Badge color='cyan' size='lg'>Resonance</Badge>
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

                <br/>

                <Badge color='cyan' size='lg'>Filter Type</Badge>
                <Select
                  value={filterType}
                  onChange={changeFilterType}
                  className='dropdown-select'
                  data={[
                    { value: 'lowpass', label: 'Lowpass' },
                    { value: 'highpass', label: 'Highpass' },
                    { value: 'bandpass', label: 'Bandpass' },
                    { value: 'lowshelf', label: 'Low Shelf' },
                    { value: 'highshelf', label: 'High Shelf' },
                    { value: 'peaking', label: 'Peaking' },
                    { value: 'notch', label: 'Notch' },
                    { value: 'allpass', label: 'Allpass' },
                  ]}
                />
            </VStack>


          </HStack>

          <br/>
          
          <Keyboard startOsc={startOsc} stopOsc={()=>oscNode.stop()}/>


        </Container>
        

      </div>
    </MantineProvider>
  )
}

export default App


