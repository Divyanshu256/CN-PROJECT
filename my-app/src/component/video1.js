import React from 'react'
import sample from './sample.mp4';
export const video = () => {
  return (
    <div>
        <video src={sample} autoPlay loop muted/>
    </div>
  )
}
