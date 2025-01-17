// import React, { useEffect, useState } from 'react';
// import './stylesheets/NeonText.css';

// const NeonText: React.FC = () => {
//   const [flicker, setFlicker] = useState(false);

//   useEffect(() => {
//     const flickerInterval = setInterval(() => {
//       setFlicker((prev) => !prev);
//     }, Math.random() * 1000 + 500); // Randomize flicker speed between 500ms and 1500ms

//     return () => clearInterval(flickerInterval); // Clean up interval on component unmount
//   }, []);

//   return (
//     <div id="container">
//       <h1 className={flicker ? 'flicker' : ''}>Malfunctioning Neon Light</h1>
//     </div>
//   );
// };

// export default NeonText;
