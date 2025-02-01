import { useState } from 'react';
import { LiveAudioVisualizer } from 'react-audio-visualize';

const Visualizer = () => {
  const [mediaRecorder] = useState<MediaRecorder>();

  // set media recorder somewhere in code
  
  return (
    <div>
      {mediaRecorder && (
        <LiveAudioVisualizer
          mediaRecorder={mediaRecorder}
          width={200}
          height={75}
        />
      )}
    </div>
  )
}

export default Visualizer;