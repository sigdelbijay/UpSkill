import React from 'react'
import { Loader, Dimmer } from 'semantic-ui-react'
const Spinner = ({spinnerLabel}) => (
  <Dimmer active>
    <Loader size="huge" content={spinnerLabel}/>
  </Dimmer>
)
export default Spinner

