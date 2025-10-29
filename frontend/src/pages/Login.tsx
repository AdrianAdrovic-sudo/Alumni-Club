import '../css/Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState } from 'react';


export default function Login(){

    const [showPassword, setShowPassword] = useState(false);

    function togglePassword() {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  }
    return(
    
        <div>
        
        <div className='login'>
            <h2>Login</h2>
            <h4>Unesite svoje podatke kako biste nastavili.</h4>

            <form>
                <label>Korisničko ime:</label><br></br>
                <input type="text" placeholder='Korisničko ime' id='username'></input><br></br>

                <label>Šifra:</label><br></br>
                <div className='passwordContainer'>
                 <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Šifra"
            id="password"></input>
          
          <span onClick={togglePassword} className='toggleEye'>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        <br />
    </div>

                <button type="submit">Potvrdi</button>
                <p>Zaboravili ste sifru?</p> {/* razraditi ideju, poslati formu preko mail-a */}

            </form>

            </div> 

      </div>
    );
}