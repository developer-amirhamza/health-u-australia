import React from 'react'

const SnapForm = () => {
  return (
    <div className="flex w-full h-full mx-auto justify-center bg-[#f3cc6b] py-0 my-0 ">
        <div className="container_form mx-auto flex min-h-full">
            <iframe
      className='flex w-full md:min-h-[395vh]  min-h-[485vh]  m-0'
      src="https://healthuaustralia.snapforms.com.au/form/tH39fGCmwm"
      title="Referral & request of services form"
      width="100%"
      height="800"
      style={{ border: 0, display: 'block' }}
      scrolling="auto"
      allow="geolocation; microphone; camera"
    />
        </div>

    </div>
  )
}

export default SnapForm