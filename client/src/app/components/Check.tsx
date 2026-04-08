import React from 'react'

const Check = () => {
  return (
    <div>
      <iframe
    style={{ overflow: 'hidden' }}
      // ref={iframeRef}
      src="https://healthuaustralia.snapforms.com.au/form/tH39fGCmwm"
      title="Referral & request of services form"
      width="100%"
      className='h-[400vh]'
      scrolling="auto"
      allow="geolocation; microphone; camera"
    />
    </div>
  )
}

export default Check