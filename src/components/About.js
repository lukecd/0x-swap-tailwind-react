import React from 'react'

/**
 * 
 * @returns A styled list of all social media profiles
 */
const About = () => {
  const hide = () => {
    let about = document.getElementById('about');
    about.style.display = "none";
  }
  return (
    <div id='about' className='flex bg-black text-white absolute bottom-10 right-5 ml-10 mr-10'>
      <span>
        Lately about different ways to communicate with the user, ideas besides just using modal dialogs. 
        For this project I first imagined a DEX with an ocean theme, a way to play off the "crypto whale"
        metaphor. I thought it would be cool to have a background of waves that subtly undulate, barely
        perceptible motion ... except when a transaction is being processed in which case they speed up a lot.
        There's more details, including tutorials I used on <a className="underline" href="https://github.com/lukecd/0x-swap-tailwind-react" target="_blank" rel="noreferrer">GitHub</a>. And more about me on my <a className="underline" href="https://www.luke.gallery" target="_blank" rel="noreferrer">portfolio site</a>.
        <br/><br/>You can also <a className="underline" href="#" onClick={hide}>hide this about text</a>
      </span>
     
    </div>      
  )
}

export default About