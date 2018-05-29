import { Slider } from 'material-ui'
import React from 'react'
//import getNext from '../../../componentid'
import Innstilling from './Innstilling'

const SliderSetting = ({
  tittel,
  undertittel,
  disabled,
  icon,
  value,
  min,
  max,
  step,
  onChange,
}) => (
  <Innstilling tittel={tittel} undertittel={undertittel} icon={icon}>
    <Slider
      sliderStyle={{ marginTop: '6px', marginBottom: '0px' }}
      disabled={disabled}
      min={min || 0}
      max={max || 1}
      step={step || 0.01}
      value={value}
      onChange={(event, value) => onChange(value)}
      //      id={getNext()}
    />
  </Innstilling>
)
export default SliderSetting
